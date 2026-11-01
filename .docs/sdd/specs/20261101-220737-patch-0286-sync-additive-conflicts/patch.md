---
id: 20261101-220737-patch-0286-sync-additive-conflicts
task: 0286
title: Patch — Un conflicto de `sdd merge --sync` que solo suma no para al dev-lead, y `--sync` va en una llamada propia
type: patch
solution: dev-lead
status: done
created: 2026-11-01
branch: patch/0286-sync-additive-conflicts
commit: pendiente
---

# Patch 0286 — Un conflicto de `sdd merge --sync` que solo suma no para al dev-lead, y `--sync` va en una llamada propia

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Modificadas: `archive` — «Un conflicto de la base solo en docs que junta dos añadidos lo resuelve el agente»: el predicado va por la forma del conflicto en cualquier Markdown, repite el gate, y `--sync` va en una llamada propia.

## 1. Síntoma

Fila 0286 y tickets: tres cierres seguidos (0279 §1, 0163 §3, 0277 §4) pararon al dev-lead por conflictos en `skills/` en los que cada lado añadía algo distinto. En la 0163 §2, una cadena con `;` corrió el gate sobre un árbol con marcas y publicó la rama sin integrar. En la 0276 (menores), `sdd merge --sync` dijo `base: conflicto en` dos ficheros y dejó el índice sin conflictos ni marcas.

## 2. Solución fijada, y causa raíz de lo que era un fallo

Dev-lead, prompt de arranque, 2026-11-01: «El predicado del paso 6 va por la forma del conflicto, no por la ruta: si los dos lados solo añaden o tocan filas distintas de una lista o tabla, y ninguno cambia lo del otro, el agente los junta, repite el gate y lo nombra»; «`--sync` va en una llamada propia, y su salida se lee antes del gate, sustituyendo la frase inicial del paso»; «Comprueba si `sdd merge --sync` sale distinto de 0 con conflicto. Si no, lo arregla, y mira el caso de la 0276».

Lo comprobado:

