---
id: 20261106-093842-feature-0015-paths-in-fast
feature: 0015
title: El test de longitud de rutas pasa a la tarea fast del gate
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El test de longitud de rutas pasa a la tarea fast del gate

🦆 Hoy la tarea rápida del gate (la que corre el pre-commit) solo prueba la aplicación, y la comprobación de que ninguna ruta del repo pasa de 140 caracteres vive en una tarea lenta que no se corre al hacer commit. Tras el cambio, esa comprobación se corre con la tarea rápida: con un fichero de ruta de 141 caracteres ya añadido al repo, la tarea rápida falla, y el pre-commit que la corre frenaría el commit (ese hook no está en el repo y este cambio no lo instala). Como la comprobación mira la lista de ficheros y no solo el código, la tarea rápida correrá con cualquier cambio de fichero, no solo con los de `src/`; cuesta unas décimas de segundo. La tarea lenta se borra porque se queda sin nada que correr. No cambia nada de lo que ve o hace quien reserva salas.

Validación: agente — es una configuración del gate sin comportamiento de producto; lo que se observa (qué corre la tarea y si frena con una ruta larga) lo mide el agente ejecutándolo.

## Capacidades

- Ninguna, porque herramientas (configuración del gate, sin comportamiento observable del producto).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta (hecha, dos rondas: un revisor por ronda; ver «Hallazgos de la review»): un revisor — señales: ninguna de la rúbrica (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin permisos; el fichero que se edita, `gate.json`, está leído) · tamaño: ~6 líneas en 1 fichero
- Técnica+dominio (sonnet): si la tarea `fast` resultante corre de verdad `test/paths.test.js` y se invalida con cualquier fichero nuevo (decisión 1), y si borrar `slow` (decisión 2) deja alguna referencia colgando (señal: ninguna; tamaño pequeño)
- Mínimo razonable: sin revisor — deja sin mirar si los `inputs` de la decisión 1 bastan para que la caché no se salte la comprobación

1. **Enfoque elegido (la decisión central; va más allá de lo que dijo el dev-lead, que solo fijó el movimiento de tarea): `fast` corre los dos ficheros en un solo comando y sus `inputs` pasan a `**/*`.** `fast.command` = `node --test test/app.test.js test/paths.test.js`; `fast.inputs` = `["**/*"]`. Por qué: `paths.test.js` lee `git ls-files`, así que lo puede romper cualquier fichero añadido o renombrado, esté donde esté; con los `inputs` actuales de `fast` (`src/**`, `test/app.test.js`) la caché se saltaría la comprobación justo cuando alguien añade una ruta larga fuera de `src/`. Coste: `fast` se invalida con cualquier cambio; medido hoy, `paths.test.js` tarda ~0,3 s en reloj (118 ms de test, medido con `time node --test test/paths.test.js`), no 1 s, y `app.test.js` es del mismo orden.
   - Descartado: dejar los `inputs` estrechos y añadir solo `test/paths.test.js` — más caché pero deja pasar el caso que el test existe para cazar. Descartado: tarea nueva `paths` — el pre-commit solo corre `fast`, no frenaría nada.
