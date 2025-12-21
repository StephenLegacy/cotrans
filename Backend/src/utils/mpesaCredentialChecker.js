// Backend/src/utils/mpesaCredentialChecker.js
// RUN THIS TO VERIFY YOUR M-PESA CREDENTIALS

import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const checkMpesaCredentials = async () => {
  console.log('\n🔍 M-PESA CREDENTIAL VERIFICATION\n');
  console.log('=' .repeat(60));
  
  // 1. Check Environment Variables
  console.log('\n1️⃣ CHECKING ENVIRONMENT VARIABLES:\n');
  
  const requiredVars = {
    'MPESA_CONSUMER_KEY': process.env.MPESA_CONSUMER_KEY,
    'MPESA_CONSUMER_SECRET': process.env.MPESA_CONSUMER_SECRET,
    'MPESA_SHORTCODE': process.env.MPESA_SHORTCODE,
    'MPESA_PASSKEY': process.env.MPESA_PASSKEY,
    'MPESA_CALLBACK_URL': process.env.MPESA_CALLBACK_URL,
    'MPESA_ENVIRONMENT': process.env.MPESA_ENVIRONMENT || 'sandbox'
  };

  let hasAllVars = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.log(`   ❌ ${key}: MISSING`);
      hasAllVars = false;
    } else {
      // Mask sensitive data
      const maskedValue = key.includes('SECRET') || key.includes('KEY') || key.includes('PASSKEY')
        ? value.substring(0, 4) + '****' + value.substring(value.length - 4)
        : value;
      console.log(`   ✅ ${key}: ${maskedValue}`);
    }
  }

  if (!hasAllVars) {
    console.log('\n❌ MISSING CREDENTIALS - Cannot proceed with tests\n');
    return;
  }

  console.log('\n✅ All environment variables present\n');

  // 2. Test Access Token Generation
  console.log('2️⃣ TESTING ACCESS TOKEN GENERATION:\n');
  
  try {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const baseUrl = process.env.MPESA_ENVIRONMENT === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';

    const tokenResponse = await axios.get(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const token = tokenResponse.data.access_token;
    console.log(`   ✅ Access Token Generated: ${token.substring(0, 20)}...`);
    console.log(`   ✅ Expires In: ${tokenResponse.data.expires_in} seconds\n`);

    // 3. Test Password Generation
    console.log('3️⃣ TESTING PASSWORD GENERATION:\n');
    
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    
    console.log(`   Shortcode: ${shortcode}`);
    console.log(`   Timestamp: ${timestamp}`);
    console.log(`   Passkey: ${passkey.substring(0, 10)}...`);
    
    const passwordString = `${shortcode}${passkey}${timestamp}`;
    const password = Buffer.from(passwordString).toString('base64');
    
    console.log(`   ✅ Generated Password: ${password.substring(0, 30)}...\n`);

    // 4. Verify Shortcode Format
    console.log('4️⃣ VERIFYING SHORTCODE FORMAT:\n');
    
    if (process.env.MPESA_ENVIRONMENT === 'sandbox') {
      if (shortcode !== '174379') {
        console.log(`   ⚠️  WARNING: Sandbox shortcode should be 174379, but got: ${shortcode}`);
        console.log(`   ⚠️  This might cause the "Wrong credentials" error!`);
      } else {
        console.log(`   ✅ Sandbox shortcode is correct: ${shortcode}`);
      }
    } else {
      if (!/^\d{5,7}$/.test(shortcode)) {
        console.log(`   ⚠️  WARNING: Shortcode format looks incorrect: ${shortcode}`);
      } else {
        console.log(`   ✅ Production shortcode format looks valid: ${shortcode}`);
      }
    }

    // 5. Verify Passkey Format
    console.log('\n5️⃣ VERIFYING PASSKEY FORMAT:\n');
    
    if (process.env.MPESA_ENVIRONMENT === 'sandbox') {
      const sandboxPasskey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
      if (passkey !== sandboxPasskey) {
        console.log(`   ⚠️  WARNING: Sandbox passkey doesn't match expected value!`);
        console.log(`   Expected: ${sandboxPasskey}`);
        console.log(`   Got:      ${passkey}`);
        console.log(`   ⚠️  This WILL cause "Wrong credentials" error!`);
      } else {
        console.log(`   ✅ Sandbox passkey is correct`);
      }
    } else {
      if (passkey.length < 20) {
        console.log(`   ⚠️  WARNING: Production passkey seems too short (${passkey.length} chars)`);
      } else {
        console.log(`   ✅ Production passkey format looks valid (${passkey.length} chars)`);
      }
    }

    // 6. Test STK Push (Dry Run)
    console.log('\n6️⃣ TESTING STK PUSH REQUEST FORMAT:\n');
    
    const stkPushPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: 1,
      PartyA: '254708374149', // Test number
      PartyB: shortcode,
      PhoneNumber: '254708374149',
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'Test',
      TransactionDesc: 'Test Payment'
    };

    console.log(`   Request Payload:`);
    console.log(`   - BusinessShortCode: ${stkPushPayload.BusinessShortCode}`);
    console.log(`   - TransactionType: ${stkPushPayload.TransactionType}`);
    console.log(`   - Amount: ${stkPushPayload.Amount}`);
    console.log(`   - PartyA: ${stkPushPayload.PartyA}`);
    console.log(`   - PartyB: ${stkPushPayload.PartyB}`);
    console.log(`   - PhoneNumber: ${stkPushPayload.PhoneNumber}`);
    console.log(`   - CallBackURL: ${stkPushPayload.CallBackURL}`);

    console.log('\n   ⚠️  NOTE: Not sending actual STK Push to avoid charges\n');

    // Summary
    console.log('=' .repeat(60));
    console.log('\n📋 SUMMARY:\n');
    
    if (process.env.MPESA_ENVIRONMENT === 'sandbox') {
      console.log('   Environment: SANDBOX (Testing)');
      console.log('   Expected Shortcode: 174379');
      console.log('   Expected Passkey: bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919');
    } else {
      console.log('   Environment: PRODUCTION (Live)');
      console.log('   ⚠️  Using production credentials - charges will apply!');
    }

    console.log('\n   If you\'re still getting "Wrong credentials" error, check:');
    console.log('   1. ✅ Consumer Key and Secret are from the SAME app in Daraja');
    console.log('   2. ✅ Shortcode matches your environment (174379 for sandbox)');
    console.log('   3. ✅ Passkey is correct for your environment');
    console.log('   4. ✅ App has "Lipa Na M-Pesa Online" product enabled');
    console.log('   5. ✅ You\'re using the correct environment URLs\n');

  } catch (error) {
    console.log('\n❌ ERROR DURING VERIFICATION:\n');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
      
      if (error.response.status === 401) {
        console.log('\n   💡 SOLUTION: Your Consumer Key/Secret are incorrect');
        console.log('   - Go to https://developer.safaricom.co.ke/MyApps');
        console.log('   - Select your app and get new credentials');
      }
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
};

// Run the check
checkMpesaCredentials().catch(console.error);

export default checkMpesaCredentials;