- **Código de salida**: `--sync` con conflicto ya sale con 1; lo cubre `cli/test/merge/sync.slow.test.ts` («un conflicto fuera de los registros…», `expect(result.code).toBe(1)`). No hay nada que arreglar: el rojo de la 0163 vino del `;`, no del verbo.
- **Causa de la 0276**: `commitResolution` (`cli/src/merge/registries.ts`) devolvía `false` si el hook rechazaba el commit de una resolución completa, y `resolveConflicts` devolvía entonces todos los ficheros como pendientes: `base: conflicto en …` con el índice limpio. Reproducido con un `pre-commit` en rojo: `Received: "base: conflicto en .docs/sdd/roadmap.md."`. El requisito de `control-profiles` ya lo pedía: «si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.`».
- **`keyed.ts` no es más simple**: une filas por id, y el criterio de hecho son dos adiciones dentro de una misma línea. La regla sigue en el paso 6.

## 3. Fix

- **Fichero(s)**: `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/merge-recipe.md`, `cli/src/merge/registries.ts`, `cli/test/merge/sync.slow.test.ts`, `tests/batteries/sdd-archive/battery.md`, `tests/batteries/sdd-archive/subject.mjs`
- **Cambio**: el paso 6 decide por la forma del conflicto en cualquier Markdown, repite el gate y abre con `--sync` en una llamada propia, leída antes de cualquier gate o push. Un hook que rechaza el commit de una resolución completa dice `verificación: el hook rechazó el merge.` y aborta, en vez de `base: conflicto en`. La batería suma `m3` y `m4`.
- **Saldo de palabras**: `SKILL.md` + `merge-recipe.md`, 7293 → 7293 (`wc -w`); `SKILL.md`, 4847 → 4845. Lo paga la lista de rutas que se retira, «by the case» y «and names it» de la receta.
- **Lo que se retira**: la lista de rutas del predicado (`.docs/` fuera de `capabilities/`, `ROADMAP.md`, `CHANGELOG.md`).
- **Límite**: un conflicto en un fichero que no es Markdown sigue parando, también el de un test que une dos listas (criterio de la 0163 §3): el dev-lead acota a Markdown.
- **Decisiones**:
  - El predicado cubre cualquier `*.md`, sin excluir `capabilities/`, y sigue parando ante la duda — dev-lead (prompt de arranque: «por la forma del conflicto, no por la ruta», «Markdown del kit y del proyecto»)
  - Todo conflicto que junta el agente repite el gate, también en `.docs/` — dev-lead (prompt de arranque: «repite el gate»)
  - El hook que rechaza la resolución aborta el merge, como cualquier otro rechazo del hook: relanzar `--sync` la rehace — sin el dev-lead (método; no cambia lo que ve el usuario del kit salvo el mensaje que ya fijaba la capacidad)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `--sync` con conflicto sale distinto de 0 | ✅ ya era así: `sync.slow.test.ts`, `expect(result.code).toBe(1)`; sin cambio |
| 2 | Hook que rechaza una resolución completa (0276) | RED: `Received: "base: conflicto en .docs/sdd/roadmap.md."` → GREEN; `sync.slow` y `failures.slow`, 29/29 |
| 3 | RED `m3`, kit sin la regla (n = 2) | `m3-1` para en el conflicto: «Falta resolver `migrations/v3.0.0.md`»; `m3-2` para antes, por una duda del molde sobre `canceladas`, y no llega al paso 6 |
| 4 | GREEN `m3`: dos adiciones en `**Escribe**` | 2/2: juntadas, suite repetida sobre el merge, línea `Conflicto de la base resuelto por el agente: migrations/v3.0.0.md — …`, y sin cadena de `--sync` con gate o push |
| 5 | GREEN `m4`: los dos lados reescriben la frase | 2/2: no resuelve, «No terminado» |
| 6 | GREEN `m1` y `m2`, controles de la regla anterior | 2/2 y 2/2 |

El recorte final de palabras cayó con el GREEN recién lanzado y se aplicó también a su copia del kit: quita «by the case» y «and names it», sin cambiar la regla.

## 5. Tiempo

- Estimación: 2 h + 0,17 h del gate de cierre (10 min, patches 027x)
- Inicio: 2026-11-01T22:07Z
- Coste de sujetos: 4,42 $ en 10 sujetos sonnet — RED 0,83 $; GREEN 3,59 $

## 6. Delta de capacidad

### Capacidad: `archive`

#### MODIFIED — Un conflicto de la base solo en docs que junta dos añadidos lo resuelve el agente

- GIVEN `sdd merge --sync`, en una llamada propia cuya salida se lee antes de cualquier gate o push, que da `base: conflicto en .docs/sdd/roadmap.md.`, donde la rama pone el prefijo `**[Feature 0235, 2026-10-28: parcial — …]**` a una fila de deuda cuyo «Destino» la base cambió de `**Esperar 2.º ticket**` a `**Actuar → 0236**`
- WHEN el cierre lee el conflicto, en cualquier perfil
- THEN deja la fila con el prefijo de la rama y el «Destino» de la base, commitea el merge de sincronización con el hook, repite el gate y sigue el cierre
- AND el cuerpo del commit y el mensaje final llevan `Conflicto de la base resuelto por el agente: .docs/sdd/roadmap.md — el prefijo de cierre de la rama y el «Destino» de la base en la fila «…»`
- AND lo mismo con una frase que la base añade al final de una línea de `.docs/sdd/tech-stack.md` que la rama reescribe, si no dice lo contrario que la línea de la rama: queda la línea de la rama más la frase de la base
- AND lo mismo fuera de `.docs/`, en cualquier `*.md`: dos adiciones en la línea `**Escribe**` de una migración quedan juntas, y dos filas contiguas de una tabla que toca cada lado quedan con el cambio de cada uno
- AND si los dos lados reescriben la misma frase de forma distinta, si en un trozo ponen dos «Destino» distintos (`**Actuar → 0240**` y `**Descartada**`), si la frase de la base dice lo contrario que la línea de la rama, si el conflicto incluye un fichero que no es Markdown (`src/slots.js`), o ante la duda, no resuelve nada: el cierre queda «No terminado» para una persona
