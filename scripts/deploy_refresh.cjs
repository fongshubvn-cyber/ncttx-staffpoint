const { execSync } = require('child_process');

try {
  console.log('Running git add...');
  execSync('git add -A', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('Running git commit...');
  execSync('git commit -m "feat: Add 1-touch Cache Refresh and update button for PWA v1.020"', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('Pushing to main...');
  execSync('git push origin main', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('Deploying to gh-pages...');
  execSync('npm run deploy', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('DEPLOY SUCCESSFUL!');
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
