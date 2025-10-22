import React from 'react';
import { formatDate, isOverdue } from '../utils/dateUtils';
import { getPriorityColors, getTaskStatusStyles } from '../utils/taskUtils';

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !task.completed;
  };

  const priorityColors = getPriorityColors(task.priority);
  const statusStyles = getTaskStatusStyles(task.completed, task.dueDate);

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 p-6 transition-all duration-200 hover:shadow-md ${statusStyles.container}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onToggle(task._id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-primary-500'
              }`}
            >
              {task.completed && '✓'}
            </button>
            
            <h3 className={`text-lg font-medium ${statusStyles.title}`}>
              {task.title}
            </h3>
            
            <span className={`px-2 py-1 text-xs rounded-full ${priorityColors.bg} ${priorityColors.text}`}>
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className={`text-sm mb-3 ${statusStyles.description}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Created: {formatDate(task.createdAt)}</span>
            {task.dueDate && (
              <span className={isOverdue(task.dueDate) ? 'text-red-500 font-medium' : ''}>
                Due: {formatDate(task.dueDate)}
                {isOverdue(task.dueDate) && ' (Overdue)'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Edit task"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;