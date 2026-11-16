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

> 🦆 Hoy, al cerrar una feature, salen dos mensajes: `aviso-cierre` (dice qué se cierra y manda correr el gate) y `resumen-cierre` (cuenta commits y filas del roadmap). Esta feature borra el primero y pasa su «qué se cierra» al segundo: quien cierra verá un solo mensaje. Ojo con lo que se pierde: el «corre el gate» no tiene sitio nuevo (decisión 2).

Review de spec propuesta: ninguna — señales: `MODIFIED` (1 requisito de `closing`) · tamaño: ~10 líneas en 3 ficheros
- Mínimo razonable: ninguna — deja sin mirar solo que no quede otra mención de `aviso-cierre`, que ya busqué con grep en todo el repo.

Política de modelos: sin review no se despacha ningún modelo; la implementación sigue en la sesión actual.

Validación del delta (copia temporal de `.docs/sdd`): `capability merge` sobre la copia → «closing.md: sustituido «Quien cierra sabe qué se cierra»», sin rechazos; el `capabilities/` del repo no cambia.

1. `resumen-cierre` gana su «Di qué se cierra» como **paso 3** (al final), no como paso 1: así «El resumen va al final» sigue siendo cierto sin tocarlo (paso 1 = commits, paso 2 = filas del roadmap).
2. **«Corre el gate»**, el paso 2 de `aviso-cierre`, **se retira con la skill y no pasa a ningún sitio**: `resumen-cierre` corre al *acabar* el cierre, y mandar correr el gate ahí llegaría tarde. Ninguna capacidad lo exige hoy. Si lo quieres conservar, dime dónde (cambios).
3. La fila 0030 del roadmap la salda el cierre de esta feature (`sdd-archive`); no se edita ahora.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se borra `skills/aviso-cierre/SKILL.md` (y su carpeta); `skills/resumen-cierre/SKILL.md` gana el paso 3 «Di qué se cierra»; `.docs/sdd/capabilities/closing.md` cambia por el delta (su THEN nombra hoy `aviso-cierre`).
- No entra: cambiar `aviso-apertura`; mover «corre el gate» a otra parte (decisión 2).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra |
| el THEN «`aviso-cierre` dice qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | lo cambia el `MODIFIED` de esta spec (ahora `resumen-cierre`) |
| su paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md` | se retira sin destino (✋ 2) |
| la fila 0030 | `.docs/sdd/roadmap.md:9` | la salda `sdd-archive` al cerrar |

- Filas que implementa: 0030 (`.docs/sdd/roadmap.md`). Búsqueda de `aviso-cierre`, `resumen-cierre` y `0030` en todo el repo (README, PRODUCT.md, scripts, src, test, package.json): sin más menciones que las de la tabla.

## Approach

`resumen-cierre` añade al final un paso 3 «Di qué se cierra»; los pasos 1 y 2 siguen igual.

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
- THEN `resumen-cierre` dice qué se cierra en su paso 3

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
