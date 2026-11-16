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

🦆 Hoy, al cerrar una feature, salen dos mensajes: uno dice qué se cierra y corre el gate de tests, y otro cuenta los commits y las filas del roadmap que se saldan. Tras el cambio sale uno solo: «Se cierra la feature 0042 · gate en verde · 5 commits · salda la fila 0042». Para eso la skill `aviso-cierre` desaparece y sus dos pasos (qué se cierra, correr el gate) pasan a `resumen-cierre`, delante de los que ya tenía. Los pasos de contar commits y listar filas pasan a ser el 3 y el 4.

Validación: dev-lead — son textos que lee y sigue quien cierra una feature; solo una persona puede juzgar si el mensaje único se entiende.

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da el paso 1 de `resumen-cierre`, el gate corre en su paso 2 y el resumen pasa a los pasos 3 y 4.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (dos requisitos de `closing`), unexplored area (`quality-gate` lo he leído, no he leído código fuera de `skills/`) · tamaño: ~25 líneas en 4 ficheros
- Dominio (sonnet): si el nuevo orden de `resumen-cierre` mantiene lo que hoy exige `closing` y si «el gate corre una sola vez» de `quality-gate` sigue siendo cierto con el gate dentro de `resumen-cierre` (señal: MODIFIED)
- Técnica (sonnet): si la renumeración (gate = paso 2, commits = paso 3, filas = paso 4) deja bien las citas «paso 2» de `quality-gate` y los pasos 1 y 2 de «El resumen va al final», y si queda alguna mención de `aviso-cierre` (señal: MODIFIED)
- Mínimo razonable: solo técnica — deja sin mirar si el mensaje único sigue contando lo mismo a quien cierra que los dos de hoy

