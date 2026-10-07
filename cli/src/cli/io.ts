export interface Io {
  out(line: string): void;
  err(line: string): void;
  json(value: unknown): void;
}

export interface MemoryIo extends Io {
  stdout: string[];
  stderr: string[];
}

function writeUtf8(stream: NodeJS.WriteStream, line: string): void {
  stream.write(Buffer.from(`${line}\n`, 'utf8'));
}

export function processIo(): Io {
  const out = (line: string) => writeUtf8(process.stdout, line);
  return {
    out,
    err: (line) => writeUtf8(process.stderr, line),
    json: (value) => out(JSON.stringify(value, null, 2)),
  };
}

export function memoryIo(): MemoryIo {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    out: (line) => void stdout.push(line),
    err: (line) => void stderr.push(line),
    json: (value) => void stdout.push(JSON.stringify(value, null, 2)),
  };
}
