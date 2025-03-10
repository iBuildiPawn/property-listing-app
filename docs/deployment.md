# Deployment Guide

This document outlines the steps to deploy the Property Listing App to production.

## Prerequisites

Before deploying, ensure you have the following:

1. A Supabase account and project set up with the necessary tables
2. An n8n instance set up for the chatbot functionality
3. A Vercel or Netlify account for hosting the application
4. Environment variables configured for production

## Environment Variables

The following environment variables are required for the application to function properly:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_N8N_WEBHOOK_URL=your-n8n-webhook-url
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Import Project" and select your GitHub repository
   - Configure the project settings (build command, output directory, etc.)
   - Add the environment variables in the Vercel project settings

2. **Deploy the application**:
   - Vercel will automatically deploy your application when you push to the main branch
   - You can also manually trigger a deployment from the Vercel dashboard

3. **Configure custom domain (optional)**:
   - In the Vercel dashboard, go to your project settings
   - Click on "Domains" and add your custom domain
   - Follow the instructions to configure DNS settings

### Option 2: Netlify

1. **Connect your GitHub repository to Netlify**:
   - Go to [Netlify](https://netlify.com) and sign in
   - Click "New site from Git" and select your GitHub repository
   - Configure the build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add the environment variables in the Netlify project settings

2. **Deploy the application**:
   - Netlify will automatically deploy your application when you push to the main branch
   - You can also manually trigger a deployment from the Netlify dashboard

3. **Configure custom domain (optional)**:
   - In the Netlify dashboard, go to your site settings
   - Click on "Domain management" and add your custom domain
   - Follow the instructions to configure DNS settings

## CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration and deployment:

- **CI Workflow** (`.github/workflows/ci.yml`):
  - Runs on every push to the main branch and pull requests
  - Lints the code
  - Runs tests
  - Builds the application

- **CD Workflow** (`.github/workflows/cd.yml`):
  - Runs on every push to the main branch
  - Builds the application
  - Deploys to Vercel or Netlify (depending on configuration)

### Setting up GitHub Secrets

To use the CI/CD pipeline, you need to set up the following secrets in your GitHub repository:

For Vercel deployment:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_N8N_WEBHOOK_URL
```

For Netlify deployment:
```
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_N8N_WEBHOOK_URL
```

## Post-Deployment Checklist

After deploying the application, perform the following checks:

1. Verify that the application loads correctly
2. Test user authentication (signup, login, logout)
3. Test property listing functionality
4. Test transportation service functionality
5. Test chatbot functionality
6. Check responsive design on different devices
7. Verify that all environment variables are correctly set
8. Check for any console errors or warnings

## Troubleshooting

If you encounter issues during deployment, check the following:

1. **Build errors**:
   - Check the build logs for any errors
   - Ensure all dependencies are installed
   - Verify that the build command is correct

2. **Runtime errors**:
   - Check the browser console for any JavaScript errors
   - Verify that all environment variables are correctly set
   - Check the server logs for any backend errors

3. **API errors**:
   - Verify that the Supabase URL and API key are correct
   - Check that the n8n webhook URL is correct and accessible
   - Ensure that the database tables are correctly set up

## Monitoring and Analytics

Consider setting up the following monitoring and analytics tools:

1. **Error tracking**:
   - [Sentry](https://sentry.io)
   - [LogRocket](https://logrocket.com)

2. **Performance monitoring**:
   - [Vercel Analytics](https://vercel.com/analytics)
   - [Google Analytics](https://analytics.google.com)

3. **User behavior analytics**:
   - [Hotjar](https://hotjar.com)
   - [Mixpanel](https://mixpanel.com)

## Scaling Considerations

As your application grows, consider the following scaling strategies:

1. **Database scaling**:
   - Optimize database queries
   - Use connection pooling
   - Consider sharding for large datasets

2. **Frontend performance**:
   - Implement server-side rendering (SSR) for critical pages
   - Use static site generation (SSG) where possible
   - Optimize bundle size and code splitting

3. **API scaling**:
   - Implement caching strategies
   - Use rate limiting to prevent abuse
   - Consider serverless functions for API endpoints 