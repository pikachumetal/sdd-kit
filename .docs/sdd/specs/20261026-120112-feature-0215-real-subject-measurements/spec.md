---
id: 20261026-120112-feature-0215-real-subject-measurements
feature: 0215
parent: 0214
title: Medidas con sujetos reales del lanzador de tests/headless/
mode: full
profile: delegate
status: approved
created: 2026-10-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-26
---

# Spec — Medidas con sujetos reales del lanzador de tests/headless/

🦆 Hoy tres cosas del lanzador de sujetos se dan por buenas sin haberlas visto en un `claude -p` real: que el `CLAUDE.md` personal de quien lanza no se cuela en el sujeto, que el hook que impide matar procesos por nombre corre, y que dos sujetos a la vez trabajan cada uno en su molde. Esta feature lo mide con unos 6 sujetos (techo 3 $) y deja escrito el resultado en `tech-stack.md`. Por ejemplo, si un sujeto ejecuta `taskkill //IM node.exe`, el stream tiene que traer la denegación del hook. Además arregla dos fallos de puertos que dejó la 0214: un número fuera de rango que deja sin comprobar los demás, y dos sujetos en paralelo que comparten puerto y se paran el servidor el uno al otro.

## Capacidades

- Ninguna, porque herramientas: `tests/headless/` es el lanzador de las campañas del propio kit; ninguna skill ni capacidad cambia.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna (sin delta de capacidad, sin contrato público, sin datos ni dependencias; el código tocado está leído en esta sesión) · tamaño: ~40 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin mirar la forma de la sonda del perfil, que el repaso de coherencia ya contrasta con `lib.sh`
- `sdd capability merge` sobre una copia de `.docs/sdd`: «Sin delta que fusionar» (2026-10-26)

1. **La parte de «los tests y la vigilancia» de la fila de deuda del perfil ya no tiene código que tocar** — comprobado el 2026-10-26: ningún `tests/*.ps1`, `cli/src` ni `.githooks` lee `plugins/cache` (`grep -rn "plugins.cache\|plugins/cache"`); `tests/DispatchBrief.Tests.ps1` ya no busca `task-brief` en la caché; `Measure-SessionTokens.ps1` no existe, y `cli/src/session/transcripts.ts` ya lee `CLAUDE_CONFIG_DIR` y todos los `~/.claude*`. Se salda con esa comprobación; `tests/DispatchBrief.Tests.ps1`, aunque lo nombra la fila 0215, no se edita.
2. **La sonda del perfil pregunta por una regla del `CLAUDE.md` global que no se adivina, no por su texto** — «¿qué te piden tus instrucciones de usuario para los mensajes de commit? Si no tienes instrucciones de usuario, di NINGUNA», sin leer ficheros. Con el `CLAUDE.md` del dev-lead la respuesta nombra «tipo/scope en inglés»; sin él, NINGUNA. Así la evidencia no copia el `CLAUDE.md` privado al repo. Un sujeto que lea `~/.claude/CLAUDE.md` con una herramienta queda invalidado (se ve en `tools.txt`).
3. **La sonda del hook es `taskkill //IM sdd-0215-nonexistent.exe`** — casa con el primer patrón de `deny-kill.mjs` y, si el hook no corre, no para nada: el proceso no existe.
4. **Las dos sondas van en el mismo sujeto**, en dos casos: con `lib.sh` y `SUPERPOWERS_DIR` (`--setting-sources ""`, el modo de toda campaña desde la 0095) y con un `claude -p` suelto sin `--setting-sources` y el mismo `--settings`. Modelo `haiku` en las dos: lo medido es carga de configuración, no conducta del modelo. 2 sujetos.
5. **La reproducción en paralelo usa el caso del ticket del patch 0087** — un molde con `.docs/sdd/` y la carpeta del patch 0013, y la petición «¿qué hay en el patch 0013 de este proyecto?», lanzados con `run.sh` y `MAX_PARALLEL=2`, en dos tandas de 2 (4 sujetos, `sonnet`). Se reproduce si algún sujeto contesta desde el working tree del kit («no hay patch 0013», rutas del kit en `tools.txt`).
6. **Si el paralelo se reproduce, se para**: es un desvío; la causa se busca con `sdd-debugging` antes de tocar código y la decisión sobre el arreglo vuelve al dev-lead.
7. **Un puerto fuera de 1–65535 se descarta en `subject_ports`** antes de pasarlo a `Get-NetTCPConnection`, en vez de fallar la consulta entera.
8. **Dos sujetos que nombran el mismo puerto: lo para el último en acabar** — `stop_subject_ports` no para un puerto que nombra el stream de otro sujeto en curso del mismo `RUNS_DIR` (su marca de `live/` con PID vivo). Descartado parar solo los descendientes del sujeto: en Windows, un servidor lanzado con `&` desde la tool Bash queda huérfano y la cadena de padres se rompe, que es justo el caso que la limpieza cubre hoy.
9. **`run.sh` imprime el `CLAUDE_CONFIG_DIR` efectivo al empezar solo si la medida dice que el `CLAUDE.md` global llega con `--setting-sources ""`**; si no llega, la única salida es la línea de `tech-stack.md` con lo medido. Es la condición de la fila de deuda.
10. **Previsión**: 2 sujetos `haiku` (~0,05 $ c/u) + 4 `sonnet` de arranque (mediana 0,35 $) ≈ 1,5 $; techos `SUBJECT_CAP=8`, `COST_CAP=3`.
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la medida en serie o de 2 en 2 (`MAX_PARALLEL=2`, la propia medida en paralelo) · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar los ejes de la revisión final y la tanda de 2 sujetos

