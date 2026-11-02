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
- Modificadas: `quality-gate` — el gate pasa a ser el paso 3 de `resumen-cierre` (hoy es el paso 2 de `aviso-cierre`).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (tres requisitos entre `closing` y `quality-gate`) · tamaño: ~15 líneas en 4 ficheros
- Mínimo razonable: ninguna revisión — deja sin mirar a otro par de ojos sobre el reparto de pasos de `resumen-cierre`.

Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica · sin otros despachos en paralelo — en paralelo hasta `control.maxParallelAgents`

Resultado de `capability merge` sobre una copia de `.docs/sdd` (el repo no cambia): `closing.md: sustituido «Quien cierra sabe qué se cierra»` · `quality-gate.md: sustituido «El gate corre una sola vez»` · `quality-gate.md: sustituido «Un gate en rojo para el cierre»`.

Corregido en la pasada de coherencia: la tabla de retiros estaba vacía; la fila 0030 sí aparece en el roadmap (la spec decía «nada»); el «paso 2» de `quality-gate` dependía del paso que se retira; «abre con» chocaba con la numeración de «El resumen va al final».

1. `resumen-cierre` gana una línea con lo que se cierra. Va como línea de apertura **sin número**, para que sus pasos 1 y 2 sigan siendo los de «El resumen va al final».
2. **El gate no se pierde** (lo he decidido yo, es la decisión más discutible): `aviso-cierre` también decía «Corre el gate» en su paso 2, y las dos reglas de `quality-gate` se apoyan en ese «paso 2». Al retirar la skill ese paso desaparecería. Lo paso a `resumen-cierre` como paso 3, y esas dos reglas pasan de «paso 2» a «paso 3». Alternativa: retirar también el gate del cierre, que obligaría a retirar esas reglas; no la propongo porque la constitución exige el gate de cierre en verde.
3. Para la fila 0030 del roadmap no hay nada que implementar aparte: se marca saldada al cerrar, como el resto de filas.
4. El texto del paso 3 es «Corre el gate.», igual que el de `aviso-cierre`.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: al cerrar queda una sola skill, sin perder el aviso de qué se cierra ni el gate; fracaso, aunque técnicamente funcione: que el gate deje de correr al cerrar.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` dice también qué se cierra (línea de apertura) y corre el gate (paso 3).
- Entra: `capabilities/closing.md` (requisito «Quien cierra sabe qué se cierra») y `capabilities/quality-gate.md` (requisitos «El gate corre una sola vez» y «Un gate en rojo para el cierre»), por el delta de abajo, al cerrar.
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| «Di qué se cierra.» (paso 1 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md` | línea de apertura sin número en `skills/resumen-cierre/SKILL.md` |
| «Corre el gate.» (paso 2 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md` | paso 3 de `skills/resumen-cierre/SKILL.md` |
| `aviso-cierre` | `.docs/sdd/capabilities/closing.md:13` | MODIFIED de abajo: pasa a `resumen-cierre` |
| «paso 2» del cierre | `.docs/sdd/capabilities/quality-gate.md` (requisitos «El gate corre una sola vez» y «Un gate en rojo para el cierre») | MODIFIED de abajo: pasa a «paso 3» |
| fila 0030 | `.docs/sdd/roadmap.md:9` | se marca saldada al cerrar la feature |
| título «Retirar la skill aviso-cierre» | `.docs/sdd/roadmap.md:9` | queda como histórico de la fila |

- Filas que implementa: 0030 (`.docs/sdd/roadmap.md:9`); comprobado con `grep -rn 0030` sobre el repo, que solo la nombra ahí y en esta spec.
- Sin hits de `aviso-cierre` en `README.md`, `constitution.md`, `operations.md` ni `aviso-apertura`.

## Approach

`resumen-cierre` abre con lo que se cierra (línea sin número); sus pasos 1 y 2 siguen igual y gana un paso 3 que corre el gate. Se borra `skills/aviso-cierre/`.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`.
- el gate: que `resumen-cierre` lo nombra como paso 3 y que `skills/aviso-cierre/` ya no existe.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 3
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 3 con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
