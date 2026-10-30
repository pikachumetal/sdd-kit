---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261030-111117-patch-0261-stale-mold-system-port
task: 0261
date: 2026-10-30
---

# Ticket para el kit — patch 0261: el puerto del molde reservas-e2e-stale

## Contexto

- Carril y modo: patch, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5, sin subagentes
- Coste en reloj: 0,14 h frente a 0,7 h estimadas
- Coste en tokens: 1,83 $ de sesión

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados.

## Hallazgos

### 1. El mensaje nuevo del molde no enseña el `EACCES`: hay un segundo `stdio: 'ignore'`

- **Qué pasó**: con el fix, y con `E2E_PORT` forzado al puerto reservado 6020, el test dice `[e1-1] no arrancó el servidor ajeno: el entorno no responde en http://localhost:6020/health`. El criterio de la fila se cumple, porque es el error de `env-up.mjs`. Pero el `EACCES`, que era lo que costó 20 minutos en la 0246, sigue sin verse: `env-up.mjs` lanza `server.mjs` con `detached: true, stdio: 'ignore'`. El ticket de la 0246 §1 y la fila 0261 atribuían la pérdida solo al `stdio: 'ignore'` de `staleServer()`.
- **Fuente**: `tests/batteries/sdd-archive/fixtures/e2e/scripts/env-up.mjs` (el `spawn` de `server.mjs`); `patch.md` del 0261 §2 y §4.
- **Dónde en el kit**: `tests/batteries/sdd-archive/fixtures/e2e/scripts/env-up.mjs`. El alcance del patch solo nombraba `staleServer()`, así que no lo toqué.
- **Por qué el kit no lo evitó**: el criterio de aceptación mide «incluye su error» sin decir qué error tiene que verse.
- **Coste**: ninguno hoy: con `listen(0)` el molde ya no pide un puerto reservado. Solo cuesta si `server.mjs` vuelve a morir al arrancar.
- **Propuesta**: que `env-up.mjs` mande la salida de `server.mjs` a un fichero y la vuelque al agotar la espera a `/health`. Sin fila mientras no haya un segundo caso.
- **Verificada**: sí — `E2E_PORT = 6020`, `molds.test.ts -t reservas-e2e-stale`, en Git Bash, con la línea citada arriba. La propuesta, sin verificar.
- **Criterio de aceptación**: GIVEN `server.mjs` que muere con `listen EACCES` WHEN `staleServer()` lanza `env-up.mjs` THEN el mensaje del test incluye `EACCES`.

## Lo que hice por iniciativa propia

- Hoy `netsh` ya no reserva 3998-4597, así que el intermitente no salía solo. Seguí con el RED del puerto 6020, como pedía el prompt, aunque `sdd-start-patch` paso 1 manda parar si el fallo no se reproduce. Lo decía la petición del dev-lead, y `patch.md` §1 lo registra.

## Funcionó, no tocar

- El prompt de arranque traía la causa, el alcance, las decisiones y qué hacer si el rango había cambiado: 0,14 h, sin ninguna pregunta.

## Menores

- Otro molde con puerto fijo, fuera del alcance: `tests/batteries/sdd-verify/mold-hojas/server/api.js` y su copia `fixtures/hojas-0024/api.js` nombran un puerto literal. No lo he medido contra los rangos reservados.
- Un script de cierre mío reemplazó `### Fixed\n\n` sobre un `changelog.md` con CRLF y falló. Lo repetí por líneas: menos de 2 min.
