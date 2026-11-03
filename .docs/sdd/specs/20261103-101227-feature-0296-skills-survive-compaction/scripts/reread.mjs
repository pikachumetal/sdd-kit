import { readFileSync } from 'node:fs';
const marker = 'skill content truncated for compaction';
for (const file of process.argv.slice(2)) {
  if (file.includes('f678edbb')) continue;
  const entries = readFileSync(file, 'utf8').split('\n').filter(Boolean).flatMap((l) => {
    try { return [JSON.parse(l)]; } catch { return []; }
  });
  entries.forEach((e, i) => {
    const a = e.attachment;
    if (e.type !== 'attachment' || a?.type !== 'invoked_skills') return;
    for (const s of a.skills.filter((x) => x.content.includes(marker) && x.name.startsWith('sdd-kit:'))) {
      const short = s.name.split(':')[1];
      let reread = 'no';
      let reinvoke = 'no';
      let turns = 0;
      for (const later of entries.slice(i + 1)) {
        if (later.type === 'assistant') turns++;
        for (const c of later.message?.content ?? []) {
          if (c?.type !== 'tool_use') continue;
          const p = JSON.stringify(c.input ?? {});
          if (c.name === 'Read' && p.includes(`${short}`) && p.includes('SKILL.md')) reread = reread === 'no' ? `turno ${turns}` : reread;
          if (c.name === 'Skill' && p.includes(short)) reinvoke = reinvoke === 'no' ? `turno ${turns}` : reinvoke;
        }
      }
      console.log(JSON.stringify({ file: file.split(/[\\/]/).at(-2).slice(0, 70), ts: e.timestamp, skill: short, reread, reinvoke, turnsAfter: turns, cutAt: s.content.slice(-400, -102).replace(/\s+/g, ' ').slice(-140) }));
    }
  });
}
