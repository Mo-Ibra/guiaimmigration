#!/usr/bin/env node

/**
 * Deployment Setup Script
 * This script helps you set up environment variables for deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Guia Immigration Deployment Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from env.example...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('❌ env.example file not found!');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Required Environment Variables for Deployment:\n');

console.log('🔧 For Render (Server):');
console.log('NODE_ENV=production');
console.log('STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here');
console.log('PERPLEXITY_API_KEY=your_perplexity_api_key_here');
console.log('DATABASE_URL=your_database_connection_string');

console.log('\n🌐 For Vercel (Client):');
console.log('VITE_API_URL=https://your-app-name.onrender.com');
console.log('VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key_here');

console.log('\n📖 Next Steps:');
console.log('1. Update your .env file with your actual values');
console.log('2. Deploy server to Render using render.yaml');
console.log('3. Deploy client to Vercel using vercel.json');
console.log('4. Set environment variables in both Render and Vercel dashboards');
console.log('5. Test your deployment');

console.log('\n📚 See DEPLOYMENT.md for detailed instructions\n'); 