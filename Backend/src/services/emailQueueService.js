// Backend/src/services/emailQueueService.js

import cron from 'node-cron';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory queue (for production, use Redis or RabbitMQ)
const emailQueue = [];
let isProcessing = false;

// ============================================
// EMAIL DELAY CONFIGURATION
// ============================================
// TESTING: Use 30 seconds (0.5 minutes) for immediate testing
// PRODUCTION: Use 10 minutes for real deployment
// 
// To switch between testing and production:
// - For testing: Set EMAIL_DELAY_MINUTES = 0.5 (30 seconds)
// - For production: Set EMAIL_DELAY_MINUTES = 10 (10 minutes)
// ============================================

const EMAIL_DELAY_MINUTES = 0.5; // ← CHANGE THIS: 0.5 for testing (30 sec) | 10 for production

// Alternative: Use environment variable for flexibility
// const EMAIL_DELAY_MINUTES = parseFloat(process.env.EMAIL_DELAY_MINUTES) || 10;

console.log(`📧 Email Queue Configuration: Delay set to ${EMAIL_DELAY_MINUTES} minutes`);

// Load email template
const loadTemplate = (filename, variables) => {
  try {
    const filePath = path.join(process.cwd(), 'src/emails', filename);
    let template = fs.readFileSync(filePath, 'utf8');

    for (const key in variables) {
      const value = variables[key] || '';
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
      // Also support <%= key %> syntax for EJS-style templates
      template = template.replace(new RegExp(`<%=\\s*${key}\\s*%>`, "g"), value);
    }
    return template;
  } catch (err) {
    console.warn(`⚠ Template not found: ${filename}`);
    return null;
  }
};

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const emailPayload = {
      from: process.env.FROM_EMAIL || 'Cotrans Global <onboarding@resend.dev>',
      to,
      subject,
    };

    if (html) {
      emailPayload.html = html;
    } else if (text) {
      emailPayload.text = text;
    }

    const response = await resend.emails.send(emailPayload);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err.message);
    throw err;
  }
};

// ============================================
// SCHEDULE EMAIL WITH CONFIGURABLE DELAY
// ============================================
/**
 * Add email to queue with delay
 * @param {Object} emailData - Email data (to, subject, templateName, variables)
 * @param {number} delayMinutes - Override delay in minutes (optional, defaults to EMAIL_DELAY_MINUTES)
 * @returns {string} Queue ID
 */
export const scheduleEmail = (emailData, delayMinutes = null) => {
  // Use custom delay if provided, otherwise use configured default
  const delay = delayMinutes !== null ? delayMinutes : EMAIL_DELAY_MINUTES;
  
  const scheduledTime = new Date(Date.now() + delay * 60 * 1000);
  
  const queueItem = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...emailData,
    scheduledTime,
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
    createdAt: new Date(),
  };

  emailQueue.push(queueItem);
  
  console.log(`\n📧 Email scheduled successfully`);
  console.log(`   Queue ID: ${queueItem.id}`);
  console.log(`   To: ${emailData.to}`);
  console.log(`   Subject: ${emailData.subject}`);
  console.log(`   Delay: ${delay} minute(s) (${delay * 60} seconds)`);
  console.log(`   Scheduled for: ${scheduledTime.toLocaleString()}`);
  
  return queueItem.id;
};

