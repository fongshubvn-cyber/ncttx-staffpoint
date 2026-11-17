const { execSync } = require('child_process');

try {
  execSync('git add maintenance/index.html maintenance.bat deploy.bat', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  execSync('git commit -m "feat: Add smart maintenance mode and cache clearer"', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  execSync('git push origin main', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('COMMITTED AND PUSHED SUCCESSFULLY!');
} catch (e) {
  console.error(e);
}
