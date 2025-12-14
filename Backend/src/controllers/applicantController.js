// APPLY TO JOB CONTROLLER WITH PDF GENERATION + FALLBACK STRATEGY
import Applicant from "../models/Applicant.js";
import Job from "../models/Job.js";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { generateApplicationPDF } from "../utils/pdfTemplateBuilder.js";
import dotenv from "dotenv";

dotenv.config();

// -----------------------------
// CONSTANTS & SETUP
// -----------------------------
const MAX_EMAIL_ATTACHMENT_SIZE = 3 * 1024 * 1024; // 3MB (conservative limit)
const PDF_STORAGE_DIR = path.join(process.cwd(), "storage/applications");

// Ensure storage directory exists
if (!fs.existsSync(PDF_STORAGE_DIR)) {
  fs.mkdirSync(PDF_STORAGE_DIR, { recursive: true });
  console.log('✓ Created PDF storage directory');
}

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
      template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
    }
    return template;
  } catch (err) {
    console.warn(`⚠ Template not found: ${filename}, falling back to text`);
    return null;
  }
};

// -----------------------------
// SAVE PDF TO DISK (NEW FEATURE)
// -----------------------------
const savePdfToDisk = async (pdfBuffer, applicantId, jobTitle, fullName) => {
  try {
    const filename = `Application_${applicantId}_${fullName.replace(/\s+/g, '_')}_${jobTitle.replace(/\s+/g, '_')}.pdf`;
    const filePath = path.join(PDF_STORAGE_DIR, filename);
    
    await fs.promises.writeFile(filePath, pdfBuffer);
    console.log('✓ PDF saved to disk:', filename);
    
    return {
      path: filePath,
      relativePath: `storage/applications/${filename}`,
      filename
    };
  } catch (err) {
    console.error('❌ Failed to save PDF to disk:', err);
    throw err;
  }
};

// -----------------------------
// CALCULATE ATTACHMENT SIZE (NEW FEATURE)
// -----------------------------
const calculateAttachmentSize = (attachments) => {
  return attachments.reduce((total, att) => {
    if (att.content) {
      const size = Buffer.from(att.content, 'base64').length;
      return total + size;
    }
    return total;
  }, 0);
};