2. **La tarea `slow` se borra de `gate.json` (también va más allá de lo dicho por el dev-lead).** Se queda sin comando una vez movido su único test; una tarea vacía o duplicada confunde. Si prefieres conservarla (p. ej. para tests lentos futuros), dilo.
3. **`cancel.test.js` no entra:** hoy no está en ninguna tarea (solo lo corre `node --test` entero, el gate de cierre). Es un hueco que existía ya y no es de este cambio; lo digo por si quieres otra fila.
4. **Riesgo abierto, el índice de git no es un input (hallazgo Crítico de la review):** `paths.test.js` lee el índice (`git ls-files`) y los `inputs` `**/*` miran el árbol de trabajo. Si se corre `fast` con un fichero largo aún sin añadir (verde, se cachea) y luego se hace `git add` sin cambiar su contenido, la caché podría saltarse la tarea y dejar pasar la ruta larga. No sé cómo hashea el ejecutor, que no está en el repo: queda `sin medir` y el plan lo mide primero (Dónde se prueba). Si se confirma, es una enmienda a esta spec (p. ej. añadir `.git/index` a los `inputs` si el ejecutor lo admite, o dejar esa tarea sin caché), no una decisión mía ahora; dejar la tarea sin caché además obligaría a revisar `tech-stack.md:6` y el Scope. **Aprobar esta spec equivale a aceptar que la decisión 1 puede cambiar tras esa medida**: no se puede medir antes porque el ejecutor no está en el repo. Hasta medirlo, la garantía del Intent es «falla con la ruta ya añadida y sin caché previa de ese estado».
5. **Validación `agente`**, no `dev-lead`: la plantilla de la spec admite `agente` para configuración y tests cuando un humano no observaría nada que el agente no haya medido ya; aquí el efecto se mide por comando. Si prefieres validarlo tú, dilo.
6. **Discrepancia que no corrijo:** `tech-stack.md:6` dice que el pre-commit corre `fast`, pero `.git/hooks` no tiene hook (es local, no viaja con el repo, así que puede existir en otros clones). No lo toco; si quieres instalarlo o versionarlo, es otra fila de roadmap.
7. **Carril:** el cambio es de configuración, que por defecto no lleva spec; lo tratamos como feature con spec porque lo pediste. Id `0015` tomado de la rama `feature/0015-paths-in-fast`; no hay fila en el roadmap y no la creo. `sdd id claim` dijo «sin remoto: la 0015 vale (contador local)». Perfil `delegate` (de `sdd-kit.json`; no hay `sdd-kit.local.json`).
8. **Sin delta de capacidades:** el proyecto no tiene `capabilities/` (`sdd capability index` → «Sin capacidades») y el cambio no toca comportamiento observable.
- Política de modelos: revisor de la spec en sonnet (uno) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Hallazgos de la review

1. **Aceptado (Crítico)** — el índice de git no es un input de `**/*`, la caché podría saltarse `paths.test.js` tras un `git add` → decisión 4 (riesgo abierto, `sin medir`), Intent y «Dónde se prueba» (c), con enmienda si se confirma.
2. **Aceptado (Crítico)** — la spec prometía que el pre-commit frenaría el commit pero no instala el hook → 🦆 e Intent dicen que lo que cambia es que `fast` falla; el hook queda fuera y dicho.
3. **Aceptado** — «por construcción» no es verificable → «Dónde se prueba» da tres comprobaciones ejecutables (a, b, c) o declara que no se puede medir.
4. **Aceptado** — una ruta de 141 caracteres en disco puede fallar en Windows → se añade al índice con `git update-index --cacheinfo`.
5. **Aceptado** — «3 tests» → se dice 2 + 1.
6. **Aceptado** — referencia de líneas → `gate.json:10-15`.
7. **Aceptado** — gate de cierre citado → se cita `operations.md` y la constitución.
8. **Aceptado** — qué va más allá de lo dicho por el dev-lead → marcado en las decisiones 1 y 2.
9. **Aceptado** — decisión de validación `agente` confusa → reformulada (ahora decisión 5).

### Decisiones tomadas con el dev-lead

- `test/paths.test.js` pasa de la tarea `slow` a la tarea `fast` de `gate.json` porque tarda ~1 s y debe frenar el pre-commit — «test/paths.test.js pasa de la tarea slow a la tarea fast de gate.json, porque tarda 1 s y debe frenar el pre-commit»
- Entrevista ya hecha; se pide la spec — «La entrevista ya está hecha; … Escribe la spec en su carpeta y preséntamela para aprobar.»

## Intent

