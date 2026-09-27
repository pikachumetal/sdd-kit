# Sujeto headless (Sonnet) con dev-lead simulado (Haiku) a varios turnos sobre una copia fresca de un molde.
# Uso: python driver.py <molde> <etiqueta> <persona|-> <max_turnos> <petición>
import json, pathlib, shutil, subprocess, sys, tempfile

BASE = pathlib.Path(__file__).parent
KIT = BASE / "kit"
RUNS = BASE / "runs"
OUT = BASE / "out"
GIT = ["git", "-c", "user.email=fixture@example.com", "-c", "user.name=Fixture"]


def git(run, *args):
    return subprocess.run(GIT + ["-C", str(run), *args], capture_output=True, text=True, encoding="utf-8").stdout


def prepare(mold, label):
    run = RUNS / label
    shutil.rmtree(run, ignore_errors=True)
    shutil.copytree(BASE / "molds" / mold, run)
    if mold == "e1-template":
        git(run, "init", "-q", "-b", "main"); git(run, "add", "-A")
        git(run, "commit", "-q", "-m", "chore: instanciar template angular-dotnet")
        git(run, "checkout", "-q", "-b", "develop")
    elif mold == "e2-code":
        remote = RUNS / f"{label}-remote.git"
        shutil.rmtree(remote, ignore_errors=True)
        subprocess.run(["git", "init", "-q", "--bare", "-b", "master", str(remote)])
        git(run, "init", "-q", "-b", "master"); git(run, "add", "-A")
        git(run, "commit", "-q", "-m", "feat: statusline con modelo, rama y coste")
        git(run, "remote", "add", "origin", str(remote)); git(run, "push", "-q", "origin", "master")
    return run


def subject(run, label, turn, message, session=None):
    cmd = ["claude", "-p", "--model", "sonnet",
           "--settings", '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}',
           "--plugin-dir", str(KIT), "--add-dir", str(KIT),
           "--permission-mode", "acceptEdits", "--allowedTools", "Bash(*)", "Agent",
           "--disallowedTools", "SendMessage", "ListAgents",
           "--max-turns", "60", "--output-format", "stream-json", "--verbose"]
    if session:
        cmd += ["--resume", session]
    cmd.append(message)
    stream = RUNS / f"{label}-t{turn}.jsonl"
    with open(stream, "w", encoding="utf-8") as f:
        subprocess.run(cmd, cwd=run, stdin=subprocess.DEVNULL, stdout=f, stderr=subprocess.DEVNULL)
    session_id, text, cost = session, "", 0.0
    for line in stream.read_text(encoding="utf-8").splitlines():
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        session_id = ev.get("session_id", session_id)
        if ev.get("type") == "result":
            text = ev.get("result") or ""
            cost = ev.get("total_cost_usd") or 0.0
    return session_id, text, cost


def persona_reply(persona, agent_text):
    prompt = (persona + "\n\n---\nÚltimo mensaje del agente:\n\n" + agent_text +
              "\n\n---\nEscribe SOLO tu respuesta como dev-lead, en castellano, breve (1-3 frases). "
              "Si el mensaje trae varias preguntas, responde solo a la primera. "
              "Si el agente no pregunta nada ni pide aprobación y da la inicialización por terminada, responde exactamente FIN.")
    with tempfile.TemporaryDirectory() as tmp:
        r = subprocess.run(["claude", "-p", "--model", "haiku", "--setting-sources", "", "--tools", "",
                            "--max-turns", "1", "--output-format", "text", prompt],
                           cwd=tmp, stdin=subprocess.DEVNULL, capture_output=True, text=True, encoding="utf-8")
    return r.stdout.strip()


def snapshot(run, label, log, total):
    dest = OUT / label
    shutil.rmtree(dest, ignore_errors=True); dest.mkdir(parents=True)
    (dest / "transcript.md").write_text(log, encoding="utf-8")
    state = ["## git status", git(run, "status", "--short", "--untracked-files=all"),
             "## git log", git(run, "log", "--oneline", "--all", "--decorate"),
             "## ramas remotas", git(run, "ls-remote", "--heads", "origin"),
             "## marcadores pendientes",
             subprocess.run(["grep", "-rn", "sdd-template: pending", ".docs/sdd"], cwd=run,
                            capture_output=True, text=True).stdout,
             f"## coste total sujeto: {total:.2f} $"]
    (dest / "state.txt").write_text("\n".join(state), encoding="utf-8")
    for rel in [".docs", "CLAUDE.md", "docs"]:
        src = run / rel
        if src.is_dir():
            shutil.copytree(src, dest / rel)
        elif src.is_file():
            shutil.copy(src, dest / rel)


def main():
    mold, label, persona_file, max_turns, request = sys.argv[1:6]
    persona = "" if persona_file == "-" else (BASE / persona_file).read_text(encoding="utf-8")
    run = prepare(mold, label)
    log, total, message, session = [], 0.0, request, None
    for turn in range(1, int(max_turns) + 1):
        log.append(f"### Turno {turn} — dev-lead\n\n{message}\n")
        session, text, cost = subject(run, label, turn, message, session)
        total += cost
        log.append(f"### Turno {turn} — agente\n\n{text}\n")
        if not persona:
            break
        message = persona_reply(persona, text)
        if message.strip() == "FIN" or not message:
            log.append("### FIN (simulador)\n")
            break
    snapshot(run, label, "\n".join(log), total)
    print(f"[{label}] listo, {total:.2f} $")


if __name__ == "__main__":
    main()
