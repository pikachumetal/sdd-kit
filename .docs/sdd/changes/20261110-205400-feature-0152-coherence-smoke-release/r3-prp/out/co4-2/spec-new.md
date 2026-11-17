---
id: 20261111-200840-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra: «se cierra la 0016, avisos de cierre». Con este cambio dice además qué queda sin hacer: «se cierra la 0016; queda pendiente: la task 4 (el aviso por SMS)». Si no queda nada, lo dice igual: «nada pendiente». Por dentro es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`, con su prueba con sujetos (RED → GREEN) antes de tocarla.

Validación: agente — es una skill y su resultado son mensajes de un sujeto que se miden con la batería; ninguna persona vería nada que la medida no recoja (decisión 8).

## Capacidades

- Ninguna, porque herramientas (el proyecto no tiene `capabilities/`; el cambio es el texto de una skill).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna contada (sin contrato público, sin `MODIFIED`, sin datos, sin capacidades) · tamaño: ~3 líneas en 1 fichero (`skills/aviso-cierre/SKILL.md`) más 2 ficheros de fixture
- Único revisor (sonnet), los siete puntos: si «pendiente» queda definido en el propio texto del paso 1 y si los THEN de c1 y c2 distinguen «se cierra» de «queda pendiente» (señal: ninguna; el riesgo es de ambigüedad, no de contrato)
- Mínimo razonable: sin revisor — deja sin mirar si «pendiente» admite dos lecturas, que es justo donde un sujeto puede acertar por casualidad

1. «Pendiente» = lo que la feature deja sin hacer: las tasks de su plan sin cerrar y lo que su spec puso en «No entra». La instrucción del dev-lead no lo define: es mi propuesta, corrígela si por pendiente entendías otra cosa (p. ej. solo las filas ⏳ del roadmap). Va escrito dentro del paso 1 para que el sujeto lo vea, y la información la lee de `plan.md` y `spec.md` de la feature, no de `ROADMAP.md`.
2. Texto del paso 1 (la línea 8 se reescribe entera, no se añade una segunda):

   ```text
   1. Di qué se cierra y qué queda pendiente (las tasks del plan sin cerrar y lo que la spec dejó en «No entra»); si no queda nada, di «nada pendiente».
   ```

   El dev-lead fijó «dice también qué queda pendiente»; la definición entre paréntesis y la cláusula de «nada pendiente» son mías.
3. El paso 2 («Corre el gate») no cambia y el orden se mantiene: primero el aviso, luego el gate — nadie pidió moverlos. Los THEN de c1 y c2 comprueban que el gate se sigue corriendo después del aviso.
4. Fixtures de c1 y c2: dos ficheros de datos en `tests/batteries/aviso-cierre/` (`c1-fixture.md`, `c2-fixture.md`) con la feature que cierra el sujeto; no se añaden filas ni columnas a `battery.md`. Mecanismo: el prompt del sujeto da la ruta `tests/batteries/aviso-cierre/<id>-fixture.md` y le dice que esa es la feature que cierra; crearlos es una task del plan, antes del RED. Datos inventados (feature «recordatorios», no real).
5. Criterio de éxito: 2 de 2 sujetos por escenario en GREEN; criterio de RED: al menos 1 de 2 sujetos de c1 falla con el texto actual (si pasan los 2, el RED no discrimina y se para a decidir con el dev-lead). c2 es un control de no-invención: puede pasar ya hoy y no se exige que falle en el RED; se mantiene en el RED para tener su línea base (medir el falso positivo con el texto actual) y porque su coste son 1,40 $. Se juzga por aserción literal sobre el mensaje del sujeto (decisión 11).
6. Enfoque: A (una cláusula en el paso 1), frente a B (un paso 2 nuevo «Di qué queda pendiente») y C (una sección «Formato del aviso») — ver Approach.
7. Previsión de coste: RED, GREEN y una tanda de REFACTOR a n=2 por escenario, y una medición tras la revisión final a n=1; controles a cero. Total 9,80 $ con el precio de `operations.md` (0,70 $ por sujeto; el `patch-0006` midió ~0,31 $ (`.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md:3`), y aplico el de `operations.md` por ser el vigente y el más caro). Minutos: ~18, estimación mía sin medir (`plan.mjs` no da minutos). Tras el RED se recalcula con el coste real; si la suma previsible supera 9,80 $ o 18 min en más de un 20 % (11,76 $ o 22 min), se para y decide el dev-lead (constitution, regla 5). Una segunda tanda de REFACTOR no está prevista y también para. Los dos revisores de la spec (~100k tokens cada uno) no cuentan en los 9,80 $, que son de sujetos.
8. Validación `agente`, no `dev-lead`: lo que se observa son mensajes de sujetos que la batería ya mide.
9. `pendiente` no se añade a la terminología de `PRODUCT.md` en esta feature: se queda en esta spec; si el dev-lead la confirma, el cierre la lleva allí.
10. Perfil `delegate`, el del proyecto (`sdd-kit.json`); sin `sdd-kit.local.json`.
11. Juicio de los sujetos: aserción literal, sin juez, sobre el mensaje del sujeto, sin distinguir mayúsculas — c1 pasa si contiene «pendiente», «task 4» y «recordatorio por correo» y no presenta ninguna como cerrada; c2 pasa si contiene «nada pendiente» y ninguna palabra «task N» ligada a «pendiente». Los dos corren el gate después del aviso (decisión 3).
- Política de modelos: un revisor de la spec en sonnet (y una segunda ronda en sonnet, por los Críticos aceptados) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: sujetos de la batería, por tandas de n=2 · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente» (entrevista ya hecha, 2026-11-11).

### Hallazgos de la review

- **Aceptado** (Crítico) — la previsión no traía minutos → añadida la columna «Minutos», ~18 en total como estimación declarada, y la regla de parada de la decisión 7.
- **Aceptado** (Crítico) — sin escenario verificable → «Dónde se prueba» lleva GIVEN/WHEN/THEN de c1 y c2 con su fixture, y la decisión 5 fija el criterio de RED.
- **Aceptado** — c2 podía pasar siempre → su THEN exige que ninguna task figure como pendiente, y la decisión 5 lo declara control de no-invención.
- **Aceptado** — la definición de «pendiente» no estaba en el texto del paso 1 y chocaba con «No entra: ROADMAP.md» → la definición va en el paso 1 y la fuente son `plan.md` y `spec.md` (decisiones 1 y 2); se retira «apuntado a roadmap».
- **Aceptado** — fixtures fuera del Scope → entran en «Entra» (decisión 4).
- **Aceptado** — decisiones sin listar → decisiones 5, 7, 8 y 9.
- **Aceptado** — el `git grep` dicho «sin resultados» era falso → corregido en «Lo que se retira».
- **Aceptado** — sin control del paso 2 → el gate entra en los THEN (decisión 3).
- **Aceptado** — no constaba que `plan.mjs` se hubiera corrido → dicho en «Previsión de coste».
- **Aceptado** (2.ª ronda, 5 Importantes, sin Críticos) — los fixtures no tenían mecanismo → decisión 4 (ruta en el prompt, task previa al RED); el THEN de c1 era cumplible sin el cambio → aserción literal con «pendiente» (decisión 11); «No entra» sin escenario → entra en c1; fila de la tabla ambigua → «se amplía», línea reescrita entera; parada sin tolerancia → +20 % (decisión 7). Menores: c2 fija que el fixture omite «No entra», el texto va en bloque de código, el 0,31 $ cita su fichero, los revisores no cuentan en los 9,80 $.
- **Aceptado** — recalibrar tras el RED → regla de la decisión 7.

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo «Di qué se cierra»: quien lee el aviso de cierre no sabe qué se ha quedado fuera. Se quiere que el mismo paso diga también qué queda pendiente, y que lo diga siempre, incluso si es nada. Éxito: en 2 de 2 sujetos del cierre con una task sin cerrar (c1) el aviso la nombra como pendiente, y en 2 de 2 del cierre de una feature entera (c2) dice «nada pendiente». Fracaso aunque «funcione»: un aviso que solo repite lo cerrado, o que inventa pendientes que la feature no dejó.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente (decisiones 1 y 2).
- Entra: los fixtures de c1 y c2 en `tests/batteries/aviso-cierre/` (decisión 4).
- No entra: el paso 2 (el gate), la frontmatter de la skill, cualquier otra skill, nuevas filas de `battery.md` y cualquier cambio en `ROADMAP.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La frase «Di qué se cierra.» del paso 1 cambia de forma: se amplía | `skills/aviso-cierre/SKILL.md:8` | Scope, decisión 2: la línea se reescribe entera con el texto de la decisión 2 |

