import { readFileSync } from 'node:fs';
const marker = 'skill content truncated for compaction';
const rows = [];
for (const file of process.argv.slice(2)) {
  if (file.includes('f678edbb')) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  for (const line of lines) {
    if (!line.includes(marker)) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    const a = entry.attachment;
    if (entry.type !== 'attachment' || a?.type !== 'invoked_skills') continue;
    for (const s of a.skills) {
      const cut = s.content.includes(marker);
      rows.push({
        session: file.split(/[\\/]/).slice(-2).join('/').slice(0, 90),
        ts: entry.timestamp,
        skill: s.name,
        chars: s.content.length,
        cut,
        tail: cut ? s.content.slice(-260, -100).replace(/\s+/g, ' ') : '',
      });
    }
  }
}
for (const r of rows) console.log(JSON.stringify(r));
