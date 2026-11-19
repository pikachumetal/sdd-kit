---
id: 20261119-161443-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: lite
profile: delegate
status: in-review
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra: «Cerrada la 0005». Con este cambio dirá además qué queda pendiente: (p. ej.) «Cerrada la 0005. Pendiente: la fila 0006 sigue abierta en el roadmap». Así quien cierra no se entera de la fila abierta a media parada. Se consigue añadiendo esa frase al paso 1 de la skill `aviso-cierre`, y se prueba con sujetos, RED antes que GREEN.

Validación: dev-lead — el aviso lo lee una persona al cerrar; solo ella dice si «lo pendiente» se entiende.

## Capacidades

- Ninguna, porque herramientas (cambio de una skill del propio proyecto; no hay `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

> Propuesta de review: nivel bajo (lite, un fichero de ~8 líneas, sin código). Señales: 1 skill editada, 0 capacidades, 0 datos. Lentes: Spec (que el paso 1 pida lo pendiente y nada más) y Coste (previsión de abajo). Mínima: sin review de arquitectura ni de código; queda sin cubrir que `lint.mjs` no lee el contenido de la skill.

1. **Qué cuenta como «pendiente»: las filas de `Now` y `Next` de `ROADMAP.md` con ⏳ en Estado, sin la fila que se cierra, que se marca ✅ antes del aviso; `Later` no cuenta, son ideas sin comprometer** (formato comprobado en el `ROADMAP.md` del repo) — el ticket dice «una fila abierta» pero no define el término; es mi lectura y la que más se ajusta al caso de la 0005. **pendiente de confirmar por el dev-lead.**
2. **Texto del paso 1**: «Di qué se cierra y qué queda pendiente: las filas con ⏳ de Now y Next de `ROADMAP.md`, sin la que se cierra, o "nada pendiente" si no hay ninguna.» — el literal es mío; nombra la ruta y el marcador, y «nada pendiente» evita que el silencio parezca olvido. El ejemplo del 🦆 es ilustrativo, no un formato obligatorio.
3. **Pasos no tocados**: el paso 2 («Corre el gate.») y el `description` quedan igual; no se renumera nada.
4. **Batería sin cambios** (`c1`, `c2`) — su fichero es solo una tabla y no trae fixture: **pendiente de confirmar por el dev-lead** si el arnés ya pone un `ROADMAP.md` a cada sujeto; si no, hay que enmendar la batería (fixture con una fila ⏳ y otro sin ninguna) y la previsión de coste se rehace.
5. **Previsión de coste** (filas de abajo): escenarios `c1 c2`, N=2 en RED y GREEN, N=1 en REFACTOR y en la medición final, controles a cero — elección mía; total 8,40 $.
6. **Carpeta en `.docs/sdd/specs/`**, no `changes/`: es donde viven las specs de este proyecto. Id 0028 por la rama; no hay fila en `ROADMAP.md` (la rama lo reserva).
7. **Enfoque: A, frente a B y C** (ver Approach).
7b. **Umbrales de la prueba** (los de «Dónde se prueba») — míos, sin medir.
8. **RED sin medir** («el RED aún no se ha medido»): lo que el ticket cuenta es un solo caso; ver «Entra, si el RED lo exhibe».
8b. **Validación `dev-lead`**, capacidades «Ninguna» y el criterio pasa/falla — míos, con su porqué arriba y en «Dónde se prueba».
9. **Modo lite** y **estimación** (Tipo docs, 0,5 h + 1 h, confianza baja) — cifras mías: una línea de skill, sin plan.
- Política de modelos (`delegate`): revisores de la spec: a decidir en `sdd-spec-review` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin código) · otros despachos: los sujetos de la batería, por tandas, en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

1. **Aceptado** (Crítico) — la batería no trae fixture ni criterio → escenarios y pasa/falla en «Dónde se prueba»; el fixture, a ✋ 4 como pendiente del dev-lead.
2. **Aceptado** — sin escenarios GIVEN/WHEN/THEN → dos escenarios en «Dónde se prueba».
3. **Aceptado** — «Entra, si el RED lo exhibe» abierto → acotado al paso 1; lo demás vuelve a spec o patch.
4. **Aceptado** — literal sin ruta ni marcador → ahora nombra `ROADMAP.md` y ⏳; el ejemplo del 🦆 es ilustrativo.
5. **Aceptado** — «pendiente» sin confirmar en «Términos resueltos» → pasa a «ninguno».
6. **Aceptado** — faltan minutos → columna `min` (~3 por sujeto); lo de la enmienda de batería, en ✋ 4.
7. **Aceptado** — sin umbral → umbrales RED/GREEN (✋ 7b).
8. **Rechazado** — «dev-lead» no figura en PRODUCT → es el rol del kit para quien aprueba, sea una o varias personas.
9. **Aceptado** — `ROADMAP.md` existe (comprobado) y su formato de fila abierta (⏳) está citado.
10. **Aceptado** — confianza → baja.

Segunda ronda (sonnet; sin tercera):
1. **Aceptado** (Crítico) — la fila que se cierra y Later → ✋ 1, literal, escenario 1 y fixture alineados.
2. **Aceptado** (Crítico) — fixture/batería → sigue como pendiente del dev-lead (✋ 4), con el mapeo `c1`→1, `c2`→2; no se implementa sin su confirmación.
3. **Aceptado** — chequeo comprobable y quién lo aplica → «Dónde se prueba».
4. **Aceptado** — umbral por escenario y qué pasa si GREEN no da 4/4 → «Dónde se prueba».
5. **Aceptado** — ✋ 8b; el lint sale de `operations.md`.
6. **Aceptado** — tope en sujetos y minutos; el 2.º REFACTOR se para.
7. **Aceptado** — ids de fixture aclarados.
8. **Aceptado** — duplicado fundido en ✋ 8.
9. **Rechazado** — `PRODUCT.md` está en la raíz, no en `steering/`, y `operations.md` existe (leído).
10. **Rechazado** — el escenario 1 exige ids concretas, así que un «nada pendiente» fijo falla ahí; no hace falta un control más.

### Decisiones tomadas con el dev-lead

- El paso 1 dice también qué queda pendiente, por el ticket de campo §1 — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra». Al cerrar la 0005 el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta; coste: una parada del dev-lead (`.docs/sdd/field-reports/20260914-aviso.md` §1). Se quiere que el aviso nombre también lo pendiente. Éxito: en los sujetos de `c1` y `c2`, el aviso de cierre menciona cada fila abierta, o dice «nada pendiente»; la cifra concreta (sujetos que lo hacen hoy y después) sale de la medición, no de esta spec. Anti-goal: un aviso que lista todo el roadmap o repite lo cerrado y entierra la fila abierta.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente.
- Entra, si el RED lo exhibe: ajustar el mismo paso 1 a lo que el RED muestre del ticket (sin medir, aunque sea todo el cambio). Cualquier otra ampliación (otro paso, la batería, un script) vuelve a spec o patch con su propia previsión.
- No entra: el gate (paso 2), la batería, `lint.mjs`, el formato del roadmap, calcular lo pendiente con un script.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1 «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope: pasa a decir también lo pendiente (decisión 2) |

- Repaso de coherencia: `git grep -niE "Di qué se cierra|qué se cierra|aviso-cierre"` fuera de evidencias → el literal solo está en `SKILL.md:8`; `operations.md:16` y `patch.md` (0006) nombran la skill sin citar el paso y no cambian.
- Filas que implementa: ninguna: comprobado con `grep -n "aviso\|pendiente" ROADMAP.md PRODUCT.md README.md CHANGELOG.md` → sin coincidencias. El origen es el ticket de campo §1, que no es fila.

## Approach

- A. Ampliar el paso 1 con la frase de lo pendiente — una línea editada, sin renumerar; es lo que pidió el dev-lead.
- B. Paso nuevo «Di qué queda pendiente» entre 1 y 2 — renumera el gate a 3 y contradice lo decidido (el paso 1).
- C. Calcular lo pendiente con un script sobre `ROADMAP.md` — código nuevo y su test para una frase; sobredimensionado, y lo pendiente aún no está definido (decisión 1).
- Elegido: A — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».

## Dónde se prueba

Con sujetos de `tests/batteries/aviso-cierre/battery.md` (`c1`, `c2`): RED sobre la skill actual y GREEN sobre la editada (constitution, regla 5). Sin test unitario: no hay código. Escenarios, con los datos de un fixture inventado (los ids no son los del roadmap real; 0005/0006 son solo el caso del ticket); `c1` ejecuta el escenario 1 y `c2` el 2 (propuesta, ✋ 4):

- GIVEN un `ROADMAP.md` de fixture con la 0010 y la 0011 ⏳ en Now, la 0004 ⏳ en Later, y la 0008 recién cerrada (✅) · WHEN el sujeto aplica `aviso-cierre` · THEN el aviso nombra qué se cierra (0008) y nombra la 0010 y la 0011 como pendientes, y no la 0004.
- GIVEN un `ROADMAP.md` de fixture sin ninguna fila ⏳ en Now ni Next tras cerrar la 0008 · WHEN el sujeto aplica `aviso-cierre` · THEN el aviso dice «nada pendiente» y no inventa ninguna fila.
- Pasa/falla por sujeto, comprobable: están las ids esperadas, no está ninguna otra y, en el escenario 2, aparece «nada pendiente»; falla si omite una, inventa una o lista el roadmap entero (anti-goal). Lo aplica el agente al medir, sobre la salida de cada sujeto.
- Umbrales (míos, ✋ 7b): RED con al menos 1 sujeto que falla en cada escenario (si en uno ninguno falla, ese RED no exhibe nada: se para y decide el dev-lead); GREEN con 4 de 4 que pasan; si no, se para y decide el dev-lead, sin tanda extra.
- Condición, que el dev-lead confirma antes de implementar: que `c1` y `c2` tengan un `ROADMAP.md` con esas filas (✋ 4, pendiente).
- `node --test && node scripts/lint.mjs` sigue en verde (gate de cierre, de `operations.md`).

## Términos y ADR

- Términos resueltos: ninguno (pendiente — fila ⏳ del roadmap tras el cierre — es propuesta, ✋ 1, sin confirmar)
- ADR candidatas: ninguna

## Delta de comportamiento

No aplica: sin capacidades; el comportamiento se fija en los escenarios de «Dónde se prueba».

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 1 h (edición de una línea; el grueso es la prueba con sujetos)
- Base de la estimación: una línea de skill y 12 sujetos en cuatro tandas; incertidumbre: si el RED exhibe más casos que el de la 0005. Sin referencia en `estimation-log.md`.
- Confianza: baja (el RED puede exhibir más casos que el de la 0005)

## Previsión de coste

| Tanda | Sujetos (batería) | min | $ |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | ~12 | 2,80 |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | ~12 | 2,80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=1 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | ~6 | 1,40 |
| Controles | sin sujetos: la batería no tiene escenario de control | ~0 | 0 |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | ~6 | 1,40 |
| Suma | 12 sujetos | ~36 | 8,40 |

Tope: 8,40 $ · 12 sujetos · ~36 min; una segunda tanda de REFACTOR no tiene presupuesto y se para. Minutos: ~3 por sujeto, en serie (estimación mía, sin medir, ✋ 5). Si la prueba supera 8,40 $ (REFACTOR incluido), se para y decide el dev-lead (constitution, regla 5).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
