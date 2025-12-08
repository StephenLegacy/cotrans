import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import jobRoutes from './src/routes/jobs.js';
import applicantRoutes from './src/routes/applicantRoutes.js';
import fileUpload from "express-fileupload";

import contactRoutes from "./src/routes/contactRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());


connectDB();

app.get('/', (req, res) => res.send('Al Oula Backend v2'));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
