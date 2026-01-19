import { useState } from 'react';
import { formatDateTime, formatDate, isOverdue, isApproaching, getDaysUntilDeadline } from '../utils/dateFormatter';

const categoryColors = {
  Work: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/30',
  Personal: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-purple-500/30',
  Shopping: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/30',
  Health: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30',
  Learning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-500/30',
  Travel: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-500/30',
  Finance: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30',
  Other: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-gray-500/30',
};

const priorityColors = {
  High: 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50',
  Medium: 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50',
  Low: 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50',
};

const statusColors = {
  Todo: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg',
  'In Progress': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/50',
  Done: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50',
};

const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel', 'Finance', 'Other'];
const validPriorities = ['High', 'Medium', 'Low'];

// Helper to convert ISO string to datetime-local format
const isoToDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function TaskCard({ task, onUpdate, onDelete, onStatusChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDeadline, setEditDeadline] = useState(task.deadline ? isoToDateTimeLocal(task.deadline) : '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }
    
    if (editDescription && editDescription.length > 1000) {
      newErrors.description = 'Description must be 1000 characters or less';
    }
    
    if (!validPriorities.includes(editPriority)) {
      newErrors.priority = 'Invalid priority';
    }
    
    if (editCategory && !categories.includes(editCategory)) {
      newErrors.category = 'Invalid category';
    }
    
    // Deadline validation
    if (editDeadline) {
      const deadlineDate = new Date(editDeadline);
      if (isNaN(deadlineDate.getTime())) {
        newErrors.deadline = 'Invalid deadline format';
      } else if (deadlineDate <= new Date() && task.status !== 'Done') {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    
    try {
      const deadlineISO = editDeadline ? new Date(editDeadline).toISOString() : undefined;
      await onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        category: editCategory || undefined,
        deadline: deadlineISO,
      });
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDeadline(task.deadline ? isoToDateTimeLocal(task.deadline) : '');
    setIsEditing(false);
  };

  const handleStatusToggle = () => {
    const statusOrder = ['Todo', 'In Progress', 'Done'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange(task.id, statusOrder[nextIndex]);
  };

  return (
    <div className="task-card-gradient glass-card-strong rounded-2xl shadow-xl p-6 card-hover border border-white/50 fade-in relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative z-10">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm ${
                errors.title ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Task title"
              maxLength={200}
            />
            {errors.title && (
              <p className="text-red-600 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <textarea
              value={editDescription}
              onChange={(e) => {
                setEditDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all bg-white/80 backdrop-blur-sm ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
              rows="3"
              placeholder="Description"
              maxLength={1000}
            />
            {errors.description && (
              <p className="text-red-600 text-xs mt-1">{errors.description}</p>
            )}
          </div>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm"
          >
            <option value="">🤖 Auto</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div>
            <input
              type="datetime-local"
              value={editDeadline}
              onChange={(e) => {
                setEditDeadline(e.target.value);
                if (errors.deadline) setErrors({ ...errors, deadline: '' });
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 backdrop-blur-sm ${
                errors.deadline ? 'border-red-300' : 'border-gray-200'
              }`}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.deadline && (
              <p className="text-red-600 text-xs mt-1">{errors.deadline}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Leave empty for no deadline</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleSave} 
              className="btn-primary flex-1"
              disabled={Object.keys(errors).length > 0}
            >
              💾 Save
            </button>
            <button onClick={handleCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{task.title}</h3>
              {task.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-3">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-4 h-4 rounded-full ${priorityColors[task.priority]} shadow-lg`} title={task.priority}></div>
            </div>
          </div>

          {/* Timestamps and Deadline Indicators */}
          <div className="mb-4 space-y-2">
            {/* Deadline with indicators */}
            {task.deadline && (() => {
              // #region agent log
              if (import.meta.env.DEV) {
                fetch('http://127.0.0.1:7242/ingest/a78c118c-fa70-4c1c-9718-152bf27e85b7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TaskCard.jsx:deadline-render',message:'Rendering deadline UI',data:{taskId:task.id,taskTitle:task.title,deadlineValue:task.deadline,formattedResult:formatDateTime(task.deadline)},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'C'})}).catch(()=>{});
              }
              // #endregion
              return (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-600">⏰ Deadline:</span>
                  <span className="text-xs font-medium text-gray-700">{formatDateTime(task.deadline)}</span>
                  {isOverdue(task.deadline, task.status) && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md">
                      ⚠️ Overdue
                    </span>
                  )}
                  {!isOverdue(task.deadline, task.status) && isApproaching(task.deadline, task.status) && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md">
                      ⏰ Due soon
                    </span>
                  )}
                </div>
              );
            })()}
            
            {/* Created date */}
            {task.createdAt && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">📅 Created:</span>
                <span className="text-xs text-gray-700">{formatDate(task.createdAt, false)}</span>
              </div>
            )}
            
            {/* Finished date */}
            {task.finishedAt && task.status === 'Done' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">✅ Finished:</span>
                <span className="text-xs text-gray-700">{formatDateTime(task.finishedAt)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${categoryColors[task.category] || categoryColors.Other}`}>
                {task.category}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStatusToggle}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${statusColors[task.status]}`}
                title="Toggle status"
              >
                {task.status === 'Todo' ? '▶ Start' : task.status === 'In Progress' ? '✓ Complete' : '↻ Reset'}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                title="Edit task"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
