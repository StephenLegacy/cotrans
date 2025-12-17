import fs from "fs";
import path from "path";
import { sendEmail } from "./email.js";

export const sendPaymentEmail = async ({ applicant, job }) => {
  const templatePath = path.join(
    process.cwd(),
    "src/emails/userPaymentInstructionsTemplate.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace("{{fullName}}", applicant.fullName)
    .replace("{{jobTitle}}", job.title)
    .replace("{{amount}}", applicant.medicalAmount.toLocaleString())
    .replace("{{paybill}}", "123456")
    .replace("{{account}}", applicant._id.toString().slice(-8))
    .replace("{{dateTime}}", new Date().toLocaleString("en-KE"));

  await sendEmail({
    to: applicant.email,
    subject: "Medical Payment Instructions – Cotrans Global",
    html
  });
};
