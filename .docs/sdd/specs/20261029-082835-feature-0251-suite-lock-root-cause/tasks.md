# Tasks — feature 0251

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `sdd merge --verify` sin el cerrojo de merge | ✅ | `14825b47` |
| 2 — `cli:test` con la mitad de los workers y `mergiraf.test.ts` a lento | ✅ | `7ffcf529` |
| 3 — La medida de la 0240 y el cerrojo de suites | 🔄 | |

## Línea base

Worktree desanclado en `a215b9a9` (commit de apertura). Gate sin `--affected`, con el cerrojo: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test` → verde en 86 s (`cli:test` 1625/1625 en 12,60 s; `kit:test-headless` 227/227 en 81,07 s). `npx vitest run test/merge --test-timeout 120000` → 188/189 en 249 s: `cleanup.slow.test.ts` › «un id en dos secciones del roadmap lleva el aviso de roadmap check» con `error: unable to write file .git/objects/df/967b96a579e45a18b8251732d16804b2e56a55: No such file or directory`, a la vez que los RED de la Task 1; en la verificación de la Task 1, en verde (201/201).

## Medida (Task 3)

Dos worktrees desanclados en `7ffcf529` (`measure-0251-a` y `-b`), con `pnpm install --frozen-lockfile` y `moon.yml` sin `sdd lock run` en `kit:test-headless`; sin cerrojo de suites cogido; abierto además `feature-0236-project-gate-levels`. Gate sin `--affected`: `moon run kit:test-headless cli:typecheck cli:test`.

| Pasada | Resultado | Tests | Duración |
| --- | --- | --- | --- |
| a, a la vez que b (10:28:29–10:29:49) | verde | `cli:test` 1623/1623 (22,45 s) · `kit:test-headless` 227/227 (77,01 s) | 80,0 s |
| b, a la vez que a | verde | `cli:test` 1623/1623 (23,89 s) · `kit:test-headless` 227/227 (77,37 s) | 80,1 s |
| a, sola | rojo | `kit:test-headless` 226/227: `molds.test.ts` › «sdd-propose construye en seco el molde reservas-remoto (id1)», `error: unable to migrate temporary objects` / `error: failed to push some refs to '…\red\id1-1\origin.git'` | 52,9 s |
| `molds.test.ts` solo, en a | verde | 98/98 | 41,85 s |
| a, sola, otra vez | verde | `cli:test` 1623/1623 (12,24 s) · `kit:test-headless` 227/227 (45,11 s) | 47,5 s |

Veredicto: en verde los dos y por debajo de 5 min → `kit:test-headless`, `cli:test-slow` y el gate de cierre dejan el `sdd lock run`. El rojo de la pasada sola es un recurso de la máquina (los objetos temporales de git), no se repite y no cuenta para la medida, que es la pasada en paralelo.
