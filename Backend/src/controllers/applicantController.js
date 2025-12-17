// APPLY TO JOB CONTROLLER WITH PDF GENERATION - FIXED VERSION
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
      // Also support <%= key %> syntax for EJS-style templates
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
    // Resend has a 40MB total limit, but we'll be conservative
    const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB
    const MAX_SINGLE_ATTACHMENT = 10 * 1024 * 1024; // 10MB per file

    let processedAttachments = [];
    let totalSize = 0;

    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        const attachmentSize = attachment.content 
          ? Buffer.from(attachment.content, 'base64').length 
          : 0;

        // Skip attachments that are too large
        if (attachmentSize > MAX_SINGLE_ATTACHMENT) {
          console.warn(`⚠️ Skipping attachment ${attachment.filename}: too large (${(attachmentSize / 1024 / 1024).toFixed(2)}MB)`);
          continue;
        }

        // Check if adding this would exceed total size
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

    // Add reply-to if provided
    if (replyTo) {
      emailPayload.reply_to = replyTo;
    }

    // Add content (prefer HTML over text)
    if (html) {
      emailPayload.html = html;
    } else if (text) {
      emailPayload.text = text;
    }

    // Add processed attachments
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
      medicalFeePaid, 
      medicalAmount, 
      notes
    } = req.body;

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

    // Check medical fee
    const requiredAmount = 8000;
    const amountNum = Number(medicalAmount || 0);
    if (!medicalFeePaid || amountNum < requiredAmount) {
      return res.status(400).json({ 
        success: false,
        message: `Mandatory medical test fee of Kshs. ${requiredAmount} is required.`
      });
    }

    // Save applicant to database
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
      medicalFeePaid: true, 
      medicalAmount: amountNum, 
      notes
    });

    console.log('✅ Applicant saved to database:', applicant._id);

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

    // STEP 1: Send Admin Email (WITHOUT large attachments, only PDF)
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
      medicalAmount: amountNum,
      notes: notes || 'None',
      applicantId: applicant._id
    });

    const adminEmailOptions = {
      to: process.env.ADMIN_EMAIL || 'admin@cotransglobal.com',
      subject: `New Job Application: ${job.title} - ${fullName}`,
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

Medical Fee: Kshs. ${amountNum}
Notes: ${notes || 'None'}

Applicant ID: ${applicant._id}

Note: Resume and passport documents can be requested from the applicant directly.
      `.trim();
    }

    // Send admin email - THIS MUST SUCCEED
    try {
      const adminResult = await sendEmail(adminEmailOptions);
      console.log('✅ Admin email sent successfully:', adminResult.id);
    } catch (adminError) {
      console.error('❌ CRITICAL: Failed to send admin email:', adminError.message);
      
      // Try without PDF as last resort
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

    // STEP 2: Send User Confirmation Email with PDF
    console.log('\n📧 STEP 2: Sending applicant confirmation...');
    
    const userHtmlTemplate = loadTemplate("userApplicationTemplate.html", {
      fullName,
      jobTitle: job.title,
      name: fullName
    });

    const userEmailOptions = {
      to: email,
      subject: `Application Received: ${job.title} - Cotrans Global`,
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

We have successfully received your application and our team will review it shortly.

If your qualifications match our requirements, we will contact you within 3-5 business days.

Next Steps:
• Our team will review your application
• Shortlisted candidates will be contacted for interviews
• Successful candidates will undergo medical assessment (Kshs. 8,000)
• Visa processing and job placement assistance will be provided

Best regards,
Cotrans Global Recruitment Team
      `.trim();
    }

    // Send user email - THIS MUST SUCCEED BEFORE PAYMENT EMAIL
    try {
      const userResult = await sendEmail(userEmailOptions);
      console.log('✅ Applicant confirmation email sent successfully:', userResult.id);
    } catch (userError) {
      console.error('❌ WARNING: Failed to send user email with PDF:', userError.message);
      
      // Try without PDF
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

    // STEP 3: Only schedule payment email if previous emails succeeded
    console.log('\n📧 STEP 3: Scheduling payment details email...');
    try {
      scheduleEmail({
        to: email,
        subject: `Next Steps: Complete Your Application - ${job.title}`,
        templateName: 'paymentDetailsTemplate.html',
        variables: {
          fullName: applicant.fullName,
          jobTitle: job.title,
          applicantId: applicant._id.toString(),
        }
      }, 10); // 10 minutes delay
      console.log('✅ Payment details email scheduled for 10 minutes from now');
    } catch (scheduleError) {
      console.warn('⚠️ Email scheduling not available:', scheduleError.message);
      // Don't throw - this is not critical
    }

    // SUCCESS RESPONSE
    res.status(200).json({ 
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.',
      applicant: {
        id: applicant._id,
        fullName: applicant.fullName,
        email: applicant.email
      }
    });

  } catch (err) {
    console.error('❌ Application submission error:', err);
    
    // If applicant was saved but emails failed, we should still return success
    // but with a warning about email
    if (applicant) {
      return res.status(200).json({ 
        success: true,
        message: 'Application submitted successfully, but email notification may have failed. We will contact you shortly.',
        warning: 'Email notification pending',
        applicant: {
          id: applicant._id,
          fullName: applicant.fullName,
          email: applicant.email
        }
      });
    }
    
    // If applicant wasn't saved, this is a real error
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

    // Generate PDF
    console.log('Generating PDF for applicant:', applicant._id);
    const pdfBuffer = await generateApplicationPDF(applicant, applicant.job, null);
    
    // Set response headers for PDF download
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