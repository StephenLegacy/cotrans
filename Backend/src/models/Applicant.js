import mongoose from 'mongoose';

const ApplicantSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  nationality: String,
  experience: String,
  cvName: String,
  pdfPath: {
  type: String,
  default: null
  },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['applied','shortlisted','rejected'], default: 'applied' },
  medicalFeePaid: { type: Boolean, default: false },
  medicalAmount: { type: Number, default: 0 },
  notes: String
},{ timestamps:true });

export default mongoose.model('Applicant', ApplicantSchema);
