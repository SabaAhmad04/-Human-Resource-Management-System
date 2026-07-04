const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
    createJobOpening,
    getAllJobOpenings,
    updateJobOpening,
    closeJob,
    scheduleInterview,
    getInterviews,
    updateInterviewStatus
} = require('../controllers/recruitmentController');

const router = express.Router();

router.use(authenticate);

router.post('/jobs', authorize('super_admin', 'hr_manager'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
], validate, createJobOpening);

router.get('/jobs', getAllJobOpenings);

router.put('/jobs/:id', authorize('super_admin', 'hr_manager'), updateJobOpening);

router.put('/jobs/:id/close', authorize('super_admin', 'hr_manager'), closeJob);

router.post('/interviews', authorize('super_admin', 'hr_manager'), [
    body('jobId').isInt().withMessage('Valid job ID is required'),
    body('candidateName').notEmpty().withMessage('Candidate name is required'),
    body('candidateEmail').isEmail().withMessage('Valid email is required'),
    body('scheduledAt').isISO8601().withMessage('Valid scheduled time is required')
], validate, scheduleInterview);

router.get('/interviews', getInterviews);

router.put('/interviews/:id', authorize('super_admin', 'hr_manager'), [
    body('status').isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status')
], validate, updateInterviewStatus);

module.exports = router;