// ============================================
// PROCESS EMAIL QUEUE
// ============================================
const processQueue = async () => {
  if (isProcessing || emailQueue.length === 0) {
    return;
  }

  isProcessing = true;
  const now = new Date();

  // Filter emails that are ready to be sent
  const readyEmails = emailQueue.filter(
    item => item.status === 'pending' && item.scheduledTime <= now
  );

  if (readyEmails.length > 0) {
    console.log(`\n📬 Processing ${readyEmails.length} ready email(s)...`);
  }

  for (const emailItem of readyEmails) {
    try {
      console.log(`\n📤 Sending scheduled email: ${emailItem.id}`);
      console.log(`   To: ${emailItem.to}`);
      console.log(`   Subject: ${emailItem.subject}`);
      
      // Load template if templateName is provided
      let html = emailItem.html;
      if (emailItem.templateName && emailItem.variables) {
        html = loadTemplate(emailItem.templateName, emailItem.variables);
      }

      // Send email
      const response = await sendEmail({
        to: emailItem.to,
        subject: emailItem.subject,
        html: html || emailItem.text,
        text: emailItem.text,
      });

      // Mark as sent
      emailItem.status = 'sent';
      emailItem.sentAt = new Date();
      
      console.log(`✅ Email sent successfully: ${emailItem.id}`);
      console.log(`   Response ID: ${response.id}`);
      
      // Remove from queue after successful send
      const index = emailQueue.indexOf(emailItem);
      if (index > -1) {
        emailQueue.splice(index, 1);
      }
      
    } catch (error) {
      console.error(`\n❌ Failed to send email ${emailItem.id}:`, error.message);
      
      emailItem.attempts += 1;
      emailItem.lastError = error.message;

      if (emailItem.attempts >= emailItem.maxAttempts) {
        emailItem.status = 'failed';
        console.error(`❌ Email ${emailItem.id} failed permanently after ${emailItem.maxAttempts} attempts`);
        console.error(`   Final error: ${error.message}`);
        
        // Remove from queue after max attempts
        const index = emailQueue.indexOf(emailItem);
        if (index > -1) {
          emailQueue.splice(index, 1);
        }
      } else {
        // Retry in 2 minutes
        emailItem.scheduledTime = new Date(Date.now() + 2 * 60 * 1000);
        console.log(`🔄 Retrying email ${emailItem.id} in 2 minutes`);
        console.log(`   Attempt ${emailItem.attempts}/${emailItem.maxAttempts}`);
      }
    }
  }

  isProcessing = false;
};

// ============================================
// START EMAIL QUEUE PROCESSOR
// ============================================
export const startEmailQueueProcessor = () => {
  console.log('\n🚀 Starting email queue processor...');
  console.log(`   Default delay: ${EMAIL_DELAY_MINUTES} minute(s)`);
  console.log(`   Processing interval: Every 1 minute`);
  console.log(`   Max retry attempts: 3`);
  
  // Process queue every minute
  cron.schedule('* * * * *', () => {
    const pendingCount = emailQueue.filter(e => e.status === 'pending').length;
    if (pendingCount > 0) {
      console.log(`\n⏰ Cron tick - Checking queue (${pendingCount} pending email(s))`);
    }
    processQueue();
  });

  console.log('✅ Email queue processor started successfully\n');
};

// ============================================
// GET QUEUE STATS (FOR MONITORING)
// ============================================
export const getQueueStats = () => {
  const stats = {
    total: emailQueue.length,
    pending: emailQueue.filter(e => e.status === 'pending').length,
    failed: emailQueue.filter(e => e.status === 'failed').length,
    configuredDelay: EMAIL_DELAY_MINUTES,
    emails: emailQueue.map(e => ({
      id: e.id,
      to: e.to,
      subject: e.subject,
      status: e.status,
      scheduledTime: e.scheduledTime,
      attempts: e.attempts,
      createdAt: e.createdAt,
      sentAt: e.sentAt || null,
      lastError: e.lastError || null,
    })),
  };
  return stats;
};

// ============================================
// CANCEL SCHEDULED EMAIL
// ============================================
export const cancelScheduledEmail = (emailId) => {
  const index = emailQueue.findIndex(e => e.id === emailId);
  if (index > -1) {
    const email = emailQueue[index];
    emailQueue.splice(index, 1);
    console.log(`\n🗑️  Cancelled email: ${emailId}`);
    console.log(`   To: ${email.to}`);
    console.log(`   Subject: ${email.subject}`);
    return true;
  }
  console.log(`⚠️  Email not found: ${emailId}`);
  return false;
};

// ============================================
// MANUAL QUEUE PROCESSING (FOR TESTING)
// ============================================
export const processQueueNow = async () => {
  console.log('\n🔧 Manual queue processing triggered...');
  await processQueue();
};

// ============================================
// CLEAR ALL PENDING EMAILS (FOR TESTING)
// ============================================
export const clearQueue = () => {
  const clearedCount = emailQueue.length;
  emailQueue.length = 0;
  console.log(`\n🧹 Cleared ${clearedCount} email(s) from queue`);
  return clearedCount;
};