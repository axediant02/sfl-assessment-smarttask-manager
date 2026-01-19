import TaskCard from './TaskCard';

export default function TaskList({ tasks, onUpdate, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
        <p className="text-gray-500">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
