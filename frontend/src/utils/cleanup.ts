// localStorage cleanup utility
export const cleanupLocalStorage = () => {
  try {
    // List of keys that might contain invalid data
    const keysToCheck = ['user', 'token'];
    
    keysToCheck.forEach(key => {
      const value = localStorage.getItem(key);
      if (value === 'undefined' || value === 'null' || value === '') {
        console.log(`Removing invalid localStorage key: ${key} with value: ${value}`);
        localStorage.removeItem(key);
      }
    });
    
    console.log('localStorage cleanup completed');
  } catch (error) {
    console.error('Error during localStorage cleanup:', error);
  }
};

// Auto-cleanup on import
if (typeof window !== 'undefined') {
  cleanupLocalStorage();
}

export default cleanupLocalStorage;