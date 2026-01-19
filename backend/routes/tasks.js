import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { categorizeTask } from '../utils/categorize.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data/tasks.json');

// Helper function to read tasks from file
async function readTasks() {
  try {
    const data = await readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Helper function to write tasks to file
async function writeTasks(tasks) {
  try {
    await writeFile(dataPath, JSON.stringify(tasks, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing tasks:', error);
    throw error;
  }
}

// Ensure data directory exists
import { mkdir } from 'fs/promises';
const dataDir = join(__dirname, '../data');
try {
  await mkdir(dataDir, { recursive: true });
} catch (error) {
  // Directory might already exist
}

// GET /api/tasks - Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'Medium', status = 'Todo', category, deadline } = req.body;
    
    // Validation
    const trimmedTitle = title?.trim() || '';
    if (!trimmedTitle) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (trimmedTitle.length > 200) {
      return res.status(400).json({ error: 'Title must be 200 characters or less' });
    }
    if (description && description.length > 1000) {
      return res.status(400).json({ error: 'Description must be 1000 characters or less' });
    }
    const validPriorities = ['High', 'Medium', 'Low'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
    }
    const validStatuses = ['Todo', 'In Progress', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be Todo, In Progress, or Done' });
    }
    const validCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel', 'Finance', 'Other'];
    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    // Deadline validation
    let deadlineISO = null;
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ error: 'Invalid deadline format' });
      }
      // Check if deadline is in the future
      if (deadlineDate <= new Date()) {
        return res.status(400).json({ error: 'Deadline must be in the future' });
      }
      deadlineISO = deadlineDate.toISOString();
    }

    const tasks = await readTasks();
    // Use provided category, or auto-categorize if not provided
    const taskCategory = category || categorizeTask(trimmedTitle, description?.trim() || '');
    
    // Set finishedAt if status is Done
    const finishedAt = status === 'Done' ? new Date().toISOString() : null;
    
    const newTask = {
      id: uuidv4(),
      title: trimmedTitle,
      description: description?.trim() || '',
      category: taskCategory,
      priority,
      status,
      deadline: deadlineISO,
      finishedAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeTasks(tasks);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, priority, status, deadline } = req.body;
    
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const existingTask = tasks[taskIndex];
    const previousStatus = existingTask.status;
    
    // Validation and update task fields
    if (title !== undefined) {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (trimmedTitle.length > 200) {
        return res.status(400).json({ error: 'Title must be 200 characters or less' });
      }
      existingTask.title = trimmedTitle;
    }
    if (description !== undefined) {
      if (description.length > 1000) {
        return res.status(400).json({ error: 'Description must be 1000 characters or less' });
      }
      existingTask.description = description.trim() || '';
    }
    if (category !== undefined) {
      const validCategories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel', 'Finance', 'Other'];
      if (category && !validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      // If category is explicitly provided, use it
      existingTask.category = category;
    } else if (title !== undefined || description !== undefined) {
      // Only auto-categorize if category wasn't provided and title/description changed
      existingTask.category = categorizeTask(existingTask.title, existingTask.description);
    }
    if (priority !== undefined) {
      const validPriorities = ['High', 'Medium', 'Low'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
      }
      existingTask.priority = priority;
    }
    
    // Handle deadline
    if (deadline !== undefined) {
      if (deadline === null || deadline === '') {
        existingTask.deadline = null;
      } else {
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
          return res.status(400).json({ error: 'Invalid deadline format' });
        }
        // Only validate future deadline if task is not done
        if (existingTask.status !== 'Done' && deadlineDate <= new Date()) {
          return res.status(400).json({ error: 'Deadline must be in the future' });
        }
        existingTask.deadline = deadlineDate.toISOString();
      }
    }
    
    // Handle status and finishedAt
    if (status !== undefined) {
      const validStatuses = ['Todo', 'In Progress', 'Done'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status must be Todo, In Progress, or Done' });
      }
      existingTask.status = status;
      
      // Auto-set finishedAt when status changes to Done
      if (status === 'Done' && previousStatus !== 'Done') {
        existingTask.finishedAt = new Date().toISOString();
      }
      // Clear finishedAt when status changes from Done to another status
      else if (status !== 'Done' && previousStatus === 'Done') {
        existingTask.finishedAt = null;
      }
    }
    
    existingTask.updatedAt = new Date().toISOString();
    
    await writeTasks(tasks);
    res.json(existingTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (tasks.length === filteredTasks.length) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await writeTasks(filteredTasks);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
