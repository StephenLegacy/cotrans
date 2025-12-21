// Backend/src/routes/paymentRoutes.js

import express from 'express';
import {
  initiatePayment,
  checkPaymentStatusManual,
  mpesaCallback,
  getPaymentByApplicant,
  resetPaymentStatus,      // ✅ New
  verifyPaymentStatus,      // ✅ New
} from '../controllers/paymentController.js';

const router = express.Router();

// Initiate M-PESA payment
router.post('/initiate', initiatePayment);

// Check payment status manually
router.get('/status/:paymentId', checkPaymentStatusManual);

// M-PESA callback (webhook)
router.post('/callback', mpesaCallback);

// Get payment history for an applicant
router.get('/history/:applicantId', getPaymentByApplicant);

// Verify payment status (check for mismatches)
router.get('/verify/:applicantId', verifyPaymentStatus);

// Reset payment status (for testing/fixing issues)
router.post('/reset/:applicantId', resetPaymentStatus);

export default router;