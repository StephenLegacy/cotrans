import Job from '../models/Job.js';

// Get all jobs (with optional filters)
export const getJobs = async (req, res) => {
  try {
    const { category, location, search, isActive = true } = req.query;
    
    // Build filter object
    const filter = { isActive };
    
    if (category && category !== 'All Categories') {
      filter.category = category;
    }
    
    if (location && location !== 'All Locations') {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .select('-createdBy');
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch jobs' 
    });
  }
};

// Get single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select('-createdBy');
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch job' 
    });
  }
};

// Create new job (Admin only)
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      createdBy: req.admin?._id
    });
    
    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create job' 
    });
  }
};

// Update job (Admin only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }
    
    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update job' 
    });
  }
};

// Delete job (Admin only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete job' 
    });
  }
};

// Get job categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Job.distinct('category');
    res.json(['All Categories', ...categories]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch categories' 
    });
  }
};

// Get job locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Job.distinct('location');
    res.json(['All Locations', ...locations]);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch locations' 
    });
  }
};