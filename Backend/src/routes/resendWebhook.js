// src/routes/resendWebhook.js
import express from "express";
const router = express.Router();

// Simple raw-body handler recommended (Resend signs webhooks)
router.post("/resend-events", express.json(), (req, res) => {
  // TODO: verify signature if using Resend's signing secret
  const events = req.body;
  console.log("Resend webhook events:", events);
  // handle f.e. hard_bounce => mark email as invalid in DB
  res.status(200).send("ok");
});

export default router;
