export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export const getUserPreferences = () => {
  return getStorageItem('userPreferences', {
    theme: 'light',
    tasksPerPage: 10,
    defaultPriority: 'Medium',
    defaultSort: 'created',
    defaultSortOrder: 'desc'
  });
};

export const saveUserPreferences = (preferences) => {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = { ...currentPreferences, ...preferences };
  return setStorageItem('userPreferences', updatedPreferences);
};

export const getSavedFilters = () => {
  return getStorageItem('taskFilters', {
    status: 'all',
    priority: 'all',
    search: ''
  });
};

export const saveFilters = (filters) => {
  return setStorageItem('taskFilters', filters);
};