Hoy `gate.json` tiene dos tareas: `fast` (`node --test test/app.test.js`, el pre-commit) y `slow` (`node --test test/paths.test.js`, que ninguna cosa automática corre al hacer commit). El test de rutas comprueba que ninguna ruta de `git ls-files` pasa de 140 caracteres; si no corre en el pre-commit, una ruta larga entra en el historial y se descubre tarde. Éxito: con una ruta de 141 caracteres ya añadida al repo (en el índice de git), la tarea `fast` falla; sin ella, pasa. Que eso frene un commit depende de que el pre-commit corra `fast` (lo dice `tech-stack.md`; el hook no está en el repo y este cambio no lo toca). Fracaso aunque «funcione»: mover el test pero dejar la caché de `fast` saltándose la comprobación cuando cambia la lista de ficheros (decisión 1 y riesgo de la decisión 4).

## Scope

- Entra: en `gate.json`, `fast.command` corre `test/app.test.js` y `test/paths.test.js`; `fast.inputs` = `["**/*"]`; se borra la tarea `slow`.
- No entra: tocar `cancel.test.js` o su ubicación; cambiar el gate de cierre o de merge (`node --test && node scripts/lint.mjs`, según `operations.md` §Testing; la constitución, punto 2, solo exige `node --test` entero); instalar o cambiar el hook de pre-commit (no está en el repo: `.git/hooks` no tiene ninguno); cambiar `tech-stack.md` (solo dice que el pre-commit corre `fast`, y sigue siendo cierto).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Tarea `slow` | `gate.json:10-15` | Scope y decisión 2: se borra, sin comando que correr |
| `fast.inputs` (`src/**`, `test/app.test.js`) | `gate.json:5-8` | Scope y decisión 1: pasa a `**/*` |
| `test/paths.test.js` como comando de `slow` | `gate.json:11` | Scope: pasa a `fast.command` |

- Filas que implementa: nada: comprobado con `git grep -nE "slow|paths\.test|gate\.json|pre-commit|\bfast\b"` en todo el repo; solo `gate.json` y `tech-stack.md:6` (que sigue siendo cierto) lo nombran, y ningún id de fila del roadmap (0015 no tiene fila).

## Approach

Editar `gate.json` según la decisión 1 y la decisión 2. El resto (cómo se verifica) es del plan.

## Dónde se prueba

- Que `fast` corre los dos ficheros y pasa: ejecutando el comando de `fast` tal cual queda (`node --test test/app.test.js test/paths.test.js`) → 3 tests en verde (2 de `app.test.js` y 1 de `paths.test.js`), sin tocar nada más.
- Que `fast` frena con una ruta larga: sin tocar el disco (una ruta de 141 caracteres puede pasar de MAX_PATH en Windows con la ruta del repo), con `blob=$(git hash-object -w --stdin </dev/null)`, `git update-index --add --cacheinfo 100644,$blob,<ruta solo ASCII de 141 caracteres, p. ej. docs/ + relleno>` y el comando de `fast` → rojo; se deshace con `git update-index --force-remove <ruta>`, y se comprueba que `git status` queda limpio y `git ls-files | awk 'length>140'` vacío. Sin test nuevo en el repo: es una comprobación del agente sobre configuración.
- Que la caché no se salta la comprobación: `sin medir`. El ejecutor de tareas no está en el repo y `tech-stack.md` solo dice «se salta si no cambia ningún input». El plan lo mide primero, con el ejecutor del proyecto: (a) correr `fast` dos veces seguidas y ver que la segunda se salta; (b) tocar un fichero fuera de `src/` y ver que corre; (c) añadir al índice una ruta larga sin cambiar el árbol de trabajo (la comprobación de arriba) y ver que corre y falla. Si (c) se salta la tarea, se enmienda la spec (decisión 4) antes de seguir. Si no hay ejecutor con el que medirlo, la garantía de caché de (c) pasa a validación `dev-lead` y se dice tal cual en el cierre; el resto (que `fast` corre los dos ficheros y falla con la ruta larga) se mide igualmente.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: no hay comportamiento observable del producto.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
