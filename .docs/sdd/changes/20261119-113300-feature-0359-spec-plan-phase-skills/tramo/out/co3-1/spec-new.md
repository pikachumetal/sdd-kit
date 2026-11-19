---
id: 20261119-161216-feature-0015-paths-in-fast
feature: 0015
title: El test de longitud de rutas pasa a la tarea fast
mode: lite
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El test de longitud de rutas pasa a la tarea fast

🦆 Hoy, si alguien añade un fichero con una ruta de más de 140 caracteres, el pre-commit lo deja pasar: solo lo vería la tarea `slow`, que no corre al commitear. Con el cambio, la tarea `fast` (la que corre el pre-commit, según `operations.md`) lo frena: `docs/…/…` con 141 caracteres → falla el test `ninguna ruta del repo pasa de 140 caracteres`. Para que la caché no se salte el test cuando solo cambia un fichero fuera de `src/`, la tarea `fast` pasa a depender de todos los ficheros.

Validación: dev-lead — el agente mide el comando (`node --test …` en verde y en rojo con una ruta de 141), pero no la caché del ejecutor, que vive fuera del repo: eso lo comprueba el dev-lead con su ejecutor (ver «Riesgos abiertos»).

## Capacidades

- Ninguna, porque herramientas

## ✋ Decisiones que he tomado yo — valida estas

1. Id `0015` — viene de la rama `feature/0015-paths-in-fast`; no hay fila en `ROADMAP.md` ni pude correr `sdd id` (no está en el PATH). **Pendiente**: confirmar que la 0015 no la ha reservado otro clon.
2. Modo lite — un solo fichero de configuración y sin comportamiento observable nuevo; no hay plan aparte.
3. Enfoque A (ver Approach) frente a B y C — la caché obliga a ensanchar las entradas de `fast`.
4. `fast` pasa a `node --test test/app.test.js test/paths.test.js` (una sola invocación) y a `inputs: ["**/*"]` — el valor que ya tenía `slow` para este test, porque el test lee `git ls-files`, o sea cualquier fichero del repo.
5. **Pendiente de confirmar**: se elimina la tarea `slow` de `gate.json` — se queda sin tests y nada la nombra (`grep slow` solo la encuentra en `gate.json`).
6. Línea 16 de `operations.md`, texto nuevo: `- Tareas: `gate.json`, con caché: una tarea se salta si no cambia ninguno de sus `inputs`. El pre-commit corre `fast`, que incluye la comprobación de rutas (`test/paths.test.js`).` — para que la doc no contradiga a `gate.json`; de paso, el espacio que faltaba tras «Tareas:».
7. Validación `dev-lead` en vez de `agente` — la caché y el hook no se pueden medir desde el repo.
8. Sin test automático nuevo (excepción a la constitución §2, **valídala**): el test ya existe y solo se mueve; uno nuevo para «141 falla» exigiría un repo git temporal. Lo propongo como mejora aparte si lo quieres.
9. `test/cancel.test.js` no está en ninguna tarea de `gate.json` (solo lo ejecuta el gate de cierre, `node --test`): lo vi, no lo toco — no era lo pedido.
10. Repaso de coherencia: `git grep` de `slow`, `paths.test`, `fast` y `140` fuera de la carpeta de cambios solo encuentra `gate.json` (`slow`, `fast`, el comando), `operations.md:16` (`fast`) y `test/paths.test.js` (`140`), los tres ya en la tabla. Sin delta de capacidades, no hay `capability merge` que probar. Medido: `node --test test/app.test.js test/paths.test.js` → 3 pass en 0,4 s (el test de rutas tarda ~43 ms aquí; la ruta más larga mide 63).
- Política de modelos: un revisor de spec (sonnet, más una segunda lectura) · sin revisión final por ejes (lite, sin código de producto) · sin otros despachos en paralelo

### Hallazgos de la review

Review de spec propuesta: un revisor (sonnet) — lite; señales: ninguna del rubric · tamaño: ~15 líneas en 2 ficheros. Mínimo razonable: el mismo; deja sin cubrir lo que solo vería quien tenga el ejecutor.

- **Aceptado** (Crítico) — la caché puede saltar el test con un fichero largo ya existente sin rastrear → «Riesgos abiertos»: se declara como límite conocido; no se cambia el enfoque porque `inputs` no expresa el índice y el ejecutor no está en el repo.
- **Aceptado** — el criterio de éxito nombraba el pre-commit, que no se prueba → ahora es «`fast` falla».
- **Aceptado** — comprobar `gate.json` leyéndolo era una tautología → pasa a riesgo abierto.
- **Rechazado** — falta un test automático (constitución §2) → el test ya existe y solo se mueve; uno nuevo necesitaría un repo temporal: queda como excepción a §2 en ✋ 8, para que la valide el dev-lead.
- **Aceptado** — semántica de globs / dotfiles sin comprobar → «Riesgos abiertos».
- **Aceptado** — `slow` quizá lo invoca algo fuera del repo → decisión 5 marcada pendiente.
- **Aceptado** — cifras de tiempo → corregidas a 0,4 s medidos.
- **Aceptado** — atribución de A → corregida en Approach.
- **Aceptado** — id 0015 → ya era pendiente (decisión 1).
- **Aceptado** — texto exacto de `operations.md:16` → en decisión 6.

