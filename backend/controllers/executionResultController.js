const ExecutionResult = require('../models/executionResult');

const createExecutionResult = async (req, res) => {
  try {
    const { user, exercise, code, result, executionTime, score, adaptabilityDecision } = req.body;
    const executionResult = new ExecutionResult({ user, exercise, code, result, executionTime, score, adaptabilityDecision });
    await executionResult.save();
    res.status(201).json(executionResult);
  } catch (error) {
    res.status(500).json({ error: 'Error creating execution result' });
  }
};

module.exports = { createExecutionResult };
