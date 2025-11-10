const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const { protect } = require("../middleware/authMiddleware");

// Teacher routes
router.post("/", protect, classController.createClass);
router.get("/mine/teacher", protect, classController.getAllForTeacher);
router.get("/mine/student", protect, classController.getAllForStudent);
router.get("/:id", protect, classController.getClass);
router.delete("/:classId/student/:studentId", protect, classController.removeStudent);


// Student route
router.post("/join", protect, classController.joinClassByCode);

module.exports = router;
