import { readFileSync } from 'node:fs';
for (const file of process.argv.slice(2)) {
  if (file.includes('f678edbb')) continue;
  const entries = readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap((l) => {
    try { return [JSON.parse(l)]; } catch { return []; }
  });
  const invoked = new Set();
  for (const e of entries) {
    for (const c of e.message?.content ?? []) {
      if (c?.type === 'tool_use' && c.name === 'Skill') invoked.add(String(c.input?.skill ?? '').replace(/^\//, ''));
    }
    const a = e.attachment;
    if (e.type === 'attachment' && a?.type === 'invoked_skills') {
      const names = a.skills.map((s) => s.name);
      const total = a.skills.reduce((n, s) => n + s.content.length, 0);
      const missing = [...invoked].filter((n) => !names.includes(n) && !names.includes(n.split(':').pop()));
      console.log(JSON.stringify({ file: file.split(/[\\/]/).at(-2).slice(0, 60), ts: e.timestamp, n: names.length, chars: total, missing }));
    }
  }
}
