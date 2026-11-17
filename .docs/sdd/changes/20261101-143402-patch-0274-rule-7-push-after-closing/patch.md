---
id: 20261101-143402-patch-0274-rule-7-push-after-closing
task: 0274
title: Patch — La regla 7 de CLAUDE.md publica la rama tras el commit de cierre
type: patch
solution: dev-lead
status: done
created: 2026-11-01
branch: patch/0274-rule-7-push-after-closing
commit: 47e17437
---

# Patch 0274 — La regla 7 de `CLAUDE.md` publica la rama tras el commit de cierre

Validación: agente, perfil `delegate` con `validation.mode: field` — lo que cambia es una frase de una regla de este repo, y su comprobación es literal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la regla 7 de `CLAUDE.md`, que es una regla de trabajar en este repo.

## 1. Síntoma

Ticket de la feature 0206, §2: «publiqué la rama para la CI antes del commit de cierre; `sdd-archive`, paso 5, pide juntar la pasada de fix en el cierre, y `git push -f` lo paró el hook del dev-lead». Segundo caso en el ticket de la 0257, §3, con el mismo bloqueo.

## 2. Solución fijada

Encargo del dev-lead y fila 0274 del roadmap: «la regla 7 de CLAUDE.md dice que el primer push de la rama va tras el commit de cierre»; «sustituye "antes de cada `sdd merge`" sin alargar la regla».

Comprobado lo que da por existente: la regla 7 está en `CLAUDE.md:36` y `.github/workflows/ci.yml` corre en los pushes a `feature/**` y `patch/**`.

## 3. Fix

- **Fichero(s)**: `CLAUDE.md`
- **Cambio**: el título de la regla 7 fija el primer push tras el commit de cierre y conserva la lectura de la CI antes del `sdd merge`. Para no alargarla salen «publícala con», «la orden de» y una «y».
- **Decisiones**:
  - El primer push va tras el commit de cierre y el rojo sigue arreglándose con commits nuevos en la rama — dev-lead
  - `sdd-archive` no se toca: el paso 5 junta sin decir cuándo se publica, el paso 6 integra la base tras el cierre y `commit-milestones.md` ya prohíbe juntar lo publicado; nada dice lo contrario — sin el dev-lead

## 4. Verificación

Sin test automático: `cli/test/kit/` no comprueba el texto de `CLAUDE.md`, y un test de una frase solo la repetiría.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | La regla 7 fija el primer push tras el commit de cierre | ✅ `CLAUDE.md:36`, «Primer push de tu rama tras el commit de cierre» |
| 2 | Sigue pidiendo mirar la CI antes del merge | ✅ «antes del `sdd merge`, mira su CI» y «con `failure` no fusiones» |
| 3 | No sube su número de palabras | ✅ 80 palabras antes y 80 después, separando por espacios |
| 4 | `sdd-archive` no dice lo contrario | ✅ pasos 5 a 7 y `merge-recipe.md` leídos; `skills/` no nombra la regla 7 |

Gate: no corre, la rama solo toca `.docs/` y `*.md`. El pre-commit del fix sí corrió: `cli:test` en verde, 3 tareas completadas.

Validación en campo: 2026-11-01 · smoke 4/4 casos por lectura literal y recuento de palabras · no probado: el primer cierre real con la regla nueva

## 5. Tiempo

- Estimación: 0,25 h + 0,02 h del gate de cierre (80 s, patch 0267)
- Inicio: 2026-11-01T14:34Z
- Esfuerzo real: 0,05 h — reloj de la sesión 0,05 h desde 2026-11-01T14:32Z, sin 0 min de espera al dev-lead (0 esperas). Medido antes del commit de cierre y sin la espera de la CI. Desvío de más del 30 % a la baja: el encargo traía la solución y el cambio es una frase.
- Coste de sujetos: no aplica
