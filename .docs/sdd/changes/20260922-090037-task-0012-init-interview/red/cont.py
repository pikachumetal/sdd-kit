# Continúa una sesión del driver donde se quedó: persona responde al último mensaje y se reanuda.
import sys, re
import driver as d

label, persona_file, extra = sys.argv[1], sys.argv[2], int(sys.argv[3])
run = d.RUNS / label
persona = (d.BASE / persona_file).read_text(encoding="utf-8")
log = (d.OUT / label / "transcript.md").read_text(encoding="utf-8")
first = max(int(n) for n in re.findall(r"### Turno (\d+) — agente", log)) + 1
last_text = log.rsplit("— agente\n\n", 1)[1]
session = None
for line in (d.RUNS / f"{label}-t{first-1}.jsonl").read_text(encoding="utf-8").splitlines():
    m = re.search(r'"session_id":"([^"]+)"', line)
    if m: session = m.group(1)
parts, total = [log], 0.0
for turn in range(first, first + extra):
    msg = d.persona_reply(persona, last_text)
    if msg.strip() == "FIN" or not msg:
        parts.append("### FIN (simulador)\n"); break
    parts.append(f"### Turno {turn} — dev-lead\n\n{msg}\n")
    session, last_text, cost = d.subject(run, label, turn, msg, session)
    total += cost
    parts.append(f"### Turno {turn} — agente\n\n{last_text}\n")
d.snapshot(run, label, "\n".join(parts), total)
print(f"[{label}] continuado, +{total:.2f} $")
