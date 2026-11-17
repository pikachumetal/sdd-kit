# Sujeto headless multi-turno de la feature 0089: molde = template angular-dotnet de develop, respuestas fijas.
# Uso: SDD_SCRATCH=<scratchpad> python driver.py <etiqueta>
import json, os, pathlib, shutil, subprocess, sys

BASE = pathlib.Path(__file__).parent
SCRATCH = pathlib.Path(os.environ["SDD_SCRATCH"])
KIT, TPL, RUNS, OUT = SCRATCH / "kit", SCRATCH / "tpl/templates/angular-dotnet", SCRATCH / "runs", BASE / "out"
GIT = ["git", "-c", "user.email=fixture@example.com", "-c", "user.name=Fixture", "-c", "core.autocrlf=false", "-c", "core.longpaths=true"]
ASK = ("Acabo de crear este proyecto desde nuestro template. Inicializa la documentación SDD con "
       "sdd-init-greenfield. Mis respuestas a la entrevista están en brief.md: tómalas como mías.")
REPLY = "Si me preguntas algo que no está en brief.md: no sé. Si me presentas un documento: ok, aprobado. Sigue."
MAX_TURNS, COST_CAP = 14, 8.0


def git(repo, *args):
    return subprocess.run(GIT + ["-C", str(repo), *args], capture_output=True, text=True, encoding="utf-8").stdout


def prepare(label):
    run = RUNS / label / "app"
    subprocess.run(["rm", "-rf", str(run.parent)], check=True)
    shutil.copytree(TPL, run)
    shutil.copy(BASE.parent / "red" / "brief.md", run / "brief.md")
    git(run, "init", "-q", "-b", "main"); git(run, "add", "-A"); git(run, "commit", "-q", "-m", "chore: instanciar el template")
    git(run, "checkout", "-q", "-b", "develop")
    return run


def claude(run, stream, message, session=None):
    cmd = ["claude", "-p", "--model", "sonnet", "--settings", '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}',
           "--plugin-dir", str(KIT), "--add-dir", str(KIT), "--permission-mode", "acceptEdits",
           "--allowedTools", "Bash(*)", "Agent", "Edit(.claude/**)", "Write(.claude/**)", "--disallowedTools", "SendMessage", "ListAgents",
           "--max-turns", "60", "--output-format", "stream-json", "--verbose"]
    cmd += ["--resume", session] if session else []
    with open(stream, "a", encoding="utf-8") as f:
        subprocess.run(cmd + [message], cwd=run, stdin=subprocess.DEVNULL, stdout=f, stderr=subprocess.DEVNULL)


def last_result(stream):
    result = {}
    for line in stream.read_text(encoding="utf-8").splitlines():
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if ev.get("type") == "result":
            result = ev
    return result


def main(label):
    run = prepare(label)
    stream = RUNS / f"{label}.jsonl"
    stream.unlink(missing_ok=True)
    dest = OUT / label
    shutil.rmtree(dest, ignore_errors=True); dest.mkdir(parents=True)
    turns, cost, session, message = [], 0.0, None, ASK
    for _ in range(MAX_TURNS):
        claude(run, stream, message, session)
        res = last_result(stream)
        session, text = res.get("session_id"), res.get("result") or ""
        cost += res.get("total_cost_usd") or 0.0
        turns.append(text)
        if "?" not in text or cost >= COST_CAP:
            break
        message = REPLY
    transcript = "\n\n".join(f"## Turno {i + 1}\n\n{t}" for i, t in enumerate(turns))
    (dest / "turns.md").write_text(f"# {label}\n\nCoste: {cost:.2f} $ · turnos: {len(turns)}\n\n{transcript}\n", encoding="utf-8")
    (dest / "diff.txt").write_text(git(run, "status", "--short") + "\n" + git(run, "diff", "HEAD", "--stat") + "\n"
                                   + git(run, "log", "--oneline", "--all"), encoding="utf-8")
    for rel in [".docs/sdd/sdd-kit.json", ".docs/sdd/roadmap.md", ".docs/sdd/mission.md", ".docs/sdd/constitution.md",
                ".claude/settings.json", ".gitignore", "CLAUDE.md"]:
        src = run / rel
        if src.exists():
            shutil.copy(src, dest / rel.replace("/", "_").replace("CLAUDE.md", "claude_md.md").lstrip("._"))
    print(f"{label}: {cost:.2f} $, {len(turns)} turnos")


main(sys.argv[1])
