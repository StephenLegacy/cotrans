import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

function getToken(admin){
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const register = async (req, res) => {
  try{
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const exists = await Admin.findOne({ email });
    if(exists) return res.status(400).json({ message: 'Admin already exists' });
    const admin = await Admin.create({ name, email, password });
    res.json({ token: getToken(admin), admin: { id: admin._id, email: admin.email }});
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if(!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const matched = await admin.matchPassword(password);
    if(!matched) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: getToken(admin), admin: { id: admin._id, email: admin.email }});
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};
