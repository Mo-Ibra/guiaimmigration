# Deployment URLs Reference

## Server (Render)
- **URL**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/api/health`
- **Environment**: Production

## Client (Vercel)
- **URL**: `https://your-vercel-app.vercel.app`
- **Environment**: Production

## Environment Variables

### Render (Server)
```
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
DATABASE_URL=your_database_connection_string
```

### Vercel (Client)
```
VITE_API_URL=https://your-app-name.onrender.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key_here
```

## Quick Commands

```bash
# Setup deployment environment
npm run setup-deployment

# Build for production
npm run build

# Build for Vercel
npm run vercel-build
```

## Testing Checklist

- [ ] Server health check returns 200 OK
- [ ] Client loads without errors
- [ ] API calls from client to server work
- [ ] Stripe payments work
- [ ] AI assistant works
- [ ] Forms and guides load correctly
- [ ] No CORS errors in browser console 