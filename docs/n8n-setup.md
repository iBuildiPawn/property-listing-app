# Setting up n8n for the Property Listing & Transportation App

This document provides instructions for setting up n8n to work with the Property Listing & Transportation App.

## Prerequisites

- Node.js 14 or later
- npm or yarn
- Docker (optional, for containerized setup)

## Installation

### Option 1: Local Installation

1. Install n8n globally:
   ```bash
   npm install -g n8n
   ```

2. Start n8n:
   ```bash
   n8n start
   ```

### Option 2: Docker Installation

1. Pull the n8n Docker image:
   ```bash
   docker pull n8nio/n8n
   ```

2. Start n8n with Docker:
   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

## Configuration

### 1. Access the n8n Dashboard

Open your browser and navigate to `http://localhost:5678`. You should see the n8n dashboard.

### 2. Create a Webhook

1. Create a new workflow in n8n.
2. Add a "Webhook" node as a trigger.
3. Configure the webhook:
   - Method: POST
   - Path: /chatbot
   - Authentication: Header Auth
   - Header Name: Authorization
   - Header Value: Bearer your_n8n_webhook_secret (use the same value as in your .env.local file)

### 3. Process the Incoming Message

1. Add an "HTTP Request" node after the Webhook node.
2. Configure it to query the Supabase database for relevant properties or transportation services based on the message content.
3. Use the Supabase REST API with the following settings:
   - Method: GET
   - URL: https://your-supabase-url.supabase.co/rest/v1/properties
   - Headers:
     - apikey: your_supabase_anon_key
     - Authorization: Bearer your_supabase_anon_key
   - Query Parameters: Add filters based on the message content

### 4. Generate a Response

1. Add a "Function" node to process the results and generate a response.
2. Use JavaScript to analyze the message and query results, then create a response object.
3. Example function:
   ```javascript
   const message = $node["Webhook"].json.message.toLowerCase();
   const results = $node["HTTP Request"].json;
   
   let responseText = "";
   let suggestions = [];
   
   if (results.length > 0) {
     responseText = `I found ${results.length} items that match your criteria.`;
     suggestions = ["Show me more", "I need something else"];
   } else {
     responseText = "I couldn't find anything matching your criteria.";
     suggestions = ["Try a different search"];
   }
   
   return {
     userId: $node["Webhook"].json.userId,
     messageId: $node["Webhook"].json.messageId,
     conversationId: $node["Webhook"].json.conversationId,
     responseText,
     suggestions,
     properties: message.includes("property") ? results : [],
     transportationServices: message.includes("transportation") ? results : []
   };
   ```

### 5. Send the Response to the App's Webhook

1. Add another "HTTP Request" node.
2. Configure it to send the response back to the app's webhook:
   - Method: POST
   - URL: http://your-app-url/api/webhook/n8n
   - Headers:
     - Content-Type: application/json
     - Authorization: Bearer your_webhook_secret (use the same value as in your .env.local file)
   - Body: Use the output from the Function node

### 6. Activate the Workflow

1. Click the "Active" toggle in the top-right corner of the n8n interface to activate the workflow.
2. Your n8n workflow is now ready to receive and process messages from the app.

## Testing

1. Start your Next.js application.
2. Navigate to the chat interface.
3. Send a message like "I need a 2-bedroom apartment".
4. The message should be sent to n8n, processed, and a response should be displayed in the chat interface.

## Troubleshooting

- **Webhook not receiving messages**: Check that the n8n server is running and the workflow is activated.
- **No response from n8n**: Check the n8n logs for errors and ensure the webhook URL in your .env.local file is correct.
- **Database queries not working**: Verify your Supabase credentials and ensure the database tables exist.

## Advanced Configuration

### Connecting to External APIs

You can enhance the chatbot by connecting to external APIs for additional data:

1. Add more HTTP Request nodes to your workflow to query external APIs.
2. Process the results in a Function node.
3. Include the results in the response sent back to the app.

### Using AI for Natural Language Processing

You can integrate AI services like OpenAI's GPT to enhance the chatbot's natural language understanding:

1. Add an "OpenAI" node to your workflow.
2. Configure it with your API key and prompt.
3. Use the AI-generated response to enhance your chatbot's replies.

## Conclusion

With n8n set up and configured, your Property Listing & Transportation App now has a powerful chatbot that can process user queries and provide relevant information about properties and transportation services. 