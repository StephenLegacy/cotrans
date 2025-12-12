import mongoose from 'mongoose';
import slugify from 'slugify';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: 'Cotrans Global Corporation' },
  description: String,
  location: { type: String, default: 'UAE' },
  salary: String,
  requirements: [String],
  responsibilities: [String],
  benefits: [String],
  category: { 
    type: String, 
    enum: ['Healthcare', 'Hospitality', 'Construction', 'Technology', 'Engineering', 'Retail', 'Other'],
    default: 'Other'
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'],
    default: 'Full-time'
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    default: 'Mid Level'
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  slug: { type: String, unique: true, index: true },
  deadline: { 
    type: Date 
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  applicantsCount: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save hook to generate slug from title
JobSchema.pre("save", function(next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});


// Index for faster queries
JobSchema.index({ category: 1, isActive: 1 });
JobSchema.index({ location: 1, isActive: 1 });
JobSchema.index({ featured: 1, isActive: 1 });
JobSchema.index({ deadline: 1 });

export default mongoose.model('Job', JobSchema);