// src/utils/resendClient.js
import Resend from "@resend/node";

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
