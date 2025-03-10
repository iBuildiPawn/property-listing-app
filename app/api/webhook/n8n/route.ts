import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// This is a simple secret to verify that the webhook is coming from n8n
// In a production environment, you would use a more secure method
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'default_webhook_secret';

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook secret
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const body = await req.json();
    
    // Log the incoming webhook for debugging
    console.log('Received webhook from n8n:', JSON.stringify(body, null, 2));
    
    // Extract the necessary data from the webhook
    const { 
      userId, 
      messageId, 
      message, 
      conversationId, 
      properties = [], 
      transportationServices = [],
      suggestions = [],
      responseText
    } = body;
    
    // If we have a userId and conversationId, store the message in the database
    if (userId && conversationId) {
      // Get the existing conversation or create a new one
      const { data: existingConversation, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching conversation:', fetchError);
        return NextResponse.json({ error: 'Error fetching conversation' }, { status: 500 });
      }
      
      if (existingConversation) {
        // Update the existing conversation with the new message
        const updatedMessages = [
          ...existingConversation.messages,
          {
            id: messageId,
            role: 'assistant',
            content: responseText,
            timestamp: new Date().toISOString(),
            properties,
            transportationServices,
            suggestions
          }
        ];
        
        const { error: updateError } = await supabase
          .from('conversations')
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
        
        if (updateError) {
          console.error('Error updating conversation:', updateError);
          return NextResponse.json({ error: 'Error updating conversation' }, { status: 500 });
        }
      } else {
        // Create a new conversation
        const { error: insertError } = await supabase
          .from('conversations')
          .insert({
            id: conversationId,
            user_id: userId,
            messages: [
              {
                id: messageId,
                role: 'assistant',
                content: responseText,
                timestamp: new Date().toISOString(),
                properties,
                transportationServices,
                suggestions
              }
            ],
            is_active: true
          });
        
        if (insertError) {
          console.error('Error creating conversation:', insertError);
          return NextResponse.json({ error: 'Error creating conversation' }, { status: 500 });
        }
      }
    }
    
    // Return a success response
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received successfully' 
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 