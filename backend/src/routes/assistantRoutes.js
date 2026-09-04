const express = require('express');
const router = express.Router();
const { chatWithAssistant } = require('../controllers/assistantController');

// AI donation assistant (Gemini-powered)
router.post('/', chatWithAssistant);

module.exports = router;
