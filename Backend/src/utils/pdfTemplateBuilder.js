// src/utils/pdfTemplateBuilder.js
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

const safeNumber = (value, fallback = 0) =>
  Number.isFinite(value) ? value : fallback;

/**
 * Generates a professional 3-page application PDF with complete branding
 * @param {Object} applicant - Applicant data
 * @param {Object} job - Job data
 * @param {Buffer} passportPhotoBuffer - Optional passport photo
 * @returns {Promise<Buffer>} PDF buffer
 */
export const generateApplicationPDF = async (applicant, job, passportPhotoBuffer = null) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 40, right: 40 },
        bufferPages: true
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Helper to safely get field value with comprehensive checks
      const getField = (obj, ...keys) => {
        if (!obj) return 'Not provided';
        
        for (let key of keys) {
          const value = obj[key];
          if (value !== undefined && 
              value !== null && 
              value !== '' && 
              String(value).trim() !== '' &&
              String(value).toLowerCase() !== 'undefined' &&
              String(value).toLowerCase() !== 'null') {
            return String(value).trim();
          }
        }
        return 'Not provided';
      };

      // ============================================
      // PAGE 1: HEADER WITH LOGO & BRANDING
      // ============================================
      
      // Light gradient header
      doc.rect(0, 0, 595, 100)
         .fill('#dbeafe');
      
      doc.rect(0, 0, 595, 100)
         .fillOpacity(0.6)
         .fill('#bfdbfe')
         .fillOpacity(1);

      // Company Logo
      const logoPath = path.join(process.cwd(), 'public', 'cotrans-logo.png');
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 40, 20, { width: 60, height: 60 });
        } catch (err) {
          console.error('Logo loading error:', err);
        }
      }

      // Company Name & Tagline
      doc.fontSize(26)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('COTRANS GLOBAL CORPORATION', 110, 24);
      
      doc.fontSize(10)
         .fillColor('#3b82f6')
         .font('Helvetica')
         .text('Your Guaranteed Gateway To UAE Top Careers', 110, 52);

      // Contact Information - Add phone number later
      doc.fontSize(8)
         .fillColor('#64748b')
         .text('Email: hello@cotransglobal.com  |  Web: www.cotransglobal.com  ', 40, 82);

      // Physical Address
      doc.fontSize(8)
         .fillColor('#64748b')
         .text('Physical Address: Nairobi, Kenya', 40, 92);

      // ============================================
      // DOCUMENT TITLE
      // ============================================
      let currentY = 120;

      doc.roundedRect(40, currentY, 515, 42, 6)
         .fillAndStroke('#f0f9ff', '#93c5fd');
      
      doc.fontSize(17)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text('JOB APPLICATION FORM', 40, currentY + 13, { 
           align: 'center', 
           width: 515 
         });

      currentY += 52;

      // Application Metadata
      const appDate = new Date(applicant.createdAt || Date.now()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      doc.fontSize(8)
         .fillColor('#64748b')
         .font('Helvetica')
         .text(`Application Date: ${appDate}`, 40, currentY)
         .text(`Reference ID: ${String(applicant._id || '').slice(-8).toUpperCase()}`, 390, currentY, { width: 165, align: 'right' });

      currentY += 24;

      // ============================================
      // PASSPORT PHOTO SECTION
      // ============================================
      const photoWidth = 88;
      const photoHeight = 105;
      const photoX = 462;
      const photoY = currentY;

      if (passportPhotoBuffer) {
        try {
          doc.roundedRect(photoX - 2, photoY - 2, photoWidth + 4, photoHeight + 4, 4)
             .fillAndStroke('#e2e8f0', '#94a3b8');
          
          doc.image(passportPhotoBuffer, photoX, photoY, {
            fit: [photoWidth, photoHeight],
            align: 'center',
            valign: 'center'
          });

          doc.fontSize(7)
             .fillColor('#64748b')
             .font('Helvetica')
             .text('Passport Photo', photoX, photoY + photoHeight + 5, { 
               width: photoWidth, 
               align: 'center' 
             });
        } catch (err) {
          console.error('Passport photo error:', err);
        }
      }

      // ============================================
      // POSITION APPLIED FOR
      // ============================================
      doc.roundedRect(40, currentY, 400, 68, 6)
         .fillAndStroke('#eff6ff', '#bfdbfe');

      doc.fontSize(8)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('POSITION APPLIED FOR', 50, currentY + 10);

      doc.fontSize(13)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text(job.title || 'Not specified', 50, currentY + 24, { width: 380, ellipsis: true });

      doc.fontSize(9)
         .fillColor('#475569')
         .font('Helvetica')
         .text(`Company: ${job.company || 'N/A'}`, 50, currentY + 43);
      
      doc.text(`Location: ${job.location || 'N/A'}`, 240, currentY + 43);

      doc.fontSize(10)
         .fillColor('#15803d')
         .font('Helvetica-Bold')
         .text(`Salary: ${job.salary || 'Negotiable'}`, 50, currentY + 55);

      // CRITICAL: Move past both the position box AND photo
      currentY += 68;
      if (passportPhotoBuffer) {
        const photoBottom = photoY + photoHeight + 18;
        if (currentY < photoBottom) {
          currentY = photoBottom;
        }
      }
      currentY += 5;

      // ============================================
      // PERSONAL INFORMATION SECTION
      // ============================================
      addSectionHeader(doc, 'PERSONAL INFORMATION', currentY);
      currentY += 20;

      const personalData = [
        ['Full Name', getField(applicant, 'fullName', 'name', 'fullname', 'full_name')],
        ['Email Address', getField(applicant, 'email', 'emailAddress', 'email_address')],
        ['Phone Number', getField(applicant, 'phone', 'phoneNumber', 'mobile', 'contact', 'phone_number')],
      //   ['Date of Birth', getField(applicant, 'dateOfBirth', 'dob', 'birthDate', 'date_of_birth', 'birth_date')],
        ['Nationality', getField(applicant, 'nationality', 'country', 'citizenship', 'nation')],
      //   ['ID Number', getField(applicant, 'idNumber', 'nationalId', 'identificationNumber', 'id_number', 'national_id')]
      ];

      personalData.forEach((field, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = col === 0 ? 50 : 310;
        const y = currentY + (row * 24);

        doc.fontSize(7)
           .fillColor('#64748b')
           .font('Helvetica')
           .text(`${field[0]}:`, x, y);

        doc.fontSize(9)
           .fillColor('#1e293b')
           .font('Helvetica-Bold')
           .text(field[1], x, y + 10, { width: 235, ellipsis: true });
      });

      currentY += (Math.ceil(personalData.length / 2) * 24) + 20;

      // ============================================
      // WORK EXPERIENCE SECTION
      // ============================================
      addSectionHeader(doc, 'WORK EXPERIENCE', currentY);
      currentY += 16;

      const experience = getField(applicant, 'experience', 'workExperience', 'employmentHistory', 'work_experience', 'employment_history', 'work_history');
      
      doc.fontSize(9)
         .fillColor('#1e293b')
         .font('Helvetica')
         .text(experience.substring(0, 280), 50, currentY, {
           width: 500,
           lineGap: 2
         });

      currentY += 48;

      // ============================================
      // EDUCATION & QUALIFICATIONS SECTION
      // ============================================

      // addSectionHeader(doc, 'EDUCATION & QUALIFICATIONS', currentY);
      // currentY += 16;

      // const education = getField(applicant, 'education', 'educationLevel', 'qualification', 'qualifications', 'education_level', 'highest_education', 'academic_qualifications', 'academic_background', 'educational_background');
      
      // doc.fontSize(9)
      //    .fillColor('#1e293b')
      //    .font('Helvetica')
      //    .text(education.substring(0, 220), 50, currentY, {
      //      width: 500,
      //      lineGap: 2
      //    });

      // currentY += 40;

      // ============================================
      // COVER LETTER (IF PROVIDED)
      // ============================================
      if (applicant.coverLetter && String(applicant.coverLetter).trim() !== '') {
        addSectionHeader(doc, 'COVER LETTER', currentY);
        currentY += 16;

        doc.fontSize(9)
           .fillColor('#1e293b')
           .font('Helvetica')
           .text(String(applicant.coverLetter).substring(0, 320), 50, currentY, {
             width: 500,
             align: 'justify',
             lineGap: 2
           });

        currentY += 52;
      }

      // ============================================
      // MEDICAL FEE PAYMENT
      // ============================================
      // doc.roundedRect(40, currentY, 515, 42, 6)
      //    .fillAndStroke('#f0fdf4', '#86efac');

      // doc.fontSize(11)
      //    .fillColor('#15803d')
      //    .font('Helvetica-Bold')
      //    .text('MEDICAL FEE PAYMENT PENDING', 50, currentY + 9);

      // doc.fontSize(15)
      //    .fillColor('#166534')
      //    .text(`Kshs. ${(applicant.medicalAmount || 0).toLocaleString()}`, 50, currentY + 24);

      // doc.fontSize(9)
      //    .fillColor('#15803d')
      //    .font('Helvetica')
      //    .text('Your payment is pending Approval', 360, currentY + 27);

      // currentY += 52;

      // ============================================
      // ADDITIONAL NOTES (IF PROVIDED)
      // ============================================
      if (applicant.notes && String(applicant.notes).trim() !== '') {
        addSectionHeader(doc, 'ADDITIONAL NOTES', currentY);
        currentY += 16;

        doc.fontSize(8)
           .fillColor('#1e293b')
           .font('Helvetica')
           .text(String(applicant.notes).substring(0, 220), 50, currentY, { 
             width: 500, 
             lineGap: 2
           });
      }

      // ============================================
      // PAGE 2: APPLICATION DISCLAIMER
      // ============================================
      doc.addPage();
      
      // Page Header
      doc.rect(0, 0, 595, 65)
         .fill('#dbeafe');
      
      doc.fontSize(19)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('APPLICATION DISCLAIMER', 40, 24);

      let y = 85;

      // Introduction
      doc.fontSize(10)
         .fillColor('#1e293b')
         .font('Helvetica')
         .text('This application form and all attached documents are submitted voluntarily by the applicant for employment consideration with ', 40, y, { continued: true, width: 515 })
         .font('Helvetica-Bold')
         .text('Cotrans Global', { continued: true })
         .font('Helvetica')
         .text(' and its partner organizations.');

      y += 38;

      // Main Confirmations Section
      doc.fontSize(12)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('BY SUBMITTING THIS APPLICATION, THE APPLICANT CONFIRMS:', 40, y);

      y += 22;

      const confirmations = [
        'All information provided is true, accurate, and complete to the best of their knowledge.',
        'Any false statements or omissions may result in disqualification or termination of employment.',
        'Cotrans Global reserves the right to verify all information provided.',
        'The applicant authorizes background checks, reference verification, and credential validation.',
        'The medical fee paid is non-refundable and covers pre-employment medical assessments.',
        'Employment is subject to satisfactory completion of all screening processes.',
        'This application does not constitute a contract or guarantee of employment.',
        'Cotrans Global maintains the right to reject any application without providing reasons.'
      ];

      confirmations.forEach((item, index) => {
        doc.fontSize(9)
           .fillColor('#1e40af')
           .font('Helvetica-Bold')
           .text(`${index + 1}. `, 50, y, { continued: true })
           .fillColor('#1e293b')
           .font('Helvetica')
           .text(item, { width: 495, lineGap: 2.5 });
        y = doc.y + 7;
      });

      y += 12;

      // Understanding Clause
      doc.fontSize(9)
         .fillColor('#475569')
         .font('Helvetica-Oblique')
         .text('The applicant understands that submission of this application does not guarantee employment and that all hiring decisions are made at the sole discretion of Cotrans Global and its partner organizations.', 40, y, { width: 515, align: 'justify', lineGap: 2.5 });

      y = doc.y + 28;

      // Declaration Section
      doc.fontSize(12)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('APPLICANT DECLARATION', 40, y);

      y += 20;

      doc.fontSize(9)
         .fillColor('#1e293b')
         .font('Helvetica')
         .text('I hereby declare that ', 40, y, { continued: true })
         .font('Helvetica-Bold')
         .text('all information provided in this application is true and accurate', { continued: true })
         .font('Helvetica')
         .text('. I understand that any misrepresentation or omission of facts may result in rejection of my application or termination of employment if discovered after hiring.', { width: 515, align: 'justify', lineGap: 2.5 });

      y = doc.y + 15;

      doc.text('I authorize ', 40, y, { continued: true })
         .font('Helvetica-Bold')
         .text('Cotrans Global', { continued: true })
         .font('Helvetica')
         .text(' and its representatives to conduct background checks, verify my credentials, contact references, and collect any necessary information for employment screening purposes.', { width: 515, align: 'justify', lineGap: 2.5 });

      // ============================================
      // PAGE 3: PRIVACY & DATA PROTECTION NOTICE
      // ============================================
      doc.addPage();
      
      // Page Header
      doc.rect(0, 0, 595, 65)
         .fill('#dbeafe');
      
      doc.fontSize(19)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('PRIVACY & DATA PROTECTION NOTICE', 40, 24);

      y = 85;

      // Introduction
      doc.fontSize(10)
         .fillColor('#1e293b')
         .font('Helvetica-Bold')
         .text('Cotrans Global ', 40, y, { continued: true })
         .font('Helvetica')
         .text('is committed to protecting your personal data and respecting your privacy rights. This notice explains how we handle your information.', { width: 515 });

      y += 32;

      // Privacy Sections
      const privacySections = [
        {
          number: '1',
          title: 'DATA COLLECTION & USE',
          content: 'We collect personal information including your name, contact details, employment history, educational qualifications, identification documents, and medical assessment results. This data is used solely for employment screening, placement services, visa processing, and compliance with legal requirements.'
        },
        {
          number: '2',
          title: 'DATA STORAGE & SECURITY',
          content: 'Your application data is stored securely in encrypted databases with restricted access. We implement industry-standard security measures to prevent unauthorized access, disclosure, or destruction of your personal information.'
        },
        {
          number: '3',
          title: 'DATA SHARING',
          content: 'Your information may be shared with: (a) Potential employers for recruitment purposes, (b) Government agencies for visa and work permit processing, (c) Medical facilities for health assessments, (d) Background check providers for verification. We only share data necessary for legitimate employment purposes.'
        },
        {
          number: '4',
          title: 'YOUR RIGHTS',
          content: 'You have the right to: Access your personal data, Request corrections to inaccurate information, Withdraw consent for data processing (subject to contractual obligations), Request deletion of your data after the retention period, Lodge complaints with relevant data protection authorities.'
        },
        {
          number: '5',
          title: 'DATA RETENTION',
          content: 'Application records are retained for a minimum of 2 years for compliance purposes. Successful applicants\' data is maintained throughout employment and 7 years post-employment as required by law.'
        },
        {
          number: '6',
          title: 'CONSENT',
          content: 'By submitting this application, you acknowledge that you have read and understood this Privacy Notice and consent to the processing of your personal data as described herein.'
        }
      ];

      privacySections.forEach(section => {
        doc.fontSize(11)
           .fillColor('#1e40af')
           .font('Helvetica-Bold')
           .text(`${section.number}. ${section.title}`, 40, y);
        
        y += 18;

        doc.fontSize(9)
           .fillColor('#1e293b')
           .font('Helvetica')
           .text(section.content, 40, y, { width: 515, align: 'justify', lineGap: 2.5 });
        
        y = doc.y + 16;
      });

      // Contact Section
      y += 8;
      
      doc.fontSize(11)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('CONTACT FOR PRIVACY CONCERNS', 40, y);

      y += 18;

      doc.fontSize(9)
         .fillColor('#1e293b')
         .font('Helvetica')
         .text('For questions about data protection or to exercise your rights, please contact our Data Protection Officer at: ', 40, y, { continued: true, width: 515 })
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('hello@cotransglobal.com');

      // ============================================
      // COMPANY DETAILS FOOTER (PAGE 3)
      // ============================================
      y = 710;

      doc.roundedRect(40, y, 515, 85, 6)
         .fillAndStroke('#f0f9ff', '#93c5fd');

      doc.fontSize(14)
         .fillColor('#1e40af')
         .font('Helvetica-Bold')
         .text('COTRANS GLOBAL CORPORATION', 52, y + 14);

      doc.fontSize(10)
         .fillColor('#1e293b')
         .font('Helvetica')
         .text('International Employment & Recruitment Corporation', 52, y + 32);

      doc.fontSize(8)
         .fillColor('#475569')
         .text('Physical Address:', 52, y + 50, { continued: true })
         .font('Helvetica-Bold')
         .text(' Nairobi, Kenya');
      
      doc.font('Helvetica')
         .text('Email:', 52, y + 62, { continued: true })
         .font('Helvetica-Bold')
         .text(' hello@cotransglobal.com');
      
      doc.font('Helvetica')
         .text('Website:', 300, y + 50, { continued: true })
         .font('Helvetica-Bold')
         .text(' www.cotransglobal.com');
      
      doc.font('Helvetica')
         .text('Phone:', 300, y + 62, { continued: true })
         .font('Helvetica-Bold')
         // .text(' +254 700 000 000');

      doc.end();

      /**
       * Helper function for styled section headers
       */
      function addSectionHeader(doc, title, y) {
        doc.fontSize(10)
           .fillColor('#1e40af')
           .font('Helvetica-Bold')
           .text(title, 40, y);
        
        doc.moveTo(40, y + 14)
           .lineTo(555, y + 14)
           .strokeColor('#3b82f6')
           .lineWidth(1.2)
           .stroke();
      }

    } catch (err) {
      reject(err);
    }
  });
};