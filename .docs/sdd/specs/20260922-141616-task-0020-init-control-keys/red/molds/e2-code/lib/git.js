const { execSync } = require('node:child_process');

function gitBranch(dir) {
  try {
    return execSync('git branch --show-current', { cwd: dir, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

module.exports = { gitBranch };
