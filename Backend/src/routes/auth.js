import express from 'express';
import { register, login } from '../controllers/authController.js';
const router = express.Router();

// Note: In production, restrict register endpoint or seed an admin manually
router.post('/register', register);
router.post('/login', login);

export default router;
