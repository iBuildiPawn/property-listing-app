import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Kuwait Property & Transportation App
        </h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Find your dream property and transportation services in Kuwait with our chatbot-driven application.
        </p>
        <div className="flex gap-4">
          <Link
            href="/routes/auth/login"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            href="/routes/auth/register"
            className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
} 