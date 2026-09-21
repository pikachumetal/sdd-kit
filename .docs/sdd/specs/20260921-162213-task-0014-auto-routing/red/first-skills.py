"""Lista, en orden, las skills que el sujeto invoca en un stream-json de Claude Code."""
import json
import sys

for line in open(sys.argv[1], encoding="utf-8"):
    try:
        event = json.loads(line)
    except json.JSONDecodeError:
        continue
    if event.get("type") != "assistant":
        continue
    for block in event["message"].get("content", []):
        if block.get("type") == "tool_use" and block.get("name") == "Skill":
            print(block["input"].get("skill"))
