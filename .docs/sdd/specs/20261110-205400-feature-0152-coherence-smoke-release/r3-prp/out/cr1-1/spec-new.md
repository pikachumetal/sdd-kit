---
id: 20261111-192422-feature-0028-aviso-pendiente
feature: 0028
title: El aviso de cierre dice qué queda pendiente
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice qué queda pendiente

🦆 Al cerrar una feature, el aviso dirá también qué filas del roadmap siguen abiertas. Por ejemplo, al cerrar la 0010 dirá «quedan pendientes: 0011 Anular reservas de otros · 0008 Avisos por correo antes de la reserva», y con el roadmap vacío dirá «no queda nada pendiente». Se hace añadiendo esa instrucción al primer paso de la skill del aviso, y se prueba con sujetos antes y después, por 8,40 $ como mucho. El fallo del ticket aún no está medido: si el sujeto ya avisa bien sin el cambio, la prueba lo mostrará y no habrá nada que cambiar.

Validación: dev-lead — el aviso lo lee una persona; la batería mide lo que escribe el sujeto, no si la persona se entera de lo que queda abierto.

## Capacidades

- Ninguna, porque herramientas (el cambio es el texto de una skill del flujo, no el comportamiento de `salas`; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad) · tamaño: ~3 líneas en 1 fichero
- Dominio y técnica juntas (sonnet): si «filas en ⏳ de Now y Next» (decisión 1) cubre el caso del ticket, y si el escenario c1 (0010, 0011 y 0008) y el c2 («nada pendiente») pasan sin que el sujeto adivine el texto (señal: ninguna; el cambio es una frase)
- Mínimo razonable: sin revisor — deja sin mirar si la definición de «pendiente» deja fuera una fila que el dev-lead querría ver

1. **Qué es «pendiente»**: las filas de `ROADMAP.md` en ⏳ de las tablas Now y Next, salvo la que se cierra; Later queda fuera (son ideas aparcadas, no trabajo en marcha) y las ✅ también. — Con el roadmap de hoy, al cerrar la 0010 salen 2: 0011 y 0008; la 0004 (Later) no.
2. **Texto del paso 1**: «1. Di qué se cierra y qué queda pendiente: las filas de `ROADMAP.md` en ⏳ de Now y Next, salvo la que se cierra, una línea por fila, `<id> <título>`, en el orden del roadmap. Si no hay ninguna, di «no queda nada pendiente».» — el literal «no queda nada pendiente», el orden y el formato de línea los he puesto yo.
3. **Formato del aviso**: una línea por fila, `<id> <título>`, después de lo que se cierra. — nadie lo dijo; es lo mínimo que identifica la fila.
4. **Enfoque**: A (una cláusula en el paso 1, con su fuente), frente a B y C (ver Approach).
5. **Validación `dev-lead`**, no `agente`: el aviso lo lee una persona. La spec no está aprobada por delegación y la frase del dev-lead no nombra `agente`.
6. **Qué cubren c1 y c2**: `battery.md` solo trae id, paso, n y modelo; no sé qué fixtures tienen. Supongo que c1 cierra con filas abiertas y c2 sin ninguna. **Sin medir**: la Task 1 lo lee antes del RED, y si no es así se para y decide el dev-lead.
7. **El ticket sin medir**: el RED decide si el fallo existe (Scope, «Entra, si el RED lo exhibe»). El caso real del ticket (cerrar la 0005) no se puede repetir: esa fila ya no está en el roadmap. Se prueba con el roadmap de hoy.
8. **Precio por sujeto**: uso 0,70 $ de `operations.md`. El patch 0006 midió ~0,31 $ por sujeto (`patch.md`). Si el real es el segundo, el tope de abajo sobra; no lo bajo por mi cuenta.
9. **Orden y tamaño de la prueba**: el aviso lista las filas en el orden de `ROADMAP.md`; n=2 por escenario; una sola tanda de REFACTOR; controles y medición final a 0 (ver Previsión). El tope de 8,40 $ es el de la previsión al precio de `operations.md`, sin margen añadido: superarlo para y decide el dev-lead (art. 5). El umbral «1 de 4», el RED mixto como exhibido, el criterio de GREEN «4 de 4» y cerrar sin edición con 0 de 4 también los he puesto yo.
10. **Minutos**: la constitución pide sujetos, minutos y dólares, y `plan.mjs` no da minutos ni hay una medida previa. **Sin medir**: no los invento; al aprobar la spec aceptas ese hueco, o dime una cifra y la escribo.
11. **Ticket sin versionar**: `.docs/sdd/field-reports/20260914-aviso.md` está sin versionar (`??`). No lo añado a ningún commit: decide el dev-lead.
12. **Sin tope de palabras**: ningún test del proyecto limita las palabras de `SKILL.md` (`git grep` de «word-budget» y «palabras» en `test/`, `scripts/` y `tests/`: sin resultados), así que no hay tabla de topes.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: los 12 sujetos de la batería, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** (Crítico) — ninguna prueba ejercita una fila de Next → c1 pasa la 0008 a Next.
- **Aceptado** (Crítico) — los fixtures de c1 y c2 no están leídos → Scope «Entra, si la Task 1 lo exige» y decisión 6.
- **Aceptado** (Importante) — presencia de texto y ausencias débiles → c1 exige el orden y que la 0010 no salga como pendiente.
- **Aceptado** (Importante) — c2 no discrimina → c2 lleva una fila ✅ y una de Later.
- **Aceptado** (Importante) — Scope duplicado y sin umbral → una sola línea condicionada y criterio «1 de 4».
- **Aceptado** (Importante) — falso negativo del ticket → el Scope dice que aprobar lo acepta.
- **Aceptado** (Importante) — decisiones sueltas → decisiones 9 y 10.
- **Aceptado** (Menor) — ticket sin versionar y fixture presentado como real → decisión 11 y nota en «Dónde se prueba».
- **Rechazado** (Importante) — `ROADMAP.md` ausente o con otros estados → el proyecto solo usa ⏳ y ✅; va a «No entra».

