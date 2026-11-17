const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// 1. Read package.json to get current version
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version; // e.g. "1.020"

// 2. Compute new version: "1.020" -> "1.021"
const parts = currentVersion.split('.');
const lastPart = parts[parts.length - 1]; // "020"
const nextNum = parseInt(lastPart, 10) + 1;
const padLen = Math.max(lastPart.length, 3);
const nextPart = nextNum.toString().padStart(padLen, '0');
const newVersion = [...parts.slice(0, parts.length - 1), nextPart].join('.'); // "1.021"
const oldTag = `v${currentVersion}`;
const newTag = `v${newVersion}`;

const logMsg = process.argv[2] || `Release ${newTag}: Auto-deploy update`;

console.log('====================================================');
console.log(`🚀 AUTO-DEPLOYING: ${oldTag} ➔ ${newTag}`);
console.log(`📝 Note: ${logMsg}`);
console.log('====================================================');

// 3. Update package.json
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log(`✓ Updated package.json to ${newVersion}`);

// 4. Update package-lock.json
const lockPath = path.join(rootDir, 'package-lock.json');
if (fs.existsSync(lockPath)) {
  const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  lock.version = newVersion;
  if (lock.packages && lock.packages['']) {
    lock.packages[''].version = newVersion;
  }
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
  console.log(`✓ Updated package-lock.json to ${newVersion}`);
}

// 5. Update public/sw.js
const swPath = path.join(rootDir, 'public', 'sw.js');
if (fs.existsSync(swPath)) {
  let sw = fs.readFileSync(swPath, 'utf8');
  sw = sw.replace(/staffpoint-v\d+\.\d+/g, `staffpoint-${newTag}`);
  fs.writeFileSync(swPath, sw, 'utf8');
  console.log(`✓ Updated public/sw.js cache name to staffpoint-${newTag}`);
}

// 6. Update Option1Layout.tsx
const layoutPath = path.join(rootDir, 'src', 'components', 'option1', 'Option1Layout.tsx');
if (fs.existsSync(layoutPath)) {
  let layout = fs.readFileSync(layoutPath, 'utf8');
  layout = layout.split(oldTag).join(newTag);
  fs.writeFileSync(layoutPath, layout, 'utf8');
  console.log(`✓ Updated Option1Layout.tsx to ${newTag}`);
}

// 7. Update Option1ShiftConfigView.tsx
const shiftConfigPath = path.join(rootDir, 'src', 'components', 'option1', 'Option1ShiftConfigView.tsx');
if (fs.existsSync(shiftConfigPath)) {
  let shiftConfig = fs.readFileSync(shiftConfigPath, 'utf8');
  shiftConfig = shiftConfig.split(oldTag).join(newTag);
  fs.writeFileSync(shiftConfigPath, shiftConfig, 'utf8');
  console.log(`✓ Updated Option1ShiftConfigView.tsx to ${newTag}`);
}

// 8. Update Navbar.tsx
const navPath = path.join(rootDir, 'src', 'components', 'Navbar.tsx');
if (fs.existsSync(navPath)) {
  let nav = fs.readFileSync(navPath, 'utf8');
  nav = nav.split(oldTag).join(newTag);
  fs.writeFileSync(navPath, nav, 'utf8');
  console.log(`✓ Updated Navbar.tsx to ${newTag}`);
}

// 9. Update deploy.bat header
const batPath = path.join(rootDir, 'deploy.bat');
if (fs.existsSync(batPath)) {
  let bat = fs.readFileSync(batPath, 'utf8');
  bat = bat.split(oldTag).join(newTag);
  fs.writeFileSync(batPath, bat, 'utf8');
  console.log(`✓ Updated deploy.bat to ${newTag}`);
}

// 10. Update DEPLOY_LOG.md if not already present
const logPath = path.join(rootDir, 'DEPLOY_LOG.md');
if (fs.existsSync(logPath)) {
  let logContent = fs.readFileSync(logPath, 'utf8');
  if (!logContent.includes(`## 🚀 [${newTag}]`)) {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newEntry = `## 🚀 [${newTag}] - ${dateStr}\n* **Mô tả:** ${logMsg}\n* **Hạ tầng triển khai:** Tự động đồng bộ trên Vercel (Production) và GitHub Pages.\n\n---\n\n`;
    logContent = logContent.replace('# 📋 Nhật Ký Triển Khai (Deploy Log) - NCTTX Staffpoint\n\n', `# 📋 Nhật Ký Triển Khai (Deploy Log) - NCTTX Staffpoint\n\n${newEntry}`);
    fs.writeFileSync(logPath, logContent, 'utf8');
    console.log(`✓ Added ${newTag} to DEPLOY_LOG.md`);
  }
}

// 10.5. Sync Google Sheet shifts data
console.log('\n🔄 [0/4] Syncing latest Google Sheet shift data...');
try {
  execSync('node scripts/generate_initial_shifts.cjs', { cwd: rootDir, stdio: 'inherit' });
} catch (e) {
  console.warn('Warning: Google Sheet sync encountered an issue, proceeding with existing shifts...', e);
}

// 11. Run Type Check & Build
console.log('\n🔍 [1/4] Running TypeScript compiler check...');
execSync('npx.cmd tsc --noEmit', { cwd: rootDir, stdio: 'inherit' });

console.log('\n📦 [2/4] Building production bundle with Vite...');
execSync('npm.cmd run build', { cwd: rootDir, stdio: 'inherit' });

// 12. Push source to GitHub main (Vercel triggers automatic deployment)
console.log('\n📤 [3/4] Committing & pushing to GitHub main (triggers Vercel deployment)...');
execSync('git add -A', { cwd: rootDir, stdio: 'inherit' });
execSync(`git commit -m "release: bump to ${newTag} - ${logMsg}"`, { cwd: rootDir, stdio: 'inherit' });
execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });

// 13. Deploy to GitHub Pages (Backup)
console.log('\n🌐 [4/4] Uploading to GitHub Pages (gh-pages)...');
execSync('call npm.cmd run deploy', { cwd: rootDir, stdio: 'inherit' });

console.log('\n====================================================');
console.log(`✅ DEPLOY ${newTag} THÀNH CÔNG RỰC RỠ!`);
console.log('🔗 Vercel: https://ncttx-staffpoint.vercel.app/');
console.log('🔗 GitHub Pages: https://fongshubvn-cyber.github.io/ncttx-staffpoint/');
console.log('====================================================\n');
