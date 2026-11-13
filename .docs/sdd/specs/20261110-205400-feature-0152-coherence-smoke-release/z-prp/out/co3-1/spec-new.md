---
id: 20261112-160415-feature-0015-paths-in-fast
feature: 0015
title: El test de rutas pasa a la tarea fast del gate
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El test de rutas pasa a la tarea fast del gate

🦆 Hoy el pre-commit solo corre `fast`, que prueba `src/app.js`; el test que vigila que ninguna ruta del repo pase de 140 caracteres vive en `slow` y no frena nada. Con este cambio, `fast` corre ese test también: si alguien intenta commitear un fichero con una ruta de 141 caracteres, el commit se para. Por dentro, `gate.json` ejecuta los dos ficheros de test en `fast` y `fast` vigila todo el repo, porque ese test mira la lista de ficheros, no solo `src/`; la tarea `slow` desaparece porque se queda vacía.

Validación: agente — es configuración de herramientas: nadie que use `salas` ve ni hace nada distinto, y el agente mide el resultado (el gate corre ambos tests y para con una ruta larga).

## Capacidades

- Ninguna, porque herramientas (`gate.json` no cambia lo que el usuario de `salas` ve ni puede hacer).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin capacidad, sin contrato público, sin MODIFIED, sin datos) · tamaño: ~8 líneas en 1 fichero
- Técnica (sonnet): si `inputs: ["**/*"]` basta para que la caché de `fast` no se salte una ruta larga nueva (decisión 1) y si borrar `slow` deja algún gate o doc apuntándole (decisión 2)
- Mínimo razonable: sin revisión — deja sin mirar el hueco de caché de la decisión 1, justo el que haría que el pre-commit no frenara nada

1. `inputs` de `fast` pasa a `["**/*"]` (el mismo que tenía `slow`) — el test lee `git ls-files`: depende de las rutas de TODO el repo, no de `src/**`. Con `src/**` y los dos tests, un fichero largo añadido en `docs/` no cambiaría ningún input y la caché saltaría `fast`: el pre-commit no pararía justo lo que debe parar. Coste: `fast` ya no se salta cuando solo cambia un doc (~0,3 s medidos en `node --test test/paths.test.js`, no 1 s): ¿lo aceptas?
2. La tarea `slow` se elimina — se queda sin comando y no hay otro candidato; una tarea vacía o duplicada confundiría. Si prefieres conservarla vacía, dilo.
3. `fast` ejecuta `node --test test/app.test.js test/paths.test.js` — un solo proceso `node --test` con dos ficheros, sin cambiar el formato de `command`.
4. `test/cancel.test.js` sigue sin estar en ninguna tarea — lo vi (no está ni en `fast` ni en `slow`), no es lo que se pidió y lo cubre el gate de cierre (`node --test` entero). Va a «No entra».
5. Enfoque: A (una tarea `fast` con los dos tests y `**/*`), frente a B (`fast` con `src/**` y los dos tests: hueco de caché, decisión 1) y C (una tarea `paths` aparte en el pre-commit: contradice «pasa a la tarea fast») — ver Approach.
- Política de modelos: un revisor de spec (sonnet) · ejes de la revisión final según el plan · sin otros despachos en paralelo.

6. `sin medir`: que `inputs: ["**/*"]` invalide la caché con rutas nuevas bajo `.docs/` (punto inicial) y con ficheros solo añadidos al índice — el repo no trae el motor de la caché a mano; la Task 1 lo mide antes de dar nada por bueno (ver «Dónde se prueba»), y si no invalida, `inputs` añade `.*/**`.
7. `sin medir`: que algún hook o CI invoque `fast` en el pre-commit — `operations.md:16` lo afirma, pero en el repo no hay hook (`.git/hooks` solo trae `*.sample`, sin `core.hooksPath`) ni CI. El cableado queda fuera (No entra); lo que esta spec garantiza es que `fast` falla con una ruta larga.
8. Pendiente de tu respuesta en el gate: que cablear el pre-commit quede fuera (decisión 7) y que `fast` deje de ser una tarea acotada por inputs (decisión 1; alternativa D en Approach).

### Hallazgos de la review

