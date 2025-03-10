# Property Listing & Transportation App

A chatbot-driven application that streamlines the process of finding real estate and related transportation services. The app provides a user-friendly, conversational experience, leveraging natural language understanding and retrieval-augmented generation (RAG) to deliver personalized recommendations and efficient information access.

## Features

- Chatbot interface for intuitive property and transportation search
- Real estate property listings with detailed information
- Transportation service integration
- Personalized recommendations based on user preferences
- User authentication and profile management
- Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Shadcn UI
- **Backend**: Node.js with Express.js
- **Database**: Supabase
- **Chatbot Platform**: n8n (webhook)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/property-listing-app.git
   cd property-listing-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
property-listing-app/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── routes/             # App routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   └── public/         # Public pages
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── globals.css         # Global CSS
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── .env.local              # Local environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Development

### Database Schema

The application uses Supabase as the database with the following main tables:
- Users
- Properties
- Transportation Services
- User Preferences
- Conversations

### Authentication

Authentication is handled by Supabase Auth, providing:
- Email/password authentication
- Social login (Google, Facebook, etc.)
- Password reset functionality
- User profile management

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.io/)
- [n8n](https://n8n.io/) 