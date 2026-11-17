# executing-plans: `task-done` exits 1 silently and records nothing when the test command prints no output

> Borrador del patch 0110 para el repositorio de superpowers. Sin publicar: lo publica el dev-lead.

## Summary

`skills/executing-plans/scripts/task-done` aborts with exit status 1, without any message and without appending the `complete` line to the ledger, when the test command succeeds but writes nothing to stdout or stderr. Silent-on-success commands are common verification steps (`tsc --noEmit`, `dotnet format --verify-no-changes`, `eslint`, a plain `node:assert` script), so a task that passed is left unrecorded, and the caller gets no hint about why.

## Version

superpowers 6.4.2 (the same script ships in 6.3.0 and 6.4.1). Observed on Windows 11 with Git Bash; the cause is platform-independent.

## Reproduction

```bash
cd "$(mktemp -d)" && git init -q && git commit -q --allow-empty -m base
B=$(git rev-parse HEAD); echo "# plan" > plan.md
S=<superpowers>/skills/executing-plans/scripts/task-done

bash "$S" plan.md 1 "$B" -- true;     echo "rc=$?"   # rc=1, no output, no ledger line
bash "$S" plan.md 2 "$B" -- echo ok;  echo "rc=$?"   # rc=0, "ledger: Task 2: complete (...)"
```

## Cause

The script runs with `set -euo pipefail`, and after the test command succeeds it computes:

```bash
last=$(grep -v '^[[:space:]]*$' "$log" | tail -n 1)
```

With an empty log, `grep` selects no lines and exits 1. `pipefail` makes the pipeline fail, and `set -e` aborts the script at that assignment, after `tail -n 5 "$log"` printed nothing and before the ledger is written. The test command's exit status was 0, which the header comment promises to return.

## Suggested fix

Tolerate the empty log and record a placeholder:

```bash
last=$(grep -v '^[[:space:]]*$' "$log" | tail -n 1 || true)
[ -n "$last" ] || last="(no output)"
```

## Impact

In the field report that found it, the agent spent about three minutes diagnosing the silent exit and re-ran the command wrapped as `sh -c '<command> && echo ok'`. The worse outcome is an agent that does not check the exit status and treats the task as recorded: after a context compaction the ledger is the source of truth for which tasks are done.
