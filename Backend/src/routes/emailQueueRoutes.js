// Backend/src/routes/emailQueueRoutes.js

import express from 'express';
import { getQueueStats, cancelScheduledEmail } from '../services/emailQueueService.js';

const router = express.Router();

// Get queue statistics (admin only - add auth middleware in production)
router.get('/queue/stats', (req, res) => {
  try {
    const stats = getQueueStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get queue stats',
      error: error.message
    });
  }
});

// Cancel a scheduled email (admin only - add auth middleware in production)
router.delete('/queue/:emailId', (req, res) => {
  try {
    const { emailId } = req.params;
    const cancelled = cancelScheduledEmail(emailId);
    
    if (cancelled) {
      res.json({
        success: true,
        message: 'Email cancelled successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Email not found in queue'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel email',
      error: error.message
    });
  }
});

export default router;