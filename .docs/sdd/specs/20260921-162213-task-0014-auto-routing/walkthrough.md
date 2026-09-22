---
id: 20260921-162213-task-0014-auto-routing
task: 0014
title: Walkthrough — Auto-enrutado del kit frente a superpowers
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Auto-enrutado del kit frente a superpowers

## 1. Cambios realizados

- **`hooks/`, nuevo** (`e514aa2`, `c544031`, `896dd50`):
  - `hooks.json` declara un `SessionStart` (`startup|clear|compact`, `shell: bash`) que ejecuta `hooks/session-start` por ruta, sin `bash` delante.
  - `session-start` (bash, LF, 100755) no escribe nada sin `.docs/sdd/` bajo `CLAUDE_PROJECT_DIR`. Si existe, emite solo `hookSpecificOutput.additionalContext` con el contenido de `router.md`.
  - `router.md` (100 palabras) va redactado como instrucción del proyecto y prevalece sobre la regla de superpowers de invocar `brainstorming` primero. Manda trabajo a `sdd-start-task`, bug a `sdd-start-patch`, pregunta a `sdd-consult`, y deja la edición trivial en directo.
  - `.gitattributes` gana `hooks/* text eol=lf`.
- **Skills** (`3e4d94e`):
  - `description` de `sdd-start-task` con frases naturales. Su exclusión pasa de «cambios describibles en una frase» a «ediciones sin comportamiento (un typo, un renombrado, un formato)», y añade «preguntas → `sdd-consult`».
  - `sdd-start-patch` gana «hay un bug…, arréglalo».
  - `sdd-consult` gana «¿cómo funciona…?» y «¿se puede…?».
  - `argument-hint` en las tres. `user-invocable: false` en `sdd-templates`.
- **Tests**:
  - `tests/Hook.Tests.ps1`, con 8 casos, escrito por el hilo y movido por el implementador. Los casos de conducta ejecutan el `command` real de `hooks.json` con `bash -c`.
  - `tests/Skills.Tests.ps1` gana 4 casos de frontmatter.
- **Evidencia**: `tests/auto-routing-red.md` y `tests/auto-routing-green.md`. Los moldes, los lanzadores y los streams de los 42 sujetos lanzados con `subject.sh` están en `red/` de esta carpeta; las tres comprobaciones desde PowerShell no se guardaron.
- **README** (`0584d31`): sección «Enrutado automático», con el límite del canal `npx`.
- **Capacidad nueva** [`routing`](../../capabilities/routing.md), fusionada en este cierre desde el delta.
- **Roadmap** (`034aa60`): fila de deuda sobre Codex.
- **Integración con `develop`, dos veces**:
  - `c7e31c5`, antes de escribir los docs de cierre: `develop` había avanzado con un commit que solo tocaba `roadmap.md`.
  - Justo antes del merge, `develop` ya traía la 0008 (perfiles de control). Chocaron `changelog.md`, `roadmap.md` y `estimation-log.md`, y `sdd-start-task/SKILL.md` se fusionó solo: la `description` de la 0014 en el frontmatter y los pasos de la 0008 en el cuerpo. Tras integrar se repitió la suite, y este cierre sigue la versión de `sdd-end-task` y de la plantilla que trae la 0008.

## 2. Tiempo: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3,0h
- Esfuerzo real: 3,2h de implementación, aproximado por las marcas de los commits en hora local. Son dos tramos: 20:25 → 22:20 del día 21 (Tasks 1–5) y 07:55 → 09:15 del día 22 (revisión final, validación y los dos fixes del hook). A eso se suman 2,1h de spec y plan (18:22 → 20:25, incluida la campaña RED de 14 sujetos).
- Desviación: +0,2h (+7%) sobre la implementación
- Causa de la desviación: dentro del umbral. El tramo del día 22 no estaba en el plan: una pregunta del dev-lead sobre `run-hook.cmd` destapó el `bash` redundante, y su arreglo abrió la regresión del bit de ejecución.
- Review de spec: no · hallazgos 0, aceptados 0
- Coste de subagentes: ≈ 355k tokens en 4 despachos y una re-revisión:
  - implementador de la Task 2: 67k;
  - revisor de la Task 2: 66k;
  - revisor final de rama: 136k;
  - revisor del fix en línea: 75k;
  - re-revisión del mismo agente, reanudado: ≈ 10k.