1. **El gate se mueve, no se pierde.** `aviso-cierre` también decía «Corre el gate»; retirarla sin más dejaba el cierre sin gate (y `quality-gate` habla del «paso 2» de un cierre). El gate pasa a `resumen-cierre`. Alternativa descartada: dejarlo fuera y que lo corra quien cierra a mano, porque rompe «Un gate en rojo para el cierre».
2. **Orden nuevo de `resumen-cierre`:** 1 «Di qué se cierra» · 2 «Corre el gate» · 3 «Cuenta los commits de la rama» · 4 «Lista las filas del roadmap que salda». Motivo: el gate sigue siendo el paso 2, como era en `aviso-cierre`, y `quality-gate` no cambia; y el resumen sigue al final, como dice «El resumen va al final». Alternativa descartada: añadir los dos pasos al final (el gate correría después de contar y anunciar el cierre, y un gate en rojo pararía un cierre ya resumido).
3. **`closing` recoge el nuevo orden:** «El resumen va al final» pasa de «pasos 1 y 2» a «pasos 3 y 4» y dice que va tras el gate (MODIFIED), y un requisito nuevo «El cierre corre el gate» (ADDED) fija que el paso 2 de `resumen-cierre` corre el gate del proyecto. No repite qué pasa si el gate falla ni que corre una vez: eso vive solo en `quality-gate`.
4. **La `description` de `resumen-cierre` cambia** de «Usar al acabar el cierre de una feature.» a «Usar al cerrar una feature.»: ahora arranca el cierre, no lo remata, y la de `aviso-cierre` («Usar al cerrar una feature.») es la que hoy lo dispara.
5. **`quality-gate` no se toca:** sus dos citas del «paso 2» siguen siendo el gate; el requisito ADDED de la decisión 3 es lo que liga ese «paso 2» a `resumen-cierre`.
6. **La fila 0030 del roadmap la salda `sdd-archive` al cerrar**, no esta spec.
7. **Sin `§Frontend` ni capacidad nueva:** no cambia nada que se vea en pantalla y `closing` ya existe.
8. **Delta probado sobre una copia de `.docs/sdd`:** `sdd capability merge` sustituye «Quien cierra sabe qué se cierra» y «El resumen va al final»; `sdd capability check` con la spec: «Capacidades válidas: 14». El `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: dos revisores de la spec en sonnet (la spec no toca reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin código) · sin otros despachos en paralelo · hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Retirar la skill `aviso-cierre` — fila 0030 del roadmap: «Retirar la skill aviso-cierre»
- Que `resumen-cierre` diga también qué se cierra — fila 0030 y la spec previa del dev-lead (Scope «Entra»)

### Hallazgos de la review

- **Aceptado** (dominio 1, 2, 3; técnica 1, 2, 3, 4) — el delta no fijaba el gate ni su dueño → ADDED «El cierre corre el gate», THEN de «Quien cierra sabe qué se cierra» con «el paso 1», y «El resumen va al final» dice que va tras el gate (decisión 3).
- **Aceptado** (dominio 6) — el ejemplo del 🦆 usaba el id real 0030 → ahora 0042.
- **Aceptado** (técnica 7, 8) — «Dónde se prueba» lleva comprobaciones mecánicas: `git grep` del paso 2 y `sdd capability check`.
- **Rechazado** (dominio 4) — «un solo mensaje» como requisito → sale de que solo queda una skill de cierre; lo comprueba el `git grep` de `aviso-cierre`.
- **Rechazado** (dominio 5) — el cambio de disparo no está en el Scope → sí está (`description`, Scope y decisión 4).
- **Rechazado** (dominio 7) — «Laura» como aprobadora → es el nombre que el dev-lead dejó en la cabecera de la spec; no he leído `mission.md` para contrastarlo y lo dejo a tu criterio.
- **Rechazado** (dominio 8, técnica 7 en su parte del lint) — el gate de cierre `node --test && node scripts/lint.mjs` es el de `operations.md`, no el de la constitución; esta spec no lo cambia.
- **Rechazado** (técnica 5) — numerar la línea de review → es el registro del proceso, no una decisión de producto.
- **Rechazado** (técnica 6) — buscar más menciones → `git ls-files` no tiene manifiestos ni README que nombren la skill, y `git grep` de `aviso-cierre` y `0030` fuera de `specs/` solo da `roadmap.md`; las citas de línea las dejo porque son del estado de hoy.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje, sin perder lo que hoy hace cada una: decir qué se cierra, correr el gate y contar el resumen.

Éxito: tras el cambio no queda ninguna mención a `aviso-cierre` fuera de las specs históricas, el gate sigue corriendo una vez en el cierre y el mensaje sale en el orden de la decisión 2. Fracaso aunque «funcione»: que el cierre se quede sin gate.

## Scope

- Entra: se borra `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` pasa a 4 pasos (decisión 2) y cambia su `description` (decisión 4); `.docs/sdd/capabilities/closing.md` se actualiza con el delta.
- No entra: cambiar `aviso-apertura`; cambiar `quality-gate.md` (decisión 5); la fila 0030 del roadmap (decisión 6).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (carpeta y nombre) | `skills/aviso-cierre/SKILL.md:2,6` | Scope: se borra la carpeta |
| el paso «Corre el gate» de `aviso-cierre` | `skills/aviso-cierre/SKILL.md:9` | decisión 1: pasa a `resumen-cierre`, paso 2 |
| el paso «Di qué se cierra» de `aviso-cierre` | `skills/aviso-cierre/SKILL.md:8` | decisión 2: pasa a `resumen-cierre`, paso 1 |
| «`aviso-cierre` dice qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | delta, `MODIFIED` «Quien cierra sabe qué se cierra» |
| el gate de cierre sin dueño en `closing` | `.docs/sdd/capabilities/quality-gate.md:18,23` | delta, `ADDED` «El cierre corre el gate» |
| «paso 1 cuenta los commits» / «paso 2 lista las filas» | `.docs/sdd/capabilities/closing.md:25-26` | delta, `MODIFIED` «El resumen va al final» (pasos 3 y 4) |
| «paso 2» (el gate) | `.docs/sdd/capabilities/quality-gate.md:18,23` | decisión 5: sin cambio, sigue siendo el gate |
| «paso 2» de `aviso-apertura` | `.docs/sdd/capabilities/closing.md:18` | sin cambio: es otra skill |
| `description` de `resumen-cierre` | `skills/resumen-cierre/SKILL.md:3` | decisión 4 |
| fila 0030 | `.docs/sdd/roadmap.md:9` | decisión 6: la salda `sdd-archive` |

- Filas que implementa: 0030 → `.docs/sdd/roadmap.md:9` (decisión 6); ningún otro fichero la nombra: comprobado con `git grep -n 0030 -- . ':!.docs/sdd/specs/'`.

## Approach

`resumen-cierre` pasa a ser el único mensaje de cierre: abre con lo que se cierra, corre el gate, y sigue con el resumen que ya daba. `aviso-cierre` se borra. Un solo camino razonable: reutilizar la skill que ya existe y que `closing` ya nombra; la alternativa (renombrar `aviso-cierre` y borrar `resumen-cierre`) deja `closing` y `quality-gate` apuntando a pasos de otra skill.

## Dónde se prueba

- Mensaje único de cierre: leyendo `skills/resumen-cierre/SKILL.md`, sin test automático (las skills de `skills/` no tienen tests en `test/`); el dev-lead lo valida leyéndolo.
- Que no queda `aviso-cierre`: `git grep -n aviso-cierre -- . ':!.docs/sdd/specs/'` sin resultados.
- Que el gate sigue en el paso 2: `git grep -n '^2\. Corre el gate' -- skills/resumen-cierre/SKILL.md` da una línea; y `node --test && node scripts/lint.mjs` como gate de cierre del proyecto (`operations.md`).
- Que `closing` queda válida: `sdd capability check --path .docs/sdd --artifact <esta spec>` tras fusionar.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN el paso 1 de `resumen-cierre` dice qué se cierra

#### ADDED — El cierre corre el gate

- GIVEN una feature terminada
- WHEN corre `resumen-cierre`
- THEN el paso 2 corre el gate de cierre del proyecto

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 3, posterior al gate, cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
