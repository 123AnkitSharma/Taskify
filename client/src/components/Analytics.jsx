import React from 'react';

const Analytics = ({ tasks }) => {
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = tasks.filter(task => !task.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Task Summary</h2>
      
      {/* Simple Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-600">Done</div>
        </div>
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">{activeTasks}</div>
          <div className="text-sm text-gray-600">Todo</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </div>
      </div>

      {/* Simple Message */}
      {tasks.length > 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            You have <strong>{activeTasks}</strong> tasks to complete
            {completionRate > 0 && <span> • <strong>{completionRate}%</strong> done so far</span>}
          </p>
        </div>
      ) : (
        <div className="text-center p-8">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-gray-500">No tasks yet. Create your first task!</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;