### Hallazgos de la segunda ronda

- **Aceptado** (Crítico) — dos cuentas incompatibles (3 y 2) → decisión 1 y caso real dicen 2 al cerrar la 0010.
- **Aceptado** (Crítico) — el literal del paso 1 no pedía lo que exige c1 → decisión 2 lleva «salvo la que se cierra», una línea por fila y el orden.
- **Aceptado** (Importante) — GIVEN y WHEN de c2 incompatibles → c2 con una sola ⏳ en Now que se cierra.
- **Aceptado** (Importante) — c2 fallaba siempre en el RED por el literal → THEN semántico en RED, literal solo en GREEN.
- **Aceptado** (Importante) — sin criterio de GREEN → 4 de 4, fix y REFACTOR, luego para.
- **Aceptado** (Importante) — fixtures no declarados en la tabla → fila nueva, condicionada a la Task 1.
- **Aceptado** (Importante) — decisiones sueltas → ampliada la decisión 9.
- **Aceptado** (Menor) — tope «exacto» mal dicho → reescrita la decisión 9.
- **Rechazado** (Importante) — estimar los minutos → no hay base para una cifra; queda `sin medir` y el dev-lead lo acepta al aprobar o da una.
- **Rechazado** (Menor) — ids reales en los ejemplos y «dev-lead» en un proyecto de una persona → son datos del propio proyecto, no salen del repo, y «dev-lead» es el rol del kit.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»
- El RED no está medido — «el RED aún no se ha medido»

## Intent

Hoy el paso 1 solo dice «Di qué se cierra». El ticket de campo (§1) cuenta que, al cerrar la 0005, el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta; costó una parada del dev-lead. Se quiere que el aviso diga también qué queda abierto. Éxito: con filas ⏳ en Now o Next, el aviso las nombra todas por id y título; sin ninguna, dice «no queda nada pendiente». Fracaso aunque funcione: que el sujeto cite una fila ✅ o de Later, o se invente una pendiente cuando no hay ninguna.

## Scope

- Entra: medir el RED de `aviso-cierre` con c1 y c2.
- Entra, si el RED lo exhibe: la instrucción del paso 1 de `skills/aviso-cierre/SKILL.md` (una línea), es decir, todo el cambio. El ticket no está medido: si c1 y c2 ya dan el aviso con lo pendiente sin tocar la skill (0 de 4 fallos), no se edita nada y la feature se cierra con esa medida. Aprobar esta spec acepta ese resultado posible: el caso del ticket (la 0005) no se puede reproducir.
- Entra, si la Task 1 lo exige: ajustar los fixtures de c1 y c2 para que cumplan sus GIVEN, con una previsión de coste nueva; antes se para y decide el dev-lead.
- No entra: el paso 2 («Corre el gate»), la descripción de la skill, el aviso de otras skills, `ROADMAP.md`, un `ROADMAP.md` ausente o con estados distintos de ⏳ y ✅ (el proyecto no usa otros).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea «1. Di qué se cierra.» pasa a «1. Di qué se cierra y qué queda pendiente: …» | `skills/aviso-cierre/SKILL.md:8` (único sitio: `git grep "Di qué se cierra"` fuera de evidencias) | Scope, decisión 2 |
| Fixtures de c1 y c2 (0008 en Next, filas ✅ y Later, una sola ⏳ en c2) | `tests/batteries/aviso-cierre/` (sin leer: decisión 6) | Scope: solo si la Task 1 lo exige, con previsión nueva |
| Nombre `aviso-cierre`: no cambia | `skills/aviso-cierre/SKILL.md:2,6` · `tests/batteries/aviso-cierre/battery.md:1` · `.docs/sdd/steering/operations.md:16` | Ninguno: se queda tal cual |

