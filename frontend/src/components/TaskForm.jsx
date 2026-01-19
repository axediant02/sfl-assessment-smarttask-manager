import { useState } from 'react';

const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel', 'Finance', 'Other'];
const validPriorities = ['High', 'Medium', 'Low'];

// Helper to convert ISO string to datetime-local format
const isoToDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  // Format: YYYY-MM-DDTHH:mm
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function TaskForm({ onClose, onSubmit, initialTask = null }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  const [category, setCategory] = useState(initialTask?.category || '');
  const [deadline, setDeadline] = useState(initialTask?.deadline ? isoToDateTimeLocal(initialTask.deadline) : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    // Title validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }
    
    // Description validation
    if (description && description.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }
    
    // Priority validation
    if (!validPriorities.includes(priority)) {
      newErrors.priority = 'Invalid priority selected';
    }
    
    // Category validation (if provided)
    if (category && !categories.includes(category)) {
      newErrors.category = 'Invalid category selected';
    }
    
    // Deadline validation
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        newErrors.deadline = 'Invalid deadline format';
      } else if (deadlineDate <= new Date()) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Convert datetime-local to ISO string
      const deadlineISO = deadline ? new Date(deadline).toISOString() : undefined;
      
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category || undefined, // Send undefined if empty to let backend auto-categorize
        deadline: deadlineISO,
      });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('');
      setDeadline('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in" onClick={onClose}>
      <div className="glass-card-strong rounded-2xl shadow-2xl max-w-md w-full p-8 slide-in relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-2xl">
              ✨
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm font-medium ${
                  errors.title ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Enter task title..."
                maxLength={200}
                autoFocus
              />
              {errors.title && (
                <p className="text-red-600 text-xs mt-1">{errors.title}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">{title.length}/200 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all bg-white/80 backdrop-blur-sm ${
                  errors.description ? 'border-red-300' : 'border-gray-200'
                }`}
                rows="4"
                placeholder="Enter task description..."
                maxLength={1000}
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1">{errors.description}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">{description.length}/1000 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="High">🔴 High</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm font-medium"
              >
                <option value="">🤖 Auto (Smart Detection)</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Leave as "Auto" to let the system categorize based on keywords</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors({ ...errors, deadline: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm font-medium ${
                  errors.deadline ? 'border-red-300' : 'border-gray-200'
                }`}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.deadline && (
                <p className="text-red-600 text-xs mt-1">{errors.deadline}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Set a deadline to track when this task should be completed</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting || !title.trim() || Object.keys(errors).length > 0}
              >
                {isSubmitting ? '⏳ Creating...' : initialTask ? '💾 Update' : '✨ Create Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
