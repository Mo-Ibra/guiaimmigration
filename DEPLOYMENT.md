# Deployment Guide

This guide will help you deploy the Guia Immigration application with the server on Render and the client on Vercel.

## Prerequisites

- GitHub account with your code repository
- Render account (free tier available)
- Vercel account (free tier available)
- Stripe account for payments
- Perplexity AI API key for AI assistant
- Database (PostgreSQL recommended)

## Step 1: Deploy Server to Render

### 1.1 Connect to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository

### 1.2 Configure the Web Service

- **Name**: `guia-immigration-server` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 1.3 Environment Variables

Add these environment variables in Render dashboard:

```
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
DATABASE_URL=your_database_connection_string
```

### 1.4 Deploy

Click "Create Web Service" and wait for the deployment to complete. Note the URL (e.g., `https://your-app-name.onrender.com`).

## Step 2: Deploy Client to Vercel

### 2.1 Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository

### 2.2 Configure the Project

- **Framework Preset**: `Vite`
- **Root Directory**: `./` (root of your project)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist/public`

### 2.3 Environment Variables

Add these environment variables in Vercel dashboard:

```
VITE_API_URL=https://your-app-name.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key_here
```

**Important**: Replace `your-app-name.onrender.com` with your actual Render server URL.

### 2.4 Deploy

Click "Deploy" and wait for the deployment to complete.

## Step 3: Update CORS Settings (if needed)

If you encounter CORS issues, you may need to update the server to allow requests from your Vercel domain. Add this to your server configuration:

```typescript
// In server/index.ts or server/routes.ts
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Step 4: Test Your Deployment

1. Test the health check endpoint: `https://your-app-name.onrender.com/api/health`
2. Test the client application: `https://your-vercel-app.vercel.app`
3. Verify that API calls from the client to the server work correctly

## Step 5: Custom Domain (Optional)

### Render Custom Domain
1. In Render dashboard, go to your web service
2. Click "Settings" → "Custom Domains"
3. Add your domain and configure DNS

### Vercel Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain and configure DNS

## Troubleshooting

### Common Issues

1. **Build Failures**: Check the build logs in Render/Vercel for specific error messages
2. **Environment Variables**: Ensure all required environment variables are set correctly
3. **CORS Errors**: Verify the API URL is correct and CORS is properly configured
4. **Database Connection**: Ensure your database is accessible from Render's servers

### Health Check

The server includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs

- **Render**: View logs in the Render dashboard under your web service
- **Vercel**: View logs in the Vercel dashboard under your project

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to your repository
2. **HTTPS**: Both Render and Vercel provide HTTPS by default
3. **API Keys**: Use production API keys for live deployments
4. **Database**: Use a production-ready database with proper security

## Monitoring

- Set up monitoring for your Render service
- Configure alerts for downtime
- Monitor API response times and errors
- Set up logging for debugging production issues

## Updates

To update your deployment:
1. Push changes to your GitHub repository
2. Render and Vercel will automatically redeploy
3. Monitor the deployment logs for any issues 