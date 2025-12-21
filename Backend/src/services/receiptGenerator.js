// Backend/src/services/receiptGenerator.js

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import moment from 'moment';

export const generatePaymentReceipt = async (payment, applicant, job) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // HEADER - Company Logo/Name with background
      doc.rect(0, 0, 595, 120).fill('#1e3a8a');
      
      doc.fontSize(28)
         .fillColor('#ffffff')
         .text('COTRANS GLOBAL', 50, 30, { align: 'center' })
         .fontSize(12)
         .fillColor('#d4af37')
         .text('Employment Recruitment Agency', 50, 65, { align: 'center' })
         .fontSize(10)
         .fillColor('#ffffff')
         .text('Nairobi, Kenya | Licensed UAE Recruitment Partner', 50, 85, { align: 'center' });

      // RECEIPT TITLE
      doc.fontSize(24)
         .fillColor('#000000')
         .text('PAYMENT RECEIPT', 50, 150, { align: 'center', underline: true })
         .moveDown(1.5);

      // Receipt Details Box
      const boxY = 200;
      doc.rect(50, boxY, 495, 80)
         .strokeColor('#e2e8f0')
         .lineWidth(2)
         .stroke();

      // Receipt Information
      doc.fontSize(11)
         .fillColor('#000000');

      const receiptInfoY = boxY + 15;
      
      // Receipt Number
      doc.text('Receipt No:', 70, receiptInfoY, { continued: true })
         .font('Helvetica-Bold')
         .fillColor('#1e3a8a')
         .text(` ${payment.mpesaReceiptNumber}`)
         .font('Helvetica')
         .fillColor('#000000');

      // Transaction Date
      const formattedDate = moment(payment.transactionDate, 'YYYYMMDDHHmmss').format('DD MMM YYYY, hh:mm A');
      doc.text('Date:', 70, receiptInfoY + 20, { continued: true })
         .font('Helvetica-Bold')
         .text(` ${formattedDate}`)
         .font('Helvetica');

      // Amount Paid
      doc.text('Amount Paid:', 70, receiptInfoY + 40, { continued: true })
         .font('Helvetica-Bold')
         .fillColor('#16a34a')
         .fontSize(14)
         .text(` Kshs. ${payment.amount.toLocaleString()}`)
         .fillColor('#000000')
         .fontSize(11)
         .font('Helvetica');

      // Status Badge
      doc.rect(380, receiptInfoY + 10, 140, 30)
         .fill('#16a34a');
      doc.fillColor('#ffffff')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('✓ PAYMENT CONFIRMED', 390, receiptInfoY + 18)
         .font('Helvetica')
         .fillColor('#000000')
         .fontSize(11);

      doc.moveDown(2);

      // PAYMENT DETAILS SECTION
      const detailsY = 310;
      
      doc.fontSize(16)
         .fillColor('#1e3a8a')
         .font('Helvetica-Bold')
         .text('Payment Details', 50, detailsY)
         .font('Helvetica')
         .moveDown(0.5);

      doc.fontSize(11)
         .fillColor('#000000');

      const details = [
        { label: 'Paid By', value: applicant.fullName },
        { label: 'Phone Number', value: payment.phoneNumber },
        { label: 'Transaction ID', value: payment.mpesaReceiptNumber },
        { label: 'Checkout Request ID', value: payment.checkoutRequestID },
      ];

      let currentY = detailsY + 35;
      details.forEach(item => {
        doc.text(`${item.label}:`, 70, currentY, { continued: true, width: 150 })
           .font('Helvetica-Bold')
           .text(` ${item.value}`, { width: 400 })
           .font('Helvetica');
        currentY += 20;
      });

      doc.moveDown(1);

      // SERVICE DETAILS SECTION
      const serviceY = currentY + 20;
      
      doc.fontSize(16)
         .fillColor('#1e3a8a')
         .font('Helvetica-Bold')
         .text('Service Details', 50, serviceY)
         .font('Helvetica')
         .moveDown(0.5);

      // Service Table
      const tableY = serviceY + 35;
      
      // Table Header
      doc.rect(50, tableY, 495, 30)
         .fill('#f1f5f9');
      
      doc.fontSize(11)
         .fillColor('#1e3a8a')
         .font('Helvetica-Bold')
         .text('Description', 60, tableY + 10, { width: 280 })
         .text('Position', 350, tableY + 10, { width: 120 })
         .text('Amount', 480, tableY + 10, { width: 60, align: 'right' })
         .font('Helvetica');

      // Table Row
      const rowY = tableY + 30;
      doc.rect(50, rowY, 495, 40)
         .strokeColor('#e2e8f0')
         .stroke();

      doc.fontSize(10)
         .fillColor('#000000')
         .text('Medical Assessment Fee', 60, rowY + 10, { width: 280 })
         .text('UAE Visa Requirements', 60, rowY + 23, { width: 280, fontSize: 9, fillColor: '#64748b' });

      doc.fontSize(10)
         .fillColor('#000000')
         .text(job.title, 350, rowY + 15, { width: 120 });

      doc.font('Helvetica-Bold')
         .text(`Kshs. ${payment.amount.toLocaleString()}`, 470, rowY + 15, { width: 70, align: 'right' })
         .font('Helvetica');

      // Total
      const totalY = rowY + 40;
      doc.rect(50, totalY, 495, 35)
         .fill('#1e3a8a');

      doc.fontSize(13)
         .fillColor('#ffffff')
         .font('Helvetica-Bold')
         .text('TOTAL PAID:', 60, totalY + 10)
         .text(`Kshs. ${payment.amount.toLocaleString()}`, 470, totalY + 10, { width: 70, align: 'right' })
         .font('Helvetica');

      // Generate QR Code
      const qrData = JSON.stringify({
        receiptNo: payment.mpesaReceiptNumber,
        amount: payment.amount,
        date: formattedDate,
        applicant: applicant._id,
      });

      const qrCodeBuffer = await QRCode.toBuffer(qrData, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 120,
      });

      // QR Code position
      const qrY = totalY + 60;
      doc.image(qrCodeBuffer, 430, qrY, { width: 100, height: 100 });
      
      doc.fontSize(8)
         .fillColor('#64748b')
         .text('Scan to verify', 430, qrY + 105, { width: 100, align: 'center' });

      // Important Notes
      doc.fontSize(14)
         .fillColor('#1e3a8a')
         .font('Helvetica-Bold')
         .text('Important Information', 50, qrY)
         .font('Helvetica')
         .moveDown(0.5);

      doc.fontSize(10)
         .fillColor('#000000')
         .text('• This receipt confirms payment of the medical assessment fee', 50, qrY + 30, { width: 350 })
         .text('• Keep this receipt for your records', 50, qrY + 45, { width: 350 })
         .text('• Our team will contact you to schedule your medical assessment', 50, qrY + 60, { width: 350 })
         .text('• For inquiries, contact: hello@cotransglobal.com', 50, qrY + 75, { width: 350 });

      // FOOTER
      const footerY = 750;
      doc.moveTo(50, footerY)
         .lineTo(545, footerY)
         .strokeColor('#cbd5e1')
         .lineWidth(1)
         .stroke();

      doc.fontSize(9)
         .fillColor('#64748b')
         .text('Thank you for choosing Cotrans Global', 50, footerY + 10, { align: 'center' })
         .text('This is a computer-generated receipt and does not require a signature', 50, footerY + 25, { align: 'center' })
         .fontSize(8)
         .fillColor('#94a3b8')
         .text('Cotrans Global Corporation © 2025 | www.cotransglobal.com', 50, footerY + 45, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};