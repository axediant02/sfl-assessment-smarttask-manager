import { useState } from 'react';

const categoryColors = {
  Work: 'bg-blue-100 text-blue-800 border-blue-200',
  Personal: 'bg-purple-100 text-purple-800 border-purple-200',
  Shopping: 'bg-green-100 text-green-800 border-green-200',
  Health: 'bg-red-100 text-red-800 border-red-200',
  Learning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Travel: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Finance: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors = {
  High: 'bg-red-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500',
};

const statusColors = {
  Todo: 'bg-gray-200 text-gray-700',
  'In Progress': 'bg-blue-200 text-blue-700',
  Done: 'bg-green-200 text-green-700',
};

export default function TaskCard({ task, onUpdate, onDelete, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleSave = async () => {
    try {
      await onUpdate(task.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleStatusToggle = () => {
    const statusOrder = ['Todo', 'In Progress', 'Done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange(task.id, statusOrder[nextIndex]);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 card-hover border border-gray-100 fade-in">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows="3"
            placeholder="Description"
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1">
              Save
            </button>
            <button onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]}`} title={task.priority} />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 rounded-md text-xs font-medium border ${categoryColors[task.category] || categoryColors.Other}`}>
                {task.category}
              </span>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStatusToggle}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 ${statusColors[task.status]}`}
                title="Toggle status"
              >
                {task.status === 'Todo' ? '▶ Start' : task.status === 'In Progress' ? '✓ Complete' : '↻ Reset'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Edit task"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200 hover:scale-105 active:scale-95"
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
