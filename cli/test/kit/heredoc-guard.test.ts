import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { heredocCodeTarget } from '../../../.claude/hooks/heredoc-guard.mjs';
import { kitRoot } from './process.ts';

const script = (...lines: string[]) => lines.join('\n');

describe('heredocCodeTarget: lo que se para', () => {
  it.each([
    ['cat con delimitador entre comillas', script("cat > x.mjs <<'EOF'", 'const a = 1;', 'EOF'), 'x.mjs'],
    ['cat que añade', script('cat >> x.py <<EOF', 'a = 1', 'EOF'), 'x.py'],
    ['redirección tras el heredoc', script('cat <<EOF > x.ts', 'const a = 1;', 'EOF'), 'x.ts'],
    ['ruta entre comillas', script(`cat > "D:/a b/x.mjs" <<'EOF'`, 'a', 'EOF'), 'D:/a b/x.mjs'],
    ['tee', script('tee x.js <<EOF', 'a', 'EOF'), 'x.js'],
    ['tee en tubería', script('cat <<EOF | tee x.mjs', 'a', 'EOF'), 'x.mjs'],
    ['con <<-', script("cat > x.mjs <<-'EOF'", '\ta', '\tEOF'), 'x.mjs'],
    ['tras otro comando', script("cd a && cat > x.mjs <<'EOF'", 'a', 'EOF', 'node x.mjs'), 'x.mjs'],
    ['segundo heredoc de la orden', script("cat > a.md <<'EOF'", 'a', 'EOF', "cat > x.mjs <<'EOF'", 'b', 'EOF'), 'x.mjs'],
  ])('%s', (_name, command, target) => {
    expect(heredocCodeTarget(command)).toBe(target);
  });

  it.each([
    ['node con ruta literal', script("node <<'EOF'", "const fs = require('fs');", "fs.writeFileSync('cli/src/verbs.ts', text);", 'EOF'), 'cli/src/verbs.ts'],
    ['node con la ruta en una variable', script("node --input-type=module <<'EOF'", "const f = 'tests/subject.mjs';", 'writeFileSync(f, text);', 'EOF'), 'tests/subject.mjs'],
    ['node leído por tubería', script("cat <<'EOF' | node", "writeFileSync('x.js', text);", 'EOF'), 'x.js'],
    ['node con guion y prefijo de entorno', script("A=1 node - <<'EOF'", "fs.appendFileSync('x.mjs', text);", 'EOF'), 'x.mjs'],
    ['python con open', script("python3 <<'EOF'", "open('x.py', 'w').write(text)", 'EOF'), 'x.py'],
    ['python con Path', script("python - <<'EOF'", "Path('x.ts').write_text(text)", 'EOF'), 'x.ts'],
    ['python con Path en una variable', script("py <<'EOF'", "p = Path(r'x.py')", 'p.write_text(text)', 'EOF'), 'x.py'],
  ])('%s', (_name, command, target) => {
    expect(heredocCodeTarget(command)).toBe(target);
  });
});

describe('heredocCodeTarget: lo que pasa', () => {
  it.each([
    ['mensaje de commit por stdin', script("git commit -F - <<'EOF'", 'docs: cuenta el caso', '', "cat > x.mjs <<'FIN'", 'FIN', 'EOF')],
    ['mensaje de commit con -m y sustitución', script(`git commit -m "$(cat <<'EOF'`, 'dice "cat > x.mjs <<FIN" y (algo)', 'EOF', ')"')],
    ['el texto entre comillas no es una orden', `git commit -m "cat > x.mjs <<EOF"`],
    ['comillas simples con varias líneas', script("echo 'a", "cat > x.mjs <<EOF", "b'")],
    ['un comentario', script("# cat > x.mjs <<'EOF'", 'ls')],
    ['Markdown', script("cat > notas.md <<'EOF'", 'writeFileSync("x.mjs", a)', 'EOF')],
    ['node que lee código y escribe otra cosa', script("node <<'EOF'", "const a = readFileSync('a.ts', 'utf8');", "writeFileSync('b.md', a);", 'EOF')],
    ['node que no escribe', script("node <<'EOF'", "console.log(readFileSync('a.mjs', 'utf8'));", 'EOF')],
    ['ruta calculada', script("node <<'EOF'", "writeFileSync(join(dir, 'x.mjs'), a);", 'EOF')],
    ['python que abre para leer', script("python <<'EOF'", "print(open('x.py').read())", 'EOF')],
    ['node con script, el heredoc es su entrada', script("node run.mjs <<'EOF'", "writeFileSync('x.mjs', a)", 'EOF')],
    ['otro programa con su entrada', script("sqlite3 db <<'EOF'", "writeFileSync('x.mjs', a)", 'EOF')],
    ['here-string', 'cat > x.mjs <<< "a"'],
    ['sin heredoc', 'cat a.txt > x.mjs'],
    ['ejecutar un script', 'node x.mjs'],
    ['node -e, fuera de alcance', `node -e "require('fs').writeFileSync('x.mjs', a)"`],
    ['comillas sin cerrar', script("cat > x.mjs <<'EOF", 'a', 'EOF')],
    ['orden vacía', ''],
  ])('%s', (_name, command) => {
    expect(heredocCodeTarget(command)).toBeNull();
  });
});

describe('.claude/settings.json', () => {
  it('registra el hook como PreToolUse de Bash, con node', () => {
    const { PreToolUse } = JSON.parse(readFileSync(join(kitRoot, '.claude', 'settings.json'), 'utf8')).hooks;
    const entry = PreToolUse.find((candidate: { matcher: string }) => candidate.matcher === 'Bash');
    expect(entry.hooks[0].command).toMatch(/^node\s.*heredoc-guard\.mjs/);
  });
});
