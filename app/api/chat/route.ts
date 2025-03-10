import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// n8n webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/chatbot';
// n8n webhook secret
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET || 'default_webhook_secret';

export async function POST(req: NextRequest) {
  try {
    const { message, userId, conversationId: existingConversationId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate a unique ID for the message
    const messageId = uuidv4();
    
    // Generate a conversation ID if one doesn't exist
    const conversationId = existingConversationId || uuidv4();
    
    // Store the user message in Supabase if userId is provided
    if (userId) {
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching conversation:', fetchError);
      }

      if (existingConversation) {
        // Update existing conversation
        const updatedMessages = [
          ...existingConversation.messages,
          { id: messageId, role: 'user', content: message, timestamp: new Date().toISOString() },
        ];

        const { error: updateError } = await supabase
          .from('conversations')
          .update({ 
            messages: updatedMessages,
            updated_at: new Date().toISOString(),
          })
          .eq('id', conversationId);

        if (updateError) {
          console.error('Error updating conversation:', updateError);
        }
      } else {
        // Create new conversation
        const { error: insertError } = await supabase
          .from('conversations')
          .insert({
            id: conversationId,
            user_id: userId,
            messages: [
              { id: messageId, role: 'user', content: message, timestamp: new Date().toISOString() },
            ],
            is_active: true,
          });

        if (insertError) {
          console.error('Error creating conversation:', insertError);
        }
      }
    }

    // Send the message to n8n for processing
    try {
      const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${N8N_WEBHOOK_SECRET}`
        },
        body: JSON.stringify({
          userId,
          messageId,
          message,
          conversationId,
          timestamp: new Date().toISOString()
        })
      });

      if (!n8nResponse.ok) {
        throw new Error(`n8n webhook returned ${n8nResponse.status}: ${await n8nResponse.text()}`);
      }

      // For now, return a placeholder response
      // In a real implementation, n8n would send a response to our webhook endpoint
      return NextResponse.json({
        text: "I'm processing your request. You'll receive a response shortly.",
        timestamp: new Date().toISOString(),
        conversationId
      });
    } catch (error) {
      console.error('Error sending message to n8n:', error);
      
      // Return a fallback response if n8n is not available
      return NextResponse.json({
        text: "I'm sorry, but I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date().toISOString(),
        conversationId
      });
    }
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 