- Coste de los sujetos headless: ≈ 10,3 $ en 45 sujetos Sonnet:
  - RED: 3,81 $ (14 sujetos);
  - controles RED: 0,61 $ (4);
  - GREEN: 3,59 $ (17);
  - repetición tras el hardening: 1,76 $ (7);
  - tres comprobaciones del hook desde PowerShell: ≈ 0,5 $.

## 3. Desviaciones del plan

- **Test del hook corregido antes de despachar** (Task 2, Step 2). La primera versión daba un verde falso: `Get-Content` sin `-ErrorAction Stop` dejaba el recuento de palabras en 0. Además daba dos rojos de ejecución, porque `bash` del PATH es el lanzador de WSL. Se corrigió en el test y en el plan; la spec no cambió.
- **Paquete de la revisión final sin `red/`**. El que genera `review-package` pesaba 4,1 MB por los streams de los sujetos. Se regeneró sobre código y docs (72 KB); la evidencia llega resumida en `tests/auto-routing-*.md`.
- **Hardening después de la revisión final** (`c544031`). El dev-lead preguntó por qué no se copiaba `run-hook.cmd` de superpowers. Al revisarlo apareció un `bash` literal en el `command`, además de `"shell": "bash"`: era una segunda resolución por PATH, que en esta máquina es WSL. No fallaba, pero dependía de un comportamiento no documentado de Claude Code. El dev-lead eligió quitarlo en vez de copiar el wrapper.
- **La regresión que introdujo ese fix** (`896dd50`). Sin `bash` delante, el script se ejecuta por ruta, y estaba en 100644. En Linux y macOS eso da «Permission denied»; en Windows no se ve, porque Git Bash ignora el bit. La cazó el revisor del fix en línea (paso 9), que la marcó Critical. Se corrigió con `chmod +x` y con un test que exige 100755. Además, los tests de conducta, que invocaban `bash script` (la ruta vieja), pasan a ejecutar el comando real.
- **Task 6 (`using-sdd`) no se ejecutó**: el GREEN cumplió la decisión 4 de la spec.

### Decisiones tomadas sin el dev-lead

- El test RED del hook se movió con `git mv` desde un fichero ya commiteado, cuando el plan lo suponía sin seguir — el contenido del test no cambia — coste si está mal: ninguno.
- El paquete de la revisión final se regeneró sin `red/` — el de `review-package` pesaba 4,1 MB por los streams y no cabía con provecho en el contexto del revisor — coste si está mal: el revisor final no vio los streams, solo su resumen en `tests/auto-routing-*.md`.
- Los conflictos de la integración con la 0008 (`changelog.md`, `roadmap.md`) se resolvieron conservando las dos entradas, ordenadas por id, y `estimation-log.md` se regeneró con el script — coste si está mal: una entrada fuera de orden, sin pérdida.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: 227 verdes, 0 fallos, 6 saltados (los previos), después de integrar `develop` y del último fix.
- `claude plugin validate --strict skills`: acepta `argument-hint` y `user-invocable`.

### 4.2 Smoke / tests

- **Validado por el dev-lead: 2026-09-22.**
  - Qué probó: en un proyecto de prueba con el molde de la campaña (`.docs/sdd/` completo, código de reservas, git en `develop`), cargando el plugin desde este worktree con `--plugin-dir`, escribió «es un cambio pequeño: añade un campo 'notas' a las reservas, hazlo rápido».
  - Resultado: la respuesta propuso arrancar con `sdd-kit:sdd-start-task` en modo lite, sin `brainstorming`. Preguntó antes de actuar porque el texto llegó pegado (`<pasted_content>`), que es la conducta correcta del harness.
  - Sus palabras: «si, esa prueba funciono, lo que no se lanzo sino que me pregunto si usaba start-task» y «si, validada, cierra la tarea».
  - Límites de esa validación: la hizo en Windows y antes de `896dd50`, que no cambia nada en Windows. No probó «let's build», el control de edición trivial ni Linux o macOS.
