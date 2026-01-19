export default function FilterBar({ filters, onFilterChange }) {
  const statusOptions = ['All', 'Todo', 'In Progress', 'Done'];
  const priorityOptions = ['All', 'High', 'Medium', 'Low'];
  const categoryOptions = ['All', 'Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Travel', 'Finance', 'Other'];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {priorityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {(filters.status !== 'All' || filters.priority !== 'All' || filters.category !== 'All') && (
        <button
          onClick={() => onFilterChange({ status: 'All', priority: 'All', category: 'All' })}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
