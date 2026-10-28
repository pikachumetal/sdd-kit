import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { win32 } from 'node:path';

function runCygpath(file, args) {
  return execFileSync(file, args, { encoding: 'utf8', timeout: 2000, windowsHide: true });
}

// git.exe vive en <Git>\cmd o <Git>\bin, y en <Git>\mingw64\bin
function gitCygpath(pathEnv, exists) {
  for (const dir of pathEnv.split(';').filter(Boolean)) {
    if (!exists(win32.join(dir, 'git.exe'))) continue;
    const candidates = [win32.join(dir, '..', 'usr', 'bin', 'cygpath.exe'), win32.join(dir, '..', '..', 'usr', 'bin', 'cygpath.exe')];
    const found = candidates.find(exists);
    if (found) return found;
  }
  return '';
}

export function gitBashTmpPath({ platform = process.platform, pathEnv = process.env.PATH ?? '', exists = existsSync, run = runCygpath } = {}) {
  if (platform !== 'win32') return '';
  const cygpath = gitCygpath(pathEnv, exists);
  return cygpath ? run(cygpath, ['-w', '/tmp']).trim() : '';
}

// Git Bash monta /tmp sobre el TEMP del primer proceso MSYS y lo mantiene aunque esa carpeta se borre
const realFileSystem = {
  existsSync,
  mkdirSync: (path) => {
    mkdirSync(path, { recursive: true });
  },
};

export function repairGitBashTmp(tmpPath, fileSystem = realFileSystem) {
  if (!tmpPath || fileSystem.existsSync(tmpPath)) return '';
  fileSystem.mkdirSync(tmpPath);
  return `sdd-kit: Git Bash tenía /tmp montado sobre una carpeta borrada; la he creado vacía: ${tmpPath}`;
}

export function withSystemMessage(output, notice) {
  if (!notice) return output;
  const json = output ? JSON.parse(output) : {};
  json.systemMessage = [notice, json.systemMessage].filter(Boolean).join('\n\n');
  return `${JSON.stringify(json, null, 2)}\n`;
}
