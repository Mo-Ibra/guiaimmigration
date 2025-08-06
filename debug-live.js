#!/usr/bin/env node

/**
 * Debug Script for Live Environment Issues
 * This script helps identify why guide creation works on localhost but fails on live site
 */

const LIVE_API_URL = 'https://your-app-name.onrender.com'; // Replace with your actual Render URL
const LOCAL_API_URL = 'http://localhost:5000';

async function testEndpoint(baseUrl, endpoint, description) {
  console.log(`\n Testing ${description}`);
  console.log(`URL: ${baseUrl}${endpoint}`);
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testGuideCreation(baseUrl, description) {
  console.log(`\n Testing Guide Creation - ${description}`);
  
  // First login
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log(`Login Status: ${loginResponse.status}`);
    console.log(`Login Response:`, JSON.stringify(loginData, null, 2));
    
    if (!loginResponse.ok) {
      console.log(`Login failed, cannot test guide creation`);
      return;
    }
    
    // Now try to create a guide
    const testGuide = {
      title: "Test Guide " + Date.now(),
      titleEs: "Guía de Prueba " + Date.now(),
      description: "This is a test guide for debugging",
      descriptionEs: "Esta es una guía de prueba para depuración",
      formType: "TEST",
      price: "25.00",
      skillLevel: "beginner",
      featured: false,
      onlineFiling: false
    };
    
    const createResponse = await fetch(`${baseUrl}/api/admin/guides`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testGuide)
    });
    
    const createData = await createResponse.json();
    console.log(`Create Guide Status: ${createResponse.status}`);
    console.log(`Create Guide Response:`, JSON.stringify(createData, null, 2));
    
  } catch (error) {
    console.log(`Guide Creation Error: ${error.message}`);
  }
}

async function runDiagnostics() {
  console.log('Starting Live Environment Diagnostics');
  console.log('='.repeat(50));
  
  // Test basic connectivity
  await testEndpoint(LIVE_API_URL, '/api/health', 'Live Health Check');
  await testEndpoint(LIVE_API_URL, '/api/debug', 'Live Debug Info');
  await testEndpoint(LIVE_API_URL, '/api/debug/admin', 'Live Admin Debug Info');
  
  // Test authentication flow
  await testEndpoint(LIVE_API_URL, '/api/auth/me', 'Live Auth Status (before login)');
  
  // Test guide creation flow
  await testGuideCreation(LIVE_API_URL, 'Live Environment');
  
  console.log('\n' + '='.repeat(50));
  console.log('Diagnostics Complete');
  console.log('\nNext Steps:');
  console.log('1. Replace LIVE_API_URL in this script with your actual Render URL');
  console.log('2. Run this script to test your live environment');
  console.log('3. Compare the results with localhost');
  console.log('4. Check browser developer tools for CORS errors');
  console.log('5. Verify environment variables in Render dashboard');
}

// Run diagnostics if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostics().catch(console.error);
}

export { testEndpoint, testGuideCreation, runDiagnostics };
