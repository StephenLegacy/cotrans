// Backend/src/models/Payment.js - FIXED VERSION
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Applicant',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  checkoutRequestID: {
    type: String,
    required: true,
    unique: true
  },
  merchantRequestID: {
    type: String,
    required: true
  },
  mpesaReceiptNumber: {
    type: String,
    default: null,
    sparse: true  // ✅ This allows multiple null values
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'timeout'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['medical_fee', 'visa_fee', 'other'],
    default: 'medical_fee'
  },
  transactionDate: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// ✅ CRITICAL FIX: Remove the separate index definition
// The sparse: true in the field definition is sufficient
// If you already have the index, you'll need to drop it

paymentSchema.methods.isCompleted = function() {
  return this.status === 'completed' && this.mpesaReceiptNumber;
};

paymentSchema.methods.canRetry = function() {
  return ['failed', 'cancelled', 'timeout'].includes(this.status);
};

export default mongoose.model('Payment', paymentSchema);