### Decisiones tomadas con el dev-lead

- Nace de partir la 0214 por umbral; `parent: 0214` — «Partir en 3» (2026-10-25).
- Gasta sujetos reales (~2-3 $), con la previsión en la spec — prompt de arranque, 2026-10-26.
- Heredado de la 0214: hook `PreToolUse` de `--settings` en un `claude -p` real con y sin `--setting-sources ""`; puerto > 65535; choque de puertos entre paralelos — prompt de arranque, 2026-10-26.

## Intent

Tres supuestos del lanzador de `tests/headless/` no se han visto nunca en un sujeto real: que con `--setting-sources ""` el `CLAUDE.md` global de quien lanza no llega al sujeto (la evidencia dependería de la máquina y del perfil), que el hook `deny-kill.mjs` de `--settings` corre (si no, un sujeto puede tumbar los MCP de la máquina) y que dos sujetos en paralelo trabajan cada uno en su molde (en el 0087, 2 de 5 leyeron el working tree del kit). Éxito: cada supuesto queda medido con su stream guardado y escrito en `tech-stack.md`, las tres filas de deuda «Actuar → 0215» saldadas, y los dos fallos de puertos de la 0214 con su test. Fracaso aunque funcione: una medida cuya respuesta salga de leer ficheros y no de la configuración cargada.

## Scope

- Entra: medida del perfil y del hook (2 sujetos); reproducción en paralelo (4 sujetos); filtro de rango y regla del último en acabar en `tests/headless/lib.sh` con sus tests en `tests/HeadlessLauncher.Tests.ps1`; `CLAUDE_CONFIG_DIR` en `run.sh` solo según la decisión 9; líneas de `tech-stack.md`; saldar las filas de deuda del roadmap y la fila 0215.
- No entra: el molde de cierre vivo (0216); arreglar el paralelo si se reproduce (decisión 6); cambiar qué perfil usa una campaña más allá de escribir lo medido.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «sin verificar si el `CLAUDE.md` global del perfil entra en el sujeto» | `roadmap.md`, fila de deuda «El sujeto headless hereda el perfil…» | saldada con lo medido, decisión 1 |
| línea «Un sujeto de enrutado no lleva el `CLAUDE.md` del dev-lead» | `tech-stack.md:221` | se completa con lo medido |

- Filas que implementa: 0215 → `roadmap.md:21` (estado); deudas «El sujeto headless hereda el perfil…» (`roadmap.md:314`) y «Un sujeto lanzado en paralelo acaba en el repo del kit…» (`roadmap.md:322`) → marca de saldada. Ninguna capacidad ni skill nombra la 0215: comprobado con `grep -rn "0215" .docs/sdd/capabilities skills`.

## Approach

Primero se mide y después se toca código: el código del perfil depende de lo medido (decisión 9). Las sondas corren con `lib.sh`, el lanzador real, salvo el caso sin `--setting-sources`, que `lib.sh` ya no permite con el kit actual (`subject_init` exige `SUPERPOWERS_DIR`). Los arreglos de puertos son deterministas y se prueban con Pester, sin sujetos.

## Dónde se prueba

- `CLAUDE.md` global y hook con `--setting-sources ""`: un sujeto real con `lib.sh`; evidencia en `red/out/` de la carpeta, como las campañas actuales.
- Los mismos sin `--setting-sources`: un `claude -p` suelto; su stream en la misma carpeta.
- Dos sujetos en paralelo: `run.sh` con `MAX_PARALLEL=2`; `tools.txt` y `texts.txt` de cada uno.
- Puerto fuera de rango y último en acabar: `tests/HeadlessLauncher.Tests.ps1`, junto a `subject_ports junta PORT y los puertos del stream` y `para al acabar lo que escucha en los puertos del sujeto`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 19477 / 19663 | 186 | sin cambio (previsto ~+100) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-26 | aprobada (opción «Apruebo») |
