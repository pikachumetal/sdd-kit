const log = [];

export function audit(command) {
  log.push({ command, at: new Date().toISOString() });
}

export function auditLog() {
  return [...log];
}
