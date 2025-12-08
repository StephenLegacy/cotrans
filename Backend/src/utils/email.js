import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * sendApplicationEmail: sends an application email to ADMIN_EMAIL
 * - to: process.env.ADMIN_EMAIL
 * - subject, text, attachments optional
 */
export async function sendApplicationEmail({ subject, text, attachments }) {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
    attachments
  });
  return info;
}

export async function sendEmailToApplicant({ to, subject, text }) {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text
  });
  return info;
}
