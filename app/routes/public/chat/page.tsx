import ChatInterface from '@/app/components/chatbot/chat-interface';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Property & Transportation Assistant</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered assistant can help you find the perfect property and transportation services based on your preferences.
          </p>
        </div>
        
        <div className="bg-card/50 p-6 rounded-lg shadow-sm">
          <ChatInterface />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">How It Works</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                <span>Tell the assistant what you're looking for in a property</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                <span>Specify your preferences for location, price, size, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                <span>Get personalized recommendations based on your needs</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                <span>Ask about transportation options for your chosen property</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Example Questions</h2>
            <ul className="space-y-2 text-sm">
              <li className="p-2 bg-muted rounded-md">"I'm looking for a 2-bedroom apartment in downtown under $2000"</li>
              <li className="p-2 bg-muted rounded-md">"What transportation options are available near 123 Main Street?"</li>
              <li className="p-2 bg-muted rounded-md">"Show me houses with a garden in the suburbs"</li>
              <li className="p-2 bg-muted rounded-md">"I need a moving company for next weekend"</li>
              <li className="p-2 bg-muted rounded-md">"What are the best neighborhoods for students?"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 