# Lanzador de la GREEN: un turno, sin persona, sobre una copia fresca de un molde de green/molds/.
# Uso: python driver.py <molde> <etiqueta> <petición>
import json, os, pathlib, shutil, subprocess, sys

BASE = pathlib.Path(__file__).parent
SCRATCH = pathlib.Path(os.environ["SDD_SCRATCH"])
KIT = SCRATCH / "kit"
RUNS = SCRATCH / "runs-green"
OUT = BASE / "out"
GIT = ["git", "-c", "user.email=fixture@example.com", "-c", "user.name=Fixture"]
SNAPSHOT = [".docs", ".claude", ".gitignore", "memory", "CLAUDE.md"]


def git(repo, *args):
    return subprocess.run(GIT + ["-C", str(repo), *args], capture_output=True, text=True, encoding="utf-8").stdout


def prepare(mold, label):
    run = RUNS / label
    shutil.rmtree(run, ignore_errors=True)
    shutil.copytree(BASE / "molds" / mold, run)
    if (run / "memory").is_dir():
        local = {"autoMemoryDirectory": str(run / "memory").replace("\\", "/")}
        (run / ".claude").mkdir(exist_ok=True)
        (run / ".claude" / "settings.local.json").write_text(json.dumps(local) + "\n", encoding="utf-8")
    git(run, "init", "-q", "-b", "main"); git(run, "add", "-A"); git(run, "commit", "-q", "-m", "chore: estado inicial")
    git(run, "checkout", "-q", "-b", "develop")
    return run


def subject(run, label, message):
    cmd = ["claude", "-p", "--model", "sonnet",
           "--settings", '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}',
           "--plugin-dir", str(KIT), "--add-dir", str(KIT),
           "--permission-mode", "acceptEdits", "--allowedTools", "Bash(*)", "Agent",
           "--disallowedTools", "SendMessage", "ListAgents",
           "--max-turns", "60", "--output-format", "stream-json", "--verbose", message]
    stream = RUNS / f"{label}.jsonl"
    with open(stream, "w", encoding="utf-8") as f:
        subprocess.run(cmd, cwd=run, stdin=subprocess.DEVNULL, stdout=f, stderr=subprocess.DEVNULL)
    return stream


def read_stream(stream):
    text, cost, tools = "", 0.0, []
    for line in stream.read_text(encoding="utf-8").splitlines():
        try:
            ev = json.loads(line)
        except json.JSONDecodeError:
            continue
        if ev.get("type") == "result":
            text, cost = ev.get("result") or "", ev.get("total_cost_usd") or 0.0
        message = ev.get("message")
        content = message.get("content") if isinstance(message, dict) else None
        for block in content if isinstance(content, list) else []:
            if isinstance(block, dict) and block.get("type") == "tool_use":
                tools.append(f"{block['name']}: {json.dumps(block.get('input'), ensure_ascii=False)[:300]}")
    return text, cost, tools


def snapshot(run, label, request, text, cost, tools):
    dest = OUT / label
    shutil.rmtree(dest, ignore_errors=True); dest.mkdir(parents=True)
    root = str(run).replace("\\", "/")
    clean = [t.replace(root, "<run>").replace(str(run).replace("\\", "\\\\"), "<run>") for t in tools]
    (dest / "transcript.md").write_text(f"### dev-lead\n\n{request}\n\n### agente\n\n{text}\n", encoding="utf-8")
    (dest / "tools.txt").write_text("\n".join(clean), encoding="utf-8")
    scripts = [str(p.relative_to(run)) for p in run.rglob("*.ps1")]
    state = ["## git status", git(run, "status", "--short", "--untracked-files=all"),
             "## git log", git(run, "log", "--oneline", "--all", "--decorate"),
             "## scripts .ps1 en el proyecto", "\n".join(scripts) or "ninguno",
             f"## coste: {cost:.2f} $"]
    (dest / "state.txt").write_text("\n".join(state), encoding="utf-8")
    for rel in SNAPSHOT:
        src = run / rel
        if src.is_dir():
            shutil.copytree(src, dest / rel.lstrip("."), ignore=shutil.ignore_patterns("settings.local.json"))
        elif src.is_file():
            shutil.copy(src, dest / rel.lstrip("."))


def main():
    mold, label, request = sys.argv[1:4]
    run = prepare(mold, label)
    text, cost, tools = read_stream(subject(run, label, request))
    snapshot(run, label, request, text, cost, tools)
    print(f"[{label}] listo, {cost:.2f} $")


if __name__ == "__main__":
    main()
