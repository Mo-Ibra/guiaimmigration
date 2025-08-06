# Payment System Setup Guide

## 🚨 Error: "Invalid API Key provided"

If you're seeing this error:
```
Error: 500: {"message":"Error creating payment intent: Invalid API Key provided: sk_test_***********************here"}
```

This means the Stripe API keys are not properly configured. Here's how to fix it:

## Quick Fix

1. **Run the setup script:**
   ```bash
   npm run setup
   ```

2. **Get your Stripe API keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_` for test mode)
   - Copy your **Secret key** (starts with `sk_test_` for test mode)

3. **Update the .env file:**
   Open the `.env` file and replace the placeholder values:
   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_actual_public_key_here
   STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Manual Setup

If the setup script doesn't work, you can manually create the `.env` file:

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the .env file** with your actual Stripe keys

## Test Mode vs Production

- **For development/testing:** Use test keys (start with `pk_test_` and `sk_test_`)
- **For production:** Use live keys (start with `pk_live_` and `sk_live_`)

## Test Card Numbers

Use these test card numbers to test payments:
- **Success:** 4242 4242 4242 4242 (Visa)
- **Decline:** 4000 0000 0000 0002 (Generic decline)
- **Insufficient funds:** 4000 0000 0000 9995

## Security Notes

⚠️ **IMPORTANT:**
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` for security
- Keep your secret key private and secure

## Troubleshooting

### Still getting 500 errors?
1. Make sure your Stripe keys are correct
2. Check that you're using the right keys (test vs live)
3. Verify the `.env` file is in the root directory
4. Restart your development server after making changes

### Payment system unavailable message?
This means the server detected missing or invalid Stripe configuration. Follow the setup steps above.

### Need help?
- Check the [Stripe documentation](https://stripe.com/docs)
- Review the [STRIPE_SETUP.md](./STRIPE_SETUP.md) file
- Contact support if you continue having issues

## What Was Fixed

The application now:
- ✅ Validates Stripe configuration on startup
- ✅ Shows helpful error messages instead of 500 errors
- ✅ Gracefully handles missing API keys
- ✅ Provides clear setup instructions
- ✅ Includes a setup script for easy configuration 