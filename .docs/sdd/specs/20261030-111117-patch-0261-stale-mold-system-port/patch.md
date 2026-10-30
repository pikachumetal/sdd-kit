---
id: 20261030-111117-patch-0261-stale-mold-system-port
task: 0261
title: Patch — El molde reservas-e2e-stale pide el puerto al sistema
type: patch
solution: causa raíz
status: done
created: 2026-10-30
branch: patch/0261-stale-mold-system-port
commit: 8aedb6f9
---

# Patch 0261 — El molde reservas-e2e-stale pide el puerto al sistema

## Capacidades

- Ninguna, porque ninguna capacidad describe el molde `reservas-e2e-stale` de la batería de `sdd-archive`.

## 1. Síntoma

Reportado: `kit:test-headless` sale rojo más o menos la mitad de las veces en `molds.test.ts` > «sdd-archive construye en seco el molde reservas-e2e-stale (e1)», con `AssertionError: [e1-1] no arrancó el servidor ajeno`.

Medido el 2026-10-30: el rango 3998-4597 **ya no está reservado** en esta máquina y `netsh interface ipv4 show excludedportrange protocol=tcp` no da ninguno que solape 4300-4899, así que hoy el intermitente no sale solo. El RED se fija con un puerto reservado de los que da `netsh`, el 6020 (rango 6020-6119), forzado a mano en `E2E_PORT`: da el mismo `AssertionError`, sin ningún error debajo.

## 2. Causa raíz

`tests/batteries/sdd-archive/subject.mjs` elegía `E2E_PORT` al azar entre 4300 y 4899, sin comprobar que se pudiera abrir. Si Windows tiene ese puerto reservado, `server.mjs` muere con `listen EACCES` (ticket de la 0246, §1, reproducido entonces con `node server.mjs`) y `env-up.mjs` agota su espera a `/health`. `staleServer()` lanzaba `env-up.mjs` con `stdio: 'ignore'` y tiraba lo que este decía.

El ticket y la fila atribuyen a ese `stdio` la pérdida del `EACCES`, y es solo la mitad: `env-up.mjs` lanza a su vez `server.mjs` con `stdio: 'ignore'`, así que el `EACCES` nunca le llega. Lo que `env-up.mjs` puede contar es que el entorno no responde.

## 3. Fix

- **Fichero(s)**: `tests/batteries/sdd-archive/subject.mjs`
- **Cambio**: `E2E_PORT` sale de un `listen(0)` de `node:net`, leyendo el puerto asignado y cerrando el servidor; el mensaje de `s.die` en `staleServer()` lleva la salida de `env-up.mjs`.
- **Decisiones**:
  - `listen(0)` y no saltarse los rangos reservados, porque cambian con cada arranque — dev-lead
  - Un puerto por sujeto sigue siendo la regla — dev-lead
  - `env-up.mjs` y `server.mjs` del fixture no se tocan, porque el alcance solo nombra `staleServer()`: el mensaje enseña el error de `env-up.mjs`, no el `EACCES` — sin el dev-lead

## 4. Verificación

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 256/256 · cli:test: corrió 1672/1684 · cli:typecheck: saltada (`--affected`: sus `inputs` no cambian), 46 s, sobre 8aedb6f9

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `E2E_PORT = 6020` (reservado) con el código anterior | ❌ `AssertionError: [e1-1] no arrancó el servidor ajeno`, sin más |
| 2 | Fallo forzado de `env-up.mjs` (el mismo puerto), con el mensaje nuevo | ✅ `AssertionError: [e1-1] no arrancó el servidor ajeno: el entorno no responde en http://localhost:6020/health` |
| 3 | GREEN: `molds.test.ts` monta `reservas-e2e-stale` diez veces seguidas con `listen(0)` | ✅ 10/10 |

Validación en campo: 2026-10-30 · gate de cierre en verde y los tres casos de la tabla, corridos por el agente. No probado: el puerto de un rango reservado que aparezca al arrancar, porque hoy `netsh` no solapa 4300-4899; el RED lo sustituye con el 6020.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-30T11:10Z
- Esfuerzo real: 0,08 h — reloj de la sesión 0,08 h desde 2026-10-30T11:10Z, sin 0 min de espera al dev-lead (0 esperas)
- Desviación: por debajo de la estimación porque la causa y el fix venían fijados en la petición y el gate tardó 46 s, no los 12 min de referencia.
