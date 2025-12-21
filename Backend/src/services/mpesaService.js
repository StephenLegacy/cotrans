// Backend/src/services/mpesaService.js - FIXED VERSION

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ============================================
// M-PESA CONFIGURATION
// ============================================
const MPESA_CONFIG = {
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  businessShortCode: process.env.MPESA_SHORTCODE,
  passkey: process.env.MPESA_PASSKEY,
  callbackUrl: process.env.MPESA_CALLBACK_URL,
  
  // Use correct Safaricom API URLs
  authUrl: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
  stkPushUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  queryUrl: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
  
  // For production, use these URLs:
  // authUrl: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
  // stkPushUrl: 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
  // queryUrl: 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query',
};

// ============================================
// TOKEN CACHE TO AVOID RATE LIMITING
// ============================================
let cachedToken = null;
let tokenExpiry = null;

// ============================================
// RATE LIMITER - PREVENT SPIKE ARREST
// ============================================
class RateLimiter {
  constructor(maxRequests = 5, windowMs = 60000) {
    this.requests = [];
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitForSlot() {
    const now = Date.now();
    
    // Remove requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    // If we've hit the limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest) + 1000; // Add 1s buffer
      
      console.log(`⏳ Rate limit reached. Waiting ${(waitTime / 1000).toFixed(1)}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      return this.waitForSlot(); // Recursive call after waiting
    }
    
    // Add current request
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(5, 60000); // 5 requests per minute

// ============================================
// GENERATE M-PESA ACCESS TOKEN (WITH CACHING)
// ============================================
const generateAccessToken = async () => {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('✅ Using cached M-PESA token');
    return cachedToken;
  }

  try {
    // Wait for rate limiter slot
    await rateLimiter.waitForSlot();

    console.log('🔑 Generating new M-PESA access token...');
    
    const auth = Buffer.from(
      `${MPESA_CONFIG.consumerKey}:${MPESA_CONFIG.consumerSecret}`
    ).toString('base64');

    const response = await axios.get(MPESA_CONFIG.authUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    if (response.data && response.data.access_token) {
      cachedToken = response.data.access_token;
      // Token expires in 3599 seconds, cache for 3500 seconds (safe margin)
      tokenExpiry = Date.now() + (3500 * 1000);
      
      console.log('✅ M-PESA token generated successfully');
      console.log(`   Token expires in: ${((tokenExpiry - Date.now()) / 1000 / 60).toFixed(1)} minutes`);
      
      return cachedToken;
    } else {
      throw new Error('Invalid token response from M-PESA API');
    }
  } catch (error) {
    console.error('❌ M-PESA Token Generation Error:', error.message);
    
    // Clear cached token on error
    cachedToken = null;
    tokenExpiry = null;
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Check for specific errors
      if (error.response.status === 401) {
        throw new Error('Invalid M-PESA credentials. Check CONSUMER_KEY and CONSUMER_SECRET.');
      } else if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      throw new Error('M-PESA API timeout. Please try again.');
    }
    
    throw new Error(`Failed to generate M-PESA access token: ${error.message}`);
  }
};

// ============================================
// GENERATE PASSWORD FOR STK PUSH
// ============================================
const generatePassword = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
  
  const password = Buffer.from(
    `${MPESA_CONFIG.businessShortCode}${MPESA_CONFIG.passkey}${timestamp}`
  ).toString('base64');
  
  return { password, timestamp };
};

// ============================================
// INITIATE STK PUSH
// ============================================
export const initiateSTKPush = async ({ phone, amount, reference }) => {
  try {
    console.log('\n📱 Initiating M-PESA STK Push...');
    console.log(`   Phone: ${phone}`);
    console.log(`   Amount: Kshs. ${amount}`);
    console.log(`   Reference: ${reference}`);

    // Validate inputs
    if (!phone || !amount || !reference) {
      throw new Error('Missing required fields: phone, amount, or reference');
    }

    // Format phone number (remove leading 0 or +, ensure 254 prefix)
    let formattedPhone = phone.toString().replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    console.log(`   Formatted phone: ${formattedPhone}`);

    // Get access token
    const accessToken = await generateAccessToken();

    // Generate password and timestamp
    const { password, timestamp } = generatePassword();

    // Wait for rate limiter
    await rateLimiter.waitForSlot();

    // Prepare STK Push request
    const stkPushData = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // Ensure integer
      PartyA: formattedPhone,
      PartyB: MPESA_CONFIG.businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: MPESA_CONFIG.callbackUrl,
      AccountReference: reference,
      TransactionDesc: `Payment for ${reference}`,
    };

    console.log('📤 Sending STK Push request...');

    const response = await axios.post(
      MPESA_CONFIG.stkPushUrl,
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('✅ STK Push Response:', JSON.stringify(response.data, null, 2));

    if (response.data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: response.data.CheckoutRequestID,
        merchantRequestId: response.data.MerchantRequestID,
        customerMessage: response.data.CustomerMessage,
        responseCode: response.data.ResponseCode,
      };
    } else {
      throw new Error(
        response.data.ResponseDescription || 
        response.data.errorMessage || 
        'STK Push failed'
      );
    }
  } catch (error) {
    console.error('❌ STK Push Error:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Handle specific M-PESA errors
      const errorMessage = error.response.data?.errorMessage || 
                          error.response.data?.ResponseDescription || 
                          'STK Push failed';
      
      throw new Error(errorMessage);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('M-PESA request timed out. Please try again.');
    }

    throw error;
  }
};

// ============================================
// QUERY TRANSACTION STATUS (WITH DELAY)
// ============================================
export const queryTransactionStatus = async (checkoutRequestId) => {
  try {
    console.log(`\n🔍 Querying transaction status: ${checkoutRequestId}`);

    // Wait for rate limiter
    await rateLimiter.waitForSlot();

    const accessToken = await generateAccessToken();
    const { password, timestamp } = generatePassword();

    const queryData = {
      BusinessShortCode: MPESA_CONFIG.businessShortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await axios.post(
      MPESA_CONFIG.queryUrl,
      queryData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    console.log('✅ Query Response:', JSON.stringify(response.data, null, 2));

    return {
      success: true,
      resultCode: response.data.ResultCode,
      resultDesc: response.data.ResultDesc,
      data: response.data,
    };
  } catch (error) {
    console.error('❌ Status Query Error:', error.response?.data || error.message);
    
    // Don't throw error for query failures - return failed status instead
    return {
      success: false,
      error: error.message,
      resultCode: 'ERROR',
      resultDesc: 'Failed to query transaction status',
    };
  }
};

// ============================================
// VERIFY CONFIGURATION
// ============================================
export const verifyMpesaConfig = () => {
  const required = [
    'consumerKey',
    'consumerSecret',
    'businessShortCode',
    'passkey',
    'callbackUrl',
  ];

  const missing = required.filter(key => !MPESA_CONFIG[key]);

  if (missing.length > 0) {
    console.error('❌ Missing M-PESA configuration:', missing.join(', '));
    return false;
  }

  console.log('✅ M-PESA configuration verified');
  return true;
};

// ============================================
// CLEAR TOKEN CACHE (FOR TESTING)
// ============================================
export const clearTokenCache = () => {
  cachedToken = null;
  tokenExpiry = null;
  console.log('🗑️  M-PESA token cache cleared');
};