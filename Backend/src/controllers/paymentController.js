// Backend/src/controllers/paymentController.js - FIXED VERSION

import Payment from '../models/Payment.js';
import Applicant from '../models/Applicant.js';
import { initiateSTKPush, queryTransactionStatus, verifyMpesaConfig } from '../services/mpesaService.js';

// ============================================
// INITIATE PAYMENT - FIXED
// ============================================
export const initiatePayment = async (req, res) => {
  try {
    const { applicantId, phone, phoneNumber, amount } = req.body;

    console.log('\n💳 Payment Initiation Request:');
    console.log('   Full Request Body:', JSON.stringify(req.body, null, 2));

    const finalPhone = phone || phoneNumber;

    // Validate inputs
    if (!applicantId || !finalPhone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Applicant ID, phone number, and amount are required',
      });
    }

    // Format phone number
    const cleanPhone = finalPhone.replace(/[\s\-\(\)]/g, '');
    
    if (!/^(254|0)[17]\d{8}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Use: 254712345678 or 0712345678',
      });
    }

    const formattedPhone = cleanPhone.startsWith('0') 
      ? '254' + cleanPhone.substring(1) 
      : cleanPhone;

    console.log(`✅ Formatted Phone: ${formattedPhone}`);

    // Verify M-PESA configuration
    if (!verifyMpesaConfig()) {
      return res.status(500).json({
        success: false,
        message: 'M-PESA service not configured. Contact support.',
      });
    }

    // Find applicant
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      });
    }

    console.log(`✅ Applicant found: ${applicant.fullName}`);

    // ✅ FIX: Check for existing pending/completed payment
    const existingPayment = await Payment.findOne({
      applicant: applicantId,
      status: { $in: ['pending', 'completed'] }
    }).sort({ createdAt: -1 });

    if (existingPayment) {
      if (existingPayment.status === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Medical fee already paid',
          data: {
            paymentId: existingPayment._id,
            mpesaReceiptNumber: existingPayment.mpesaReceiptNumber
          }
        });
      }

      // If pending payment exists and is less than 5 minutes old, return it
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (existingPayment.createdAt > fiveMinutesAgo) {
        console.log('⚠️  Pending payment exists, returning existing request');
        return res.status(200).json({
          success: true,
          message: 'Payment already in progress. Check your phone.',
          data: {
            paymentId: existingPayment._id,
            checkoutRequestId: existingPayment.checkoutRequestID,
            customerMessage: 'Payment request already sent',
          }
        });
      }
    }

    // Initiate STK Push
    console.log('📱 Initiating STK Push...');
    
    const stkPushResult = await initiateSTKPush({
      phone: formattedPhone,
      amount: Number(amount),
      reference: applicantId,
    });

    if (!stkPushResult.success) {
      throw new Error('Failed to initiate STK Push');
    }

    console.log('✅ STK Push initiated successfully');
    console.log(`   Checkout Request ID: ${stkPushResult.checkoutRequestId}`);

    // ✅ FIX: Save payment WITHOUT mpesaReceiptNumber (it will be null)
    const payment = await Payment.create({
      applicant: applicantId,
      phoneNumber: formattedPhone,
      amount: Number(amount),
      checkoutRequestID: stkPushResult.checkoutRequestId,
      merchantRequestID: stkPushResult.merchantRequestId,
      status: 'pending',
      transactionType: 'medical_fee',
      // mpesaReceiptNumber is intentionally omitted - will be null by default
    });

    console.log(`✅ Payment record created: ${payment._id}`);

    // ✅ FIX: Increased delays to avoid rate limiting (M-PESA allows 5 req/min)
    setTimeout(() => checkPaymentStatus(payment._id, stkPushResult.checkoutRequestId, 1), 20000);  // 20 seconds
    setTimeout(() => checkPaymentStatus(payment._id, stkPushResult.checkoutRequestId, 2), 50000);  // 50 seconds
    setTimeout(() => checkPaymentStatus(payment._id, stkPushResult.checkoutRequestId, 3), 90000);  // 90 seconds

    res.status(200).json({
      success: true,
      message: 'Payment request sent. Please check your phone for M-PESA prompt.',
      data: {
        paymentId: payment._id,
        checkoutRequestId: stkPushResult.checkoutRequestId,
        customerMessage: stkPushResult.customerMessage,
      },
    });
  } catch (error) {
    console.error('❌ Payment Initiation Error:', error.message);
    console.error('❌ Full Error:', error);

    let userMessage = 'Payment initiation failed. Please try again.';
    
    // ✅ Better error handling for duplicate key
    if (error.code === 11000) {
      userMessage = 'A payment request is already in progress. Please wait or refresh the page.';
    } else if (error.message.includes('credentials')) {
      userMessage = 'Payment service configuration error. Contact support.';
    } else if (error.message.includes('Rate limit')) {
      userMessage = 'Too many requests. Please wait 1 minute and try again.';
    }

    res.status(500).json({
      success: false,
      message: userMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// ============================================
// CHECK PAYMENT STATUS - FIXED FOR RATE LIMITING
// ============================================
const checkPaymentStatus = async (paymentId, checkoutRequestId, attempt) => {
  try {
    console.log(`\n🔍 Checking payment status (attempt ${attempt})...`);
    console.log(`   Payment ID: ${paymentId}`);
    console.log(`   Checkout Request ID: ${checkoutRequestId}`);

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      console.error('❌ Payment not found:', paymentId);
      return;
    }

    // Skip if already completed or failed
    if (payment.status === 'completed' || payment.status === 'failed') {
      console.log(`⏭️  Payment already ${payment.status}, skipping check`);
      return;
    }

    // ✅ FIX: Add delay before querying to space out requests
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

    // Query transaction status
    const statusResult = await queryTransactionStatus(checkoutRequestId);

    if (statusResult.success) {
      if (statusResult.resultCode === '0') {
        // Payment successful
        console.log('✅ Payment successful!');

        payment.status = 'completed';
        payment.mpesaReceiptNumber = statusResult.data.MpesaReceiptNumber;
        payment.transactionDate = new Date();
        await payment.save();

        // Update applicant
        const updatedApplicant = await Applicant.findByIdAndUpdate(
          payment.applicant,
          {
            medicalFeePaid: true,
            medicalAmount: payment.amount,
          },
          { new: true }
        ).populate('job');

        console.log('✅ Applicant updated with payment confirmation');

        // ✅ SEND PAYMENT RECEIPT EMAIL
        try {
          const { sendPaymentReceiptEmail } = await import('../services/emailService.js');
          
          await sendPaymentReceiptEmail({
            email: updatedApplicant.email,
            fullName: updatedApplicant.fullName,
            receiptNumber: payment.mpesaReceiptNumber,
            amount: payment.amount,
            transactionDate: payment.transactionDate.toLocaleDateString('en-KE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            jobTitle: updatedApplicant.job?.title || 'Not specified',
          });
          
          console.log('✅ Payment receipt email sent successfully');
        } catch (emailError) {
          console.error('⚠️  Failed to send receipt email:', emailError.message);
          // Don't fail the payment if email fails
        }
      } else if (statusResult.resultCode === '1032') {
        // User cancelled
        console.log('⚠️  Payment cancelled by user');

        payment.status = 'cancelled';
        payment.failureReason = 'User cancelled payment';
        await payment.save();
      } else {
        // Payment failed
        console.log(`❌ Payment failed: ${statusResult.resultDesc}`);

        payment.status = 'failed';
        payment.failureReason = statusResult.resultDesc || 'Payment failed';
        await payment.save();
      }
    } else {
      console.log(`⚠️  Status query failed (attempt ${attempt})`);
      
      // ✅ FIX: On last attempt, mark as pending (not timeout) so callback can update
      if (attempt >= 3) {
        console.log('⚠️  Status unknown after 3 attempts, will wait for callback');
        // Don't change status - leave as pending for callback to handle
      }
    }
  } catch (error) {
    console.error(`❌ Error checking payment status (attempt ${attempt}):`, error.message);
  }
};

// ============================================
// M-PESA CALLBACK HANDLER - FIXED
// ============================================
export const mpesaCallback = async (req, res) => {
  try {
    console.log('\n📥 M-PESA Callback Received');
    console.log('Callback Data:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      console.error('❌ Invalid callback format');
      return res.status(400).json({ 
        ResultCode: 1, 
        ResultDesc: 'Invalid callback data' 
      });
    }

    const { stkCallback } = Body;
    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    console.log(`📋 Processing callback for CheckoutRequestID: ${CheckoutRequestID}`);

    // Find payment by checkout request ID
    const payment = await Payment.findOne({ checkoutRequestID: CheckoutRequestID });
    
    if (!payment) {
      console.error('❌ Payment not found for CheckoutRequestID:', CheckoutRequestID);
      // ✅ Still return success to M-PESA to avoid retries
      return res.status(200).json({ 
        ResultCode: 0, 
        ResultDesc: 'Accepted' 
      });
    }

    console.log(`✅ Payment found: ${payment._id}`);
    console.log(`   Current status: ${payment.status}`);

    // ✅ Don't process if already completed
    if (payment.status === 'completed') {
      console.log('⚠️  Payment already completed, ignoring callback');
      return res.status(200).json({ 
        ResultCode: 0, 
        ResultDesc: 'Already processed' 
      });
    }

    // Update payment based on result code
    if (ResultCode === 0) {
      // Success
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const transAmount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
      const transDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;

      console.log('💰 Payment Details:');
      console.log(`   Receipt: ${mpesaReceiptNumber}`);
      console.log(`   Amount: ${transAmount}`);
      console.log(`   Date: ${transDate}`);

      payment.status = 'completed';
      payment.mpesaReceiptNumber = mpesaReceiptNumber;
      payment.transactionDate = new Date();
      await payment.save();

      // Update applicant
      const updatedApplicant = await Applicant.findByIdAndUpdate(
        payment.applicant,
        {
          medicalFeePaid: true,
          medicalAmount: payment.amount,
        },
        { new: true }
      ).populate('job');

      console.log('✅ Payment completed successfully via callback');

      // ✅ SEND PAYMENT RECEIPT EMAIL
      try {
        const { sendPaymentReceiptEmail } = await import('../services/emailService.js');
        
        await sendPaymentReceiptEmail({
          email: updatedApplicant.email,
          fullName: updatedApplicant.fullName,
          receiptNumber: payment.mpesaReceiptNumber,
          amount: payment.amount,
          transactionDate: payment.transactionDate.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          jobTitle: updatedApplicant.job?.title || 'Not specified',
        });
        
        console.log('✅ Payment receipt email sent via callback');
      } catch (emailError) {
        console.error('⚠️  Failed to send receipt email:', emailError.message);
        // Don't fail the callback if email fails
      }
    } else {
      // Failed
      payment.status = ResultCode === 1032 ? 'cancelled' : 'failed';
      payment.failureReason = ResultDesc;
      await payment.save();

      console.log(`❌ Payment ${payment.status}: ${ResultDesc}`);
    }

    // ✅ CRITICAL: Always return success to M-PESA
    res.status(200).json({ 
      ResultCode: 0, 
      ResultDesc: 'Accepted' 
    });
  } catch (error) {
    console.error('❌ Callback processing error:', error);
    // ✅ Still return success to avoid M-PESA retries
    res.status(200).json({ 
      ResultCode: 0, 
      ResultDesc: 'Accepted' 
    });
  }
};

// ============================================
// MANUAL STATUS CHECK
// ============================================
export const checkPaymentStatusManual = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // If already completed or failed, return current status
    if (payment.status !== 'pending') {
      return res.json({
        success: true,
        status: payment.status,
        data: payment,
      });
    }

    // ✅ Rate limiting protection
    const lastCheck = payment.updatedAt;
    const now = new Date();
    const timeSinceLastCheck = (now - lastCheck) / 1000; // seconds

    if (timeSinceLastCheck < 15) {
      return res.json({
        success: true,
        status: payment.status,
        message: 'Please wait before checking again',
        data: payment,
      });
    }

    // Query M-PESA for latest status
    const statusResult = await queryTransactionStatus(payment.checkoutRequestID);

    if (statusResult.success && statusResult.resultCode === '0') {
      payment.status = 'completed';
      payment.mpesaReceiptNumber = statusResult.data.MpesaReceiptNumber;
      payment.transactionDate = new Date();
      await payment.save();

      // Update applicant
      const updatedApplicant = await Applicant.findByIdAndUpdate(
        payment.applicant,
        {
          medicalFeePaid: true,
          medicalAmount: payment.amount,
        },
        { new: true }
      ).populate('job');

      // ✅ SEND PAYMENT RECEIPT EMAIL
      try {
        const { sendPaymentReceiptEmail } = await import('../services/emailService.js');
        
        await sendPaymentReceiptEmail({
          email: updatedApplicant.email,
          fullName: updatedApplicant.fullName,
          receiptNumber: payment.mpesaReceiptNumber,
          amount: payment.amount,
          transactionDate: payment.transactionDate.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          jobTitle: updatedApplicant.job?.title || 'Not specified',
        });
        
        console.log('✅ Payment receipt email sent');
      } catch (emailError) {
        console.error('⚠️  Failed to send receipt email:', emailError.message);
      }
    }

    res.json({
      success: true,
      status: payment.status,
      data: payment,
    });
  } catch (error) {
    console.error('❌ Manual status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Other methods remain the same...
export const getPaymentByApplicant = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const payments = await Payment.find({ applicant: applicantId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error('❌ Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
    });
  }
};

export const resetPaymentStatus = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      });
    }

    const completedPayment = await Payment.findOne({
      applicant: applicantId,
      status: 'completed'
    });

    if (completedPayment) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reset - completed payment exists',
        payment: completedPayment,
      });
    }

    applicant.medicalFeePaid = false;
    applicant.medicalAmount = 0;
    await applicant.save();

    const deletedPayments = await Payment.deleteMany({
      applicant: applicantId,
      status: { $in: ['pending', 'failed', 'cancelled', 'timeout'] }
    });

    console.log(`✅ Reset payment status for applicant: ${applicantId}`);

    res.json({
      success: true,
      message: 'Payment status reset successfully',
      deletedCount: deletedPayments.deletedCount,
    });
  } catch (error) {
    console.error('❌ Reset payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset payment status',
    });
  }
};

export const verifyPaymentStatus = async (req, res) => {
  try {
    const { applicantId } = req.params;

    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: 'Applicant not found',
      });
    }

    const payments = await Payment.find({ applicant: applicantId })
      .sort({ createdAt: -1 });

    const completedPayment = payments.find(p => p.status === 'completed');
    const mismatch = applicant.medicalFeePaid !== !!completedPayment;

    res.json({
      success: true,
      applicant: {
        id: applicant._id,
        name: applicant.fullName,
        medicalFeePaid: applicant.medicalFeePaid,
        medicalAmount: applicant.medicalAmount,
      },
      payments: payments.map(p => ({
        id: p._id,
        status: p.status,
        amount: p.amount,
        mpesaReceiptNumber: p.mpesaReceiptNumber,
        createdAt: p.createdAt,
      })),
      completedPayment: completedPayment ? {
        id: completedPayment._id,
        amount: completedPayment.amount,
        mpesaReceiptNumber: completedPayment.mpesaReceiptNumber,
      } : null,
      mismatch,
    });
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment status',
    });
  }
};