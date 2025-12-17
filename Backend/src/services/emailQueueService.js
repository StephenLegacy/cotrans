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

// Load email template
const loadTemplate = (filename, variables) => {
  try {
    const filePath = path.join(process.cwd(), 'src/emails', filename);
    let template = fs.readFileSync(filePath, 'utf8');

    for (const key in variables) {
      template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
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
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err.message);
    throw err;
  }
};

// Add email to queue
export const scheduleEmail = (emailData, delayMinutes = 10) => {
  const scheduledTime = new Date(Date.now() + delayMinutes * 60 * 1000);
  
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
  
  console.log(`📧 Email scheduled for ${scheduledTime.toLocaleString()}`);
  console.log(`   To: ${emailData.to}`);
  console.log(`   Subject: ${emailData.subject}`);
  console.log(`   Queue ID: ${queueItem.id}`);
  
  return queueItem.id;
};

// Process email queue
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

  for (const emailItem of readyEmails) {
    try {
      console.log(`📤 Sending scheduled email: ${emailItem.id}`);
      
      // Load template if templateName is provided
      let html = emailItem.html;
      if (emailItem.templateName && emailItem.variables) {
        html = loadTemplate(emailItem.templateName, emailItem.variables);
      }

      // Send email
      await sendEmail({
        to: emailItem.to,
        subject: emailItem.subject,
        html: html || emailItem.text,
        text: emailItem.text,
      });

      // Mark as sent
      emailItem.status = 'sent';
      emailItem.sentAt = new Date();
      
      console.log(`✅ Email sent successfully: ${emailItem.id}`);
      
      // Remove from queue after successful send
      const index = emailQueue.indexOf(emailItem);
      if (index > -1) {
        emailQueue.splice(index, 1);
      }
      
    } catch (error) {
      console.error(`❌ Failed to send email ${emailItem.id}:`, error.message);
      
      emailItem.attempts += 1;
      emailItem.lastError = error.message;

      if (emailItem.attempts >= emailItem.maxAttempts) {
        emailItem.status = 'failed';
        console.error(`❌ Email ${emailItem.id} failed after ${emailItem.maxAttempts} attempts`);
        
        // Remove from queue after max attempts
        const index = emailQueue.indexOf(emailItem);
        if (index > -1) {
          emailQueue.splice(index, 1);
        }
      } else {
        // Retry in 2 minutes
        emailItem.scheduledTime = new Date(Date.now() + 2 * 60 * 1000);
        console.log(`🔄 Retrying email ${emailItem.id} in 2 minutes (attempt ${emailItem.attempts}/${emailItem.maxAttempts})`);
      }
    }
  }

  isProcessing = false;
};

// Start cron job to process queue every minute
export const startEmailQueueProcessor = () => {
  console.log('🚀 Starting email queue processor...');
  
  // Process queue every minute
  cron.schedule('* * * * *', () => {
    processQueue();
  });

  console.log('✅ Email queue processor started');
  console.log('   Processing interval: Every 1 minute');
};

// Get queue stats (for monitoring)
export const getQueueStats = () => {
  const stats = {
    total: emailQueue.length,
    pending: emailQueue.filter(e => e.status === 'pending').length,
    failed: emailQueue.filter(e => e.status === 'failed').length,
    emails: emailQueue.map(e => ({
      id: e.id,
      to: e.to,
      subject: e.subject,
      status: e.status,
      scheduledTime: e.scheduledTime,
      attempts: e.attempts,
    })),
  };
  return stats;
};

// Cancel scheduled email
export const cancelScheduledEmail = (emailId) => {
  const index = emailQueue.findIndex(e => e.id === emailId);
  if (index > -1) {
    emailQueue.splice(index, 1);
    console.log(`🗑️  Cancelled email: ${emailId}`);
    return true;
  }
  return false;
};