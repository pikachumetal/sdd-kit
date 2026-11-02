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

## Decisiones que he tomado yo — valida estas

1. `resumen-cierre` gana el paso 3, «Di qué se cierra», al final y no al principio: así los pasos 1 y 2 siguen siendo los que fija el requisito «El resumen va al final» de `closing`, que no cambia.
2. El paso 2 de `aviso-cierre` («Corre el gate») se retira con la skill y no pasa a ninguna otra: el gate de cierre ya lo declara `operations.md` (`node --test && node scripts/lint.mjs`). Si quieres que `resumen-cierre` lo corra, dímelo.
3. La fila 0030 del roadmap no se toca en esta spec: la cierra `sdd-archive`.
4. Resultado de `capability merge` sobre una copia temporal de `.docs/sdd`: `closing.md: sustituido «Quien cierra sabe qué se cierra»` (sin rechazos; el repo no cambia)
5. Política de modelos: ningún revisor de spec (1 señal: MODIFIED; ~12 líneas en 3 ficheros) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte
6. Corregido en la pasada de coherencia: el Approach decía «abre con» y desplazaba los pasos numerados de `closing`; la tabla de retiradas estaba vacía y «Filas que implementa» decía «nada» cuando el roadmap tiene la fila 0030.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` gana el paso 3 «Di qué se cierra»; `capabilities/closing.md` cambia `aviso-cierre` por `resumen-cierre` en «Quien cierra sabe qué se cierra» (al integrar el delta, en el cierre).
- No entra: cambiar `aviso-apertura`; mover el gate a otra skill; la fila 0030 del roadmap (la cierra `sdd-archive`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| su paso 1 «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | pasa a ser el paso 3 de `resumen-cierre` |
| su paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md` | se retira; el gate sigue en `operations.md` (ver ✋ 2) |
| `aviso-cierre` en el requisito «Quien cierra sabe qué se cierra» | `.docs/sdd/capabilities/closing.md` | lo cambia el delta (`MODIFIED`) |
| la fila 0030 | `.docs/sdd/roadmap.md` | la cierra `sdd-archive` |

- Filas que implementa: 0030 (`roadmap.md`). Comprobado con `grep -rn -i "aviso-cierre\|0030" . --exclude-dir=.git`: sin más apariciones en README, PRODUCT.md, src, test ni scripts.

## Approach

`resumen-cierre` termina con «Di qué se cierra»; sus pasos 1 y 2 siguen igual.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
