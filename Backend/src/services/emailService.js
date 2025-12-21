// Backend/src/services/emailService.js - Payment Receipt Email with Resend

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Resend with error checking
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is missing in .env file');
  throw new Error('RESEND_API_KEY is required');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// GENERATE PDF RECEIPT
// ============================================
const generatePDFReceipt = async (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header with Logo placeholder
      doc.fontSize(24)
         .fillColor('#16a34a')
         .text('PAYMENT RECEIPT', { align: 'center' })
         .moveDown(0.5);

      doc.fontSize(14)
         .fillColor('#d4af37')
         .text('COTRANS GLOBAL CORPORATION', { align: 'center' })
         .fontSize(10)
         .fillColor('#64748b')
         .text('Licensed UAE Recruitment Partner', { align: 'center' })
         .moveDown(2);

      // Receipt Details Box
      const boxTop = doc.y;
      const boxLeft = 50;
      const boxWidth = 495;
      const boxHeight = 280;

      // Draw box
      doc.rect(boxLeft, boxTop, boxWidth, boxHeight)
         .lineWidth(1)
         .stroke('#e2e8f0');

      // Content inside box
      const leftColumn = 70;
      const rightColumn = 280;
      let yPosition = boxTop + 30;

      doc.fontSize(14)
         .fillColor('#1e3a8a')
         .text('PAYMENT DETAILS', leftColumn, yPosition, { width: boxWidth - 40 });
      yPosition += 30;

      // Receipt Number
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Receipt Number', leftColumn, yPosition);
      doc.fillColor('#1e293b')
         .fontSize(12)
         .text(paymentData.receiptNumber, rightColumn, yPosition, { width: 200 });
      yPosition += 25;

      // Amount Paid
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Amount Paid', leftColumn, yPosition);
      doc.fillColor('#16a34a')
         .fontSize(16)
         .text(`Kshs. ${paymentData.amount.toLocaleString()}`, rightColumn, yPosition);
      yPosition += 30;

      // Transaction Date
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Transaction Date', leftColumn, yPosition);
      doc.fillColor('#1e293b').fontSize(11);
      doc.text(paymentData.transactionDate, rightColumn, yPosition, { width: 200 });
      yPosition += 25;

      // Applicant Name
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Applicant Name', leftColumn, yPosition);
      doc.fillColor('#1e293b').fontSize(11);
      doc.text(paymentData.fullName, rightColumn, yPosition, { width: 200 });
      yPosition += 25;

      // Job Title
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Position Applied', leftColumn, yPosition);
      doc.fillColor('#1e293b').fontSize(11);
      doc.text(paymentData.jobTitle, rightColumn, yPosition, { width: 200 });
      yPosition += 25;

      // Payment Method
      doc.fontSize(10).fillColor('#64748b');
      doc.text('Payment Method', leftColumn, yPosition);
      doc.fillColor('#1e293b').fontSize(11);
      doc.text('M-PESA', rightColumn, yPosition);

      // Move below box
      yPosition = boxTop + boxHeight + 40;

      // Footer Note
      doc.fontSize(10)
         .fillColor('#64748b')
         .text('This is an official payment receipt from Cotrans Global Corporation.', 50, yPosition, {
           align: 'center',
           width: 495,
         });
      yPosition += 20;

      doc.fontSize(9)
         .fillColor('#94a3b8')
         .text('For inquiries: hello@cotransglobal.com | www.cotransglobal.com', 50, yPosition, {
           align: 'center',
           width: 495,
         });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// ============================================
// SEND PAYMENT RECEIPT EMAIL WITH RESEND
// ============================================
export const sendPaymentReceiptEmail = async (paymentData) => {
  try {
    console.log('\n📧 Preparing payment receipt email with Resend...');
    console.log('   Recipient:', paymentData.email);
    console.log('   Receipt Number:', paymentData.receiptNumber);

    // Load email template
    const templatePath = path.join(__dirname, '../emails/paymentReceiptTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace(/{{fullName}}/g, paymentData.fullName)
      .replace(/{{receiptNumber}}/g, paymentData.receiptNumber)
      .replace(/{{amount}}/g, paymentData.amount.toLocaleString())
      .replace(/{{transactionDate}}/g, paymentData.transactionDate)
      .replace(/{{jobTitle}}/g, paymentData.jobTitle);

    // Generate PDF receipt
    console.log('📄 Generating PDF receipt...');
    const pdfBuffer = await generatePDFReceipt(paymentData);
    console.log('✅ PDF generated successfully');

    // Convert PDF buffer to base64 for Resend
    const pdfBase64 = pdfBuffer.toString('base64');

    // Send email with Resend
    console.log('📤 Sending email via Resend...');
    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Cotrans Global Corporation <hello@cotransglobal.com>',
      to: [paymentData.email],
      subject: '✅ Payment Receipt - Medical Fee Confirmed',
      html: htmlTemplate,
      attachments: [
        {
          filename: `Payment_Receipt_${paymentData.receiptNumber}.pdf`,
          content: pdfBase64,
        },
      ],
    });

    console.log('✅ Payment receipt email sent successfully via Resend');
    console.log('   Email ID:', data.id);

    return {
      success: true,
      emailId: data.id,
    };
  } catch (error) {
    console.error('❌ Error sending payment receipt email:', error);
    throw error;
  }
};

// ============================================
// SEND PAYMENT CONFIRMATION (WITHOUT PDF)
// ============================================
export const sendPaymentConfirmationEmail = async (paymentData) => {
  try {
    console.log('\n📧 Sending quick payment confirmation...');

    // Load template
    const templatePath = path.join(__dirname, '../emails/paymentReceiptTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace(/{{fullName}}/g, paymentData.fullName)
      .replace(/{{receiptNumber}}/g, paymentData.receiptNumber)
      .replace(/{{amount}}/g, paymentData.amount.toLocaleString())
      .replace(/{{transactionDate}}/g, paymentData.transactionDate)
      .replace(/{{jobTitle}}/g, paymentData.jobTitle);

    const data = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Cotrans Global Corporation <hello@cotransglobal.com>',
      to: [paymentData.email],
      subject: '✅ Payment Confirmed - Medical Fee Received',
      html: htmlTemplate,
    });

    console.log('✅ Confirmation email sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    throw error;
  }
};