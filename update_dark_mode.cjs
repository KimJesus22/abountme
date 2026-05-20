const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/components', function(filePath) {
  if (filePath.endsWith('.astro')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace backgrounds
    content = content.replace(/bg-white\b/g, 'bg-surface');
    content = content.replace(/bg-slate-\d+\b/g, 'bg-surface-variant');
    content = content.replace(/bg-surface-alt\b/g, 'bg-background');
    content = content.replace(/bg-primary-50\/30\b/g, 'bg-primary/5');
    content = content.replace(/bg-primary-50\b/g, 'bg-primary/10');
    content = content.replace(/bg-accent\/5\b/g, 'bg-error/5');
    
    // Replace text colors
    content = content.replace(/text-slate-\d+\b/g, 'text-text-muted');
    
    // Replace borders
    content = content.replace(/border-slate-\d+\b/g, 'border-white/10');
    content = content.replace(/border-accent\/20\b/g, 'border-error/20');

    // Replace specific quote form inputs
    content = content.replace(/w-full px-4 py-3 rounded-xl border border-white\/10 bg-surface text-text-heading placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary\/30 focus:border-primary transition-all/g, 'input-base');
    
    // Replace bg-white/80, bg-white/60 with bg-surface/80
    content = content.replace(/bg-surface\/60\b/g, 'bg-surface/60');
    content = content.replace(/bg-surface\/80\b/g, 'bg-surface/80');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated:', filePath);
    }
  }
});
