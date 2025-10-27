import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import TaskFilters from '../components/TaskFilters.jsx';
import Analytics from '../components/Analytics.jsx';
import { tasksAPI } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response.data.tasks);
      setError('');
    } catch (error) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...tasks];

    if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filters.status === 'active') {
      filtered = filtered.filter(task => !task.completed);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      setTasks([response.data.task, ...tasks]);
      setShowTaskForm(false);
    } catch (error) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await tasksAPI.updateTask(taskId, taskData);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data.task : task
      ));
      setEditingTask(null);
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const response = await tasksAPI.toggleTask(taskId);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data.task : task
      ));
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Total Tasks: {tasks.length}</span>
              <span>Active: {activeCount}</span>
              <span>Completed: {completedCount}</span>
            </div>
          </div>
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
              showAnalytics 
                ? 'bg-primary-600 text-white hover:bg-primary-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showAnalytics ? '📋 Show Tasks' : '📊 Show Analytics'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Analytics View */}
      {showAnalytics ? (
        <Analytics tasks={tasks} />
      ) : (
        /* Tasks View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                + Add New Task
              </button>
            </div>

            <TaskFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <TaskList
                tasks={filteredTasks}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            )}
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? 
            (data) => handleUpdateTask(editingTask._id, data) : 
            handleCreateTask
          }
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;