import { Resend } from "resend";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

// Load HTML templates
const loadTemplate = (filename, variables) => {
  let template = fs.readFileSync(
    path.join(process.cwd(), "src/emails", filename),
    "utf8"
  );

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
      message: "Please fill all required fields",
    });
  }

  // Validate required envs
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    return res.status(500).json({
      success: false,
      message: "Email service is not configured. Contact support.",
    });
  }

  try {
    // --------------------------
    // 📩 1. SEND EMAIL TO ADMIN
    // --------------------------
    const adminHtml = loadTemplate("adminContactTemplate.html", {
      name,
      email,
      phone: phone || "Not provided",
      subject,
      message,
    });

    const adminResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${subject}`,
      html: adminHtml,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`,
      reply_to: email,
    });

    console.log("Admin email sent:", adminResponse?.id);

    // --------------------------
    // 📩 2. SEND USER CONFIRMATION
    // --------------------------
    const userHtml = loadTemplate("userConfirmationTemplate.html", {
      name,
      subject,
    });

    const userResponse = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "We Received Your Message - Cotrans Global",
      html: userHtml,
      text: `Hello ${name},\n\nWe received your message regarding "${subject}". Our team will contact you shortly.\n\nBest regards,\nCotrans Global`,
    });

    console.log("User confirmation email sent:", userResponse?.id);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully — please check your email!",
    });

  } catch (error) {
    console.error("❌ Resend Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
    });
  }
};
