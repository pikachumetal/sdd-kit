"""Lista los comandos Bash de un sujeto que tocan merge, tag o develop, en orden, con su resultado."""
import json, sys

for path in sys.argv[1:]:
    print(f"== {path}")
    calls = {}
    for line in open(path, encoding="utf-8"):
        msg = json.loads(line)
        for block in (msg.get("message") or {}).get("content") or []:
            if not isinstance(block, dict):
                continue
            if block.get("type") == "tool_use" and block.get("name") == "Bash":
                cmd = block["input"].get("command", "")
                if any(k in cmd for k in ("git merge", "git tag", "checkout develop", "switch develop", "git push")):
                    calls[block["id"]] = cmd
                    print(f"$ {cmd}")
            if block.get("type") == "tool_result" and block.get("tool_use_id") in calls:
                out = block.get("content")
                text = out if isinstance(out, str) else " ".join(c.get("text", "") for c in out or [])
                print(f"  -> {'ERROR ' if block.get('is_error') else ''}{text.strip()[:300]}")
