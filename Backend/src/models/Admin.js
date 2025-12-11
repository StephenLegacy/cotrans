import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema({
  name: { type: String, default: 'Cotrans Global Corporation Admin' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
},{ timestamps:true });

AdminSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.matchPassword = async function(entered){
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model('Admin', AdminSchema);
