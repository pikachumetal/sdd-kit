---
id: 20261115-200421-feature-0015-paths-in-fast
feature: 0015
title: El test de rutas pasa a la tarea fast del gate
mode: full
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El test de rutas pasa a la tarea fast del gate

🦆 Hoy el pre-commit solo corre `app.test.js`: la comprobación de que ninguna ruta del repo pasa de 140 caracteres vive en la tarea lenta y no frena nada. Con el cambio, esa comprobación forma parte de `fast`: si alguien añade `docs/…` con una ruta de 141 caracteres, `fast` falla (con 140 pasa) y el fichero no entra. Para no abrir un hueco, `fast` pasa a mirar todos los ficheros del repo, no solo `src/` y los tests, porque la ruta larga puede estar en cualquier sitio. La tarea `slow` desaparece, porque se queda sin tests.

Validación: agente — es configuración de herramientas: nada de lo que ve o hace el usuario del producto cambia, y lo que importa (el comando y los `inputs` de `gate.json`) se mide corriendo el comando.

## Capacidades

- Ninguna, porque herramientas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna contada (sin capacidad nueva, contrato público, `MODIFIED`, datos ni dependencias) · tamaño: ~10 líneas en 1 fichero de código (`gate.json`), más esta spec
- Técnica (sonnet, siete puntos): si los `inputs` `**/*` cubren lo que lee `git ls-files` y si el comando de dos ficheros puede dejar sin correr el test de rutas — es el único riesgo del cambio (decisiones 1 y 2)
- Mínimo razonable: sin review — deja sin mirar ese mismo riesgo del caché

1. **`inputs` de `fast` = `**/*`** — `paths.test.js` lee `git ls-files`: su resultado cambia con cualquier fichero del repo, no solo con `src/**` y los tests. Con los `inputs` de hoy (`src/**`, `test/app.test.js`), añadir `docs/<ruta de 141 caracteres>` dejaría `fast` saltada por el caché y la ruta larga entraría. Es el mismo valor que tenía `slow`. Coste: `app.test.js` se vuelve a correr con cualquier cambio, aunque sea solo de documentos (medido con `node --test test/app.test.js test/paths.test.js`: 0,49 s los dos, 0,39 s `app.test.js` solo, ~0,1 s de más; el «1 s» del dev-lead incluye el arranque de la herramienta).
2. **El comando de `fast` pasa a `node --test test/app.test.js test/paths.test.js`** — una sola tarea, porque el pre-commit solo corre `fast` y una tarea nueva no se ejecutaría.
3. **Se borra la tarea `slow`** — su único test se va a `fast`; una tarea sin comando no es válida y dejarla con otro test inventaría trabajo.
4. **Fuera de alcance: `test/cancel.test.js`** — no está en ninguna tarea de `gate.json` (ni antes ni después). Lo veo al leer `gate.json`; no lo toco porque nadie lo pidió. Si quieres, va a su propia fila del roadmap.
5. **Fuera de alcance: el pre-commit** — `operations.md` dice que corre `fast`, pero en el repo no hay ningún hook instalado (`.git/hooks` solo trae los de ejemplo) ni el programa que lee `gate.json`. La spec asume que `fast` es lo que el pre-commit corre, como dice `operations.md`; no lo he medido.
6. **Sin delta de capacidad ni fusión** — no hay `capabilities/` y el cambio no toca comportamiento observable; el paso del delta sobre una copia no aplica.
7. **Enfoque: A, frente a B y C (ver Approach)**.
8. **`mode: full` y `Validación: agente`** — pediste la spec en su carpeta, así que es feature y no config; la validación es del agente porque es configuración de herramientas y el comando se mide corriéndolo.
9. **El gate de cierre no depende de `slow`** — `operations.md` lo define como `node --test && node scripts/lint.mjs`, que sigue corriendo `paths.test.js`; borrar `slow` no quita ninguna comprobación del cierre.
10. **`inputs` = `["**/*", ".docs/**"]`** — muchos globs no casan directorios con punto y las rutas más largas del repo están en `.docs/…` (único directorio con punto además de `.git`). `.docs/**` es un superconjunto sin coste y cierra ese caso sin medir. No añado `.*/**` porque casaría `.git/`, que cambia en cada commit y dejaría el caché inservible.
11. **Hueco aceptado: lo que el programa de caché hashea** — no sé si hashea solo el contenido (un `git mv` a una ruta larga no lo cambia), ni si mira el índice o el árbol de trabajo. El programa que lee `gate.json` no está en el repo: queda `sin medir`, con dueño el dev-lead, y aprobarías sabiéndolo.
12. **Sin plan de varias tareas** — se prevé 1 task (editar `gate.json` y medir); no se propone partir. Un revisor, y no dos, por tamaño (~10 líneas, sin contrato público ni `MODIFIED`).

