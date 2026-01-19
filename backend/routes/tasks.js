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
    const { title, description, priority = 'Medium', status = 'Todo', category } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const tasks = await readTasks();
    // Use provided category, or auto-categorize if not provided
    const taskCategory = category || categorizeTask(title, description || '');
    
    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim() || '',
      category: taskCategory,
      priority,
      status,
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
    const { title, description, category, priority, status } = req.body;
    
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const existingTask = tasks[taskIndex];
    
    // Update task fields
    if (title !== undefined) existingTask.title = title.trim();
    if (description !== undefined) existingTask.description = description?.trim() || '';
    if (category !== undefined) {
      // If category is explicitly provided, use it
      existingTask.category = category;
    } else if (title !== undefined || description !== undefined) {
      // Only auto-categorize if category wasn't provided and title/description changed
      existingTask.category = categorizeTask(existingTask.title, existingTask.description);
    }
    if (priority !== undefined) existingTask.priority = priority;
    if (status !== undefined) existingTask.status = status;
    
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
