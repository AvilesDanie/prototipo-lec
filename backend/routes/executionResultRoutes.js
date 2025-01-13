const express = require('express');
const router = express.Router();
const { createExecutionResult } = require('../controllers/executionResultController');

router.post('/executionResult', createExecutionResult);

module.exports = router;
