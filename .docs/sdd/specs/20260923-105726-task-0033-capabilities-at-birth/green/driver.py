# Derivado del lanzador de la task 0019: un solo turno, sin persona, un molde por escenario.
# Uso: python driver.py <etiqueta> <molde> <fichero con la petición>
import json, os, pathlib, shutil, subprocess, sys

BASE = pathlib.Path(__file__).parent
SCRATCH = pathlib.Path(os.environ["SDD_SCRATCH"])
KIT = SCRATCH / "kit"
RUNS = SCRATCH / "runs"
OUT = BASE / "out"
GIT = ["git", "-c", "user.email=fixture@example.com", "-c", "user.name=Fixture"]


def git(repo, *args):
    return subprocess.run(GIT + ["-C", str(repo), *args], capture_output=True, text=True, encoding="utf-8").stdout


def prepare(label, mold):
    run = RUNS / label
    shutil.rmtree(run, ignore_errors=True)
    shutil.copytree(BASE / "molds" / mold, run)
    git(run, "init", "-q", "-b", "main"); git(run, "add", "-A"); git(run, "commit", "-q", "-m", "chore: estado inicial")
    git(run, "checkout", "-q", "-b", "develop")
    return run


def subject(run, label, message):
    cmd = ["claude", "-p", "--model", "sonnet",
           "--settings", '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}',
           "--plugin-dir", str(KIT), "--add-dir", str(KIT),
           "--permission-mode", "acceptEdits", "--allowedTools", "Bash(*)", "PowerShell(*)", "Agent",
           "--disallowedTools", "SendMessage", "ListAgents",
           "--max-turns", "80", "--output-format", "stream-json", "--verbose", message]
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
    shutil.rmtree(dest, ignore_errors=True)
    root = str(run).replace("\\", "/")
    clean = [t.replace(root, "<run>").replace(root.replace("/", "\\\\"), "<run>") for t in tools]
    shutil.copytree(run, dest / "tree", ignore=shutil.ignore_patterns(".git"))
    (dest / "transcript.md").write_text(f"### dev-lead\n\n{request}\n\n### agente\n\n{text}\n", encoding="utf-8")
    (dest / "tools.txt").write_text("\n".join(clean), encoding="utf-8")
    state = ["## git log", git(run, "log", "--oneline", "--all", "--decorate"),
             "## git status", git(run, "status", "--short", "--untracked-files=all"),
             f"## coste: {cost:.2f} $"]
    (dest / "state.txt").write_text("\n".join(state), encoding="utf-8")


def main():
    label, mold, request_file = sys.argv[1:4]
    request = pathlib.Path(request_file).read_text(encoding="utf-8").strip()
    run = prepare(label, mold)
    text, cost, tools = read_stream(subject(run, label, request))
    snapshot(run, label, request, text, cost, tools)
    print(f"[{label}] listo, {cost:.2f} $")


if __name__ == "__main__":
    main()
