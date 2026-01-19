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
    <div className="min-h-screen py-8 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Smart Task Manager
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto md:mx-0"></div>
          </div>
          <p className="text-lg text-gray-600 font-medium mt-4">Organize your tasks with intelligent auto-categorization</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="stat-card glass-card-strong text-gray-800" style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📊</span>
              <div className="text-3xl font-extrabold bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {stats.total}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Tasks</div>
          </div>
          <div className="stat-card glass-card-strong text-yellow-600" style={{ background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(255, 237, 213, 0.95) 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📋</span>
              <div className="text-3xl font-extrabold bg-gradient-to-br from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {stats.todo}
              </div>
            </div>
            <div className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">To Do</div>
          </div>
          <div className="stat-card glass-card-strong text-blue-600" style={{ background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.95) 0%, rgba(191, 219, 254, 0.95) 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">⚡</span>
              <div className="text-3xl font-extrabold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {stats.inProgress}
              </div>
            </div>
            <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide">In Progress</div>
          </div>
          <div className="stat-card glass-card-strong text-green-600" style={{ background: 'linear-gradient(135deg, rgba(209, 250, 229, 0.95) 0%, rgba(167, 243, 208, 0.95) 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">✅</span>
              <div className="text-3xl font-extrabold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats.done}
              </div>
            </div>
            <div className="text-sm font-semibold text-green-700 uppercase tracking-wide">Done</div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-purple-500/30"
          >
            <span className="text-xl">✨</span>
            <span>Create New Task</span>
          </button>
          {error && (
            <div className="glass-card-strong bg-red-50/90 border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm fade-in flex items-center gap-3 shadow-lg">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-700 hover:text-red-900 font-bold text-lg hover:scale-125 transition-transform"
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
          <div className="text-center py-20">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium text-lg">Loading your tasks...</p>
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
