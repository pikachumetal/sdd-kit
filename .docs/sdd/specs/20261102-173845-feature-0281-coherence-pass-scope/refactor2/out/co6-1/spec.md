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

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`; `quality-gate` — el gate de cierre pasa a correr en `resumen-cierre`.

## Decisiones que he tomado yo — valida estas

1. `resumen-cierre` gana dos pasos al final: 3 «Di qué se cierra» y 4 «Corre el gate». Los pasos 1 y 2 no cambian, así que «El resumen va al final» sigue cierto.
2. **El gate de cierre no se pierde**: hoy es el paso 2 de `aviso-cierre`, y pasa a `resumen-cierre`. Retirar la skill sin moverlo dejaría el cierre sin gate; quitarlo sería un cambio de comportamiento que nadie pidió. Es lo que más te pido validar.
3. `quality-gate` gana dos `MODIFIED` («paso 2» pasa a «paso 4 de `resumen-cierre`»). No estaban en la petición, pero sus «paso 2» son los de `aviso-cierre`.
4. Corregido en la pasada de coherencia: la primera versión decía que `resumen-cierre` «abre» con lo que se cierra (chocaba con «El resumen va al final») y que la 0030 no tenía fila en el roadmap (la tiene, `roadmap.md:9`).
5. Merge de prueba del delta en una copia (`sdd capability merge`): `closing.md` sustituye «Quien cierra sabe qué se cierra»; `quality-gate.md` sustituye «El gate corre una sola vez» y «Un gate en rojo para el cierre». Sin rechazos.
6. Review de spec: ninguna. Señales: solo `MODIFIED` (1) · tamaño: ~15 líneas en 4 ficheros.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje, y que el cierre siga corriendo el gate.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` añade los pasos 3 (qué se cierra) y 4 (gate); `capabilities/closing.md` y `capabilities/quality-gate.md` por sus deltas; `roadmap.md` marca la 0030 al archivar.
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md`; `capabilities/closing.md:13` | se borra la carpeta; `closing.md` por el `MODIFIED` |
| su paso 2 «Corre el gate» | `quality-gate.md:18` y `:23` («paso 2») | pasa al paso 4 de `resumen-cierre`; `MODIFIED` en `quality-gate` |
| pasos 1 y 2 de `resumen-cierre` | `closing.md:24-26` | no cambian (los nuevos son 3 y 4) |
| paso 2 de `aviso-apertura` | `closing.md:18` | no cambia: es otra skill |
| fila 0030 | `roadmap.md:9` | se marca hecha al archivar |

- Filas que implementa: 0030 (`roadmap.md:9`), comprobado con `grep -rn 0030 .docs README.md`. README.md y PRODUCT.md no mencionan la skill.

## Approach

`resumen-cierre` conserva sus pasos 1 y 2 y añade 3 (di qué se cierra) y 4 (corre el gate); `aviso-cierre` se borra.

## Dónde se prueba

- el mensaje de cierre y el gate: leyendo la salida de `resumen-cierre`; `node --test && node scripts/lint.mjs` sigue verde.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN el paso 3 de `resumen-cierre` dice qué se cierra

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 4 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 4 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
