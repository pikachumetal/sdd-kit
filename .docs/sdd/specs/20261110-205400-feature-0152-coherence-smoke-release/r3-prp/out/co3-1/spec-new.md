---
id: 20261111-192347-feature-0015-paths-in-fast
feature: 0015
title: El test de rutas pasa a la tarea fast del gate
mode: lite
status: in-review
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El test de rutas pasa a la tarea fast del gate

🦆 Hoy, si alguien añade un fichero con una ruta de más de 140 caracteres, el pre-commit lo deja pasar y el fallo sale tarde, en la tarea lenta. Con el cambio, ese commit se frena en el momento, porque la comprobación de rutas se ejecuta junto a la de reservas. Como la comprobación mira los nombres de todos los ficheros del repo, la caché de `fast` tiene que volver a correrla ante cualquier cambio, no solo cuando cambia `src/`. Cuesta una fracción de segundo por commit.

Validación: agente — es un cambio de configuración de herramientas: nadie vería nada que el agente no mida ya al correr el gate.

## Capacidades

- Ninguna, porque herramientas (`gate.json` no cambia lo que ve ni puede hacer quien reserva salas).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (lite) — señales: ninguna de la rúbrica (sin capacidad, contrato, `MODIFIED`, datos, dependencia ni reglas de visibilidad) · tamaño: ~10 líneas en 1 fichero (`gate.json`)
- Técnica (sonnet): si los `inputs` de `fast` cubren lo que lee `test/paths.test.js` (`git ls-files`, decisión 2), si la caché invalida ante un renombrado o un borrado, y si dejar `slow` sin tarea (decisión 3) no rompe nada que lea `gate.json` (señal: tamaño)
- Mínimo razonable: sin review — deja sin mirar la invalidación de la caché con `**/*`, que solo se ve corriendo el gate

### Hallazgos de la review

Ronda 1:

- **Aceptado** — Crítico: la prueba no cubre renombrados, borrados ni ficheros sin trackear → «Dónde se prueba» pasa a tres escenarios (renombrado `git mv`, borrado, `.md`) y la decisión 10 declara fuera las rutas sin trackear
- **Aceptado** — Crítico: el éxito habla de «añadir un fichero» y el test solo ve lo trackeado o staged → el Intent se acota a «ruta staged o ya trackeada»
- **Aceptado** — Importante: no se sabe cómo calcula la caché su clave (contenido, rutas o mtime) → decisión 11: `sin medir`, y si el escenario del renombrado sale saltado se para y se enmienda la spec
- **Aceptado** — Importante: el segundo escenario pasaba también con la caché rota → sustituido por el renombrado con contenido idéntico
- **Aceptado** — Importante: nadie ha mirado cómo resuelve el gate las tareas por nombre → decisión 3 lo marca `sin medir` y fija la vuelta atrás (conservar `slow` con un comando vacío solo si el gate la exige)
- **Aceptado** — Importante: «cinco condiciones de lite cumplidas» sin justificar → decisión 1 las justifica una a una
- **Aceptado** — Menor: «1 s» del dev-lead frente a 0,14 s medido → nota en su línea
- **Aceptado** — Menor: cifras de coste distintas → una sola, con su comando (decisión 7)
- **Aceptado** — Menor: la revisión no miraba la caché → su lente la incluye (arriba)
- **Rechazado** — Menor: actualizar `operations.md` → su frase sobre `inputs` sigue siendo cierta; que `fast` corra casi siempre es consecuencia de la decisión 2, no un error del documento

Ronda 2 (última, sin tercera):

- **Aceptado** — Importante: faltaba el escenario de borrado → añadido a «Dónde se prueba»
- **Aceptado** — Importante: `**/*` puede no casar directorios con punto, donde viven las rutas largas (`.docs/sdd/changes/…`) → escenario con ruta bajo `.docs/` y la decisión 11 lo recoge
- **Aceptado** — Importante: la receta de la copia → `git clone` a una ruta corta (en win32 el prefijo + 140 caracteres no debe pasar de 260) y una pasada en verde antes de cada escenario
- **Aceptado** — Importante: el éxito decía «frena el pre-commit» y solo se prueba `fast` → el éxito pasa a «`fast` sale rojo»; que el pre-commit lo ejecute queda como supuesto (decisión 8)
- **Aceptado** — Menor: tamaño (1 fichero), rango de `slow` (10-15), el grep citado, la cifra de coste única (0,37 s), «tres cambios» → corregidos
- **Aceptado** — Menor: sin escenario de que el gate arranque sin `slow` → añadido; y la alternativa B se nombra en la decisión 11


