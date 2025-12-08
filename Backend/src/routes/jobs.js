import express from 'express';
import { 
  getJobs, 
  getJobById, 
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
router.get('/:id', getJobById);

// Protected routes (Admin only)
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

export default router;