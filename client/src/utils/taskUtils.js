export const getPriorityColors = (priority) => {
  const colorMap = {
    High: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      hover: 'hover:bg-red-200'
    },
    Medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-200'
    },
    Low: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      hover: 'hover:bg-green-200'
    }
  };
  
  return colorMap[priority] || colorMap.Medium;
};

export const getTaskStatusStyles = (completed, dueDate) => {
  if (completed) {
    return {
      container: 'bg-gray-50 border-green-400',
      title: 'line-through text-gray-500',
      description: 'text-gray-400'
    };
  }
  
  if (dueDate && new Date(dueDate) < new Date()) {
    return {
      container: 'bg-white border-red-400',
      title: 'text-gray-900',
      description: 'text-gray-600'
    };
  }
  
  return {
    container: 'bg-white border-primary-400',
    title: 'text-gray-900',
    description: 'text-gray-600'
  };
};

export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];
  
  if (filters.status === 'completed') {
    filtered = filtered.filter(task => task.completed);
  } else if (filters.status === 'active') {
    filtered = filtered.filter(task => !task.completed);
  }
  
  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

export const sortTasks = (tasks, sortBy = 'created', sortOrder = 'desc') => {
  const sorted = [...tasks];
  
  sorted.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        aValue = priorityOrder[a.priority] || 0;
        bValue = priorityOrder[b.priority] || 0;
        break;
        
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        break;
        
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
        
      case 'created':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
    }
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  ).length;
  
  const priorityStats = {
    high: tasks.filter(task => task.priority === 'High').length,
    medium: tasks.filter(task => task.priority === 'Medium').length,
    low: tasks.filter(task => task.priority === 'Low').length
  };
  
  return {
    total,
    completed,
    active,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    priorityStats
  };
};