1. **Carril y modo**: por el kit esto es carril config (un ajuste de `gate.json`), que no lleva spec. La has pedido y la escribo en modo lite, la más corta que admite spec, con las condiciones de lite: el flujo existe y se lee (`gate.json`); sin contrato público (lo consume solo la herramienta de gate de este repo, ningún otro módulo ni sistema); sin esquema de datos; un solo área, el gate; estimación ≤ medio día (0,25 h). Si prefieres no tener spec, dilo y va por config con un solo commit.
2. **`inputs` de `fast` = `["**/*"]`**, el patrón que ya tenía `slow`. El test lee `git ls-files`, así que depende de las rutas de todo el repo: con los `inputs` de ahora (`src/**`, `test/app.test.js`) la caché saltaría la tarea al añadir un fichero largo y el pre-commit no frenaría. Coste: `fast` corre ante cualquier cambio, también uno solo de documentos (decisión 7 para el coste).
3. **`slow` desaparece de `gate.json`**: su único comando era el test de rutas. Una tarea sin comando no tiene sentido y nada más en el repo la nombra (`git grep slow`, solo `gate.json`). `sin medir`: la herramienta de gate no está en el repo y no he comprobado si exige que `slow` exista; si el gate la exige, se conserva `slow` con un comando vacío y se enmienda esta decisión. Se reabre si vuelve a haber algo lento.
4. **El comando de `fast`** pasa a `node --test test/app.test.js test/paths.test.js`, los dos ficheros en una sola invocación y no dos tareas.
5. **`operations.md` sin cambio**: ya dice que «el pre-commit corre `fast`» y no nombra `slow`.
6. **Fuera de alcance, lo dejo anotado**: `test/cancel.test.js` no está en ninguna tarea de `gate.json`: solo lo corre el gate de cierre (`node --test` entero). No lo toco; si quieres que `fast` también lo cubra, es otra fila.
7. **Duración**: `node --test test/paths.test.js` tarda 0,35 s de reloj (0,14 s el test, el resto es el arranque de Node), no 1 s; `node --test test/app.test.js` tarda 0,32 s. La nueva `fast` entera (`node --test test/app.test.js test/paths.test.js`) tarda 0,37 s de reloj: esa es la cifra de todo el documento. La decisión no cambia, solo el coste.
8. **No verificado**: no hay hook de pre-commit instalado en este clon (`.git/hooks` sin ficheros), así que «el pre-commit corre `fast`» es lo que dice `operations.md`, no lo he visto ejecutarse.
9. **Se prueba corriendo el gate**: no hay test unitario de un `gate.json`; ver «Dónde se prueba».
10. **Límite declarado**: el test lee `git ls-files`, así que solo ve rutas trackeadas o staged. Un fichero largo sin `git add` no lo frena, ni antes ni después de este cambio.
11. **Caché `sin medir`**: no sé si la herramienta calcula su clave por contenido, por rutas o por fecha de modificación. Si un renombrado con contenido idéntico no hace volver a correr `fast`, los `inputs` de `**/*` no bastan; si una ruta larga bajo `.docs/` no invalida, falta cubrir los directorios con punto. En ambos casos se para y se enmienda la spec con el dev-lead; la alternativa natural es el enfoque B (una tarea `paths` aparte).

### Decisiones tomadas con el dev-lead

- `test/paths.test.js` pasa de la tarea slow a la tarea fast de `gate.json` — «porque tarda 1 s y debe frenar el pre-commit» (medido después: 0,35 s; la decisión sigue en pie, ver decisión 7)

## Intent

