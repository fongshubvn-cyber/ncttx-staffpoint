const { execSync } = require('child_process');

try {
  execSync('git add src/components/option1/Option1ShiftConfigView.tsx', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  execSync('git commit -m "feat: Add dedicated cache refresh button to ShiftConfigView"', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  execSync('git push origin main', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('PUSHED TO MAIN SUCCESSFULLY!');
  execSync('npm.cmd run deploy', { cwd: 'G:\\Jobs\\ncttx-staffpoint', stdio: 'inherit' });
  console.log('DEPLOY TO GH-PAGES COMPLETE!');
} catch (e) {
  console.error(e);
}
