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
- Modificadas: `quality-gate` — el gate del cierre lo corre `resumen-cierre` (hoy es el paso 2 de `aviso-cierre`).

## Decisiones que he tomado yo — valida estas

Política de modelos: sin review de spec (1 señal: MODIFIED; ~15 líneas en 2 ficheros de skills y 2 capacidades); la sesión sigue en el modelo actual.

1. `resumen-cierre` gana una línea de apertura, **sin numerar**, con lo que se cierra: así sus pasos 1 y 2 no cambian y «El resumen va al final» sigue cierto.
2. **El gate no se pierde.** Hoy lo corre el paso 2 de `aviso-cierre`; al retirarla pasaría a no correr nadie. Pasa a ser el paso 3 de `resumen-cierre`. Dos requisitos de `quality-gate` dicen «el paso 2» y quedarían huérfanos: se reescriben como MODIFIED apuntando al paso 3. Alternativa: retirar también el gate del cierre (no la recomiendo: la constitución lo exige).
3. Prueba del delta en una copia de `.docs/sdd` (`capability merge`): `closing.md: sustituido «Quien cierra sabe qué se cierra»` · `quality-gate.md: sustituido «El gate corre una sola vez»` · `quality-gate.md: sustituido «Un gate en rojo para el cierre»`. El repo no cambia.
4. Pasada de coherencia: «Filas que implementa» decía «nada» y era falso (la 0030 está en `roadmap.md`): corregido. Los requisitos de `quality-gate` no estaban en la primera redacción.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje, sin perder el gate que hoy corre la skill que se retira.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` abre con qué se cierra y corre el gate como paso 3.
- Ficheros que implementan los MODIFIED: `skills/resumen-cierre/SKILL.md` (los tres) y `skills/aviso-cierre/SKILL.md` (se borra).
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md`; `capabilities/closing.md` (THEN de «Quien cierra sabe qué se cierra») | se borra la carpeta; el THEN pasa a `resumen-cierre` (MODIFIED) |
| su paso 1, «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | línea de apertura de `resumen-cierre` |
| su paso 2, «Corre el gate» | `capabilities/quality-gate.md` («El gate corre una sola vez» y «Un gate en rojo para el cierre», ambos «paso 2») | pasa a `resumen-cierre` paso 3; ambos requisitos MODIFIED |

- Filas que implementa: 0030 → `roadmap.md` línea 9 («Retirar la skill aviso-cierre», ⏳); se salda al cerrar, en el archivo. Buscado con `grep -rniE "0030|aviso-cierre|resumen-cierre"` en todo el repo: sin más hits fuera de `skills/`, `closing.md`, `roadmap.md` y esta spec.

## Approach

`resumen-cierre` abre con una línea sin numerar que dice qué se cierra, conserva sus pasos 1 y 2 y añade el paso 3, «Corre el gate», copiado de `aviso-cierre`.

## Dónde se prueba

- el mensaje de cierre y el gate: leyendo `skills/resumen-cierre/SKILL.md` y la salida de una ejecución; `node --test && node scripts/lint.mjs` (gate de cierre de `operations.md`) siguen en verde.

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
- WHEN llega el paso 3 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 3 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
