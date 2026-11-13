---
id: 20261112-160429-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: in-review
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra: «Cerrada la 0016, aviso de cierre». Después de este cambio, el mismo aviso añade qué queda sin hacer, por ejemplo «Pendiente: la Task 3 y la validación con el dev-lead», o «Pendiente: nada» si no queda nada. Cómo: se reescribe el paso 1 de `skills/aviso-cierre/SKILL.md` y se prueba con la batería `aviso-cierre` (RED sobre el texto actual, GREEN sobre el nuevo), como exige la constitución.

Validación: agente — la skill la lee un agente y lo único observable es lo que dice un sujeto al cerrar; lo mide la batería, y ningún humano vería nada que esa medida no recoja.

## Capacidades

- Ninguna, porque herramientas (la skill `aviso-cierre` no es comportamiento del producto: `capabilities/` no existe y no hay delta).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: ninguna de contrato público, MODIFIED, capacidad nueva, datos ni dependencia · tamaño: ~3 líneas en 1 fichero (más el criterio de la batería)
- Dominio (sonnet): si el THEN de «qué queda pendiente» se puede observar sin ambigüedad en el texto de un sujeto y si el Scope cubre lo que el Intent promete (señal: único requisito, sin delta)
- Mínimo razonable: un revisor con los siete puntos — es ya el mínimo; sin review quedaría sin mirar si la prueba de la batería discrimina el cambio
```

1. Carril: feature, modo full, aunque el cambio de la skill sea de una línea — la constitución (art. 5) exige RED → GREEN con sujetos para cualquier edición de skill, y el texto del paso 1 no lo dio el dev-lead literal.
2. Qué es «pendiente»: lo que la feature que se cierra deja sin hacer —tasks sin cerrar, validación sin hacer, enmiendas sin aprobar—, no el roadmap ajeno. El dev-lead dijo solo «dice también qué queda pendiente»; el contenido lo fijo yo.
3. Forma: el paso 1 pasa a «Di qué se cierra y qué queda pendiente (tasks sin cerrar, validación sin hacer, enmiendas sin aprobar, según `tasks.md` y la spec) en una línea «Pendiente: <lista>»; si no queda nada, escribe «Pendiente: nada».» El texto literal y la fuente son míos.
4. Sin paso nuevo ni cambio de `description`: el dev-lead dijo que lo dice el paso 1, y el paso 2 (gate) no se toca.
5. Enfoque: reescribir el paso 1 en su sitio, frente a un paso nuevo y a ampliar la `description` (ver Approach).
6. Validación `agente` (arriba): propuesta mía; se aprueba con la spec.
7. La 0016 no tiene fila en `ROADMAP.md`: el id lo reserva la rama `feature/0016-close-notice` (`sdd id claim`: «sin remoto, la 0016 vale (contador local)»). No añado la fila: es planificación, de `sdd-roadmap`.
8. Previsión de coste: sujetos de Sonnet con la batería existente `c1` y `c2` en n = 2, tres tandas (RED, GREEN y una de REFACTOR), 8,40 $ en total; si la prueba lo supera, se para y decide el dev-lead (constitución, art. 5).
9. La batería es solo una tabla de ids, sin fixture ni criterio: la Task 1 los escribe antes del primer sujeto, como dice «Dónde se prueba» (c1 con pendientes, c2 sin ninguno). Son texto de las filas, no sujetos nuevos: la previsión no cambia; la Task 1 repite `plan.mjs` tras escribirlos y, si el coste sube, para.
### Hallazgos de la review

1. **Aceptado** — los THEN pasaban sin el comportamiento: la batería no tiene fixture ni criterio → fixture y criterio de `c1` y `c2` en «Dónde se prueba» (decisión 9 reescrita).
2. **Aceptado** — la decisión 9 dejaba abierto el coste → los fixtures son texto de las filas, la previsión no cambia (decisión 9).
3. **Aceptado** — nada separaba «inventa pendientes» de «dice nada por defecto» → `c1` falla si falta alguna de las tres cosas o sobra otra; `c2` falla si nombra alguna.
4. **Aceptado** — el ejemplo no encajaba con la definición de pendiente → ejemplo del 🦆 corregido, `c1` cubre las tres categorías.
5. **Aceptado** — el paso 1 no decía de dónde sacar lo pendiente → la definición y la fuente (`tasks.md` y la spec) entran en su texto (decisión 3).
6. **Aceptado** — el escenario del gate no se podía observar → eliminado; el paso 2 queda en «No entra».
7. **Aceptado** — REFACTOR obligado y controles sin porqué → REFACTOR contingente como techo; `c2` es el control.
8. **Aceptado** — la segunda entrada del dev-lead era de proceso → quitada.
9. **Aceptado** — la decisión 10 (carpeta) era de proceso → quitada.
10. **Rechazado** — «no existe PRODUCT.md»: existe en la raíz del repo (`PRODUCT.md`), no en `steering/`; el revisor miró en otra ruta.

### Hallazgos de la segunda ronda

1. **Aceptado** — la fuente no se ejercitaba → fixture con `tasks.md` y `spec.md` mínimos.
2. **Aceptado** — sin formato con pendientes → «Pendiente: <lista>» en el paso 1 y en `c1`.
3. **Aceptado** — «ninguna otra» ambiguo → definido por forma y con un distractor.
4. **Aceptado** — `c2` no discrimina «nada por defecto» → dicho: lo cubre `c1`.
5. **Aceptado** — coste sin repetir tras los fixtures → la Task 1 repite `plan.mjs` y para si sube.
6. **Rechazado** — la cita de `sdd id claim` es la salida literal del comando ejecutado en esta sesión.
7. **Aceptado** — suma como techo, explícito en la tabla.
8. **Aceptado** — los escenarios se declaran criterios de batería, no delta.
9. **Rechazado** — «enmiendas sin aprobar» es del flujo SDD del propio proyecto (constitución art. 1); el ejemplo del 🦆 ya usa «la validación» como categoría.
10. **Rechazado** — el aprobador se rellena al aprobar, no antes.

- Política de modelos: un revisor de la spec en sonnet (y otro en sonnet si un Crítico aceptado pide segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería: Sonnet, por tandas, en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Hoy el aviso de cierre (`skills/aviso-cierre/SKILL.md`, paso 1) solo dice qué se cierra, y quien lo lee no sabe si algo se quedó sin hacer: lo descubre después. Se quiere que el mismo aviso diga también qué queda pendiente. Éxito: en un cierre con algo sin hacer (tasks sin cerrar, validación sin hacer, enmiendas sin aprobar), el sujeto nombra cada cosa pendiente; en un cierre sin nada pendiente, dice «Pendiente: nada». Fracaso aunque funcione: el sujeto escribe «Pendiente: nada» por defecto, sin mirar, o inventa pendientes que la feature no tiene.

## Scope

- Entra: reescribir el paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 3); la prueba con sujetos (RED sobre el texto actual, GREEN sobre el nuevo); el criterio de la batería si no distingue lo pendiente (decisión 9).
- No entra: el paso 2 («Corre el gate»), el `description` de la skill, otras skills, `ROADMAP.md` y la fila 0016, y cualquier script (`scripts/plan.mjs` no cambia).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal «Di qué se cierra.» (paso 1) | `skills/aviso-cierre/SKILL.md:8` | Scope: se reescribe (decisión 3) |
| Nombre `aviso-cierre` y su coste por sujeto | `.docs/sdd/steering/operations.md:16` | Sin cambio: nombra la skill y su batería, no el texto del paso |

- Filas que implementa: nada: comprobado con `git grep -niE "0016|close-notice|di qué se cierra|pendiente"` fuera de `.docs/sdd/specs`, `.docs/sdd/changes` y `tests/*.md`, que solo da el paso 1 y `operations.md`; `ROADMAP.md` no tiene fila 0016.

## Approach

- A. Reescribir el paso 1 en su sitio — cuesta una línea y el criterio se mide sobre el mismo paso que hoy dice «qué se cierra»; no cambia la numeración.
- B. Añadir un paso nuevo («2. Di qué queda pendiente») — descartado: renumera «Corre el gate» a 3 y contradice al dev-lead, que lo quiere en el paso 1.
- C. Solo ampliar la `description` — descartado: la `description` dice cuándo usar la skill, no qué hace; un sujeto no la sigue como instrucción.
- Elegido: A — es lo que dijo el dev-lead.

Texto previsto del paso 1: el de la decisión 3.

## Dónde se prueba

- Que el aviso nombra lo pendiente: con sujetos de Sonnet sobre la batería `tests/batteries/aviso-cierre/battery.md` (n = 2 cada fila), leyendo el aviso que escribe cada sujeto, como en el patch 0006; no hay tests de código que lo cubran: la skill no se ejecuta. La Task 1 añade a cada fila, antes del RED, su fixture y su criterio:
  - `c1`: fixture con un `tasks.md` y una `spec.md` mínimos: la Task 3 de 3 sin cerrar, la validación sin hacer y una enmienda sin aprobar, escritas ahí, y un distractor (una fila ajena del `ROADMAP.md` sin hacer). Pasa si hay una línea «Pendiente: …» que nombra esas tres cosas y ningún pendiente más con forma de task, validación o enmienda, y no nombra el distractor.
  - `c2`: mismo formato de fixture con todo cerrado, validado y sin enmiendas, y el mismo distractor. Pasa si dice «Pendiente: nada». Solo protege contra inventar pendientes; el fallo «nada por defecto» lo cubre `c1`.
- Que no se rompe nada: gate de cierre, `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: la skill no es una capacidad del producto (ver Capacidades). Estos escenarios son los criterios de la batería, no un delta de producto:

- GIVEN una feature con la Task 3 sin cerrar, la validación sin hacer y una enmienda sin aprobar · WHEN el sujeto cierra con `aviso-cierre` · THEN su aviso dice qué se cierra y nombra esas tres cosas como pendientes, sin añadir otras.
- GIVEN una feature con todo cerrado, validado y sin enmiendas · WHEN el sujeto cierra con `aviso-cierre` · THEN su aviso dice qué se cierra y «Pendiente: nada», sin nombrar ningún pendiente.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Una tanda de REFACTOR (contingente: solo si el GREEN no pasa; se presupuesta como techo) | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Controles | sin tanda propia: `c2` hace de control (cierre sin pendientes) | 0 |
| Medición tras la revisión final | sin tanda: la revisión final no cambia el texto de la skill; si lo cambiara, sería otra tanda de REFACTOR | 0 |
| Suma (techo: con el REFACTOR; previsto sin él, 8 sujetos y 5.60 $) | 12 sujetos | 8.40 |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
