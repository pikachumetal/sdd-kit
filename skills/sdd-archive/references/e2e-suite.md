# The E2E suite of the close

Used by the validation and integrated-base steps of `sdd-archive` when `operations.md` §Testing declares the E2E fields («Flujos core», «Presupuesto E2E», «Entorno de la suite»…). Every pass that counts for the close follows these steps in order; a pass that skipped one doesn't count. The walkthrough's 4.1 records what each step gave.

## 1. The environment, raised by this session

Before each pass, run the command of «Entorno de la suite» yourself, in this session, and its check, and see it green. A server that was already listening doesn't count, even if it answers: it may serve another worktree's code or the data of another pass. With `no aplica`, there's nothing to raise, and the 4.1 says so. If the suite's port is held by a process you didn't start and the command doesn't free it, stop and ask: its port is the project's, and another one would check the wrong server. Stop what you raised afterwards, by its PID or its port (`sdd-implement`, «Processes you start»).

## 2. The gate as declared

Run the closing gate of `operations.md` literally: no environment variable, option or switch it doesn't declare (a lighter trace, fewer CPUs, an analyzer off, a shortcut the README offers). A suite that only passes with a switch hides races the gate exists to catch. The 4.1 records the configuration it passed with: `la del gate`, or what you added and why.

## 3. A connection failure is the environment first

`ECONNREFUSED`, `ERR_CONNECTION_REFUSED` or a 502 from a proxy say the server isn't there, not that the code is wrong. Raise the environment again, check it, and repeat the pass before you open the code or contrast with the base. If it persists with the environment checked, or the red is another one, follow «A red suite» of [merge-recipe.md](merge-recipe.md).

## 4. The budget

Compare the E2E suite's duration with «Presupuesto E2E» and write both in the 4.1: `E2E: <duración> de <Presupuesto E2E>`. Over the budget, open a debt row with the duration and the budget, also when it was already over without the branch: nobody else measures it. With `pendiente`, write the measured duration; the template's 10-minute threshold still applies.

## 5. A repeated batch

Before repeating tests (`--repeat-each`, a loop of passes), your message carries this line, and only then you launch:

```text
Tanda: <tests nuevos o cambiados> ×<N> + <los demás de esos ficheros> ×1 = <ejecuciones> ejecuciones · ~<minutos> (<duración media> × <ejecuciones> ÷ <workers>)
```

- **Scope**: «the branch» is `git diff <merge.into>...HEAD`, not `main`. Its added or changed tests ×N; the other tests of the files it touches ×1; nothing from the files it doesn't touch, even when asked for «the specs it touches».
- **Estimate**: the average duration comes from the last pass's times. The 4.1 repeats the line with the real minutes: an estimate written after the batch isn't one.
- While it runs, don't edit what it executes (`src/`, the tests, the runner's config): a change halfway makes the batch measure two codes.

## Common Rationalizations

| Excuse | Reality |
| --- | --- |
| "The server answers, so the environment is up" | It answers with someone else's code or data. Raise it yourself, then check. |
| "Three reds after the change: let me read the code" | With a server you didn't raise, the code is the last suspect. Raise the environment and pass again first. |
| "The README trick is faster and gives the same result" | Same on this machine, today. The gate is what the project declared; a switch hides the race. |
| "It was already over the budget before this branch" | Then the debt row is overdue. Open it. |
| "The branch touches both spec files, so I repeat both ×3" | Repeat what the branch changed against `merge.into` ×N and the rest ×1, after the `Tanda:` line. |
