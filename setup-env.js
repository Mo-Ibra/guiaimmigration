#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up environment variables for Guia Immigration...\n');

// Check if .env already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('.env file already exists. Please manually update it with your Stripe API keys.\n');
  console.log('Required environment variables:');
  console.log('- VITE_STRIPE_PUBLIC_KEY (your Stripe publishable key)');
  console.log('- STRIPE_SECRET_KEY (your Stripe secret key)');
  console.log('- PERPLEXITY_API_KEY (optional, for AI assistant)\n');
  
  console.log('You can get your Stripe keys from: https://dashboard.stripe.com/apikeys');
  console.log('For test mode, use keys starting with pk_test_ and sk_test_');
  console.log('For production, use keys starting with pk_live_ and sk_live_\n');
  
  process.exit(0);
}

// Read the example file
const examplePath = path.join(__dirname, 'env.example');
if (!fs.existsSync(examplePath)) {
  console.error('❌ env.example file not found!');
  process.exit(1);
}

try {
  // Copy the example file to .env
  const exampleContent = fs.readFileSync(examplePath, 'utf8');
  fs.writeFileSync(envPath, exampleContent);
  
  console.log('Created .env file from env.example');
  console.log('Please update the .env file with your actual API keys:\n');
  
  console.log('Required environment variables:');
  console.log('- VITE_STRIPE_PUBLIC_KEY (your Stripe publishable key)');
  console.log('- STRIPE_SECRET_KEY (your Stripe secret key)');
  console.log('- PERPLEXITY_API_KEY (optional, for AI assistant)\n');
  
  console.log('You can get your Stripe keys from: https://dashboard.stripe.com/apikeys');
  console.log('For test mode, use keys starting with pk_test_ and sk_test_');
  console.log('For production, use keys starting with pk_live_ and sk_live_\n');
  
  console.log('IMPORTANT: Never commit your .env file to version control!');
  console.log('   The .env file is already in .gitignore for security.\n');
  
  console.log('After updating the .env file, restart your development server.');
  
} catch (error) {
  console.error('Error creating .env file:', error.message);
  process.exit(1);
} 