- **Verificado por el agente**:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED, seis peticiones cotidianas | 6/6 con el kit primero, ya sin cambios |
| 2 | RED, «let's build» y «cambio pequeño, hazlo rápido», ×3 cada una | 3/6 con `brainstorming` primero; en 2 no se llegó al kit |
| 3 | RED, controles de edición trivial (typo ×2, renombrado ×2) | 0/4 invocan alguna skill |
| 4 | GREEN, h1 y h4 ×3 | 6/6 con `sdd-start-task` primero |
| 5 | GREEN, seis cotidianas y cuatro controles | idénticos al RED |
| 6 | GREEN, `sdd-templates` con `user-invocable: false` | se invoca por `Skill` sin error |
| 7 | Router en el `hook_response` | exactamente una vez en 17/17 streams |
| 8 | Hook desde PowerShell real, antes y después de `c544031` | `exit_code 0` y router presente |
| 9 | Repetición de h1, h4 y t1 tras `c544031` | 7/7 idénticos |
| 10 | Frase h4 desde PowerShell en el molde del smoke | `sdd-kit:sdd-start-task` |
| 11 | Sesión de prueba del dev-lead con `.docs/sdd/` vacía (leída del transcript) | router inyectado; el modelo comprobó con `Glob`, no vio ficheros y lo descartó: falso negativo del montaje, no del hook |
| 12 | Hook en Linux o macOS | no probado: solo el test del modo 100755 |

### 4.3 Residuales / deuda generada

- **Codex**: el hook no llega, y en Codex superpowers gana con la `description` de su skill. Queda en la tabla de deuda del roadmap, con la propuesta `using-sdd` más `.codex-plugin` sin hooks y el RED en Codex.
- **`resume` fuera del matcher**, como en superpowers. No se midió una sesión reanudada.
- **Minors diferidos de la Task 2**, triados por la revisión final sin bloquear:
  - no hay test de escape de comillas, tabulador y barra (el router real no los contiene);
  - `New-ProjectDir` deja carpetas temporales;
  - si faltara `router.md`, el contexto sale vacío con exit 0.
- **Ejecución del hook en Linux y macOS**: sin medir en vivo.

## 5. Aprendizajes

- Un hook se compite con otro hook, y se gana por contenido, no por orden. → `tech-stack.md`, «Aprendizajes por task», 0014 (1).
- Las peticiones corrientes escondían el fallo; solo aparecieron con casos duros. → `tech-stack.md`, 0014 (2).
- El smoke manual de un hook de contexto necesita un proyecto de verdad y la frase escrita, no pegada. → `tech-stack.md`, 0014 (3).
- Un fix en línea después de la revisión final se revisa aparte: el de este cierre traía una regresión Critical. → `tech-stack.md`, 0014 (4).
- `bash` del PATH es WSL en la máquina del dev-lead, y un hook no antepone `bash`. → `tech-stack.md`, trampas de hooks (5).
- Canales a los que llega el hook y a los que no. → `tech-stack.md`, «Distribución».
- Directorio `hooks/` y campos de frontmatter en uso. → `architecture.md`.
- Comportamiento del enrutado. → capacidad nueva `capabilities/routing.md`.
- **Revisión de skills (paso 5)**:
  - `.claude/skills/` no existe en este repo.
  - Las skills del kit se revisaron: la frase «cambio en una frase» de `overrides-superpowers.md` y la tabla de `sdd-start-task` conviven con la nueva `description`. Los controles del GREEN (typo y renombrado directos) muestran que no chocan.
  - No se editan: sin fallo medido no hay guidance (Art. I).

## 6. Adendas

_Ninguna._
