---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261030-100232-patch-0260-battery-verdict-rubric-checks
task: 0260
mode: patch
date: 2026-10-30
---

# Ticket para el kit — patch 0260: `battery.mjs verdict` aplica las filas de la rúbrica que se comprueban con una máquina

## Contexto

- Carril y modo: patch de petición cerrada, perfil `delegate`, validación en campo
- Skills del kit usadas: sdd-propose, sdd-start-patch, sdd-archive, add-to-changelog, sdd-feedback
- Proyecto: el repo del kit (skills en Markdown, CLI en Node y TypeScript, Vitest, moon), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,17 h frente a 0,5 h + 0,2 h del gate estimadas
- Coste en tokens: 3,1 M en el hilo, 2,64 $; sin sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La CI de la rama salió roja dos veces al descargar `mergiraf`, sin que la rama tuviera que ver

- **Qué pasó**: los runs de `9c8ceb10` y `a26d0e86` fallaron en la instalación de herramientas con `tar: Unexpected EOF in archive`, antes de correr ningún test. Relancé con `gh run rerun --failed` el de `a26d0e86` y salió `success`.
- **Fuente**: `gh run view --log-failed` de ambos runs; `.github/workflows/ci.yml:26` (`curl -fsSL https://codeberg.org/mergiraf/… | tar -xz`).
- **Dónde en el kit**: `.github/workflows/ci.yml`, y la regla 7 de `CLAUDE.md`, que dice «con `failure` no fusiones» y no distingue un rojo de instalación.
- **Por qué el kit no lo evitó**: la descarga va en tubería, sin reintentos y sin caché, y `tar` recibe el corte como si fuera su error.
- **Coste**: ~5 min de espera y un rerun; sin respaldo en `patch.md`.
- **Propuesta**: descargar a un fichero con `curl --retry 3 --retry-all-errors` antes de `tar`, o guardar el binario en la caché de Actions.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una descarga que se corta una vez WHEN corre `ci.yml` THEN el paso reintenta y la suite llega a correr.

### 2. La fila pedía «la línea entera de `tools.txt`», y aplicada a todo el fichero el criterio del ticket no sale

- **Qué pasó**: `tools.txt` lleva también los resultados (`<<<`) y el mensaje final. `rc2-1` de la 0257 nombra ahí `node --test` sin correrlo, así que con la regex sobre cualquier línea saldría 0/2 y no el 1/2 que pide el criterio. Lo decidí sin parar: la regex mira cada llamada `>>>` entera, también si tiene varias líneas. Sobre las salidas reales da `rc2 · 1/2 · umbral 2/2 · rojo · K6 falla en rc2-2`.
- **Fuente**: `tests/headless/extract.mjs:109-113`; `refactor3/out/rc2-1.tools.txt:38` y `:67` de la carpeta de la 0257; `patch.md` §3 de este patch.
- **Dónde en el kit**: fila 0260 de `roadmap.md`; `skills/sdd-roadmap/SKILL.md`, triaje: la fila se escribió sin contrastar la propuesta con las salidas del ticket.
- **Por qué el kit no lo evitó**: nada pide probar un criterio de aceptación contra la evidencia del ticket que lo origina cuando esa evidencia ya está en el repo.
- **Coste**: ninguno; se cazó al leer `extract.mjs` antes del fix.
- **Propuesta**: ninguna regla nueva. Registrarlo como segundo caso si otro criterio de una fila no sale con las salidas de su propio ticket.
- **Verificada**: sí — `battery.mjs verdict` sobre `refactor3/out`, en Git Bash.
- **Criterio de aceptación**: GIVEN un sujeto que nombra el comando solo en un resultado o en su mensaje final WHEN `battery.mjs verdict` con esa fila `presente` THEN el sujeto pasa.

## Lo que hice por iniciativa propia

- Una declaración `tools:` mal escrita, o con un escenario que no existe, es un error de `verdict` y no una fila a mano, porque callada la comprobación no correría.
- El corte de celdas de la tabla respeta `\|`, para que una regex admita la alternativa.
- Medí el RED del criterio con las salidas reales de la 0257, sin lanzar sujetos: coste cero.

## Funcionó, no tocar

- El pre-commit cazó un `any` implícito del test que `vitest` no ve.

## Menores

- La regla nueva de `tech-stack.md` quedó en 386 caracteres frente a 308 de la anterior, porque la misma línea documenta la forma `tools:`; el dev-lead pidió «igual de corta». — `.docs/sdd/tech-stack.md:107`.
- El dato de `Esfuerzo real` de `patch.md` (0,09 h) se tomó antes de la espera de la CI y del merge; la sesión acabó en 0,17 h. — `skills/sdd-archive/SKILL.md`, paso 2.
- La verificación de una task con `npx vitest run` no ve los errores de tipos del test; solo salen en el pre-commit. — `.docs/sdd/tech-stack.md`, «Verificación de una task».
