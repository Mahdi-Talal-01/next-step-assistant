// This is a simple diagnostic script to test ESM compatibility
console.log('Testing ES Modules compatibility');

// Test import.meta (ES module feature)
console.log('import.meta available:', import.meta !== undefined);

// Try to use async/await at the top level (ES module feature)
(async () => {
  console.log('Async/await works');
  
  // Try dynamic import (ES module feature)
  try {
    const fs = await import('fs');
    console.log('Dynamic import works');
  } catch (error) {
    console.error('Dynamic import failed:', error.message);
  }
})();

// Exit with success
console.log('Diagnostic complete'); 