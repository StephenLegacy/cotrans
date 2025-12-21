// Backend/testPayEmail.js
// Place this file in Backend root directory (same level as server.js)
// Run: node testPayEmail.js

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Checking environment variables...');
console.log('   RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Found' : '❌ Missing');
console.log('   FROM_EMAIL:', process.env.FROM_EMAIL ? '✅ Found' : '❌ Missing');

if (!process.env.RESEND_API_KEY) {
  console.error('\n❌ RESEND_API_KEY is missing in .env file');
  console.error('   Please check your .env file and make sure it contains:');
  console.error('   RESEND_API_KEY=re_KpAqWmFq_448aZdPQ6gTr7p4Jtg9Uq9V9');
  process.exit(1);
}

console.log('\n✅ Environment variables loaded successfully\n');

// Import after loading .env
const { sendPaymentReceiptEmail } = await import('./src/services/emailService.js');

async function testPaymentEmail() {
  try {
    console.log('🧪 Testing payment receipt email...\n');

    const testPaymentData = {
      email: 'oloostephen20191@gmail.com', // Your test email
      fullName: 'STEPHEN OLOO',
      receiptNumber: 'TEST_' + Date.now(),
      amount: 8000,
      transactionDate: new Date().toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      jobTitle: 'Accounts Manager - Dubai',
    };

    console.log('📧 Test Data:');
    console.log(JSON.stringify(testPaymentData, null, 2));
    console.log('\n');

    const result = await sendPaymentReceiptEmail(testPaymentData);

    if (result.success) {
      console.log('\n✅ TEST SUCCESSFUL!');
      console.log('   Email sent with ID:', result.emailId);
      console.log('   Check your inbox:', testPaymentData.email);
      console.log('\n💡 If you don\'t see the email:');
      console.log('   1. Check your spam folder');
      console.log('   2. Verify your domain in Resend dashboard');
      console.log('   3. Make sure FROM_EMAIL is verified');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('\nFull error:', error);
    
    if (error.message.includes('API key')) {
      console.error('\n💡 Fix: Check your RESEND_API_KEY in .env file');
    } else if (error.message.includes('domain')) {
      console.error('\n💡 Fix: Verify your domain in Resend dashboard');
    }
    
    process.exit(1);
  }
}

testPaymentEmail();