// -----------------------------
// SEND EMAIL USING RESEND
// -----------------------------
const sendEmail = async ({ to, subject, html, text, attachments, replyTo }) => {
  try {
    const emailPayload = {
      from: process.env.FROM_EMAIL,
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

    if (attachments && attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    console.log('📤 Sending email to:', to);
    console.log('📎 Attachments count:', attachments?.length || 0);

    const response = await resend.emails.send(emailPayload);

    if (response.error) {
      console.error('Resend API Error:', response.error);
      throw new Error(response.error.message || 'Email send failed');
    }

    console.log('✓ Email sent successfully:', response.id);
    return response;
  } catch (err) {
    console.error("❌ EMAIL SEND ERROR:", err.message);
    throw err;
  }
};

// -----------------------------
// MAIN APPLICATION HANDLER (UPDATED WITH FALLBACK STRATEGY)
// -----------------------------
export const applyToJob = async (req, res) => {
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
    const applicant = await Applicant.create({
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

    console.log('✓ Applicant saved to database:', applicant._id);

    // Prepare user-uploaded attachments
    const userAttachments = [];
    let passportPhotoBuffer = null;

    if (req.files) {
      if (req.files.resume) {
        const resumeBase64 = req.files.resume.data.toString('base64');
        userAttachments.push({
          filename: req.files.resume.name,
          content: resumeBase64,
        });
        console.log('📎 Resume attached:', req.files.resume.name, 'Size:', (req.files.resume.size / 1024).toFixed(2), 'KB');
      }

      if (req.files.passport) {
        const passportBase64 = req.files.passport.data.toString('base64');
        userAttachments.push({
          filename: req.files.passport.name,
          content: passportBase64,
        });
        console.log('📎 Passport attached:', req.files.passport.name, 'Size:', (req.files.passport.size / 1024).toFixed(2), 'KB');
      }

      if (req.files.passportPhoto) {
        passportPhotoBuffer = req.files.passportPhoto.data;
        console.log('📸 Passport photo for PDF:', req.files.passportPhoto.name, 'Size:', (req.files.passportPhoto.size / 1024).toFixed(2), 'KB');
      }
    }

    // Generate PDF using the new template builder
    console.log('📄 Generating professional PDF application...');
    const pdfBuffer = await generateApplicationPDF(applicant, job, passportPhotoBuffer);
    const pdfSizeKB = (pdfBuffer.length / 1024).toFixed(2);
    console.log(`✓ PDF generated successfully: ${pdfSizeKB} KB`);

    // FEATURE 1: Save PDF to disk (ALWAYS as backup)
    const pdfFile = await savePdfToDisk(pdfBuffer, applicant._id, job.title, fullName);
    
    // Update applicant with PDF path in database
    applicant.pdfPath = pdfFile.relativePath;
    await applicant.save();
    console.log('✓ PDF path saved to database');

    // FEATURE 2: Generate secure download URL
    const downloadUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/applicants/${applicant._id}/download`;

    // ============================================
    // ADMIN EMAIL - NATURE'S REDUNDANCY STRATEGY
    // ============================================
    
    // Prepare admin email content
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
      applicantId: applicant._id,
      downloadUrl
    });

    const adminFallbackHtml = adminHtmlTemplate || `
      <h2>New Job Application: ${job.title}</h2>
      <p><strong>Applicant:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <hr>
      <p><a href="${downloadUrl}" style="background: #1a56db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Application PDF</a></p>
    `;

    // Prepare all possible attachments
    const allAdminAttachments = [...userAttachments, {
      filename: pdfFile.filename,
      content: pdfBuffer.toString('base64')
    }];

    const totalSize = calculateAttachmentSize(allAdminAttachments);
    console.log(`📊 Total attachment size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

    let adminEmailSuccess = false;

    // LAYER 1: Try with ALL attachments (resume + passport + PDF)
    if (totalSize < MAX_EMAIL_ATTACHMENT_SIZE) {
      try {
        console.log('🔄 LAYER 1: Attempting admin email with ALL attachments...');
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `New Application: ${job.title} - ${fullName}`,
          html: adminFallbackHtml,
          replyTo: email,
          attachments: allAdminAttachments
        });
        adminEmailSuccess = true;
        console.log('✅ LAYER 1 SUCCESS: Admin email sent with all attachments');
      } catch (err) {
        console.log('⚠️ LAYER 1 FAILED: Trying fallback...');
      }
    } else {
      console.log('⚠️ LAYER 1 SKIPPED: Attachments exceed size limit');
    }

    // LAYER 2: Try with USER attachments only (no PDF)
    if (!adminEmailSuccess && userAttachments.length > 0) {
      try {
        console.log('🔄 LAYER 2: Attempting admin email with user attachments only...');
        const layer2Html = adminFallbackHtml + `
          <br><br>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>⚠️ Note:</strong> PDF was too large to attach.</p>
            <p style="margin: 5px 0 0 0;"><a href="${downloadUrl}">Download Application PDF here</a></p>
          </div>
        `;
        
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `New Application: ${job.title} - ${fullName}`,
          html: layer2Html,
          replyTo: email,
          attachments: userAttachments
        });
        adminEmailSuccess = true;
        console.log('✅ LAYER 2 SUCCESS: Admin email sent with user attachments only');
      } catch (err) {
        console.log('⚠️ LAYER 2 FAILED: Trying minimal fallback...');
      }
    }

    // LAYER 3: Send with DOWNLOAD LINK only (no attachments)
    if (!adminEmailSuccess) {
      try {
        console.log('🔄 LAYER 3: Attempting admin email with download link only...');
        const layer3Html = adminFallbackHtml + `
          <br><br>
          <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b;"><strong>⚠️ Important:</strong> All attachments were too large to send via email.</p>
            <p style="margin: 5px 0 0 0;"><a href="${downloadUrl}" style="color: #dc2626; font-weight: bold;">Click here to download the complete application package</a></p>
          </div>
        `;
        
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `🔗 New Application (Download Required): ${job.title} - ${fullName}`,
          html: layer3Html,
          replyTo: email
        });
        console.log('✅ LAYER 3 SUCCESS: Admin email sent with download link');
      } catch (err) {
        console.error('❌ ALL LAYERS FAILED: Could not send admin email:', err.message);
      }
    }

    // ============================================
    // USER CONFIRMATION EMAIL - REDUNDANCY STRATEGY
    // ============================================
    
    const userHtmlTemplate = loadTemplate("userApplicationTemplate.html", {
      fullName,
      jobTitle: job.title,
      downloadUrl
    });

    const userFallbackHtml = userHtmlTemplate || `
      <h2>Application Received</h2>
      <p>Dear ${fullName},</p>
      <p>Thank you for applying for the <strong>${job.title}</strong> position.</p>
      <p>Your application has been successfully submitted and our team will review it shortly.</p>
      <p><a href="${downloadUrl}" style="background: #1a56db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Your Application Copy</a></p>
      <p>Best regards,<br>Cotrans Global Team</p>
    `;

    let userEmailSuccess = false;

    // LAYER 1: Try with PDF attachment
    if (pdfBuffer.length < MAX_EMAIL_ATTACHMENT_SIZE) {
      try {
        console.log('🔄 Sending user confirmation with PDF...');
        await sendEmail({
          to: email,
          subject: `Application Received: ${job.title} - Cotrans Global`,
          html: userFallbackHtml,
          attachments: [{
            filename: pdfFile.filename,
            content: pdfBuffer.toString('base64')
          }]
        });
        userEmailSuccess = true;
        console.log('✅ User email sent with PDF attachment');
      } catch (err) {
        console.log('⚠️ User email with PDF failed, trying without...');
      }
    }

    // LAYER 2: Send with DOWNLOAD LINK only
    if (!userEmailSuccess) {
      try {
        console.log('🔄 Sending user confirmation with download link...');
        const fallbackUserHtml = userFallbackHtml + `
          <br><br>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px;">
            <p style="margin: 0; color: #92400e;">Your application PDF is available for download using the link above.</p>
          </div>
        `;
        
        await sendEmail({
          to: email,
          subject: `Application Received: ${job.title} - Cotrans Global`,
          html: fallbackUserHtml
        });
        console.log('✅ User email sent with download link');
      } catch (err) {
        console.error('❌ User email failed:', err.message);
      }
    }

    // Return success response
    res.status(200).json({ 
      success: true,
      message: 'Application submitted successfully! Check your email for confirmation.',
      applicant: {
        id: applicant._id,
        fullName: applicant.fullName,
        email: applicant.email,
        downloadUrl // NEW: Include download URL in response
      }
    });

  } catch (err) {
    console.error('❌ Application submission error:', err);
    
    let errorMessage = 'Failed to submit application. Please try again later.';
    
    if (err.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact support.';
    } else if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      errorMessage = 'Could not connect to email server. Please try again later.';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// -----------------------------
// DOWNLOAD APPLICATION PDF (NEW FEATURE 3)
// -----------------------------
export const downloadApplicationPdf = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Application not found' 
      });
    }

    if (!applicant.pdfPath) {
      return res.status(404).json({ 
        success: false,
        message: 'PDF file not found for this application' 
      });
    }

    const filePath = path.join(process.cwd(), applicant.pdfPath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false,
        message: 'PDF file no longer exists on server' 
      });
    }

    // Serve the file for download
    res.download(filePath, path.basename(filePath), (err) => {
      if (err) {
        console.error('❌ Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false,
            message: 'Failed to download file' 
          });
        }
      }
    });
  } catch (err) {
    console.error('❌ Download error:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// -----------------------------
// EXISTING FUNCTIONS (UNCHANGED)
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
      .sort({ appliedAt: -1 });
    
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