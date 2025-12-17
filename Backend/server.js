import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.js';
import jobRoutes from './src/routes/jobs.js';
import applicantRoutes from './src/routes/applicantRoutes.js';
import fileUpload from 'express-fileupload';
import contactRoutes from './src/routes/contactRoutes.js';
import resendWebhook from "./src/routes/resendWebhook.js";
import healthRoutes from './src/routes/healthRoutes.js';
import { startEmailQueueProcessor } from './src/services/emailQueueService.js';
// Monitoring routes (for admins)
import emailQueueRoutes from './src/routes/emailQueueRoutes.js';


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/webhooks", resendWebhook);

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });

// Health check / test route
app.get('/', (req, res) => res.send('Cotrans Global Corporation Backend v2 is running'));
app.use('/api', healthRoutes);


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', emailQueueRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// After Express app setup, before server.listen()
startEmailQueueProcessor();

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Senior Dev StephenLegacy, The Server is running on port ${PORT}`));

