const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get tasks (optionally by project)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.query;
    const filter = projectId ? { projectId } : {};
    
    const tasks = await prisma.task.findMany({
      where: filter,
      include: {
        assignee: { select: { name: true } },
        project: { select: { name: true } }
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task (ADMIN, MANAGER)
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, priority } = req.body;
    if (!title || !projectId) return res.status(400).json({ error: 'Title and projectId are required' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        priority: priority || 'MEDIUM'
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, title, description, assigneeId } = req.body;
    
    // Check if the task exists
    const existingTask = await prisma.task.findUnique({ where: { id: req.params.id } });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });

    // Members can only update status
    if (req.user.role === 'MEMBER' && (title || description || assigneeId)) {
       return res.status(403).json({ error: 'Members can only update task status' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
        ...(assigneeId && { assigneeId })
      }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