- Filas que implementa: ninguna — nada: comprobado con `git grep -n "0016"` (sin resultados fuera de esta spec; la rama `feature/0016-close-notice` no tiene fila en `ROADMAP.md`).
- Otros sitios que nombran la skill o el literal: `git grep -nE "Di qué se cierra|qué se cierra|pendiente"` fuera de `.docs/sdd/specs/` y de `.docs/sdd/changes/` → solo `skills/aviso-cierre/SKILL.md:8`, que es el que cambia. `aviso-cierre` aparece además en `operations.md:16` (el comando de previsión), en `tests/batteries/aviso-cierre/battery.md:1` y en `patch-0006` (evidencia): ninguno cita el paso 1, ninguno cambia.

## Approach

- A. Una cláusula en el paso 1 — cuesta una línea y no mueve nada; el riesgo es que el sujeto la lea como adorno si no hay «nada pendiente» explícito, y por eso la cláusula va.
- B. Un paso 2 nuevo «Di qué queda pendiente» — separa los dos avisos, pero renumera «Corre el gate» (paso 2 → 3) y el dev-lead pidió el paso 1.
- C. Una sección «Formato del aviso» — más ceremonia para una frase; contradice lo corto de la skill (9 líneas).
- Elegido: A — es lo que dijo el dev-lead («el paso 1 … dice también qué queda pendiente»); B y C añaden estructura que nadie pidió.

