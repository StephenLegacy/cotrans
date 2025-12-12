import express from 'express';
import { 
  getJobs, 
  getJobById, 
  getJobBySlug, 
  createJob, 
  updateJob, 
  deleteJob,
  getCategories,
  getLocations
} from '../controllers/jobController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/categories', getCategories);
router.get('/locations', getLocations);

// ⚠️ Make sure slug route comes BEFORE :id route
router.get('/slug/:slug', getJobBySlug);
router.get('/:id', getJobById);

// Protected routes (Admin only)
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;
