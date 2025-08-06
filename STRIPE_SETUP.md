# Stripe Setup Guide

## Environment Variables

To fix the "Payment System Unavailable" error, you need to set up your environment variables:

1. **Copy the example environment file:**
   ```bash
   cp env.example .env
   ```

2. **Get your Stripe keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for production)
   - Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for production)
   - Replace the placeholder values in the `.env` file with your actual keys

3. **Example .env file:**
   ```
   # Stripe Configuration
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
   STRIPE_SECRET_KEY=pk_test_your_stripe_secret_key_here
   
   # Perplexity AI API Key (optional - for AI assistant feature)
   PERPLEXITY_API_KEY=your_perplexity_api_key_here
   
   # Environment
   NODE_ENV=development
   ```

## What Was Fixed

1. **Added missing payment endpoint**: Created `/api/create-payment-intent` endpoint for guide purchases
2. **Updated environment configuration**: Added both client-side and server-side Stripe keys
3. **Improved error handling**: The server now properly validates Stripe configuration

## Testing

- For development, use test keys (starts with `pk_test_` and `sk_test_`)
- For production, use live keys (starts with `pk_live_` and `sk_live_`)
- Test card numbers: 4242 4242 4242 4242 (Visa), 4000 0000 0000 0002 (declined)

## Error Handling

The application now gracefully handles missing Stripe configuration:
- Shows a user-friendly message when Stripe is not configured
- Provides navigation back to the main pages
- Logs warnings instead of throwing errors

## Files Modified

- `server/routes.ts` - Added missing `/api/create-payment-intent` endpoint
- `env.example` - Updated with both client and server Stripe keys
- `STRIPE_SETUP.md` - Updated with comprehensive setup instructions

## Next Steps

1. Create the `.env` file with your actual Stripe keys
2. Restart your development server
3. Test the payment flow with test card numbers
4. The "Payment System Unavailable" error should now be resolved 