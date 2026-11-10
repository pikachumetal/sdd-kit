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

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Minutos |
| --- | --- | --- | --- |
| Batería completa de las cuatro | `node tests/headless/battery.mjs plan` de `using-sdd`, `sdd-propose`, `sdd-verify` y `sdd-archive` → `46 + 125 + 60 + 93 = 324 sujetos · 7.63 + 81.27 + 41.75 + 47.99 = 178.64 $` | 178,64 | ~540 |
| Un sujeto por escenario en las once | `N=1 … plan` de las 15 → `331 sujetos · 145.74 $`, menos las cuatro con `N=1` (`179 sujetos · 96.55 $`) → `152 sujetos · 49.19 $` | 49,19 | ~250 |
| Mediciones de la fila | (a) 3, (a') 3 + 1 Opus, (b) 3, (c) 4, (d) 3, `rn1` 3, `m2` 4, prompt 16, rojos de la base 3 × 9, `v5` RED 2 + GREEN 2 → 71 sujetos a ~0,55 $ (el Opus a ~2 $) | 40,50 | ~120 |
| RED y GREEN de los arreglos (rojos que se repiten y deuda de texto) | sin medir: hasta 8 arreglos × 4 sujetos | 17,60 | ~60 |
| Re-ejecución tras cambios de `dist/` y sujetos sin evidencia | sin medir: hasta 40 sujetos | 22,00 | ~70 |
| Una tanda de REFACTOR | 0: las frases son la forma mínima | 0 | 0 |
| Suma | 690 sujetos | 307,93 | ~1.040 |

Fuera de los sujetos: lectores de coherencia (5) y de la batería (15) en sonnet, ~35 $; revisión final, ~15 $. Total previsto, ~360 $. La parada cuenta los sujetos (el techo del lanzador, 690) y, aparte, el gasto total: si pasa de 360 $, se para y se pregunta.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-10 | aprobada por delegación (`unattended`) |
