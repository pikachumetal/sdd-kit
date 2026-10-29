---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `6ccd262`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`. El motivo sale de la lista cerrada «cambio de planes, sala ocupada, otro»; uno fuera de ella, o sin `--motivo`, responde «motivo no válido: …». La reserva cancelada guarda el motivo.
- **Listado de canceladas** (Task 2, `4483ab6`): el comando `canceladas` lista las reservas canceladas como «Norte lun — sala ocupada». Tests en `test/cancel.test.js`.
- **Cierre**: script `cancelar` en `package.json` (`node src/app.js cancelar`), `tasks.md` con la revisión final, la capacidad `bookings` fusionada del delta de la spec y los registros del cierre (changelog, roadmap, deuda).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0 (la spec lo dice: «sin review de spec: dos señales»).

## 3. Desviaciones del plan

- El gate de cierre del plan (§3) es `node --test`; el ruling de la Task 2 dice haber puesto `--test-concurrency=1` «en el gate», pero ni `gate.json` ni el plan lo llevan. El gate que corrió en el cierre es el declarado, sin ese flag, y estuvo en verde. El ruling queda en `tasks.md` tal cual; la causa que da (carrera sobre el almacén compartido) no la confirma la re-revisión, que apunta a otra: el test de `canceladas` depende del estado que deja el de `cancelar` (`test/cancel.test.js:13-15`). Va a la deuda (4.3).

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (Task 2; ver la desviación de arriba: no llegó al gate).
- La re-revisión única del cierre se despachó con `general-purpose` + `opus`, porque la sesión cargaba el kit 2.3.4 y no tenía el tipo `sdd-kit:effort-high` — coste si es erróneo: una revisión sin el effort alto que pide el kit sobre un diff de una línea de configuración.

## 4. Verificación

### 4.1 Builds

- Suite `unit`: `node --test test/app.test.js` → 2/2, verde (verificado por el agente).
- Gate: `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 · rooms:test: corrió 1/1 · duración no medida (`tech-stack.md` declara ~1 s) · configuración: la del gate, sin `--affected` (sin filtro: cambia el build, la rama toca `package.json`) · sobre el commit de cierre (el cierre junta el commit donde corrió).
- Sin E2E declarados ni entorno que levantar.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite unit 2/2 · gate 6/6 sin filtro · smoke 5/5 THEN con ejecución real · revisión final Spec y Código limpias sobre `4483ab6`, re-revisión de lo posterior a `4483ab6` sin Critical ni Important (2 minor: uno corregido, uno a deuda).

Todo lo de la tabla lo verificó el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | cumple |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) + suite | cumple |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) + suite | cumple |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar', …)` y `run('canceladas', [])`) + suite | cumple |

`canceladas` solo se puede ver en el mismo proceso que `cancelar`: el almacén es en memoria y desde otro proceso sale vacío. Guardarlo es la 0014 del roadmap, fuera del alcance de esta spec.

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` dependen del orden y del almacén compartido en memoria; el ruling de la Task 2 no coincide con el gate real. Fila en la deuda técnica del roadmap.
- Minor de la re-revisión, corregido en el cierre: la fila de la Task 1 de `tasks.md` apuntaba a `4483ab6` y es `6ccd262`.

## 5. Aprendizajes

- Cambio de comportamiento observable (cancelar con motivo, listado de canceladas) → delta de la spec fusionado con `sdd capability merge` en `capabilities/bookings.md` (capacidad nueva, `capability check` en verde).
- Tests que se apoyan en el estado que deja otro test → deuda técnica del roadmap, hasta aislar el almacén por test. Sin convención nueva para `constitution.md`, ni cambio estructural (el proyecto no tiene `architecture.md`) ni de versión o herramienta para `tech-stack.md`.
- Revisión de skills: no aplica. Se miró `.claude/skills/`: el proyecto no tiene la carpeta, y el trabajo no revela un patrón reutilizable.
- ADR: la spec no declara candidatas; `decision check` sin decisiones.

## 6. Adendas

- _(ninguna)_
