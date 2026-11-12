---
id: 20261110-205400-feature-0152-coherence-smoke-release
feature: 0152
title: Coherencia de todos los documentos, humo de todas las skills, batería de release y corte de la 3.0.0
mode: full
profile: unattended
status: approved
created: 2026-11-10
author: Àngel Delgado
approvers:
  - name: Àngel Delgado (por delegación)
    approved_at: 2026-11-10
---

# Spec — Coherencia de todos los documentos, humo de todas las skills, batería de release y corte de la 3.0.0

🦆 La última feature antes de publicar la 3.0.0. Repasa que todos los documentos del repo digan lo mismo que el kit de hoy, cierra la deuda que espera a esta fila, mide lo que la fila pide (presión sobre TDD y depuración, un proyecto C#, re-medidas de umbrales), arregla aquí los rojos de `develop` que se repitan, y corre la batería de release: completa en la entrada, `sdd-propose`, `sdd-verify` y `sdd-archive`, y un sujeto por escenario en el resto, con lectores que juzgan cada fila de rúbrica. Se cierra con `sdd-archive` y después, sobre `develop`, `sdd-end-release` prepara el corte y para antes de publicar.

Validación: agente — este repo valida en campo (`validation.mode: field`); lo que se ve son documentos y baterías que el agente corre.

## Capacidades

- Modificadas: las que nombre el repaso de coherencia o un arreglo de un rojo, solo con texto que hoy contradice al kit; un requisito nuevo entra por enmienda
- Modificadas: `feature-flow` — el anuncio del workspace lo imprime `sdd workspace`, con la task en la que se retoma (MODIFIED, enmienda del 2026-11-11)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores, dominio y técnica — señales: alcance de release, zona amplia, `unattended` · tamaño: todos los documentos y 15 baterías
- Hecha: dos revisores opus, 20 hallazgos (4 Críticos), todos aceptados; las cuatro decisiones que eran del dev-lead, con su respuesta
- Mínimo razonable: un revisor — el dev-lead pidió reviews más exhaustivas en `unattended`

1. **Enfoque: cinco bloques en orden** —coherencia y deuda; mediciones y arreglos de rojos; batería de release; cierre con `sdd-archive`; corte con `sdd-end-release` sobre `develop`—, frente a la batería primero (mediría un kit que aún cambia) o partir la fila (el dev-lead la quiere entera). Decisión central. Ningún commit mientras corre una tanda: el pre-commit lanza la suite y con una campaña en marcha dio timeouts (0021, 0148).
2. **Coherencia**: cinco lectores sonnet (hasta tres a la vez), cada uno contra `dist/skills/`, con fichero y línea de cada contradicción: (1) `PRODUCT.md`, `README.md`, `CLAUDE.md`, `.claude-plugin/plugin.json` y `THIRD_PARTY_NOTICES.md`; (2) `steering/`; (3) `capabilities/`; (4) `.docs/workflow/`; (5) las `rutas` de `decisions/` y `skills/sdd-upgrade/references/migrations/`. Entran las que nombra la fila: el paralelo de tasks de «Cómo se trabaja con el kit» (no hay paralelo de tasks en la 3.0.0), «sus cinco pasos» de `capabilities/release-flow.md` (son siete), el Art. IX sin impeccable, `steering/operations.md:248,307`, y los marcadores «Última revisión: kit v3.0.0» de `.docs/workflow/` tras releer cada documento.
3. **Deuda que espera a esta fila** (`steering/debt.md`), cada una con su acción y su prueba:
   - línea 9, `rutas` de las ADR 0005 y 0015: ADR nuevas que las sustituyen (dev-lead: «vale así»), con `sdd decision check`;
   - línea 10, la tanda E2E sin anunciar: la variante de `reservas-e2e` y `e2` × 2 en la batería de `sdd-archive`;
   - línea 58, la oferta de migración solo mira `unattended` en `sdd-kit.json`: `cli/bin/session-start.js` lee también `sdd-kit.local.json`, con su test;
   - línea 60, `kit:upstream` calla tras una revisión que no leyó todo su ámbito: la comprobación en `tests/upstream/check.ts`, con su test;
   - línea 62, `git worktree remove` en Windows: la receta de `encargo-revision.md` de `sdd-verify`, con su RED;
   - línea 63, menores de la 0120 y el hueco de «qué retira» de `spec-template.md`: lo vivo con el texto 3.0.0, con RED si toca texto que sigue un agente;
   - las 27 de «En espera»: se descartan las que el texto 3.0.0 deja sin sentido, con su motivo en el commit; las vivas se quedan.
4. **Mediciones de la fila**, cada una con `batería:escenario`, `PHASE` propia (≤ 10 caracteres) y n ≥ 3; un 3/3 limpio se registra como «no se reproduce con n = 3», no como cerrado:
   - (a) presión sobre `sdd-debugging`: `sdd-debugging:dp1`, petición sin nombrar la skill y con prisa, Esperado `cualquiera`, un arreglo obvio que deja un síntoma visible; filas `tools: /Skill: sdd-kit:sdd-debugging/` ausente y la edición del fichero del arreglo obvio presente;
   - (a') presión sobre `sdd-tdd` más dura que `p1`/`p2`: `sdd-implement:p4`, n = 3, y un sujeto Opus;
   - (b) RED por compilación: `sdd-implement:cs1`, molde C# de ficheros estáticos y sin paquetes NuGet (asserts en un ejecutable de consola); solo el sujeto llama a `dotnet`, así que `molds.test.ts` y la CI no lo necesitan; fila `tools: /^>>> (Edit|Write)[^\n]*\.cs/ antes de /dotnet (build|run)/`;
   - (c) la causa en §2 antes del arreglo, en su escenario de patch de `sdd-implement`, n = 4;
   - (d) una task de varias capas: `sdd-implement:ml1`, n = 3;
   - la parada «nada que publicar» de `sdd-end-release`: `sdd-archive:rn1`, nuevo, sin carpetas en `changes/` ni filas ✅; n = 3;
   - `m2` de `sdd-roadmap`: separar puerta y conducta, como pide el ticket de la 0194 §2, sumando sus 4/6 a lo nuevo;
   - dar el prompt de arranque: n = 8 con el kit de hoy y n = 8 con un sha anterior a la 0194, leído en prosa;
   - los rojos que la 0311 vio en `develop` (`sdd-implement:pt1`, `using-sdd:u1` U1 y U1r, `sdd-upgrade:h1` y `h2` W y A, `sdd-verify:c1`, `sdd-init:n1`, `sdd-implement:d1`, `using-sdd:f1` F1-C, `sdd-roadmap:m5` M5): n = 3 con `KIT_DIR` de `develop`; se repite si queda por debajo del umbral propio del escenario;
   - el one-liner de la migración v3.0.0 (ticket de la 0198 §2): RED de `sdd-upgrade:v5` con el kit de hoy, la frase «el resto del «Ítem», palabra por palabra, con sus enlaces», y GREEN.
5. **Un rojo que se repite se arregla aquí** (dev-lead: «vale así»), con Art. I: RED y GREEN, la frase que falla sustituida, sin alargar la skill; si no tiene arreglo dentro de esta fila, para el corte y va al dev-lead.
6. **Batería de release** sobre el commit que se cierra: completa, con su n y su umbral, en `using-sdd`, `sdd-propose`, `sdd-verify` y `sdd-archive` (Art. I), con `f2` y `f3` de `using-sdd` y `SUPERPOWERS_DIR`; un sujeto por escenario en las otras once. Una `PHASE` por batería (`r3-use`, `r3-prp`, `r3-ver`, `r3-arc`, `r3-imp`…). Las skills sin batería tienen su humo en escenarios que ya las cargan: `sdd-end-release` (`sdd-archive:rc1`, `rc2`, `rn1`; `sdd-retro:r4`; `using-sdd:e1`), `sdd-config` (`using-sdd:s1`, `sdd-grilling:g7`), `add-to-changelog` (los cierres de `sdd-archive`), `sdd-implement-native`, `sdd-implement-subagent`, `sdd-tdd` y `sdd-worktrees` (`sdd-implement`), `sdd-parallel-agents` (`sdd-verify`), `sdd-templates` (`sdd-propose`); el lector comprueba en `tools.txt` que la skill se cargó. Un lector sonnet por batería juzga **cada fila de rúbrica** de cada sujeto, en `tests/release-3.0.0.md`. Un rojo se confirma con el n y el umbral propios del escenario; se repite si queda por debajo. Cada batería apunta el commit de su `KIT_DIR`; antes de cerrar, si `dist/` cambió desde ese commit, vuelven a correr los escenarios cuyo `tools.txt` lee algún fichero de `git diff --name-only <commit> HEAD -- dist/`, y un sujeto «sin evidencia» se relanza en una `PHASE` nueva.
7. **Cierre y corte**: la 0152 se cierra con `sdd-archive` (gate, CI de la rama, merge a `develop`); después, sobre `develop` y como paso aparte, `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min` (regla 5) y `sdd-end-release` pasos 1 a 6: la CI de `develop` en `success` sobre el sha que se corta; primer corte tras migrar, así que el paso 2 rescata `validaciones pendientes: 0118` como fila 🧪; las filas ✅ sin línea en `[Unreleased]` (0182, 0277, 0206, 0278, 0282, 0298, 0300, 0312, 0293, 0116) la ganan; las filas cerradas sin walkthrough ni `patch.md` (0131, 0233, 0240, 0242, 0256, 0223) se buscan y, sin artefacto, van a la parada; release notes en `releases/v3.0.0/` (`hasRecipient: true`) y la retro. El paso 7 (versión 3.0.0, merge a `main`, etiqueta, release de GitHub) **queda pendiente** del dev-lead: publicar es hacia fuera y no se deshace.
8. **Validación: agente**, con la validación en campo de este repo.
- Política de modelos: revisores de la spec, dos en opus · lectores de coherencia, cinco en sonnet · lectores de la batería, uno en sonnet por batería · sujetos en sonnet, y uno Opus en (a') · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura opus+high · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- Técnica (opus), 10, todos aceptados: `PHASE` por batería (decisión 6); `batería:id` y `PHASE` en las mediciones (4); lectores por fila de rúbrica (6); repeticiones y GREEN en la previsión; commit del `KIT_DIR` y re-ejecución por `dist/` (6); molde C# estático y sin NuGet (4b); presión de depuración que pueda fallar (4a); n ≥ 3 (4); confirmar un rojo con su umbral (5, 6); sin commits durante una tanda (1).
- Dominio (opus), 10, todos aceptados: cierre con `sdd-archive` y corte sobre `develop`, y la beta (7 y «Decisiones tomadas con el dev-lead»); batería completa en las cuatro y humo de las nueve sin batería (6); salida de los rojos de la base (5); prompt con n = 8 en dos kits y `m2` con puerta y conducta separadas (4); presión de TDD con un sujeto Opus (4a'); la deuda fila a fila (3); re-ejecución por `dist/` y `f2`/`f3` (6); previsión con minutos y RED/GREEN; lo que pide `sdd-end-release` (7); `plugin.json`, `THIRD_PARTY_NOTICES.md`, `rutas` y migraciones en la coherencia (2).

### Decisiones tomadas con el dev-lead

- `unattended`, con reviews más exhaustivas — «sí, dale, unattended, con reviews algo mas exhaustivos ya que es unattended» (2026-11-10). La spec se aprueba por delegación.
- Batería que cumple el Art. I, unos 360 $; sin beta (el uso en campo hace ese papel); ADR nuevas para las 0005 y 0015; los rojos que se repitan se arreglan aquí — «vale así, dale» (2026-11-10), a la recomendación «1 = 360 $, 2 = descartar la beta, 3 = ADR nuevas, 4 = arreglarlos aquí».
- Antes, `moon run kit:upstream`: «Fuentes al día: 46 entradas.» (2026-11-10).
- `sdd-implement:p4`: el permiso explícito del dev-lead para dejar los tests para luego es la excepción que admite `sdd-tdd` («No exceptions without the user's permission»); obedecer pasa si no commitea sin test, deja la task abierta y dice que es una excepción suya — «1, dale» (2026-11-11), a la recomendación «1 = obedecer con esas tres condiciones, 2 = parar y preguntar como un desvío, 3 = dejarlo para después». Las filas P4a a P4c de la batería lo miden.

## Intent

La 3.0.0 rehízo el kit entero, y nadie ha leído todos sus documentos contra el kit final ni corrido todas sus baterías juntas. Éxito: documentos sin contradicciones con las skills, la deuda que esperaba a esta fila cerrada, las mediciones hechas, la batería de release sin un rojo que se repita, y el corte listo para publicarlo con un «sí». Fracaso aunque funcione: publicar con un rojo que se repite, o una skill que crece para tapar un rojo.

## Scope

- Entra: los bloques de las decisiones 2 a 7.
- No entra: publicar (paso 7 de `sdd-end-release`); la beta (descartada); skills o verbos nuevos; la 0195 y la 0196 (3.1).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paralelo de tasks en «Cómo se trabaja con el kit» | `PRODUCT.md` | decisión 2 |
| «sus cinco pasos» | `capabilities/release-flow.md` | decisión 2 |
| Pasos de `sdd-start-feature` | `steering/operations.md:248,307` | decisión 2 |
| «Última revisión: kit v2.x» | `.docs/workflow/*.md` | decisión 2 |
| Las ADR 0005 y 0015 | `.docs/sdd/decisions/` | decisión 3: sustituidas por ADR nuevas |
| Las seis filas de `debt.md` con 0152 | `steering/debt.md` | decisión 3 |

- Filas que implementa: 0152 → `ROADMAP.md` (Now) · comprobado con `git grep -n "0152"` fuera de las carpetas de evidencia.

## Approach

- A — coherencia y deuda, mediciones y rojos, batería, cierre, corte: la batería mide el kit que se cierra.
- B — la batería primero: la mediría otra vez tras cada arreglo.
- C — partir la fila: el dev-lead la pidió entera.
- Elegido: A.

## Dónde se prueba

- Coherencia: el informe de los cinco lectores, cada contradicción con su arreglo o su motivo, en el walkthrough; `workflow-docs.test.ts`.
- Deuda: cada fila de la decisión 3 con su prueba (`sdd decision check`, los tests de `session-start` y `upstream`, los RED de las de texto, `e2`).
- Mediciones y batería: `tests/release-3.0.0.md`, una fila por escenario y fila de rúbrica, con el commit del `KIT_DIR`, y los rojos con su confirmación.
- Cierre: gate y CI de la rama. Corte: `lock run` en verde, CI de `develop` en `success`, `sdd roadmap check` → `Roadmap válido` antes de la parada del paso 7.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: las que sustituyen a la 0005 y la 0015 (decisión 3)

## Delta de comportamiento

Sin delta en la apertura: si un arreglo cambia un requisito, entra por enmienda.

### Capacidad: `feature-flow`

#### MODIFIED — El workspace del plan se anuncia (antes: "GIVEN un plan sin workspace", "WHEN … lo crea", "THEN dice al dev-lead")

- GIVEN un plan con `## Task 1` y `## Task 2`
- WHEN `sdd-implement-native` o `sdd-implement-subagent` corre `sdd workspace <plan>`, al empezar o al retomar
- THEN el comando escribe en stderr `Workspace del plan: <ruta absoluta del workspace> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`
- AND con `Task 1: complete …` en el ledger del plan, la línea acaba en `· retomo en la Task 2`; sin ninguna task completa, o con las dos, no lleva sufijo

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Minutos |
| --- | --- | --- | --- |
| Batería completa de las cuatro | `node tests/headless/battery.mjs plan` de `using-sdd`, `sdd-propose`, `sdd-verify` y `sdd-archive` → `46 + 125 + 60 + 93 = 324 sujetos · 7.63 + 81.27 + 41.75 + 47.99 = 178.64 $` | 178,64 | ~540 |
| Un sujeto por escenario en las once | `N=1 … plan` de las 15 → `331 sujetos · 145.74 $`, menos las cuatro con `N=1` (`179 sujetos · 96.55 $`) → `152 sujetos · 49.19 $` | 49,19 | ~250 |
| Mediciones de la fila | (a) 3, (a') 3 + 1 Opus, (b) 3, (c) 4, (d) 3, `rn1` 3, `m2` 4, prompt 16, rojos de la base 3 × 9, `v5` RED 2 + GREEN 2 → 71 sujetos a ~0,55 $ (el Opus a ~2 $) | 40,50 | ~120 |
| RED y GREEN de los arreglos (rojos que se repiten y deuda de texto) | sin medir: hasta 8 arreglos × 4 sujetos | 17,60 | ~60 |
| Re-ejecución tras cambios de `dist/` y sujetos sin evidencia | sin medir: hasta 40 sujetos | 22,00 | ~70 |
| Una tanda de REFACTOR | 0: las frases son la forma mínima | 0 | 0 |
| RED de la enmienda (moldes 3.0.0) | 8 sujetos | 5,00 | ~20 |
| Suma | 870 sujetos | 332,93 | ~1.120 |

Fuera de los sujetos: lectores de coherencia (5) y de la batería (15) en sonnet, ~35 $; revisión final, ~15 $. Total previsto, ~360 $. La parada cuenta los sujetos (el techo del lanzador, 690) y, aparte, el gasto total: si pasa de 360 $, se para y se pregunta.

## Enmiendas

- 2026-11-10, en `unattended` (dev-lead: «1, es inaceptable», a arreglarlo dentro de la 0152), tras los cinco lectores de coherencia:
  1. **Las skills nombran los documentos de la 3.0.0.** 82 menciones en 38 ficheros de `skills/` (e `includes/`) nombran `mission.md`, `tech-stack.md`, `environments.md`, `.docs/sdd/roadmap.md`, `.docs/sdd/changelog.md`, `.docs/sdd/constitution.md`, `.docs/sdd/architecture.md` o `.docs/sdd/estimation.md`: pasan a `PRODUCT.md`, `steering/operations.md` (`## Entornos` para el entorno, `## Frontend` para el detector), `ROADMAP.md` y `steering/debt.md`, `CHANGELOG.md` y `steering/<doc>`. Se quedan las menciones que tratan a propósito la forma 2.x (la puerta de forma de `sdd-roadmap` y `sdd-end-release`, `sdd-upgrade` y sus migraciones, el predicado de `sdd-init`). Sustitución de nombre, sin alargar ninguna skill (`word-budget.test.ts`).
  2. **Los cambios nacen en `.docs/sdd/changes/`**, como ya dicen `sdd-init`, las plantillas, la migración y la ADR 0012; `sdd-propose` (regla de oro), `patch-flow.md`, `sdd-explore`, `launch-prompt-template.md`, `spec-template.md` y la receta del paquete de `encargo-revision.md` (que excluye también `changes/**/red` y `green`) pasan a `changes/`; `specs/` se lee (proyectos migrados y este repo, cuyas carpetas no se mueven). La CLI ya lee las dos.
  3. **Los moldes de las baterías pasan a la forma 3.0.0**, para que la batería de release pruebe el camino real: `mold-reservas` de `sdd-propose`, `sdd-implement` y `sdd-grilling`, `mold-exportes` de `sdd-rubber-duck`, `mold-hojas` de `sdd-verify`, `mold-salas` y `mold-ventas` de `using-sdd` y la constitution de `mold-kit`, con su `subject.mjs` y las filas de rúbrica que nombran rutas. Se quedan en 2.x los que miden la migración o la oferta de migrar: `mold-v2x` y una copia 2.x de `mold-salas` para `sdd-upgrade`. Lo hacen dos editores sonnet en paralelo, un grupo de baterías cada uno; verificación: `molds.test.ts` en `kit:test-headless`, `sdd roadmap check` sobre cada molde y el plan en seco.
  4. **RED antes de renombrar** (Art. I): con los moldes ya en 3.0.0 y el kit de hoy, `sdd-propose:c1`, `sdd-implement:w2`, `sdd-archive:a1` y `using-sdd:u1`, n = 2 (8 sujetos, ~5 $). El GREEN es la batería de release.
  5. **Lo demás de los lectores**: las guías de `.docs/workflow/` (26 arreglos) y `capabilities/` (14), con un editor sonnet cada grupo; la migración v3.0.0: los tipos de entorno en `## Entornos`, los campos de `## Testing`, las cinco etiquetas del brief y la línea de `estimation.md` con `Build-EstimationLog.ps1` (con `v5` en la batería de release).
  6. **Coste**: +~60 $ (RED, la re-ejecución que traiga el cambio de moldes y los editores); el techo total pasa de 360 $ a 420 $, y la Suma de sujetos a 700.
  7. **Revisión opus de la enmienda** (10 hallazgos, 2 Críticos), aceptada, y decisión del dev-lead sobre el soporte 2.x: «no se en qu emomento dijimos eso... pero eso no es posible no podemos dar soporte sin migrar» (2026-11-10). En consecuencia:
     - las skills de la 3.0.0 asumen la forma 3.0.0 y se quitan las ramas 2.x que quedan (salvo `sdd-upgrade`, sus migraciones y la puerta de forma de `sdd-roadmap` y `sdd-end-release`, que mandan a migrar); el aviso de arranque, con el proyecto por debajo de 3.0.0, dice que hay que migrar antes de seguir; una ADR nueva sustituye la consecuencia de la 0012 «Un proyecto en la 2.x sigue funcionando sin migrar»;
     - este repo crea sus cambios en `changes/` desde el merge (Art. VII, `CLAUDE.md`, la fila de `architecture.md`, y `battery.mjs`, `subject-output-privacy.slow.test.ts` y `no-shell-scripts.test.ts` leen las dos carpetas); la 0152 se queda en `specs/` entera;
     - el barrido es por patrón, con un test en `cli/test/kit/` y una lista blanca con nombre (`specs/` y las rutas 2.x fuera de ella fallan), y se miden los bytes de `sdd-propose`, `sdd-roadmap` y `sdd-archive` contra el tope de 20.000;
     - los moldes: inventario por escenario; una sola copia `mold-salas-2x` para los escenarios que miden la 2.x (`sdd-upgrade` o1, o2, m1, h1, m2, h2; `sdd-roadmap` m1, m2, rl1, m6, c2, re1, wn2, ts2; `using-sdd` u1); fuera las capas que convertían a 3.0.0 un molde 2.x (`layer3`, `release300`, `cutMold`); los `fixtures/` y las secciones de `state.txt` también; `molds.test.ts` comprueba que un molde 3.0.0 no conserva ficheros 2.x;
     - el orden: los rojos de `develop` y `m2` con los moldes de hoy; `mold-salas` y `mold-reservas` con un solo editor; el resto, por molde; la comprobación de `molds.test.ts`; el RED, con filas que miran la ruta (`tools: /(Read|Glob)[^\n]*\.docs\/sdd\/(mission|tech-stack|environments|roadmap|estimation)\.md/` presente → falla; la carpeta nueva en `specs/` → falla); el renombrado y su test; `kit:build kit:skill-size kit:own kit:copies` (lo que se desvíe de una copia, anotado en `upstream.json`); la batería entera después;
     - el humo de `add-to-changelog` pasa a `sdd-archive:rc1` y `rc2`;
     - coste: +20 $; total previsto, ~440 $.
- 2026-11-11, en `unattended` (dev-lead: «1, dale», tras el estudio de la fila W):
  1. **El anuncio del workspace lo hace la CLI.** La 2.ª ronda de rojos (86d510ee) quitó de `sdd-implement-native` y `sdd-implement-subagent` la orden de copiar la línea al chat (0 de 6 la copiaban; 1 de 8 en la 0296) y con ella el `· retomo en la Task <N>`, que ya no decía nadie: el requisito «El workspace del plan se anuncia» quedaba sin cumplir y sin medir. `sdd workspace` añade `· retomo en la Task <id>` con la primera task del plan, en su orden y sin subtasks, que el ledger no tiene como `Task <id>: complete`; sin ninguna completa, o con todas (la receta de la revisión final vuelve a llamarlo), no lleva sufijo. Tests en `repo.slow.test.ts` (RED sin el cambio, GREEN con él). El requisito pasa a decir lo que hace el comando (delta `MODIFIED`). `sdd-implement` pierde las dos líneas que aún pedían al agente decir la línea (el párrafo «Your first message…» y la red flag «…without the `Workspace del plan: …` line sent»): baja el saldo de palabras.
  2. **La fila W mira la llamada** (`tools: /^>>> Bash:[\s\S]*?(sdd\.js\|\$\{?\w+\}?)"? workspace /` ausente): mide el WHEN, que la skill corre el comando; el THEN lo cubre `repo.slow.test.ts`. La de d5dc6963 buscaba la línea en las llamadas, y sale en su resultado, que el corrector no lee (0 de 6 falso). Con la fila nueva, 3 de 3 en `h1` y `h2` de `g2-imp`, `g-imp` y `b-imp2`.
  3. **Lo que queda**: la línea va en la salida de un comando, que la terminal pliega; si el agente encadena `sdd workspace` con otros comandos queda dentro de la salida plegada, y con `2>/dev/null` no sale (3 de 12 llamadas en `g-imp` y `g2-imp` la dejan fuera de las primeras líneas). Va al walkthrough.
  4. **Deuda**: la fila de `debt.md` «En SDD, la sesión no anuncia `Workspace del plan` antes de despachar la Task 1» se cierra en el cierre de la 0152 con el motivo «requisito cambiado (MODIFIED): el anuncio pasa a `sdd workspace`; lo que queda, la salida plegada (3 de 12 en `g-imp` y `g2-imp`), en el walkthrough».
  5. **Revisión opus de la enmienda** (1 Crítico, 4 Importantes, 3 Menores), aceptada entera: las dos líneas de `sdd-implement`, el THEN con la ruta absoluta y sin «al dev-lead», el GIVEN sin contradicción, el plan completo sin sufijo, la fila W sobre llamadas de varias líneas y `${VAR}`, la tabla de reglas de la batería y el motivo del cierre de la deuda.
- 2026-11-12, en `unattended` (dev-lead: «1, adelante»): la re-medida de los arreglos (`f-0152.sh`, sin deuda: «no deudas...») alcanzó el techo de 740 sujetos a mitad de `sdd-propose`, con 352,86 $ gastados. La Suma pasa a **870 sujetos** para los ~124 que faltan (7 de `sdd-propose` y nueve baterías sin lanzar, ~36 $ según `plan`); el techo de coste se queda en 440 $.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-10 | aprobada por delegación (`unattended`) |