El texto del paso 1 es el de la decisión 2.

## Dónde se prueba

Con sujetos Sonnet, batería de `aviso-cierre`, como la prueba que ya existe para el cierre; ninguna otra costura.

- c1 (`c1-fixture.md`): GIVEN la feature «recordatorios» con tasks 1 a 3 cerradas, la 4 («recordatorio por SMS») sin cerrar y, en el «No entra» de su spec, «recordatorio por correo» · WHEN el sujeto cierra la feature con `aviso-cierre` · THEN el aviso dice qué se cierra y, aparte, contiene «pendiente» junto a «task 4» y a «recordatorio por correo», sin presentar ninguna como cerrada · AND corre el gate después del aviso.
- c2 (`c2-fixture.md`): GIVEN la feature «recordatorios» con sus 4 tasks cerradas y una spec que no lleva la sección «No entra» (el fixture la omite) · WHEN el sujeto cierra la feature con `aviso-cierre` · THEN el aviso dice qué se cierra y «nada pendiente», y ninguna task ni ítem figura como pendiente · AND corre el gate después del aviso.

## Términos y ADR

- Términos resueltos: ninguno (decisión 9)
- ADR candidatas: ninguna

## Previsión de coste

Comando de `operations.md`, ejecutado antes de redactar esta tabla: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`. Los minutos son estimación mía, sin medir (decisión 7).

| Tanda | Sujetos (batería) | $ | Minutos |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 | 5 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 | 5 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 | 5 |
| Controles | 0 sujetos — ninguna otra skill se edita; el orden de los pasos lo miden los THEN de c1 y c2 | 0,00 | 0 |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | 3 |
| Suma | 14 sujetos | 9,80 | 18 |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