- Filas que implementa: nada: comprobado con `git grep -n 0028` (sin resultados fuera de la rama; la 0028 no tiene fila en `ROADMAP.md`).
- Caso real del ticket (cerrar la 0005): no se puede repetir, la fila ya no está. Con el roadmap de hoy, al cerrar la 0010 la regla da 2 pendientes (0011, 0008) y deja fuera la 0004 (Later) y la 0007 (✅): contado a mano sobre `ROADMAP.md`.

## Approach

- A — una cláusula en el paso 1 que nombra la fuente (`ROADMAP.md`, ⏳, Now y Next) y el texto de «nada pendiente». Cuesta una línea más; el sujeto no puede interpretar «pendiente» a su manera.
- B — solo «y qué queda pendiente», sin fuente. Cuesta menos, pero el ticket mide justo una omisión: sin decir dónde mirar, el sujeto puede contar tareas del plan en vez de filas del roadmap.
- C — un paso nuevo «2. Di qué queda pendiente». Separa lo que el dev-lead pidió dentro del paso 1 y renumera «Corre el gate».
- Elegido: A — el dev-lead fijó el sitio (el paso 1) y B deja la definición abierta.

El aviso lista las filas por orden de aparición en `ROADMAP.md`, tras decir qué se cierra.

## Dónde se prueba

Por batería de sujetos (constitución, art. 5), sobre `aviso-cierre`, con `tests/batteries/aviso-cierre/battery.md`:

Las filas de los escenarios son un fixture de la batería, no el roadmap vivo; sus ids y títulos son de ejemplo.

- c1 — GIVEN un `ROADMAP.md` de fixture con 0010 y 0011 en ⏳ en Now, 0008 en ⏳ en Next, 0007 en ✅ y 0004 en Later · WHEN se cierra la 0010 · THEN el aviso dice qué se cierra y nombra, en este orden, la 0011 y la 0008 con su id y su título; no nombra la 0010 como pendiente, ni la 0004, ni la 0007.
- c2 — GIVEN un `ROADMAP.md` de fixture sin ninguna fila en ⏳ en Now ni en Next, con una fila ✅ y una en Later, y una sola fila ⏳ en Now · WHEN se cierra esa fila · THEN el aviso dice qué se cierra y dice que no queda nada pendiente, sin nombrar la fila ✅ ni la de Later ni inventar otra; el literal exacto «no queda nada pendiente» se exige solo en GREEN, porque el RED no puede conocerlo. *(Sin medir: ver decisión 6.)*
- GREEN pasa con 4 de 4 sujetos cumpliendo su THEN (c2 con el literal). Si falla alguno, una pasada de fix y la tanda de REFACTOR; si aún falla, se para y decide el dev-lead.
- El RED «exhibe» el fallo si al menos 1 de los 4 sujetos (c1 y c2, n=2) incumple su THEN. Un RED mixto cuenta como exhibido. Con 0 de 4 fallos no se edita nada. Un sujeto que cite la fila ✅ o la de Later, o invente una pendiente, incumple.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: el proyecto no tiene `capabilities/` y el cambio es el texto de una skill. Los escenarios van en «Dónde se prueba».

## Previsión de coste

Declarada antes del primer sujeto (constitución, art. 5). Comando: `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Controles | 0 sujetos: la batería no tiene escenario de control | 0 |
| Medición tras la revisión final | 0 sujetos: la revisión final no cambia el texto de la skill; si lo cambia, se mide con una tanda nueva y esa decisión vuelve al dev-lead | 0 |
| Suma | 12 sujetos | 8,40 |

Minutos: sin medir (el comando de previsión no los da; el plan los estima). Si la prueba supera 8,40 $, REFACTOR incluido, se para y decide el dev-lead.

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
