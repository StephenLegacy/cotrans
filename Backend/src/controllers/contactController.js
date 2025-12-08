import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// helper to load template
const loadTemplate = (filename, variables) => {
  let template = fs.readFileSync(path.join(process.cwd(), "src/emails", filename), "utf8");
  for (const key in variables) {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
  }
  return template;
};

export const submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false,
      message: "Please fill all required fields" 
    });
  }

  // Verify environment variables
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("Missing SMTP configuration");
    return res.status(500).json({ 
      success: false,
      message: "Email service not configured. Please contact support." 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add timeout and retry settings
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
    });

    // Verify connection before sending
    await transporter.verify();
    console.log("SMTP connection verified");

    // Admin email
    const adminHtml = loadTemplate("adminContactTemplate.html", { 
      name, 
      email, 
      phone: phone || "Not provided", 
      subject, 
      message 
    });

    const adminSend = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${subject}`,
      html: adminHtml,
      replyTo: email, // Allow admin to reply directly
    });

    console.log("Admin email sent:", adminSend.messageId);

    if (!adminSend.accepted || adminSend.accepted.length === 0) {
      throw new Error("Admin email was rejected by server");
    }

    // User confirmation email
    const userHtml = loadTemplate("userConfirmationTemplate.html", { name, subject });

    const userSend = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "We Received Your Message - Contrans Global",
      html: userHtml,
    });

    console.log("User email sent:", userSend.messageId);

    if (!userSend.accepted || userSend.accepted.length === 0) {
      throw new Error("User confirmation email was rejected by server");
    }

    // Only return success if both emails sent
    return res.status(200).json({ 
      success: true,
      message: "Message sent successfully! Check your email for confirmation." 
    });

  } catch (error) {
    console.error("Contact form error:", error);
    
    // More specific error messages
    let errorMessage = "Failed to send email. Please try again later.";
    
    if (error.code === "EAUTH") {
      errorMessage = "Email authentication failed. Please contact support.";
      console.error("SMTP Authentication failed - check credentials");
    } else if (error.code === "ECONNECTION" || error.code === "ETIMEDOUT") {
      errorMessage = "Could not connect to email server. Please try again later.";
      console.error("SMTP Connection failed");
    } else if (error.responseCode >= 500) {
      errorMessage = "Email server error. Please try again later.";
    }
    
    return res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
};