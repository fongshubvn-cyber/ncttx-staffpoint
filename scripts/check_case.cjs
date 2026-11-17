const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('G:\\Jobs\\ncttx-staffpoint\\src');
let errors = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importRegex = /(?:import|export)\s+(?:.*?from\s+)?['"](\.[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const dir = path.dirname(file);
    const resolvedBase = path.resolve(dir, importPath);
    
    const possible = [
      resolvedBase,
      resolvedBase + '.ts',
      resolvedBase + '.tsx',
      resolvedBase + '.d.ts',
      resolvedBase + '.css',
      resolvedBase + '.png',
      path.join(resolvedBase, 'index.ts'),
      path.join(resolvedBase, 'index.tsx')
    ];
    
    let found = false;
    for (const p of possible) {
      if (fs.existsSync(p)) {
        const pDir = path.dirname(p);
        const pBase = path.basename(p);
        const actualFiles = fs.readdirSync(pDir);
        if (actualFiles.includes(pBase)) {
          found = true;
          break;
        } else {
          const matchCase = actualFiles.find(f => f.toLowerCase() === pBase.toLowerCase());
          errors.push(`Case mismatch in ${file}: imported "${importPath}", actual is "${matchCase}"`);
          found = true;
          break;
        }
      }
    }
    if (!found) {
      errors.push(`File not found in ${file}: "${importPath}"`);
    }
  }
});

console.log('Case / Import Errors (' + errors.length + '):');
errors.forEach(e => console.log(' - ' + e));
