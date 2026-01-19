const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async getTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    const data = await response.json();
    // #region agent log
    if (import.meta.env.DEV) {
      fetch('http://127.0.0.1:7242/ingest/a78c118c-fa70-4c1c-9718-152bf27e85b7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:getTasks',message:'API response received',data:{taskCount:data.length,firstTaskHasDeadline:data[0]?.deadline?true:false,firstTaskDeadlineValue:data[0]?.deadline,firstTaskKeys:data[0]?Object.keys(data[0]):[],sampleTask:data[0]?{id:data[0].id,title:data[0].title,hasDeadline:'deadline' in (data[0]||{}),deadlineValue:data[0].deadline}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion
    return data;
  },

  async createTask(task) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  async updateTask(id, task) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  async deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
    return response.json();
  },
};
