#!/usr/bin/env bash
# uso: subject.sh <n> <copia-del-kit>
SP="/c/Users/pikac/AppData/Local/Temp/claude/D--code--worktrees-sdd-kit-0031/90c5479d-0d8a-4a69-b5e0-a6ed5b5bbd13/scratchpad"
N=$1; KIT=$2; RUN="$SP/green/run-$N"
rm -rf "$RUN"; cp -r "$SP/green/molde" "$RUN"; cd "$RUN" || exit 1
case "$(pwd)" in */scratchpad/green/run-*) ;; *) echo "ABORT cwd"; exit 1;; esac
node "$SP/effort-proxy.mjs" "$RUN/requests.jsonl" > proxy.out 2>&1 &
PID=$!; sleep 1
ANTHROPIC_BASE_URL=http://127.0.0.1:8787 claude -p --model sonnet --effort high \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits --allowedTools "Bash(*)" "Agent" "Write" "Edit" --disallowedTools PowerShell SendMessage \
  --max-turns 25 --output-format stream-json --verbose \
  "Ejecuta la Task 1 de plan.md con superpowers:subagent-driven-development. Cuando vuelva el informe del implementador, para ahí: no despaches revisores ni sigas." < /dev/null > stream.jsonl 2>&1
kill $PID
