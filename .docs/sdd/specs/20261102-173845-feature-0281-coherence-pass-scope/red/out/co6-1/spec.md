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

🦆 Hoy, al cerrar una feature, salen dos mensajes: el de `aviso-cierre` («di qué se cierra, corre el gate») y el de `resumen-cierre` (commits y filas del roadmap). Después de esto sale uno solo: el resumen empieza diciendo qué se cierra (p. ej. «Se cierra: Retirar la skill aviso-cierre»), cuenta los commits y lista las filas que salda. La skill `aviso-cierre` desaparece, y con ella su paso de correr el gate, que ya lo corre el cierre.

Validación: dev-lead — el resultado es un mensaje que lee una persona al cerrar; lo comprueba leyendo la salida de `resumen-cierre`.

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`, y sus pasos se renumeran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna — señales: `MODIFIED` (dos requisitos de `closing`) · tamaño: ~15 líneas en 4 ficheros. Una señal de ocho: no se propone review.

1. `resumen-cierre` gana una línea con lo que se cierra — es la que hacía `aviso-cierre`.
2. La línea va como paso 1 de `resumen-cierre` («abre con lo que se cierra»), así que los pasos de hoy pasan a 2 y 3. Por eso «El resumen va al final» entra en el delta como `MODIFIED`. Alternativa: ponerla como paso 3 y no tocar ese requisito.
3. El paso 2 de `aviso-cierre` («Corre el gate») se retira sin pasar a `resumen-cierre`: el gate de cierre ya está declarado en `operations.md` (`node --test && node scripts/lint.mjs`) y en la constitución, y lo corre el cierre, no un mensaje. Si prefieres que el resumen lo recuerde, entra como línea en el delta.
4. La fila 0030 de `roadmap.md` no se toca al escribir la spec: la mueve el cierre de la feature.
5. Validación `dev-lead`: ante la duda, quien lo lee es una persona.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` dice también qué se cierra, como paso 1; `capabilities/closing.md` se actualiza por el delta de abajo (lo fusiona el cierre).
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md`; `capabilities/closing.md:13` (el THEN la nombra) | Scope (se borra la carpeta) · delta, `MODIFIED` «Quien cierra sabe qué se cierra» |
| el paso 2 de `aviso-cierre`, «Corre el gate» | `skills/aviso-cierre/SKILL.md:9` | decisión 3: se retira sin sustituto, el gate vive en `operations.md` |
| la numeración de los pasos de `resumen-cierre` (1 y 2 pasan a 2 y 3) | `skills/resumen-cierre/SKILL.md:8-9`; `capabilities/closing.md:24-26` | decisión 2 · delta, `MODIFIED` «El resumen va al final» |

- Filas que implementa: 0030 → `roadmap.md:9` (la define); `README.md`, `PRODUCT.md`, `skills/` y las demás capacidades no la nombran (comprobado con `grep -rnI 0030 .`). Destino: decisión 4, la mueve el cierre.

## Approach

`resumen-cierre` abre con lo que se cierra; sus dos pasos de hoy (commits, filas del roadmap) siguen, ahora como 2 y 3.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`, que abre con lo que se cierra y sigue con commits y filas. Es texto de una skill y `node --test` no lo cubre: se comprueba con una lectura.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 1 dice qué se cierra
- AND el paso 2 cuenta los commits de la rama
- AND el paso 3 lista las filas del roadmap que salda

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
