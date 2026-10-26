---
id: 20261026-165429-proposal-0225-retire-pester
proposal: 0225
title: Fuera Pester y PowerShell del repo
source: interview
created: 2026-10-26
---

# Propuesta — Fuera Pester y PowerShell del repo

## Por qué

El repo prueba el kit con dos pilas: Vitest para la CLI y 67 ficheros Pester (969 `It`, 1289 tests al expandir los casos) para las skills. De las aserciones Pester, 1139 líneas son `Should -Match` o `-BeLike` sobre frases literales de los `SKILL.md`: prueban que el texto no cambia, no que el agente se comporte, que es lo que prueban las baterías RED/GREEN (Art. I), y obligan a tocar el test en cada edición de skill. PowerShell trae además sus propios fallos de entorno (`fatal: stash failed` solo en pwsh, el `bash` de WSL, `pwsh.dll` a medio actualizar) y ata el repo a Windows. El dev-lead, 2026-10-26: «no podemos seguir con los tests de pester, tenemos que matar ya el powershell de este proyecto»; y sobre las frases: «se que no sirven de nada y testean FRASES».

## Reglas de negocio

- Las aserciones de frases se borran, no se portan: `tests/ControlProfiles.Tests.ps1` comprueba que `control-profiles.md` contiene una frase → el fichero se borra, y una edición de esa frase ya no toca ningún test.
- La anatomía pasa a Vitest: los topes de palabras de `tests/WordBudget.Tests.ps1` (kit 91328 con su margen de la fila B21) y el tope de ruta de `tests/PathLength.Tests.ps1` (140) siguen parando un commit: una skill que pasa de su tope → el pre-commit falla igual que hoy, ahora desde `cli/test/` o la carpeta de tests que decida la feature.
- La conducta pasa a Vitest: los ~12 ficheros que lanzan procesos (`HeadlessLauncher`, `SubjectOutputPrivacy`, `UpstreamWatch`, `Clear-GitEnv`, `Hook`, `DenyKillHook`, `KitSessionSource`…) conservan lo que prueban: `DRY_RUN=1 bash tests/headless/run.sh` con `RUNS_DIR` bajo `.temp/` → el test sigue comprobando que el ensayo no aborta.
- Fuera de los tests, el repo no tiene ningún `.ps1`: `./Start-KitSession.ps1 --model sonnet` → `node start-kit-session.mjs --model sonnet`, que pone `SDD_KIT_SESSION_ROOT` y `CLAUDE_CODE_TMPDIR` solo para el proceso hijo y lanza `claude --dangerously-skip-permissions --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir <repo>` con los argumentos extra (dev-lead, 2026-10-26: «usa la 1 si quieres»). El hook `SessionStart` del repo deja de llamar a `pwsh`.
- `moon.yml` y `.githooks/pre-commit` no llaman a `pwsh`: `moon run kit:test-fast` corre sin PowerShell instalado.
- La regla de la ADR 0011 «los Pester que quedan (frases y anatomía de skills) siguen hasta la 0152» se sustituye con una ADR nueva; la 0011 no se edita.
- Va justo detrás de la 0223, que cambia `moon.yml` y `kit:test`, y por delante de las filas de la release 3.0.0 (dev-lead, 2026-10-26: «La siguiente, tras 0223»). La 0216 y la 0224 van tras la 0227, para no escribir Pester que haya que portar.

## Capacidades que toca

- Ninguna: es la forma de probar este repo, no el comportamiento del kit en los proyectos. Lo que cambia vive en `tech-stack.md` («Cómo se testean las skills», «Gate de cierre»), `architecture.md` (estructura del repo y evidencia de test) y el `CLAUDE.md` del repo (arranque de sesión).

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0226 | Frases fuera y anatomía a Vitest, con la ADR que sustituye la regla de la 0011 | 0223 |
| 2 | 0227 | Conducta a Vitest: el lanzador de sujetos, los hooks y git | 0223 |
| 3 | 0228 | Sin PowerShell en el repo: `start-kit-session.mjs`, el hook de sesión, `moon.yml` y el pre-commit | 0226, 0227 |

## Acta

No aplica: entrevista.

## Enmiendas
