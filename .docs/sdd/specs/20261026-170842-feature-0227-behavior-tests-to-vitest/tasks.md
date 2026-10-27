---
id: 20261026-170842-feature-0227-behavior-tests-to-vitest
title: Tasks — Conducta a Vitest: el lanzador de sujetos, los hooks y git
spec: ./spec.md
plan: ./plan.md
created: 2026-10-26
---

# Tasks — Conducta a Vitest: el lanzador de sujetos, los hooks y git (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0227-behavior-tests-to-vitest`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Base: bash, git y los ports pequeños | done | c12fa5e | |
| 2 | Hook de sesión del repo y Start-KitSession | done | b7813d1 | |
| 3 | Privacidad de las salidas de sujetos | done | 7c911cf, 3bc53a2 | el segundo, `/.docs/**` en `testInputs` |
| 4 | Lanzador de sujetos y baterías | done | c4659b1 | `kit:test-headless`: 81/81 en 262,6 s (Pester: 81 en 920 s) |
| 5 | Documentos y helpers | done | 021c800 | helpers `.ps1` borrados en el merge con `develop`: la 0226 ya cerró |

## Verificación por task

- [x] Task 1 — `pnpm --dir cli exec vitest run test/kit test/merge/histogram test/merge/sync` → 49/49
- [x] Task 2 — `pnpm --dir cli exec vitest run test/kit/kit-session-source` → 25/25; cotejo: faltan los 3 retirados por la spec
- [x] Task 3 — `vitest run test/kit/subject-output-privacy` → 22/22; el pre-commit para una fuga staged (2 de 2)
- [x] Task 4 — `moon run kit:test-headless --force` → 81/81, 262,6 s
- [x] Task 5 — `moon run kit:test-fast kit:roadmap` → verde

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 021c800
Pasada de fix: juntada en el cierre, 5 hallazgos RED→GREEN (más 8 sin test que los reproduzca), suite test/kit 172/172
Re-revisión: 021c800..juntada en el cierre, sdd-kit:effort-high + opus, 13 de 13 resueltos; 3 Minor nuevos adjudicados (rulings)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| `merge/histogram.slow.test.ts` y `merge/sync.slow.test.ts` llamaban a git sin `env` | anteriores a la regla en `cli/test/` | dentro del alcance (spec, decisión 8) | c12fa5e |

## Rulings

