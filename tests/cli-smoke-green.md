# Humo de la 0143 — las skills editadas ejecutan la CLI `sdd`

Art. I: cada skill editada por la feature 0143 (sus llamadas pasan de `pwsh … .ps1` a `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo>`) lleva un escenario de humo, n = 1, Sonnet. Batería y sujeto en [`humo/`](../.docs/sdd/specs/20261007-153554-feature-0143-node-cli/humo/), salida de cada sujeto en `humo/out/`. Kit: copia de `666fd772` cargada con `--plugin-dir`, junto a superpowers 6.4.2, sin la configuración del dev-lead. Molde: `salas` en modo `sequence`.

Pasa si la primera skill es la esperada y el stream muestra la llamada a `cli/bin/sdd.js` con la ruta del plugin sustituida (ningún `${CLAUDE_PLUGIN_ROOT}` literal) y el verbo del paso.

| Id | Skill | Llamada vista | Resultado | Coste |
| --- | --- | --- | --- | --- |
| h1 | `sdd-start-feature` | `node "<kit>/cli/bin/sdd.js" capability index --path .docs/sdd` (paso 1) | verde | 0,18 $ |
| h2 | `sdd-consult` | `… capability index --path .docs/sdd` → `Sin capacidades` | verde | 0,12 $ |
| h3 | `sdd-start-patch` | `… id next --project-root … --reserve` | verde | 0,14 $ |
| h4 | `sdd-roadmap` | `… roadmap check --path .docs/sdd` → sale con 1 por el roadmap viejo del molde, que la CLI detecta | verde | 0,11 $ |
| h5 | `sdd-end-release` | `… roadmap check --path .docs/sdd` → sale con 1, ídem | verde | 0,11 $ |
| h6 | `sdd-end-feature` | `… estimation log --root "<run>/repo"` → `Generado … con 1 filas.` | verde | 0,12 $ |
| h7 | `sdd-end-patch` | sin `capabilities/` en el molde, la skill salta la comprobación por su predicado (`h7-0-sin-capacidades`); con `bookings.md` en el molde, `… capability check …` → `Capacidades válidas: 1`, exit 0 | verde | 0,13 + 0,16 $ |
| h8 | `sdd-init-greenfield` | `… estimation log --root "<run>/repo"` | verde | 0,12 $ |
| h9 | `sdd-init-brownfield` | `… roadmap check --path .docs/sdd` (verificación de v2.3.0) | verde | 0,15 $ |
| h10 | `sdd-templates` | `… --help`, y el sujeto da la orden `node "<ruta del kit>/cli/bin/sdd.js" --help` | verde | 0,11 $ |

10 de 10. Claude Code sustituyó `${CLAUDE_PLUGIN_ROOT}` en el texto de los `SKILL.md` en todos los escenarios (decisión 8 de la spec). Coste del humo: 1,46 $ (más 0,80 $ del primer intento fallido por un `subject.sh` mal escrito, sin sujetos lanzados: 0 $).

## Smoke del hook

Una sesión headless con la copia de `84d9a3b` por `--plugin-dir` (y superpowers), `--include-hook-events`, Haiku: dos `hook_response` con `exit_code` 0, `additionalContext` con `# using-sdd` y `systemMessage` «trae migraciones hasta la 2.3.2.». `${CLAUDE_PLUGIN_ROOT}` se sustituye en `args` de la forma exec. 0,003 $. Sin superpowers por `--plugin-dir`, el kit no carga (dependencia declarada).
