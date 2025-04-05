
/**
 * Script to run both frontend and backend tests
 */
const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running all tests...\n');

try {
  // Run backend tests
  console.log('📋 Running backend tests:');
  execSync('cd backend && npm test', { stdio: 'inherit' });
  
  console.log('\n🎯 Backend tests completed successfully!\n');
  
  // Run frontend tests
  console.log('📋 Running frontend tests:');
  execSync('jest', { stdio: 'inherit' });
  
  console.log('\n🎯 Frontend tests completed successfully!');
  console.log('\n✅ All tests passed!');
  
} catch (error) {
  console.error('\n❌ Tests failed:', error.message);
  process.exit(1);
}
