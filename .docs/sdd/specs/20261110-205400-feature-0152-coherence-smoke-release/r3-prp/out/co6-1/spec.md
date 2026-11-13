---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`.
- Modificadas: `quality-gate` — el gate de cierre lo corre `resumen-cierre`, ya no `aviso-cierre`.

## Decisiones que he tomado yo — valida estas

1. **Orden de `resumen-cierre` tras el cambio (el orden es parte del contrato):** 1 «Di qué se cierra», 2 «Corre el gate», 3 «Cuenta los commits de la rama», 4 «Lista las filas del roadmap que salda». Es el orden que ya tiene el cierre hoy (`aviso-cierre` y luego `resumen-cierre`): primero qué se cierra, luego el gate, y el resumen al final. Nada cambia para quien cierra, salvo que ya no hay una segunda skill. Por eso los THEN de `closing` fijan el orden: el paso 1 va antes del gate y los pasos 3 y 4 después.
2. **El gate no se pierde:** el paso «Corre el gate» pasa a `resumen-cierre`. Retirar la skill sin moverlo dejaría sin dueño a `quality-gate`.
3. **Qué es «el gate»:** esta spec no lo redefine. El paso sigue diciendo «Corre el gate», como hoy. Hay una discrepancia que ya existía y no toco: la constitución dice `node --test` en verde y `operations.md` añade `node scripts/lint.mjs`. Queda para otra fila si quieres alinearlas.
4. **`description` de `resumen-cierre`:** pasa de «Usar al acabar el cierre de una feature» a «Usar al cerrar una feature», porque ahora también abre el cierre.
5. **Un test que falla antes:** la constitución pide tests antes que código. Propongo `test/skills.test.js`: comprueba que no existe `skills/aviso-cierre/`, que los pasos de `resumen-cierre` salen en el orden de la decisión 1 (compara el orden de los cuatro pasos, no su redacción) y que su `description` es la de la decisión 4. Va en el plan como Task 1 (RED).
6. **La fila 0030 de `ROADMAP.md` no se toca** en esta spec: la salda `sdd-archive`.
7. Enfoque: A, frente a B y C (ver Approach).

## Review de la spec

Review de spec propuesta: dos revisores — señales: MODIFIED (tres requisitos en dos capacidades) · tamaño: ~30 líneas en 5 ficheros
- Dominio (sonnet): si el nuevo orden de `resumen-cierre` respeta lo que `closing` y `quality-gate` ya prometen (señal: MODIFIED)
- Técnica (sonnet): si cada THEN se puede observar y si algún texto del repo cita pasos de las skills (señal: MODIFIED)
- Mínimo razonable: solo técnica — deja sin mirar si el orden nuevo contradice el sentido de «El resumen va al final»

### Hallazgos

- **Aceptado** — (técnica, Crítico) el THEN de `closing` no era observable y mezclaba un estado del repo → quito el `AND no existe la skill` del delta; la ausencia de la skill va al test de la decisión 5.
- **Aceptado** — (dominio e técnica, Importante) mover el gate al final cambiaba el orden de hoy y un gate en rojo ya habría mostrado el resumen → rehago el orden: qué se cierra, gate, resumen (decisión 1). Es la decisión central reescrita.
- **Aceptado** — (dominio) «El resumen va al final» perdía su sentido con el gate detrás → con el orden nuevo el resumen sigue al final; solo cambian sus números (1→3, 2→4), declarado como `MODIFIED`.
- **Aceptado** — (dominio) la razón de la antigua decisión 5 era falsa → desaparece con el orden nuevo.
- **Aceptado** — (técnica y dominio) el gate cita dos fuentes → decisión 3.
- **Aceptado** — (dominio) falta un test antes del código → decisión 5.
- **Aceptado** — (técnica) el éxito prometía más de lo que comprueba el `git grep` → acotado a fuera de specs y carpetas de evidencia.
- **Aceptado** — (dominio) `closing` no decía cuándo se da el aviso → el THEN fija que es el paso 1.
- **Rechazado** — (técnica, Crítico) fijar un texto exacto en `quality-gate`: los escenarios de esa capacidad son suyos y esta spec solo les cambia a quién apuntan; endurecerlos es otra feature.
- **Rechazado** — (técnica) buscar manifiestos, hooks o lint que enumeren skills: `git grep` por el nombre en todo el repo solo da `closing.md:13`, `ROADMAP.md:9` y la skill; `scripts/lint.mjs` solo mira tabuladores de `src/app.js`.
- **Rechazado** — (dominio) cambiar a Laura: el aprobador viene de la cabecera que dejó el dev-lead, no de mí.
- **Rechazado** — (técnica) quitar la política de modelos: ya no aparece como decisión.

Segunda ronda (un revisor, sonnet, tras reescribir la decisión central):

- **Aceptado** — (Crítico) el test nombra `aviso-cierre` y contradecía el Éxito → el test es una excepción declarada del Éxito.
- **Aceptado** — (Importante) «no se llega a los pasos 3 y 4» era comportamiento nuevo no declarado → lo quito del THEN de `quality-gate`: esta spec solo cambia a qué skill apuntan esos requisitos.
- **Aceptado** — (Importante) «va al final» no decía después de qué → el THEN de `closing` fija que los pasos 3 y 4 van después del gate.
- **Aceptado** — (Importante) el `AND` de orden en «Quien cierra sabe qué se cierra» era comportamiento no declarado → entra en la decisión 1, en la tabla y en el test.
- **Aceptado** — (Menor) review mezclada con las decisiones → sección propia; recuento corregido; el test solo compara el orden de los pasos, no su redacción; el test cubre también la `description`; el Intent deja de afirmar lo que nadie midió.
- **Rechazado, queda dicho** — (Importante) que la skill diga «para si falla» y «no repitas al retomar»: el texto de hoy de `aviso-cierre` es solo «Corre el gate» y esos dos escenarios de `quality-gate` ya eran así antes de esta spec; no es regresión de esta feature. Va como deuda en «Dónde se prueba».

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo (motivo de la fila 0030 del roadmap, del dev-lead: retirar `aviso-cierre`). Se quiere un solo mensaje de cierre y que el gate siga corriendo una sola vez, antes del resumen.

Éxito: tras el cambio hay una sola skill de cierre, `resumen-cierre`, que dice qué se cierra, corre el gate, cuenta commits y lista filas, en ese orden; fuera de las carpetas de evidencia (`.docs/sdd/specs/`, `.docs/sdd/changes/`), ningún fichero del repo nombra `aviso-cierre`, salvo la fila 0030 de `ROADMAP.md` hasta que se salde y `test/skills.test.js`, que lo nombra para comprobar que no existe. Sería un fallo, aunque «funcione», que el cierre dejara de correr el gate o lo corriera después del resumen.

## Scope

- Entra:
  - se retira `skills/aviso-cierre/`;
  - `skills/resumen-cierre/SKILL.md`: pasos en el orden de la decisión 1 y `description` de la decisión 4;
  - `.docs/sdd/capabilities/closing.md`: requisitos «Quien cierra sabe qué se cierra» (nombra la skill retirada) y «El resumen va al final» (cita los pasos 1 y 2);
  - `.docs/sdd/capabilities/quality-gate.md`: «El gate corre una sola vez» y «Un gate en rojo para el cierre» (citan «el paso 2» sin decir de qué skill);
  - `test/skills.test.js`: nuevo, decisión 5.
- No entra: cambiar `aviso-apertura`; `README.md`, `PRODUCT.md` y `CHANGELOG.md`, que no nombran la skill (`git grep`); la fila 0030 de `ROADMAP.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| `aviso-cierre` | `.docs/sdd/capabilities/closing.md:13` | `resumen-cierre` (`MODIFIED` de `closing`) |
| paso 1 «Di qué se cierra» | `skills/aviso-cierre/SKILL.md:8` | paso 1 de `resumen-cierre`, y `closing` fija que va antes del gate (`MODIFIED`) |
| paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md:9` | paso 2 de `resumen-cierre` |
| «paso 1» y «paso 2» de `resumen-cierre` | `.docs/sdd/capabilities/closing.md:25-26` | pasan a 3 y 4 (`MODIFIED` de `closing`) |
| «el paso 2» como gate | `.docs/sdd/capabilities/quality-gate.md:18` y `:23` | «el paso 2 de `resumen-cierre`» (`MODIFIED` de `quality-gate`) |
| «paso 2 de `aviso-apertura`» | `.docs/sdd/capabilities/closing.md:18` | se queda: es otra skill |
| id 0030 | `ROADMAP.md:9` | se queda hasta que la salde `sdd-archive` |

- Filas que implementa: 0030 → nada más: `git grep -n 0030` fuera de las carpetas de evidencia solo da la propia fila de `ROADMAP.md`.
- Comprobado con `git grep -niE "aviso-cierre|(pasos?|steps?) [0-9]+\b"` en todo el repo, sin specs, changes ni `skills/`: solo `closing.md`, `quality-gate.md` y la fila 0030, todos en la tabla.
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge` con el delta de esta versión: sustituye los cuatro requisitos (`closing`: «Quien cierra sabe qué se cierra», «El resumen va al final»; `quality-gate`: «El gate corre una sola vez», «Un gate en rojo para el cierre»), salida 0. El `capabilities/` del repo no cambia.