### Hallazgos de la review

- **Aceptado** — Importante: sin escenario con datos para «ruta larga → `fast` falla» → «Dónde se prueba» lleva ahora dos escenarios medidos (140 pasa, 141 falla).
- **Aceptado** — Crítico: la garantía del caché solo «por lectura» → decisión 10 la declara hueco aceptado y el Intent ya no promete el pre-commit, sino el comando y el caché de `fast`.
- **Aceptado** — Importante: semántica del glob y del hash → decisión 10.
- **Aceptado** — Importante: el Intent prometía un pre-commit que el Scope no entrega → Intent reformulado; el pre-commit pasa a suposición (decisión 5).
- **Aceptado** — Menor: bloque de review contradictorio → reescrito.
- **Aceptado** — Menor: cifras 0,5 / 0,3 / 1 s → una medición con su comando (decisión 1).
- **Aceptado** — Menor: decisiones sin listar (`mode`, `Validación`, gate de cierre) → decisiones 8 y 9.
- **Aceptado** — Menor: `git grep` con la exclusión equivocada → corregido en «Lo que se retira».
- **Aceptado** — Menor: nombre exacto del test y ejemplos 140/141 → en «Dónde se prueba».

Segunda ronda (un Crítico aceptado en la primera):

- **Aceptado** — Crítico: `**/*` puede no casar `.docs/…` → decisión 10 añade `.docs/**`; el criterio de éxito del Intent se mantiene para rutas en cualquier carpeta.
- **Rechazado en parte** — Crítico: proponía `.*/**` → casaría `.git/`, que cambia en cada commit; va `.docs/**`, el único directorio con punto del repo.
- **Aceptado** — Importante: los escenarios 140/141 pasarían con `gate.json` sin tocar → «Dónde se prueba» añade una comprobación sobre el propio `gate.json` y el orden rojo/verde.
- **Aceptado** — Importante: hash y árbol/índice sin declarar → decisión 11.
- **Aceptado** — Importante: el motivo «frenar el pre-commit» no lo entrega el cambio → ya estaba en decisión 5 y en el Intent; el Approach deja de usarlo como criterio y cita `operations.md:16`.
- **Aceptado** — Menores: `mode` (decisión 8, que pide confirmación al aprobar), revisor único (decisión 12), búsqueda sin CI ni `scripts/` (el `git grep` ya cubre `scripts/`; no hay `.github`), fórmula del borde 140/141.

### Decisiones tomadas con el dev-lead

- `test/paths.test.js` pasa de la tarea `slow` a la tarea `fast` de `gate.json` — «porque tarda 1 s y debe frenar el pre-commit» (dicho al invocar el paso 4).

## Intent

