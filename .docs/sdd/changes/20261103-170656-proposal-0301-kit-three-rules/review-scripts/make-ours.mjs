// Builds a synthetic annotated source from superpowers v7.0.0 SKILL.md: kit blocks marked with <!-- kit: ... -->.
// Usage: node make-ours.mjs <old.md> <out.md> [unwrap]
import { readFileSync, writeFileSync } from 'node:fs';
const [src, out, mode] = process.argv.slice(2);
let t = readFileSync(src, 'utf8');
const rep = (from, to) => { if (!t.includes(from)) throw new Error('missing: ' + from.slice(0, 60)); t = t.replace(from, to); };
const W = mode === 'unwrap';
if (W) {
  // Like the current kit: one line per paragraph or bullet (outside fences).
  const res = []; let fence = false;
  for (const l of t.split('\n')) {
    if (l.startsWith('```')) { fence = !fence; res.push(l); continue; }
    const prev = res[res.length - 1];
    const cont = !fence && l.trim() && prev !== undefined && prev.trim() && !/^(#|\||- |\d+\. |\*\*)/.test(l.trim()) && !/^(#|\|)/.test(prev.trim()) && !prev.startsWith('```');
    if (cont) res[res.length - 1] = prev + ' ' + l.trim(); else res.push(l);
  }
  t = res.join('\n');
}
const j = (s) => (W ? s.replace(/\n\s*/g, ' ') : s);
// B1: substitution of the absolute stop list (region unchanged in 7.0.1).
rep(j('Four things stop you, and only these: an irreversible or destructive\noperation; a security-sensitive action; a side effect outside this worktree\nthat norms say you ask about first (a merge, a push to a shared branch, a\npublish); and a plan so broken that every path forward is a guess. For those,\nstop and ask.'),
  '<!-- kit: 0296 · sustituye: «Four things stop you, and only these» -->\nSeven things stop you, and only these: an irreversible or destructive\noperation; a security-sensitive action; a side effect outside this worktree\nthat norms say you ask about first; a plan so broken that every path forward\nis a guess; a deviation from the approved spec; a scope brake; and, in\n`pair`, the stop after each task. For those, stop and ask.');
// B2: pure addition after Narration.
const narr = j('**Narration:** between tool calls, narrate at most one short line — the\nledger and the tool results carry the record.');
rep(narr, narr + '\n\n<!-- kit: 31783aa5 -->\n**Your first message after loading this skill**, new run or resumed, says\nwhich method runs and which task is next.');
// B3: substitution of one sentence inside a wrapped paragraph (Model Selection, unchanged in 7.0.1).
rep(j('most capable model; a subtle concurrency change does. Scoped re-reviews of\nsmall fix diffs take a cheap-to-mid tier.'),
  'most capable model; a subtle concurrency change does.\n<!-- kit: 1d89f543 · sustituye: «Scoped re-reviews of small fix diffs take a cheap-to-mid tier.» -->\nA scoped re-review takes a cheap-to-mid tier; the final review\'s single\nre-review is `sdd-verify`\'s.');
// B4: substitution of a bullet that 7.0.1 rewrote (Setup, ledger resume).
rep(j('- Check for this plan\'s ledger at `<workspace>/progress.md`. If its first\n  line names your plan file, tasks with a `Task <N>: complete` line are DONE\n  — do not re-dispatch them; resume at the first task without one. A task\n  whose last line is a fix round is mid-loop: resume the loop at the next\n  round.'),
  '<!-- kit: 4597d47e · sustituye: «resume the loop at the next round» -->\n- Check for this plan\'s ledger with `sdd task status`. Tasks with a\n  `Task <N>: complete` line are DONE; a task whose last line is a fix round\n  is mid-loop: resume it at the next round, and run its re-review first.');
// B5: pure addition inside the fix loop, a region 7.0.1 moved to references/fix-loop.md.
const r13 = 'the report file is the persistent memory either way.';
rep(r13, r13 + '\n\n<!-- kit: 4597d47e -->\n**Reproduce before fixing**: a Critical or Important finding that claims a\nfailure gets a failing test before its fix round.');
// B6: rename of a source skill (region unchanged in 7.0.1).
rep(j('Ensure the work happens in an isolated workspace: use\nsuperpowers:using-git-worktrees to create one or verify the existing one.'),
  '<!-- kit: d59bf7b5 · sustituye: «superpowers:using-git-worktrees» -->\nEnsure the work happens in an isolated workspace: use\n`sdd-worktrees` to create one or verify the existing one.');
writeFileSync(out, t);
