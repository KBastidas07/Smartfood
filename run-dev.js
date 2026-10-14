/**
 * SmartFoodPop - Orchestrator Script
 * Runs both Backend (Express) and Frontend (Vite React) simultaneously.
 */

const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// ANSI Color Codes for terminal readability
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  green: '\x1b[32m'
};

console.log(`${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.cyan}  🚀 SmartFoodPop - Starting Full-Stack Application  ${colors.reset}`);
console.log(`${colors.cyan}====================================================${colors.reset}\n`);

function logPrefix(prefix, color, data) {
  const lines = data.toString().split('\n');
  lines.forEach((line) => {
    if (line.trim().length > 0) {
      console.log(`${color}[${prefix}]${colors.reset} ${line}`);
    }
  });
}

// 1. Start Backend Server
const backendProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'backend'),
  shell: true
});

backendProc.stdout.on('data', (data) => logPrefix('BACKEND ', colors.magenta, data));
backendProc.stderr.on('data', (data) => logPrefix('BACKEND ', colors.red, data));

// 2. Start Frontend Server
const frontendProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(rootDir, 'frontend'),
  shell: true
});

frontendProc.stdout.on('data', (data) => logPrefix('FRONTEND', colors.cyan, data));
frontendProc.stderr.on('data', (data) => logPrefix('FRONTEND', colors.red, data));

// Graceful Termination
function cleanup() {
  console.log(`\n${colors.yellow}Shutting down Backend and Frontend processes...${colors.reset}`);
  if (isWin) {
    if (backendProc.pid) spawn('taskkill', ['/pid', backendProc.pid, '/f', '/t']);
    if (frontendProc.pid) spawn('taskkill', ['/pid', frontendProc.pid, '/f', '/t']);
  } else {
    backendProc.kill('SIGTERM');
    frontendProc.kill('SIGTERM');
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