- Task 1: Ruling: cleanGitEnv propio en cli/test/kit/process.ts (quita solo las 5 variables, como Clear-GitEnv.ps1) en vez del cleanEnv de ids/merge helpers, que no se exporta y quita todo GIT_* (también GIT_CEILING_DIRECTORIES de temp-setup) — coste si falla: un helper más
- Task 1: Ruling: los 11 It de Clear-GitEnv.Tests.ps1 no conservan su nombre: 5 probaban el helper .ps1 (sustituidos por «git() de cli/src/git no hereda las variables de git») y 6 la regla sobre tests/*.Tests.ps1 (ahora sobre cli/test/**/*.ts, con sus casos «señala… sin env», «acepta… con env», «no señala… texto ni comentario», «cada cli/test/**/*.ts… pasa un env») — spec decisión 8 — coste si falla: renombrar
- Task 1: Ruling: la regla de git ya no exime las lecturas de la raíz del kit (el Pester eximía git -C $KitRoot): toda llamada directa pasa env; más estricta, sin incumplimientos salvo los dos arreglados — coste si falla: un env de más en una lectura
- Task 1: Ruling: la línea base del gate se lanzó en segundo plano y, al esperar el cerrojo de la medida de kit:test-headless, corre sobre el árbol con la Task 1 ya hecha: no es una base limpia de la rama; la base limpia es develop en verde al cerrar la 0223 — coste si falla: un rojo heredado que se atribuye a esta rama
- Task 3: Ruling: stagedEvidence falla si git falla (antes, un error de git se leía como «sin evidencia» y el control pasaba: así entró una fuga en el primer intento de RED, que se deshizo) — coste si falla: un rojo por un git que falla a ratos, que se repite
- Task 3: Ruling: testInputs gana /.docs/** (en lugar de /.docs/sdd/capabilities/**): con solo una salida de sujeto staged, cli:test salía de la caché y la fuga entraba (en un RED que se deshizo); con /.docs/**, bloqueado. Spec decisión 13 actualizada; es el mismo valor que pone la 0226 — coste si falla: cli:test corre en cambios solo de .docs
- Task 4: Ruling: runCampaign manda la salida de bash a un fichero, no a una tubería: con tubería faltaban a ratos líneas finales de run.sh (2 de 3 pasadas de run-dry, un echo incondicional perdido; el ticket de la 0223 vio «pwd: write error: Bad file descriptor» en el mismo lanzador); con fichero, 3 de 3 — coste si falla: un rojo intermitente que vuelve
- Task 5: Ruling: tech-stack.md:8 conserva «o con -Tag 'Slow' (Pester)»: los Pester de la 0226 siguen usándolo hasta que cierre, y quitarlo aquí describiría un estado que no existe aún; solo sale la frase de FastSuiteBudget (spec, decisión 16, pedía las dos) — coste si falla: la 0226 lo quita
- Task 4: Ruling: el ledger de la Task 4 dice ..021c800 porque sdd task done corrió tras el commit de la Task 5 (la verificación esperaba el cerrojo); el commit de la Task 4 es c4659b1 — coste si falla: ninguno, es el registro
- Final: Ruling: Spec Important 1 (Task 4 sin línea complete ni medida) — ya resuelto cuando volvió el eje: Task 4 complete con moon run kit:test-headless 81/81, 262,6 s frente a 920 s de Pester (baseline-headless.log), irá al walkthrough — coste si falla: ninguno
- Final: Ruling: (Código, Minor 2 / Spec, Minor 7) cleanGitEnv no se fusiona con isolatedEnv ni con el cleanEnv de merge/ids: exportar isolatedEnv toca cli/src (fuera del plan) y el de merge/ids quita todo GIT_* con otro criterio; la copia de GIT_ENV_NAMES en git-env.slow.test.ts es un oráculo independiente — coste si falla: una variable nueva de git que se añade en un sitio y no en otro
- Final: Ruling: (Código, Minor 6) el dato 'tests/SubjectOutputPrivacy.Tests.ps1' del test de selectEvidencePath se conserva: es el dato literal del Pester y sigue valiendo como ruta que no es evidencia — coste si falla: ninguno
- Final: Ruling: (Código, Minor 7) stopPort y kit-session-source lanzan pwsh: van a la fila 0228 — coste si falla: la 0228 los olvida
- Final: Ruling: (Código, Declined) tests anteriores de ids/ y merge/ que mutan process.env: fuera del diff; la restricción «ningún test muta process.env» es de los tests nuevos — coste si falla: ninguno nuevo
- Final: Ruling: (Spec, Declined) fuera de Windows os.tmpdir() lee TMPDIR y RUNS_DIR caería fuera de .temp/: el repo es solo Windows, como con Pester — coste si falla: los tests del lanzador no corren en Linux
- Final: Ruling: (re-revisión, Minor) battery.slow.test.ts:76 quedó «const verdict =(table…» sin espacio tras el =: TypeScript válido, sin efecto; no hay segunda pasada de fix — coste si falla: un espacio que arregla el siguiente que toque el fichero
- Final: Ruling: (re-revisión, Minor) el comentario de usingSddBattery (battery.slow.test.ts:65) resume la fixture que monta: se queda — coste si falla: un comentario de más
- Final: Ruling: (re-revisión, Minor) el marcado de GIT_CALL come un salto de línea si la llamada se parte tras «(», y las líneas siguientes de ese fichero salen desplazadas en uno; hoy no hay ningún caso en cli/test — coste si falla: un número de línea mal en el mensaje de la regla
