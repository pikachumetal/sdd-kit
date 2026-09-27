"""Extrae de un stream-json lo que mide el paso 6: skills, encargos, comandos y su modo.

Uso: python extract.py <sujeto.jsonl> > tools.txt
"""
import json
import re
import sys

WATCHED = re.compile(r"moon|dotnet|playwright|navegador|browser|no probado|Verificaci", re.I)


def describe_tool(block):
    name, data = block["name"], block["input"]
    if name == "Skill":
        return f"SKILL {data.get('skill')}"
    if name == "Agent":
        prompt = data.get("prompt", "")
        hits = [line.strip() for line in prompt.splitlines() if WATCHED.search(line)]
        return f"AGENT model={data.get('model')} bg={data.get('run_in_background')}\n    " + "\n    ".join(hits)
    if name in ("Bash", "PowerShell"):
        return f"{name.upper()} bg={data.get('run_in_background')} {data.get('command', '')[:300]}"
    if name.startswith("mcp__"):
        return f"MCP {name}"
    if name in ("Edit", "Write") and "tasks.md" in data.get("file_path", ""):
        body = data.get("new_string") or data.get("content") or ""
        return "TASKS.MD " + " | ".join(l for l in body.splitlines() if l.startswith("| 2"))
    return None


def main(path):
    for line in open(path, encoding="utf-8"):
        event = json.loads(line)
        if event.get("type") != "assistant":
            continue
        who = "sub " if event.get("parent_tool_use_id") else "hilo"
        for block in event["message"]["content"]:
            if block.get("type") == "tool_use":
                text = describe_tool(block)
                if text:
                    print(f"[{who}] {text}")


if __name__ == "__main__":
    main(sys.argv[1])
