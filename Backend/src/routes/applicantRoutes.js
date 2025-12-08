import express from 'express';
import { applyToJob, listApplicantsForJob, getApplicant, shortlistApplicant, rejectApplicant } from '../controllers/applicantController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes - anyone can apply (express-fileupload handles files automatically)
router.post('/', applyToJob);
router.post('/apply', applyToJob);

// Admin routes (protected)
router.get('/job/:jobId', protect, listApplicantsForJob);
router.get('/:id', protect, getApplicant);
router.patch('/:id/shortlist', protect, shortlistApplicant);
router.patch('/:id/reject', protect, rejectApplicant);

export default router;