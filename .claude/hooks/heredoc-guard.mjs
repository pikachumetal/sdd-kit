// PreToolUse de Bash: deniega escribir código con un heredoc, que en Git Bash pierde barras invertidas y rompe escapes.
// Un falso positivo pararía todas las sesiones del repo: lo que no se entiende, pasa.
import { readFileSync } from 'node:fs';

const CODE_FILE = /\.(mjs|js|ts|py)$/;
const INTERPRETERS = new Set(['node', 'python', 'python3', 'py']);
const ASSIGNMENT = /^\w+=/;
const STRING = /[rR]?(['"`])([^'"`\n]+)\1/.source;
const JS_WRITE = /\b(?:writeFileSync|writeFile|appendFileSync|appendFile|createWriteStream)\(\s*/g;
const PY_OPEN = /\bopen\(\s*/g;
const PY_WRITE_MODE = /^\s*,\s*(?:mode\s*=\s*)?[rRbBfF]*['"][^'"]*[wax]/;
const PY_PATH_WRITE = /\bPath\(\s*([rR]?(['"])([^'"\n]+)\2)\s*\)\.write_(?:text|bytes)\(/g;
const PY_VARIABLE_WRITE = /\b([A-Za-z_]\w*)\.write_(?:text|bytes)\(/g;

class UnreadableCommand extends Error {}

function closingQuote(text, from) {
  const end = text.indexOf("'", from);
  if (end < 0) throw new UnreadableCommand();
  return end;
}

// Salta lo que abre `$(` dentro de comillas dobles: ahí dentro las comillas no cierran las de fuera.
function closingParen(text, from) {
  let depth = 1;
  for (let i = from; i < text.length; i++) {
    if (text[i] === '(') depth++;
    if (text[i] === ')' && --depth === 0) return i;
  }
  throw new UnreadableCommand();
}

function closingDoubleQuote(text, from) {
  for (let i = from; i < text.length; i++) {
    if (text[i] === '\\') i++;
    else if (text[i] === '"') return i;
    else if (text.startsWith('$(', i)) i = closingParen(text, i + 2);
  }
  throw new UnreadableCommand();
}

function readHeredocBody(text, from, { delimiter, stripTabs }) {
  const lines = [];
  let position = from;
  while (position < text.length) {
    const newline = text.indexOf('\n', position);
    const end = newline < 0 ? text.length : newline;
    const line = text.slice(position, end).replace(/\r$/, '');
    position = end + 1;
    if ((stripTabs ? line.replace(/^\t+/, '') : line) === delimiter) break;
    lines.push(line);
  }
  return { body: lines.join('\n'), position };
}

const newCommand = () => ({ words: [], redirects: [], bodies: [] });

// Lexer mínimo: separa órdenes, palabras, redirecciones y heredocs, sin leer como órdenes ni las comillas ni los cuerpos.
class CommandReader {
  constructor(text) {
    this.text = text;
    this.position = 0;
    this.pipelines = [];
    this.pipeline = [newCommand()];
    this.word = null;
    this.expecting = null;
    this.pending = [];
  }

  get command() {
    return this.pipeline.at(-1);
  }

  endWord() {
    if (this.word === null) return;
    const word = this.word.value;
    if (this.expecting === 'redirect') this.command.redirects.push(word);
    else if (this.expecting === 'heredoc') this.pending.push({ delimiter: word, stripTabs: this.stripTabs, command: this.command });
    else if (this.expecting !== 'skip') this.command.words.push(word);
    this.expecting = null;
    this.word = null;
  }

  append(text) {
    this.word = { value: (this.word?.value ?? '') + text };
  }

  endPipeline() {
    this.endWord();
    this.pipelines.push(this.pipeline);
    this.pipeline = [newCommand()];
  }

  readBodies() {
    for (const heredoc of this.pending) {
      const { body, position } = readHeredocBody(this.text, this.position, heredoc);
      heredoc.command.bodies.push(body);
      this.position = position;
    }
    this.pending = [];
  }

  readLessThan() {
    this.endWord();
    if (this.text.startsWith('<<<', this.position)) {
      this.position += 3;
      this.expecting = 'skip';
    } else if (this.text.startsWith('<<', this.position)) {
      this.stripTabs = this.text[this.position + 2] === '-';
      this.position += this.stripTabs ? 3 : 2;
      this.expecting = 'heredoc';
    } else {
      this.position += 1;
      this.expecting = 'skip';
    }
  }

  readGreaterThan() {
    this.endWord();
    this.position += this.text[this.position + 1] === '>' ? 2 : 1;
    if (this.text[this.position] === '&') {
      this.position += 1;
      this.expecting = 'skip';
    } else {
      this.expecting = 'redirect';
    }
  }

  readQuoted(char) {
    const start = this.position + 1;
    const end = char === "'" ? closingQuote(this.text, start) : closingDoubleQuote(this.text, start);
    this.append(this.text.slice(start, end));
    this.position = end + 1;
  }

  skipComment() {
    const newline = this.text.indexOf('\n', this.position);
    this.position = newline < 0 ? this.text.length : newline;
  }

  readSeparator(char) {
    if (char === '\n') {
      this.endPipeline();
      this.position += 1;
      this.readBodies();
    } else if (char === '|' && this.text[this.position + 1] !== '|') {
      this.endWord();
      this.pipeline.push(newCommand());
      this.position += 1;
    } else {
      this.endPipeline();
      this.position += this.text[this.position + 1] === char ? 2 : 1;
    }
  }

  readAll() {
    while (this.position < this.text.length) this.readNext(this.text[this.position]);
    this.endPipeline();
    return this.pipelines;
  }

  readNext(char) {
    if (char === "'" || char === '"') this.readQuoted(char);
    else if (char === '\\') this.readEscape();
    else if (char === '<') this.readLessThan();
    else if (char === '>') this.readGreaterThan();
    else if ('\n;&|()'.includes(char)) this.readSeparator(char);
    else if (char === ' ' || char === '\t' || char === '\r') this.readBlank();
    else if (char === '#' && this.word === null) this.skipComment();
    else this.readPlain(char);
  }

  readEscape() {
    const escaped = this.text[this.position + 1] ?? '';
    if (escaped !== '\n') this.append(escaped);
    this.position += 2;
  }

  readBlank() {
    this.endWord();
    this.position += 1;
  }

  readPlain(char) {
    this.append(char);
    this.position += 1;
  }
}

function literalOfVariable(body, name) {
  const assignment = new RegExp(`\\b${name}\\s*=\\s*(?:Path\\(\\s*)?${STRING}`);
  return body.match(assignment)?.[2] ?? null;
}

// La ruta del primer argumento: un literal, o una variable asignada a un literal. Una calculada da null.
function firstArgumentPath(body, from) {
  const rest = body.slice(from);
  const literal = rest.match(new RegExp(`^${STRING}\\s*(?=[,)])`));
  if (literal) return { path: literal[2], after: rest.slice(literal[0].length) };
  const variable = rest.match(/^([A-Za-z_$][\w$]*)\s*(?=[,)])/);
  if (variable) return { path: literalOfVariable(body, variable[1]), after: rest.slice(variable[0].length) };
  return { path: null, after: rest };
}

function writtenPaths(body) {
  const paths = [];
  for (const match of body.matchAll(JS_WRITE)) paths.push(firstArgumentPath(body, match.index + match[0].length).path);
  for (const match of body.matchAll(PY_OPEN)) {
    const { path, after } = firstArgumentPath(body, match.index + match[0].length);
    if (PY_WRITE_MODE.test(after)) paths.push(path);
  }
  for (const match of body.matchAll(PY_PATH_WRITE)) paths.push(match[3]);
  for (const match of body.matchAll(PY_VARIABLE_WRITE)) paths.push(literalOfVariable(body, match[1]));
  return paths;
}

const codePathWritten = (body) => writtenPaths(body).find((path) => path && CODE_FILE.test(path)) ?? null;

function readsStdinScript(command) {
  const [program, ...args] = command.words.filter((word, i, words) => !(ASSIGNMENT.test(word) && words.slice(0, i).every((before) => ASSIGNMENT.test(before))));
  if (!program) return false;
  const name = program.replaceAll('\\', '/').split('/').at(-1).replace(/\.exe$/i, '').toLowerCase();
  if (!INTERPRETERS.has(name)) return false;
  return args.every((arg) => arg === '-' || (arg.startsWith('--') && arg.includes('=')));
}

function targetOfPipeline(pipeline) {
  const bodies = pipeline.flatMap((command) => command.bodies);
  if (bodies.length === 0) return null;
  for (const command of pipeline) {
    const redirected = command.redirects.find((path) => CODE_FILE.test(path));
    if (redirected) return redirected;
    const teed = command.words[0] === 'tee' ? command.words.find((word) => CODE_FILE.test(word)) : null;
    if (teed) return teed;
  }
  if (!pipeline.some(readsStdinScript)) return null;
  return bodies.map(codePathWritten).find(Boolean) ?? null;
}

export function heredocCodeTarget(commandText) {
  try {
    const pipelines = new CommandReader(commandText).readAll();
    return pipelines.map(targetOfPipeline).find(Boolean) ?? null;
  } catch (error) {
    if (error instanceof UnreadableCommand) return null;
    throw error;
  }
}

function denial(target) {
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `Este Bash escribe ${target} con un heredoc: en Git Bash pierde barras invertidas y rompe escapes. Escríbelo con la herramienta Write (para un cambio, Edit).`,
    },
  };
}

if (import.meta.main) {
  try {
    const target = heredocCodeTarget(JSON.parse(readFileSync(0, 'utf8')).tool_input?.command ?? '');
    if (target) console.log(JSON.stringify(denial(target)));
  } catch {
    // Una entrada que no se entiende deja pasar el comando.
  }
}
