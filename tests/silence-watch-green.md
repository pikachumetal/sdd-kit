# GREEN — vigía de silencio (feature 0095)

Mismos escenarios y molde que en `tests/silence-watch-red.md`, con el kit de la rama (sección «Vigía de silencio» de `control-profiles.md`, frase del paso 6 y remisiones de los demás puntos de despacho) y `Watch-SubagentSilence.ps1`. Salidas en `.docs/sdd/specs/20260928-173846-feature-0095-silence-watch/green/out/`, lanzador en `green/subject.sh`.

## Resultado

| Escenario | RED | GREEN | Evidencia |
| --- | --- | --- | --- |
| s1 · Native, revisor final | 0/2 | **2/2** | `-Description "Revisión final rama feature/0012"`, igual que la del despacho, en segundo plano |
| s2 · SDD, implementador | 0/2 | **2/2** | `-Description "Implementador Task 1 0012"` |
| s3 · verificación lenta | 0/2 | **2/2** | `-Path` sobre la salida de la verificación lenta, y `-Description` del revisor final |
| s4 · aviso sin permiso | 0/2 | **2/2** | s4-1: `Cuelgue: revisor final, Read sin respuesta, 9 min, relanzado`. s4-2 para y relanza, pero el hook de la campaña («no lo vuelvas a despachar») rechaza el relanzado: lo registra como no relanzado y lo dice |
| s5p · permiso pendiente | 0/2 | **2/2** | `…, no relanzado: permiso`; dice qué permiso esperaba y no relanza |
| s5d · segundo cuelgue, `delegate` | 0/1 | **1/1** | `…, parado: segundo cuelgue` y pregunta cómo seguir, sin relanzar |
| s5u · segundo cuelgue, `unattended` | 0/1 | **1/1** | `⏸️ aparcada: cuelgue repetido del revisor final`, commiteado |
| Control · tipo `sdd-kit:effort-<nivel>` | 6/6 | 6/6 | sin regresión |
| Control · `sdd-config` P5 | — | 1/1 | recomienda los frenos por defecto; ninguna remisión a la task 0022 |

La racionalización de s5d y s5u en el RED («es un ruling operativo, dev-lead ausente, no paro») no reaparece: el paso 4 de la sección la cierra sin tabla. No se abre REFACTOR.

## Coste

13 sujetos, 5,66 $. La campaña entera: 25 sujetos, 13,02 $, más los 0,43 $ descartados del RED (13,45 $), dentro del techo de la spec (28 sujetos o 18 $). Previsión: 13 $.