Segunda vuelta (un revisor sonnet):
- **Aceptado** (Crítico) — el riesgo de la caché anula el objetivo si se cumple → condición de aprobación explícita y Validación pasa a `dev-lead`.
- **Aceptado** — política de modelos contradictoria, coste de A (`fast` corre en casi todo commit), limpieza con `git rm -f`, texto del repaso, cita de «1 s» anotada, id y `slow` como condición de aprobación.
- **Aceptado con matiz** — test automático para «141 falla»: no se añade; queda como excepción a §2 en ✋ 8 para que la valides.

### Decisiones tomadas con el dev-lead

- `test/paths.test.js` pasa de `slow` a `fast` — «test/paths.test.js pasa de la tarea slow a la tarea fast de gate.json, porque tarda 1 s y debe frenar el pre-commit» (medido aquí: ~43 ms el test, 0,4 s los dos; no cambia la decisión)

## Intent

Hoy `test/paths.test.js` (ninguna ruta de `git ls-files` pasa de 140 caracteres) vive en `slow`, que el pre-commit no corre: una ruta larga solo salta en el gate de cierre. Importa porque el fallo llega tarde, con la ruta ya commiteada. Éxito (condicionado a la caché, ver «Riesgos abiertos»): con un fichero rastreado de 141 caracteres de ruta, `fast` falla; con todas ≤ 140, pasa. Que el pre-commit invoque `fast` lo dice `operations.md`; el hook no está en el repo y no se prueba aquí.
Anti-goal: mover el test a `fast` dejando sus `inputs` en `src/**` y `test/app.test.js`. Parecería hecho y no frenaría nada: la caché se saltaría el test al añadir un fichero largo en cualquier otra carpeta.

## Scope

- Entra: `gate.json` (mover el test, ensanchar `inputs` de `fast`, quitar `slow`) y la línea «Tareas» de `operations.md`.
- No entra: cambiar el límite de 140; tocar `test/paths.test.js`; meter `test/cancel.test.js` en `gate.json`; el hook de pre-commit (ya corre `fast`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| tarea `slow` | `gate.json` | Scope · decisión 5 |
| `inputs` de `fast` (`src/**`, `test/app.test.js` → `**/*`) | `gate.json` | Approach · decisión 4 |
| «El pre-commit corre `fast`» (ahora incluye rutas) | `.docs/sdd/steering/operations.md:16` | Scope · decisión 6 |

- Filas que implementa: nada: comprobado con `grep -n 0015 ROADMAP.md` (sin resultados).

## Approach

- A. Un solo `fast` con ambos tests y `inputs: ["**/*"]` — cuesta que `fast` se ejecute en casi todo commit (con `**/*` cualquier cambio la invalida, incluso un `.md` o `gate.json`) y que `test/app.test.js` se repita con ella: ~0,4 s por commit, medido (medido: los dos tests juntos tardan 0,4 s).
- B. Un solo `fast` con ambos tests y las entradas actuales — el test se saltaría por caché con ficheros nuevos fuera de `src/`; descarta el objetivo.
- C. Tercera tarea `paths` y que el pre-commit corra `fast` y `paths` — separa la caché, pero contradice lo decidido (el test pasa a `fast`) y exige tocar el hook.
- Elegido: A — el dev-lead decidió mover el test a `fast`; A frente a B es consecuencia de la caché (B no cumple el objetivo) y A frente a C es mía (ver ✋ 3).

`gate.json` queda:

```json
{
  "tasks": {
    "fast": {
      "command": "node --test test/app.test.js test/paths.test.js",
      "inputs": ["**/*"]
    }
  }
}
```

### Riesgos abiertos

- El ejecutor de tareas y el hook de pre-commit viven fuera del repo: no se puede comprobar aquí que `**/*` cuente dotfiles y `.docs/**` (donde están las rutas más largas), ni que `fast` se invalide al cambiar solo el índice. Caso concreto: un fichero largo sin rastrear, `fast` ya corrido en verde, y luego `git add`: el contenido del árbol no cambia, la caché puede saltar el test (que lee `git ls-files`). `inputs` no puede expresar «el índice». Se acepta como límite conocido; **condición de aprobación**: el dev-lead lo comprueba con su ejecutor (y confirma el id 0015 y la retirada de `slow`) antes de aprobar. Si la caché salta el test en ese caso, el objetivo del Intent solo se cumple a medias y habría que cambiar de enfoque (p. ej. una entrada derivada de `git ls-files`).
- Nada del repo nombra `slow`, pero el ejecutor, el hook o la CI podrían invocarla por nombre: quitarla es decisión 5, pendiente de que el dev-lead lo confirme.

## Dónde se prueba

- Que el test sigue pasando en `fast`: `node --test test/app.test.js test/paths.test.js` en verde, como el test actual.
- Que frena una ruta larga: se crea un fichero con ruta de 141 caracteres y se hace `git add`, se ejecuta el mismo comando y debe fallar; se limpia con `git rm -f` y vuelve a pasar. Manual, no queda test.
- Que la caché no lo salta: no se puede comprobar en el repo (ver «Riesgos abiertos»); leer `gate.json` solo confirma lo escrito. Sin test automático nuevo: la regla ya la prueba `test/paths.test.js`, y un test nuevo para «141 falla» necesitaría un repo git temporal; es una excepción a la constitución §2 (tests antes que código) declarada en ✋ 8 (el test ya existe y solo se mueve).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no cambia comportamiento observable del producto.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0.3h
- Estimación de implementación: 0.3h
- Base de la estimación: dos ficheros pequeños y una comprobación manual; sin incertidumbre salvo el ejecutor de tareas, que no está en el repo
- Confianza: alta

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