## Approach

Tres maneras de dar un solo mensaje de cierre:

- **A (elegida) — `resumen-cierre` absorbe los dos pasos de `aviso-cierre` al principio, en su orden de hoy.** Conserva qué ve quien cierra y que el gate corra antes del resumen. Cuesta renumerar los pasos del resumen (un `MODIFIED` en `closing`) y nombrar la skill en `quality-gate`.
- **B — añadir al final «Di qué se cierra» y «Corre el gate».** No renumera, pero el gate correría tras el resumen: un gate en rojo ya habría mostrado el resumen, y «El resumen va al final» dejaría de ser verdad.
- **C — fundir ambas en una skill nueva.** Más cambio del que pide la retirada.

Es la decisión central: fija el orden del cierre.

## Dónde se prueba

- `test/skills.test.js` (Task 1, en rojo antes de tocar las skills): no existe `skills/aviso-cierre/` y `resumen-cierre` trae sus cuatro pasos en el orden de la decisión 1.
- `closing`: el orden de los pasos y la ausencia de la skill, con el test; el contenido de lo que se dice en el paso 1, leyendo la salida de `resumen-cierre` (manual).
- `quality-gate`: el gate corre una sola vez y para en rojo. Ni la skill de hoy ni esta spec lo implementan en el texto de los pasos (solo dice «Corre el gate»): esos dos escenarios quedan sin probar, como antes; deuda para otra fila, no regresión de esta.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN el paso 1 de `resumen-cierre` dice qué se cierra
- AND ese paso va antes del gate

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 3 cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda
- AND los pasos 3 y 4 van después del gate (paso 2)

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 2 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 2 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