Hoy `test/paths.test.js` (ninguna ruta del repo pasa de 140 caracteres) está en la tarea `slow`, que no corre en el pre-commit: una ruta larga se descubre tarde. Debe frenar el pre-commit porque es barata y un fallo allí es una ruta por renombrar antes de que se propague. Éxito: una ruta de más de 140 caracteres, staged o ya trackeada, hace que `fast` salga rojo, también cuando es el único cambio (un fichero sin trackear queda fuera, decisión 10). Que el pre-commit ejecute `fast` es un supuesto, decisión 8. Fracaso, aunque «funcione»: que `fast` pase en verde porque la caché lo saltó.

## Scope

- Entra: `gate.json` — el comando de `fast` incluye `test/paths.test.js`; los `inputs` de `fast` pasan a `["**/*"]`; la tarea `slow` se retira.
- No entra: las rutas sin trackear (decisión 10); `test/cancel.test.js`; el gate de cierre (`node --test && node scripts/lint.mjs`); `operations.md`; el hook de pre-commit; el contenido del test de rutas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| tarea `slow` | `gate.json:10-15` | Scope, decisión 3 |
| `inputs` de `fast` (`src/**`, `test/app.test.js`) | `gate.json:5-8` | Scope, decisión 2 |
| «El pre-commit corre `fast`» | `.docs/sdd/steering/operations.md:16` | sigue cierto: decisión 5 |

- Filas que implementa: nada: comprobado con `git grep -niE "slow|paths\.test"` fuera de `.docs/sdd/changes/`, que solo da `gate.json:10-11`; `operations.md:16` nombra `gate.json` y `fast`, no `slow` (decisión 5). La 0015 no tiene fila en `ROADMAP.md`.

## Approach

- A. Mover el test a `fast` y poner `**/*` en sus `inputs` — un cambio de dos campos en un fichero; `fast` corre ante cualquier cambio.
- B. Dos tareas, `fast` intacta y una nueva `paths` con `inputs: ["**/*"]` que también corra el pre-commit — mantiene la caché fina de `fast`, pero el pre-commit pasa a depender de dos tareas y contradice lo que dijo el dev-lead («a la tarea fast»).
- C. Mover el test y dejar los `inputs` de `fast` como están — descartada: la caché saltaría el test justo cuando cambia la lista de ficheros (decisión 2).
- Elegido: A — lo pidió el dev-lead y es el cambio mínimo que cumple el éxito del Intent; la pérdida de caché fina cuesta lo que añade `fast` (decisión 7).

`gate.json` queda así:

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

## Dónde se prueba

Todos, en un `git clone` del repo a una ruta temporal corta (en win32, prefijo + 140 caracteres no debe pasar de 260), con el gate de `operations.md` (`fast`) y una pasada previa en verde como línea base antes de cada escenario; no hay test unitario de `gate.json`. Son el RED de la implementación.

- Fichero nuevo con una ruta de más de 140 caracteres, con `git add`: `fast` sale rojo.
- Lo mismo bajo un directorio con punto (`.docs/…`): `fast` sale rojo (el caso de los directorios ocultos, decisión 11).
- `git mv` de un fichero existente a una ruta de más de 140 caracteres, sin tocar su contenido: `fast` vuelve a correr y sale rojo (el caso que decide si `**/*` basta, decisión 11).
- `git rm` del fichero largo tras un rojo: `fast` vuelve a correr y sale verde.
- Cambio solo en un `.md`, tras una pasada en verde: `fast` vuelve a correr y sale verde, no saltada.
- El gate arranca y corre `fast` sin la tarea `slow` (la incertidumbre de la decisión 3).
- Los escenarios no van a `capabilities/`: no hay comportamiento de producto.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: sin capacidad tocada.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,25 h
- Estimación de implementación: 0,25 h
- Base de la estimación: tres cambios en un JSON (comando, `inputs`, retirada de `slow`) y las ejecuciones del gate; la incertidumbre es cómo trata `**/*` la herramienta de caché (no hay herramienta de gate en este clon para comprobarlo antes)
- Confianza: media

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
