// email.js — using RESEND instead of Nodemailer
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * sendApplicationEmail:
 * Sends application details + attachments to ADMIN_EMAIL
 */
export async function sendApplicationEmail({ subject, text, attachments }) {
  try {
    const res = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      text,
      attachments: attachments?.map((file) => ({
        filename: file.name,
        content: file.data.toString("base64"),
      })),
    });

    return res;
  } catch (error) {
    console.error("Resend Email Error:", error);
    throw error;
  }
}

/**
 * sendEmailToApplicant:
 * Sends a response email to an applicant
 */
export async function sendEmailToApplicant({ to, subject, text }) {
  try {
    const res = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
    });

    return res;
  } catch (error) {
    console.error("Resend Applicant Email Error:", error);
    throw error;
  }
}
