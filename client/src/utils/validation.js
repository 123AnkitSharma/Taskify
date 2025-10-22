export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTaskForm = (taskData) => {
  const errors = {};
  
  if (!taskData.title || taskData.title.trim().length === 0) {
    errors.title = 'Task title is required';
  } else if (taskData.title.trim().length > 100) {
    errors.title = 'Task title cannot exceed 100 characters';
  }
  
  if (taskData.description && taskData.description.trim().length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }
  
  if (taskData.priority && !['Low', 'Medium', 'High'].includes(taskData.priority)) {
    errors.priority = 'Priority must be Low, Medium, or High';
  }
  
  if (taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid due date format';
    } else if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUserRegistration = (userData) => {
  const errors = {};
  
  if (!userData.name || userData.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (userData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  } else if (userData.name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters';
  }
  
  if (!userData.email || userData.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!userData.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }
  
  if (userData.confirmPassword !== userData.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
};