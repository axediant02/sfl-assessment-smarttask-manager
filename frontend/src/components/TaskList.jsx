import TaskCard from './TaskCard';

export default function TaskList({ tasks, onUpdate, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 glass-card-strong rounded-2xl">
        <div className="inline-block mb-6">
          <div className="text-8xl mb-4 animate-bounce">📝</div>
          <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto"></div>
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">No tasks found</h3>
        <p className="text-gray-500 text-lg">Create your first task to get started! 🚀</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <div key={task.id} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in">
          <TaskCard
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </div>
      ))}
    </div>
  );
}