- **Aceptado** — Crítico: la caché podría no ver rutas con punto inicial ni ficheros solo en el índice → decisión 6 `sin medir` y medición obligatoria en «Dónde se prueba», con `.*/**` de reserva.
- **Aceptado** — Crítico: la prueba manual no distinguía A de B → ahora usa ficheros en `docs/` y `.docs/`, tras un `fast` en verde con la caché poblada.
- **Aceptado** — Importante: no hay hook de pre-commit en el repo → decisión 7; el Intent baja de «frena el commit» a «`fast` falla».
- **Aceptado** — Importante: «2 tests corridos» es frágil → el criterio es que la salida lista `test/app.test.js` y `test/paths.test.js` con 0 fallos.
- **Aceptado** — Importante: eliminar `slow` y llamadas por nombre → `git grep` sin hits fuera de `gate.json`; sin CI en el repo (`.github/` no existe); lo que invoque el kit por nombre lo mira la Task 1 antes de borrar.
- **Aceptado** — Importante: el coste de `fast` no consta aceptado → queda como pregunta abierta (decisión 8), no como decidido; se añade la alternativa D.
- **Aceptado** — Menor: patrón de `operations.md` retórico → decisión 3 reformulada; `cancel.test.js` solo se menciona (decisión 4), sin tocar `debt.md`; límite de `git ls-files` → Intent.
- **Rechazado** — Menor: subir la revisión a obligatoria y fijar aprobador → la rúbrica da un revisor y `approvers` se rellena al aprobar.

### Decisiones tomadas con el dev-lead

- `test/paths.test.js` pasa de la tarea `slow` a la tarea `fast` de `gate.json` — «porque tarda 1 s y debe frenar el pre-commit»

## Intent

Hoy `test/paths.test.js` (ninguna ruta de `git ls-files` pasa de 140 caracteres) está en `slow` y el pre-commit corre solo `fast`: una ruta demasiado larga se cuela y solo la pilla el gate de cierre. Debe fallar donde se corre `fast` (el pre-commit según `operations.md`; el cableado no está en el repo, decisión 7). Solo vigila rutas ya seguidas o añadidas al índice (`git ls-files`). Éxito: con `fast` en verde, no hay rutas >140; con una de 141 añadida al índice, `fast` falla. Fracaso aunque «funcione»: mover el test pero que la caché salte `fast` al añadir el fichero largo.

## Scope

- Entra: `gate.json` — `fast` ejecuta ambos tests con `inputs: ["**/*"]`; se elimina `slow`.
- No entra: el cableado del pre-commit (decisión 7), `test/cancel.test.js` (decisión 4), `operations.md` (su línea 16 ya dice «el pre-commit corre `fast`»: sigue cierta), el contenido de los tests, el gate de cierre.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| tarea `slow` | `gate.json:10-14`; sin más hits en el repo (`git grep -nE "slow\|paths\.test\|gate\.json"` fuera de `.docs/sdd/specs`) salvo `operations.md:16`, que habla solo de `fast` | decisión 2 |
| `inputs` de `fast` (`src/**`, `test/app.test.js`) | `gate.json:4-7` | decisión 1 |

- Filas que implementa: nada: comprobado con `git grep -n "0015" -- ROADMAP.md` (la 0015 no tiene fila en el roadmap).

## Approach

- A — una tarea `fast`: comando con ambos ficheros, `inputs: ["**/*"]` — la más simple; cuesta que `fast` reaccione a cualquier cambio (~0,3 s).
- B — `fast` con `inputs` estrechos (`src/**` + los dos tests) — más caché, pero un fichero largo nuevo fuera de `src/` no invalida la caché: el test no corre y el commit no se frena.
- C — tarea `paths` aparte, también en el pre-commit — mantiene cachés separadas, pero el dev-lead pidió moverlo a `fast`, y el pre-commit tendría que conocer otra tarea.
- D — `fast` con `inputs` estrechos y una tarea `paths` aparte con `**/*`, ambas en el pre-commit — conserva la caché estrecha de `fast`, pero el dev-lead pidió moverlo a `fast` y el pre-commit tendría que correr dos tareas.
- Elegido: A — corrige B su hueco de caché sin añadir piezas (C).

```json
"fast": {
  "command": "node --test test/app.test.js test/paths.test.js",
  "inputs": ["**/*"]
}
```

## Dónde se prueba

- `fast` corre ambos tests: ejecutar la tarea `fast` y ver en la salida `test/app.test.js` y `test/paths.test.js` con 0 fallos.
- La caché no se salta una ruta larga (comprobación del agente, sin test nuevo): con `fast` en verde y la caché poblada, `git add` de un fichero de 141 caracteres de ruta en `docs/` y repetir → `fast` falla, no se salta; retirarlo, verde; repetir con otro bajo `.docs/`. Si algún caso se salta, `inputs` añade `.*/**`. No hay en el repo un ejecutor del gate (ni Moon ni hook): la Task 1 usa el que dé el kit para `gate.json`, anota qué comando y si su salida distingue «saltada» de «ejecutada»; si no la distingue, el hueco de caché queda `sin medir` y se dice en el cierre. Salida en el walkthrough. Rutas ASCII (límite de `git ls-files` con no ASCII, test sin tocar).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no cambia comportamiento observable.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
