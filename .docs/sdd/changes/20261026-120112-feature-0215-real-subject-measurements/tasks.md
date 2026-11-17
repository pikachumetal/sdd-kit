---
id: 20261026-120112-feature-0215-real-subject-measurements
title: Tasks — Medidas con sujetos reales del lanzador de tests/headless/
spec: ./spec.md
plan: ./plan.md
created: 2026-10-26
---

# Tasks — Medidas con sujetos reales del lanzador de tests/headless/ (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0215-real-subject-measurements`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Medida del perfil y del hook | done | e9622175 | `run.sh` sin cambio (decisión 9) |
| 2 | Dos sujetos en paralelo | done | b0cba343 | 0 de 4 reproducen |
| 3 | Puertos fuera de rango y compartidos | done | dc5dc226 | pasada de fix juntada en el cierre |

## Verificación por task

- [x] Task 1 — `s-1.tools.txt` y `n-1.tools.txt` con la denegación del hook; respuestas leídas
- [x] Task 2 — 4/4 sujetos citan su propia etiqueta
- [x] Task 3 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI` → 68 passed, 0 failed

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Revisión

Revisión final: Spec opus+high, with fixes · Código sonnet+high, ready · Arquitectura no (plan), sobre dc5dc226
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN
Re-revisión: juntada en el cierre (desde dc5dc226), sdd-kit:effort-high + opus, todos los hallazgos resueltos; 2 Minor nuevos adjudicados

## Rulings

- Task 1: Ruling: el texto de n-1 copiaba literal el ejemplo de commit del CLAUDE.md privado — sustituido por una marca en n-1.tools.txt y n-1.texts.txt (spec, decisión 2: la evidencia no copia el CLAUDE.md privado)
- Task 1: Ruling: run.sh sin cambio — con --setting-sources "" la respuesta fue NINGUNA (decisión 9)
- Task 3: Ruling: «para un puerto de otro sujeto que ya no corre» pasó en RED — es el comportamiento actual que el arreglo no debe romper; los otros dos fallaron por la falta del comportamiento
- Task 3: Ruling: other_subject_ports toma la raíz de RUNS (${RUNS%/*}) en vez de RUNS_DIR: es la misma carpeta, absoluta, y no depende de que run.sh exporte RUNS_DIR
- Final: Ruling: Spec m4 (el test usa $$ del sujeto en vez de sleep 60 &) — intencionado: el bash del sujeto sigue vivo durante su limpieza y no deja proceso que parar — si es incorrecto: ninguno
- Final: Ruling: Spec m5 (el Intent dice «tres filas de deuda» y son dos, :314 y :322) — se corrige en el walkthrough; la spec aprobada no se edita — si es incorrecto: ninguno
- Final: Ruling: Spec «no verificado» del solape de los pares — verificado con las horas de .args y .jsonl de RUNS_DIR: a-1 13:09:47–13:10:23 con b-1 13:09:48–13:10:15; a-2 13:10:35–13:10:58 con b-2 13:10:36–13:10:51 — si es incorrecto: ninguno
- Final: Ruling: Spec «declined» «Filename too long» del git del sujeto en a-1 y a-2 — fila de deuda nueva al cerrar — si es incorrecto: ninguno
- Final: Ruling: «para un puerto de otro sujeto que ya no corre» falló 1 vez en la pasada de fix con «escuchando al acabar: ninguno» (el servidor aún no escuchaba) y pasó en 3 repeticiones — espera de arranque del servidor de prueba bajo carga, patrón previo al de la 0214 — si es incorrecto: un test intermitente en el gate
- Final: Ruling: tasks.md no se creó antes de la Task 1 (el plan tiene 3 tasks) — creado en el cierre con el estado del ledger y git log — si es incorrecto: ninguno, el ledger tenía el registro
- Final: Ruling: comentario de dos líneas en stop_subject_ports (re-revisión, Minor) — se queda: el porqué tiene dos partes (el primero paraba el del otro; el último no veía uno anterior) y lib.sh ya lleva comentarios de dos líneas — si es incorrecto: ninguno
- Final: Ruling: el traspaso ports/<p> no caduca si el último sujeto muere sin su trap (re-revisión, Minor) — se queda: pide un sujeto cortado y el mismo puerto en otro sujeto posterior del mismo RUNS_DIR; va a una fila de deuda — si es incorrecto: un sujeto posterior para un servidor que otra sesión arrancó en ese puerto después del traspaso