Hoy `test/paths.test.js` («ninguna ruta del repo pasa de 140 caracteres») está en la tarea `slow` de `gate.json`, que el pre-commit no corre: una ruta larga solo se descubre en el gate de cierre. El dev-lead lo quiere en el pre-commit porque tarda ~1 s. Éxito, medible: con una ruta de 141 caracteres añadida a cualquier carpeta, el comando de `fast` falla, y la tarea no se salta por caché aunque `src/` y los tests no hayan cambiado; con una de 140 pasa. Que eso frene el commit depende del pre-commit, que el cambio no instala (decisión 5). Anti-objetivo: que el caché de `fast` se salte el test cuando la ruta larga está fuera de `src/` y de los tests; sería peor que no tenerlo, porque parecería protegido.

## Scope

- Entra: en `gate.json`, la tarea `fast` corre también `test/paths.test.js` y tiene `inputs: ["**/*", ".docs/**"]`; se borra la tarea `slow`.
- No entra: `test/cancel.test.js` y el resto de tests fuera de `gate.json`; instalar el hook de pre-commit o el programa que lee `gate.json`; cambiar `operations.md` (ya dice que el pre-commit corre `fast` y no nombra `slow`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tarea `slow` | `gate.json:10-16` | Scope y decisión 3 |
| `inputs` y comando de `fast` | `gate.json:3-9` | Scope y decisiones 1, 2 y 10 |

- Filas que implementa: nada: comprobado con `git grep -n "0015" -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs'` (sin resultados; las carpetas de changes y specs son evidencia, excluida) · `git grep -niE "slow|fast|gate\.json" -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs'` solo da `gate.json` y `operations.md:16`, que dice «El pre-commit corre `fast`» y sigue siendo cierto.

## Approach

- A. Mover el test a `fast`, con `inputs: ["**/*"]` y un solo comando de dos ficheros — es la única forma de que el test se corra siempre que su resultado pueda cambiar; cuesta repetir `app.test.js` en cambios que solo tocan documentos (~0,1 s).
- B. Mover el test a `fast` dejando los `inputs` actuales más `test/paths.test.js` — más barato en caché, pero un fichero largo fuera de `src/` pasa sin que el test corra: un hueco silencioso.
- C. Tarea nueva `paths` en `gate.json`, con `inputs: ["**/*"]` — separa los cachés, pero el pre-commit corre solo `fast` (`operations.md:16`), así que no frenaría nada.
- Elegido: A — protege de verdad al coste de ~0,1 s; B tiene el hueco y C deja el test fuera de la única tarea que corre el pre-commit según `operations.md:16`.

`gate.json` queda así:

```json
{
  "tasks": {
    "fast": {
      "command": "node --test test/app.test.js test/paths.test.js",
      "inputs": ["**/*", ".docs/**"]
    }
  }
}
```

## Dónde se prueba

Ambos escenarios se miden sobre el comando de `fast`, añadiendo con `git add -N` un fichero a `docs/` y quitándolo después; el test es «ninguna ruta del repo pasa de 140 caracteres», que lee `git ls-files` desde la raíz:

- Ruta `'docs/' + 'a'.repeat(135)` (140 caracteres, relativa a la raíz, con `/`): el comando sale con código 0 y 3 tests en verde (medido el 2026-11-15).
- Ruta `'docs/' + 'a'.repeat(136)` (141): sale con código 1, 2 tests en verde y 1 fallo, el de rutas (medido el 2026-11-15).
- Orden rojo/verde, con el comando leído de `gate.json` (`node -e` que lo extrae y ejecuta), no copiado: con el `gate.json` de hoy, el escenario de 141 sale con código 0 (rojo: `fast` no corre el test); tras la edición, con código 1 (verde).
- Forma de `gate.json`: `node -e` que lee el fichero y comprueba que `Object.keys(tasks)` es `["fast"]`, que el comando es el de dos ficheros y que `inputs` es `["**/*", ".docs/**"]`.
- Que el caché no se salta `fast` con una ruta larga fuera de `src/`: por lectura de `gate.json` y `sin medir` con el programa real, que no está en el repo (decisión 11).
- No hay prueba nueva de código: no hay código nuevo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio no toca comportamiento observable del producto (ver Capacidades).

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
