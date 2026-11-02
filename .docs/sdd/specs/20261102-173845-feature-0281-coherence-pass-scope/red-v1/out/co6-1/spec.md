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

- Modificadas: `closing` — el aviso de cierre y el gate los da `resumen-cierre`, y sus pasos se renumeran.

## Decisiones que he tomado yo — valida estas

1. `resumen-cierre` gana una línea con lo que se cierra (tu decisión de partida) y queda como su **paso 1**.
2. **El gate no se pierde.** `aviso-cierre` también tenía el paso «Corre el gate»; retirarla lo dejaría sin dueño y rompería «El gate corre una sola vez» y «Un gate en rojo para el cierre», que hablan del «paso 2». Lo paso a `resumen-cierre` como **paso 2**, así esas dos capacidades siguen verdaderas sin tocarlas. Alternativa descartada: dejar el gate fuera de las skills (nadie lo correría al cerrar).
3. **Los pasos de `resumen-cierre` se renumeran**: contar commits pasa a paso 3 y listar filas del roadmap a paso 4. Por eso «El resumen va al final» es un `MODIFIED` más, y «el resto de la skill sigue igual» de tu petición ya no es literal.
4. La `description` de `resumen-cierre` pasa de «Usar al acabar el cierre de una feature» a «Usar al cerrar una feature»: ya no solo corre al final.
5. Review de spec: ninguna. Señales: `MODIFIED` (2 requisitos de `closing`); sin capacidad nueva, contrato, datos ni dependencia. Tamaño: ~12 líneas en 3 ficheros. Cubierto por la pasada de coherencia.
6. Delta probado en una copia de `.docs/sdd` fuera del repo: `capability merge` → «sustituido "Quien cierra sabe qué se cierra"», «sustituido "El resumen va al final"», salida 0.
7. Corregido en la pasada de coherencia: la tabla de retiros estaba vacía y la fila «0030 → nada» era falsa (la fila 0030 de `roadmap.md` es la que esto implementa).

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` pasa a tener 4 pasos (qué se cierra · gate · commits · filas del roadmap) y nueva `description`; se actualiza el requisito de `capabilities/closing.md` que nombra `aviso-cierre`.
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (carpeta `skills/aviso-cierre/`) | `skills/aviso-cierre/SKILL.md` | se borra |
| su paso 1 «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | pasa a paso 1 de `skills/resumen-cierre/SKILL.md` |
| su paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md` | pasa a paso 2 de `skills/resumen-cierre/SKILL.md` |
| `aviso-cierre` en el requisito «Quien cierra sabe qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | `MODIFIED` en el delta: ahora `resumen-cierre` |
| pasos 1 y 2 de `resumen-cierre` en «El resumen va al final» | `.docs/sdd/capabilities/closing.md:35-38` | `MODIFIED` en el delta: pasos 3 y 4 |
| «paso 2» en «El gate corre una sola vez» y «Un gate en rojo para el cierre» | `.docs/sdd/capabilities/closing.md:17-26` | sin cambio: el gate sigue siendo el paso 2 |
| `aviso-apertura` | `.docs/sdd/capabilities/closing.md:30`, `skills/aviso-apertura/` | sin cambio (fuera de alcance) |
| `aviso-cierre` en título, intención y roadmap | `.docs/sdd/roadmap.md:9` (fila 0030) | la fila la cierra `sdd-archive` al saldarla |

- Filas que implementa: 0030 (`roadmap.md`, «Retirar la skill aviso-cierre»). Buscado `grep -rniE "aviso-cierre|resumen-cierre" --exclude-dir=.git .`: sin más apariciones (README, PRODUCT, `src/`, `test/` y `scripts/` no la citan).

## Approach

`resumen-cierre` queda con cuatro pasos: 1. Di qué se cierra. 2. Corre el gate. 3. Cuenta los commits de la rama. 4. Lista las filas del roadmap que salda. `aviso-cierre` se borra.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre` (paso 1 dice qué se cierra, paso 2 corre el gate, pasos 3 y 4 como antes).
- que `aviso-cierre` no existe: `skills/aviso-cierre/` ausente y sin menciones en `skills/` ni `capabilities/`.
- Gate de cierre: `node --test && node scripts/lint.mjs` (de `operations.md`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN el paso 1 de `resumen-cierre` dice qué se cierra
- AND `aviso-cierre` ya no existe

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 3 cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
