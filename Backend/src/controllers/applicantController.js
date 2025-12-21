// APPLY TO JOB CONTROLLER - FIXED PAYMENT FLOW
import Applicant from "../models/Applicant.js";
import Job from "../models/Job.js";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { generateApplicationPDF } from "../utils/pdfTemplateBuilder.js";
import { scheduleEmail } from "../services/emailQueueService.js";

import dotenv from "dotenv";
dotenv.config();

// -----------------------------
// INIT RESEND
// -----------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.error("❌ Missing RESEND_API_KEY");
}

// -----------------------------
// TEMPLATE LOADER
// -----------------------------
const loadTemplate = (filename, variables) => {
  try {
    const filePath = path.join(process.cwd(), "src/emails", filename);
    let template = fs.readFileSync(filePath, "utf8");

    for (const key in variables) {
      const value = variables[key] || '';
      template = template.replace(new RegExp(`{{${key}}}`, "g"), value);
      template = template.replace(new RegExp(`<%=\\s*${key}\\s*%>`, "g"), value);
    }
    return template;
  } catch (err) {
    console.warn(`⚠ Template not found: ${filename}, falling back to text`);
    return null;
  }
};

// -----------------------------
// SEND EMAIL USING RESEND (WITH SIZE LIMITS)
// -----------------------------
const sendEmail = async ({ to, subject, html, text, attachments, replyTo }) => {
  try {
    const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB
    const MAX_SINGLE_ATTACHMENT = 10 * 1024 * 1024; // 10MB per file

    let processedAttachments = [];
    let totalSize = 0;

    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const attachmentSize = attachment.content 
          ? Buffer.from(attachment.content, 'base64').length 
          : 0;

        if (attachmentSize > MAX_SINGLE_ATTACHMENT) {
          console.warn(`⚠️ Skipping attachment ${attachment.filename}: too large (${(attachmentSize / 1024 / 1024).toFixed(2)}MB)`);
          continue;
        }

        if (totalSize + attachmentSize > MAX_TOTAL_SIZE) {
          console.warn(`⚠️ Skipping attachment ${attachment.filename}: would exceed total size limit`);
          continue;
        }

        processedAttachments.push(attachment);
        totalSize += attachmentSize;
      }

      console.log(`📎 Total attachments: ${processedAttachments.length}, Total size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    }

    const emailPayload = {
      from: process.env.FROM_EMAIL || 'Cotrans Global <onboarding@resend.dev>',
      to,
      subject,
    };

    if (replyTo) {
      emailPayload.reply_to = replyTo;
    }

    if (html) {
      emailPayload.html = html;
    } else if (text) {
      emailPayload.text = text;
    }

    if (processedAttachments.length > 0) {
      emailPayload.attachments = processedAttachments;
    }

    console.log('📧 Sending email to:', to);
    console.log('📎 Attachments count:', processedAttachments.length);

    const response = await resend.emails.send(emailPayload);

    if (response.error) {
      console.error('❌ Resend API Error:', response.error);
      throw new Error(response.error.message || 'Email send failed');
    }

    console.log('✅ Email sent successfully:', response.id);
    return response;
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err.message);
    throw err;
  }
};

// -----------------------------
// APPLY TO JOB - MAIN FUNCTION
// -----------------------------
export const applyToJob = async (req, res) => {
  let applicant = null;
  
  try {
    const {
      job: jobIdentifier,
      fullName, 
      email, 
      phone, 
      dateOfBirth,
      nationality, 
      experience,
      education,
      coverLetter,
      notes
    } = req.body;

    // ❌ REMOVED medicalFeePaid and medicalAmount from request body
    // These will be set by the payment controller after successful payment

    // Validation
    if (!fullName || !email || !phone || !experience || !education) {
      return res.status(400).json({ 
        success: false,
        message: 'Please fill all required fields' 
      });
    }

    // Find job by either ObjectId or slug
    let job;
    if (mongoose.Types.ObjectId.isValid(jobIdentifier)) {
      job = await Job.findById(jobIdentifier);
    } else {
      job = await Job.findOne({ slug: jobIdentifier });
    }

    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }

    if (!job.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'This job position is no longer accepting applications' 
      });
    }

    // ✅ REMOVED medical fee check - payment happens AFTER application submission
    // The frontend will redirect to payment page after successful application

    // Save applicant to database WITHOUT payment confirmation
    applicant = await Applicant.create({
      job: job._id,
      fullName, 
      email, 
      phone, 
      dateOfBirth,
      nationality: nationality || 'Kenyan', 
      experience,
      education,
      coverLetter,
      medicalFeePaid: false,  // ✅ Set to false initially
      medicalAmount: 0,       // ✅ Set to 0 initially
      notes
    });

    console.log('✅ Applicant saved to database:', applicant._id);
    console.log('⚠️ Payment pending - will be updated after M-PESA confirmation');

    // Prepare passport photo for PDF only
    let passportPhotoBuffer = null;
    if (req.files && req.files.passportPhoto) {
      passportPhotoBuffer = req.files.passportPhoto.data;
      console.log('📷 Passport photo loaded for PDF:', req.files.passportPhoto.name);
    }

    // Generate PDF Application
    console.log('📄 Generating PDF application...');
    const pdfBuffer = await generateApplicationPDF(applicant, job, passportPhotoBuffer);
    console.log('✅ PDF generated successfully, Size:', (pdfBuffer.length / 1024).toFixed(2), 'KB');

    // Convert PDF to base64
    const pdfBase64 = pdfBuffer.toString('base64');

    // STEP 1: Send Admin Email
    console.log('\n📧 STEP 1: Sending admin notification...');
    
    const adminHtmlTemplate = loadTemplate("adminApplicationTemplate.html", {
      jobTitle: job.title,
      fullName,
      email,
      phone: phone || 'Not provided',
      dateOfBirth: dateOfBirth || 'Not provided',
      nationality: nationality || 'Kenyan',
      experience,
      education,
      coverLetter: coverLetter || 'Not provided',
      medicalAmount: '0 (Payment Pending)', // ✅ Updated
      notes: notes || 'None',
      applicantId: applicant._id,
      paymentStatus: 'PENDING - Awaiting M-PESA confirmation' // ✅ Added
    });

    const adminEmailOptions = {
      to: process.env.ADMIN_EMAIL || 'admin@cotransglobal.com',
      subject: `New Job Application: ${job.title} - ${fullName} [PAYMENT PENDING]`, // ✅ Updated subject
      replyTo: email,
      attachments: [{
        filename: `Application_${applicant.fullName.replace(/\s+/g, '_')}.pdf`,
        content: pdfBase64,
      }]
    };

    if (adminHtmlTemplate) {
      adminEmailOptions.html = adminHtmlTemplate;
    } else {
      adminEmailOptions.text = `
New Application for: ${job.title}

Applicant Details:
------------------
Name: ${fullName}
Email: ${email}
Phone: ${phone || 'N/A'}
Date of Birth: ${dateOfBirth || 'N/A'}
Nationality: ${nationality || 'Kenyan'}

Experience:
${experience}

Education:
${education}

Cover Letter:
${coverLetter || 'N/A'}

⚠️ Medical Fee: PAYMENT PENDING
Applicant ID: ${applicant._id}

Note: Payment confirmation will follow after successful M-PESA transaction.
      `.trim();
    }

    // Send admin email
    try {
      const adminResult = await sendEmail(adminEmailOptions);
      console.log('✅ Admin email sent successfully:', adminResult.id);
    } catch (adminError) {
      console.error('❌ CRITICAL: Failed to send admin email:', adminError.message);
      
      try {
        console.log('⚠️ Attempting admin email without PDF...');
        const fallbackOptions = { ...adminEmailOptions };
        delete fallbackOptions.attachments;
        const fallbackResult = await sendEmail(fallbackOptions);
        console.log('✅ Admin email sent without PDF:', fallbackResult.id);
      } catch (fallbackError) {
        console.error('❌ CRITICAL: Admin email failed completely:', fallbackError.message);
        throw new Error('Failed to notify admin. Application saved but notification failed.');
      }
    }

    // STEP 2: Send User Confirmation Email
    console.log('\n📧 STEP 2: Sending applicant confirmation...');
    
    const userHtmlTemplate = loadTemplate("userApplicationTemplate.html", {
      fullName,
      jobTitle: job.title,
      name: fullName,
      applicantId: applicant._id.toString(),
      nextSteps: 'Please complete your payment of Kshs. 8,000 to finalize your application.' // ✅ Added
    });

    const userEmailOptions = {
      to: email,
      subject: `Application Received: ${job.title} - Complete Payment`,
      attachments: [{
        filename: `Your_Application_${job.title.replace(/\s+/g, '_')}.pdf`,
        content: pdfBase64
      }]
    };

    if (userHtmlTemplate) {
      userEmailOptions.html = userHtmlTemplate;
    } else {
      userEmailOptions.text = `
Dear ${fullName},

Thank you for applying for the ${job.title} position at Cotrans Global.

⚠️ IMPORTANT: Please complete your medical fee payment of Kshs. 8,000 to finalize your application.

Your Application ID: ${applicant._id}

Next Steps:
1. Complete the M-PESA payment of Kshs. 8,000
2. Our team will review your application after payment confirmation
3. Shortlisted candidates will be contacted for interviews

Payment Instructions:
• Use the payment link provided
• Enter your phone number for M-PESA STK push
• Confirm the payment on your phone

Best regards,
Cotrans Global Recruitment Team
      `.trim();
    }

    try {
      const userResult = await sendEmail(userEmailOptions);
      console.log('✅ Applicant confirmation email sent successfully:', userResult.id);
    } catch (userError) {
      console.error('❌ WARNING: Failed to send user email with PDF:', userError.message);
      
      try {
        console.log('⚠️ Attempting user email without PDF...');
        const fallbackUserOptions = { ...userEmailOptions };
        delete fallbackUserOptions.attachments;
        const fallbackResult = await sendEmail(fallbackUserOptions);
        console.log('✅ User email sent without PDF:', fallbackResult.id);
      } catch (fallbackError) {
        console.error('❌ CRITICAL: User email failed completely:', fallbackError.message);
        throw new Error('Failed to send confirmation email. Please check your email address.');
      }
    }

    // STEP 3: Schedule payment reminder email
    console.log('\n📧 STEP 3: Scheduling payment reminder email...');
    try {
      scheduleEmail({
        to: email,
        subject: `Action Required: Complete Payment - ${job.title}`,
        templateName: 'paymentDetailsTemplate.html',
        variables: {
          fullName: applicant.fullName,
          jobTitle: job.title,
          applicantId: applicant._id.toString(),
          amount: '1', // Kshs. 8,000
          urgency: 'Please complete within 24 hours'
        }
      }, 1); // 10 minutes delay
      console.log('✅ Payment reminder email scheduled');
    } catch (scheduleError) {
      console.warn('⚠️ Email scheduling not available:', scheduleError.message);
    }

    // SUCCESS RESPONSE - Return applicant ID for payment flow
    res.status(200).json({ 
      success: true,
      message: 'Application submitted successfully! Please proceed to payment.',
      applicant: {
        id: applicant._id,
        fullName: applicant.fullName,
        email: applicant.email,
        paymentRequired: true,  // ✅ Flag for frontend
        paymentAmount: 1     // ✅ Amount to pay
      }
    });

  } catch (err) {
    console.error('❌ Application submission error:', err);
    
    if (applicant) {
      return res.status(200).json({ 
        success: true,
        message: 'Application submitted successfully, but email notification may have failed. Please proceed to payment.',
        warning: 'Email notification pending',
        applicant: {
          id: applicant._id,
          fullName: applicant.fullName,
          email: applicant.email,
          paymentRequired: true,
          paymentAmount: 1
        }
      });
    }
    
    let errorMessage = 'Failed to submit application. Please try again later.';
    
    if (err.message.includes('Failed to notify admin')) {
      errorMessage = 'Application saved but admin notification failed. We will review your application soon.';
    } else if (err.message.includes('Failed to send confirmation')) {
      errorMessage = 'Application saved but confirmation email failed. Please check your email address.';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// -----------------------------
// LIST APPLICANTS FOR JOB
// -----------------------------
export const listApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    let job;
    if (mongoose.Types.ObjectId.isValid(jobId)) {
      job = await Job.findById(jobId);
    } else {
      job = await Job.findOne({ slug: jobId });
    }

    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }

    const applicants = await Applicant.find({ job: job._id })
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      applicants 
    });
  } catch (err) {
    console.error('List applicants error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// -----------------------------
// GET SINGLE APPLICANT
// -----------------------------
export const getApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id)
      .populate('job', 'title company location salary');
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }
    
    res.json({ 
      success: true,
      applicant 
    });
  } catch (err) {
    console.error('Get applicant error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// -----------------------------
// DOWNLOAD APPLICATION PDF
// -----------------------------
export const downloadApplicationPdf = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id)
      .populate('job', 'title company location salary');
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }

    console.log('Generating PDF for applicant:', applicant._id);
    const pdfBuffer = await generateApplicationPDF(applicant, applicant.job, null);
    
    const filename = `Application_${applicant.fullName.replace(/\s+/g, '_')}_${applicant.job.title.replace(/\s+/g, '_')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    console.log('PDF downloaded successfully');
  } catch (err) {
    console.error('Download PDF error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate PDF',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// -----------------------------
// SHORTLIST APPLICANT
// -----------------------------
export const shortlistApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id, 
      { status: 'shortlisted' }, 
      { new: true }
    ).populate('job', 'title');
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }

    try {
      await sendEmail({
        to: applicant.email,
        subject: `You've Been Shortlisted - ${applicant.job.title}`,
        text: `Dear ${applicant.fullName},\n\nCongratulations! You have been shortlisted for the ${applicant.job.title} position.\n\nOur team will contact you shortly with next steps.\n\nBest regards,\nCotrans Global Recruitment Team`
      });
      console.log('Shortlist notification sent to:', applicant.email);
    } catch (emailErr) {
      console.error('Failed to send shortlist email:', emailErr);
    }

    res.json({ 
      success: true,
      message: 'Applicant shortlisted successfully',
      applicant 
    });
  } catch (err) {
    console.error('Shortlist applicant error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// -----------------------------
// REJECT APPLICANT
// -----------------------------
export const rejectApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id, 
      { status: 'rejected' }, 
      { new: true }
    ).populate('job', 'title');
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }

    try {
      await sendEmail({
        to: applicant.email,
        subject: `Application Update - ${applicant.job.title}`,
        text: `Dear ${applicant.fullName},\n\nThank you for your interest in the ${applicant.job.title} position. After careful consideration, we have decided to move forward with other candidates.\n\nWe encourage you to apply for future opportunities.\n\nBest regards,\nCotrans Global Recruitment Team`
      });
      console.log('Rejection notification sent to:', applicant.email);
    } catch (emailErr) {
      console.error('Failed to send rejection email:', emailErr);
    }

    res.json({ 
      success: true,
      message: 'Applicant status updated',
      applicant 
    });
  } catch (err) {
    console.error('Reject applicant error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// -----------------------------
// GET ALL APPLICANTS (ADMIN)
// -----------------------------
export const getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find()
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      count: applicants.length,
      applicants 
    });
  } catch (err) {
    console.error('Get all applicants error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// -----------------------------
// DELETE APPLICANT
// -----------------------------
export const deleteApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndDelete(req.params.id);
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Applicant deleted successfully' 
    });
  } catch (err) {
    console.error('Delete applicant error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};