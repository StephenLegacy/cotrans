import Applicant from '../models/Applicant.js';
import Job from '../models/Job.js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Helper to load email templates
const loadTemplate = (filename, variables) => {
  const templatePath = path.join(process.cwd(), "src/emails", filename);
  
  if (!fs.existsSync(templatePath)) {
    console.warn(`Template file not found: ${filename}, using fallback`);
    return null;
  }
  
  let template = fs.readFileSync(templatePath, "utf8");
  for (const key in variables) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
  }
  return template;
};

// Create transporter
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP configuration missing in environment variables");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

// Send email with better error handling
const sendEmail = async (options) => {
  const transporter = createTransporter();
  
  // Verify connection
  await transporter.verify();
  
  const result = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    ...options,
  });

  if (!result.accepted || result.accepted.length === 0) {
    throw new Error(`Email to ${options.to} was rejected by server`);
  }

  return result;
};

export const applyToJob = async (req, res) => {
  try {
    const {
      job: jobId, 
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

    // Find job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({ 
        success: false,
        message: 'Job not found' 
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
      job: jobId, 
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

    console.log('Applicant saved to database:', applicant._id);

    // Prepare attachments (CV/Resume and Passport) - express-fileupload format
    const attachments = [];
    if (req.files) {
      // express-fileupload uses req.files.resume directly (not req.files.resume[0])
      if (req.files.resume) {
        attachments.push({
          filename: req.files.resume.name,  // ← .name instead of .originalname
          content: req.files.resume.data    // ← .data instead of .buffer
        });
        console.log('Resume attached:', req.files.resume.name);
      }
      if (req.files.passport) {
        attachments.push({
          filename: req.files.passport.name,
          content: req.files.passport.data
        });
        console.log('Passport attached:', req.files.passport.name);
      }
    } else {
      console.log('No files attached');
    }

    // Try to use HTML template, fallback to plain text
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

    // Admin email content
    const adminEmailOptions = {
      to: process.env.ADMIN_EMAIL,
      subject: `New Job Application: ${job.title} - ${fullName}`,
      replyTo: email,
      attachments
    };

    if (adminHtmlTemplate) {
      adminEmailOptions.html = adminHtmlTemplate;
    } else {
      // Fallback to plain text
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
      `.trim();
    }

    // Send admin notification
    const adminResult = await sendEmail(adminEmailOptions);
    console.log('Admin email sent:', adminResult.messageId);

    // Try to use HTML template for applicant confirmation
    const userHtmlTemplate = loadTemplate("userApplicationTemplate.html", {
      fullName,
      jobTitle: job.title
    });

    const userEmailOptions = {
      to: email,
      subject: `Application Received: ${job.title} - Contrans Global`
    };

    if (userHtmlTemplate) {
      userEmailOptions.html = userHtmlTemplate;
    } else {
      // Fallback to plain text
      userEmailOptions.text = `
Dear ${fullName},

Thank you for applying for the ${job.title} position at Contrans Global.

We have successfully received your application and our team will review it shortly. If your qualifications match our requirements, we will contact you within 3-5 business days.

Next Steps:
• Our team will review your application
• Shortlisted candidates will be contacted for interviews
• Successful candidates will undergo medical assessment (Kshs. 8,000)
• Visa processing and job placement assistance will be provided

Best regards,
Contrans Global Recruitment Team
      `.trim();
    }

    // Send applicant confirmation
    const userResult = await sendEmail(userEmailOptions);
    console.log('Applicant confirmation email sent:', userResult.messageId);

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
    console.error('Application submission error:', err);
    
    let errorMessage = 'Failed to submit application. Please try again later.';
    
    if (err.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please contact support.';
      console.error('SMTP Authentication failed - check credentials');
    } else if (err.code === 'ECONNECTION' || err.code === 'ETIMEDOUT') {
      errorMessage = 'Could not connect to email server. Please try again later.';
      console.error('SMTP Connection failed');
    } else if (err.message.includes('SMTP configuration missing')) {
      errorMessage = 'Email service not configured. Please contact support.';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

export const listApplicantsForJob = async (req, res) => {
  try {
    const applicants = await Applicant.find({ job: req.params.jobId })
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

    // Send shortlist notification
    try {
      await sendEmail({
        to: applicant.email,
        subject: `You've Been Shortlisted - ${applicant.job.title}`,
        text: `Dear ${applicant.fullName},\n\nCongratulations! You have been shortlisted for the ${applicant.job.title} position.\n\nOur team will contact you shortly with next steps.\n\nBest regards,\nContrans Global Recruitment Team`
      });
      console.log('Shortlist notification sent to:', applicant.email);
    } catch (emailErr) {
      console.error('Failed to send shortlist email:', emailErr);
      // Don't fail the request if email fails
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

    // Send rejection notification (optional)
    try {
      await sendEmail({
        to: applicant.email,
        subject: `Application Update - ${applicant.job.title}`,
        text: `Dear ${applicant.fullName},\n\nThank you for your interest in the ${applicant.job.title} position. After careful consideration, we have decided to move forward with other candidates.\n\nWe encourage you to apply for future opportunities.\n\nBest regards,\nContrans Global Recruitment Team`
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