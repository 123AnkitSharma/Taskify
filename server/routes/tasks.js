const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = { userId: req.user._id };

    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    let tasks = await Task.find(query).sort({ createdAt: -1 });

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      tasks = tasks.filter(task => 
        searchRegex.test(task.title)
      );
    }

    res.json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks'
    });
  }
});

router.post('/', [
  authenticate,
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Task title is required'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user._id
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task'
    });
  }
});

router.put('/:id', [
  authenticate,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Task title cannot be empty'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, priority, dueDate, completed } = req.body;

    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task'
    });
  }
});

router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    task.completed = !task.completed;
    await task.save();

    res.json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`,
      task
    });
  } catch (error) {
    console.error('Toggle task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling task'
    });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task'
    });
  }
});

module.exports = router;