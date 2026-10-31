---
id: 20261031-164208-patch-0267-subject-git-identity
task: 0267
title: Patch — el sujeto de una batería ve la identidad de git del molde
type: patch
solution: causa raíz
status: done
created: 2026-10-31
branch: patch/0267-subject-git-identity
commit: 1d9d8feb
---

# Patch 0267 — el sujeto de una batería ve la identidad de git del molde

Validación: dev-lead — `validation.mode: field`: la valida el uso real, con mi verificación registrada.

## Capacidades

- Ninguna, porque ninguna capacidad describe el lanzador de sujetos.

## 1. Síntoma

Reportado (ticket del patch 0266 §2): `no se guarda g1-2.tools.txt: el stream sigue en …`. `extract.mjs` sale con 3 porque la salida lleva `user.name`, y el sujeto lo escribe en el aviso del aprobador.

Reproducido sobre la rama sin tocar, 2 de 2 sujetos de `g1` en Opus: `g1 · 0/2 · umbral 2/2 · sin evidencia · sin tools.txt: g1-1, g1-2`.

## 2. Causa raíz

El nombre llega en el contexto que el cliente de Claude Code añade al arrancar, la línea `Git user: <nombre>`, y `GIT_IDENTITY` de `tests/headless/lib.mjs` no la tapa: `GIT_CONFIG_COUNT` gana en `git config user.name`, pero no en esa línea.

Evidencia:

- **Stream**: en los dos sujetos, la primera aparición es el mensaje final, en el aviso del aprobador («el usuario de git es <nombre>»), en las líneas 127 de `g1-1.jsonl` y 110 de `g1-2.jsonl`. Ningún `tool_result` anterior lo lleva, así que no lo leyó con una herramienta.
- **Sonda**: `claude -p --model haiku --setting-sources ""` en un repo recién creado, preguntando por la línea `Git user` (cliente 2.1.316):

| Identidad fijada con | Línea `Git user` |
| --- | --- |
| `GIT_CONFIG_COUNT` y compañía (lo que hace hoy el lanzador) | el nombre de la máquina |
| `GIT_CONFIG_GLOBAL` a un fichero con Fixture | el nombre de la máquina |
| `user.name` en la config local del repo | `Fixture` |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` | ninguna línea |

La hipótesis de la petición queda confirmada. Por qué el cliente ignora el entorno no lo sé: no he leído su código, solo he medido su conducta.

`spec-template.md` no es la causa: pide `git config user.name`, que dentro del sujeto ya devuelve Fixture. El gate solo da la ocasión de escribir el nombre que el contexto trae.

## 3. Fix

- **Fichero(s)**: `tests/headless/lib.mjs`, `cli/test/kit/headless/lib.test.ts`
- **Cambio**: `launch` escribe `user.name` y `user.email` de Fixture en la config local del molde antes de lanzar `claude`. Un molde que no es su propio repo se salta, porque el `git config` caería en el repo que lo contiene.
- **Decisiones**:
  - En `launch` y no en cada `subject.mjs`: vale para todas las baterías — sin el dev-lead (la petición deja elegir entre lanzador y molde)
  - Descartado `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS`: quita también lo que el sujeto ve del repo y cambiaría lo que se mide — sin el dev-lead
  - `GIT_IDENTITY` se queda: cubre el repo que el propio sujeto cree, y sobre todo los clones y `git init` durante la sesión, donde no hay config local — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `lib.test.ts`: `launch` fija la identidad antes de `claude`, y no la escribe sin repo propio | ✅ RED del primero antes del fix (`order` solo con `claude`); los dos en verde después |
| 2 | RED: `g1` sobre la rama sin tocar | 0/2 guardan `tools.txt`, con el nombre en el aviso del aprobador |
| 3 | GREEN `green`: `g1` con el fix, sin más turnos | ✅ 2/2 guardan `tools.txt` y `texts.txt`, sin el nombre. ❗ 0/2 escriben el aviso: sale cuando el nombre no cuadra con Laura, y con Fixture no lo comentan |
| 4 | GREEN `green2` y `green3`: `g1` con un `TURN2` que pide el aviso | ✅ 2 sujetos escriben el aviso con `Git user: Fixture`, guardan sus salidas y no llevan el nombre (`green2/g1-2`, `green3/g1-1`). ❌ `green2/g1-1` no guarda: ver abajo |

**El criterio de la petición se cumple con el aviso pedido en un segundo turno**, no espontáneo: el aviso espontáneo desaparece con la causa que lo provocaba.

**Límite que queda**: `green2/g1-1` veía `Fixture` en el contexto, pero el turno le pedía comparar con `git config`, y corrió `git config --show-origin --get-all user.name`, que lista también el fichero global de la máquina. `extract.mjs` lo paró, como debe. No lo corto: `GIT_CONFIG_GLOBAL` taparía ese fichero entero, con `core.autocrlf` y `core.longpaths`, y cambiaría lo que miden todas las baterías; y `cat ~/.gitconfig` seguiría llegando. Solo pasa si el sujeto va a buscarlo.

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 280/280 · cli:typecheck: corrió 1/1 · cli:test: corrió 1685/1697, 12 saltados (80 s)

Validación en campo: 2026-10-31 · gate en verde, `lib.test.ts` 74/74 y los sujetos de `g1` de la tabla; no probado: las demás baterías con el fix.

## 5. Tiempo

- Estimación: 0,75 h + 0,02 h del gate de cierre (77 s, patch 0265)
- Inicio: 2026-10-31T16:42Z
- Esfuerzo real: 0,40 h — reloj de la sesión 0,40 h desde 2026-10-31T16:34Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: ~6,4 $ en 7 sujetos Opus — RED ~1,6 $ (estimado: borré sus streams antes de leer el coste, y `battery.mjs` no lo contó porque no guardaron `tools.txt`); `green` 1,61 $; `green2` 2,14 $; `green3` 1,02 $
