import { useState } from 'react';

const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel', 'Finance', 'Other'];

export default function TaskForm({ onClose, onSubmit, initialTask = null }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  const [category, setCategory] = useState(initialTask?.category || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category || undefined, // Send undefined if empty to let backend auto-categorize
      });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('');
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
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm font-medium"
                placeholder="Enter task title..."
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all bg-white/80 backdrop-blur-sm"
                rows="4"
                placeholder="Enter task description..."
              />
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
                disabled={isSubmitting || !title.trim()}
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
