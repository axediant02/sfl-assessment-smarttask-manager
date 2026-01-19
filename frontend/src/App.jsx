import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import { api } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    category: 'All',
  });

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks when filters or tasks change
  useEffect(() => {
    const filtered = tasks.filter(task => {
      const statusMatch = filters.status === 'All' || task.status === filters.status;
      const priorityMatch = filters.priority === 'All' || task.priority === filters.priority;
      const categoryMatch = filters.category === 'All' || task.category === filters.category;
      return statusMatch && priorityMatch && categoryMatch;
    });
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please check if the backend is running.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await api.updateTask(id, taskData);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedTask = await api.updateTask(id, { status: newStatus });
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      setError('Failed to update task status');
      console.error('Error updating status:', err);
    }
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'Todo').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart Task Manager</h1>
          <p className="text-gray-600">Organize your tasks with intelligent auto-categorization</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <div className="text-2xl font-bold text-yellow-600">{stats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
            <div className="text-2xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-gray-600">Done</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>+</span>
            <span>Create Task</span>
          </button>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm fade-in flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-700 hover:text-red-900 font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Task List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="fade-in">
            <TaskList
              tasks={filteredTasks}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm
            onClose={() => setShowForm(false)}
            onSubmit={handleCreateTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
