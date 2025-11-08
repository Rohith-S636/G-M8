const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware'); // adjust name if yours differs

router.post('/', protect, classController.createClass); // create class (teacher)
router.get('/mine/teacher', protect, classController.getAllForTeacher);
router.get('/mine/student', protect, classController.getAllForStudent);
router.get('/:id', protect, classController.getClass);
router.post('/join', protect, classController.joinClassByCode);
router.delete('/:classId/student/:studentId', protect, classController.removeStudent);

module.exports = router;
