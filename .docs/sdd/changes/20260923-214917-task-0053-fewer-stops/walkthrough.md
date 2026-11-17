---
id: 20260923-214917-task-0053-fewer-stops
task: 0053
title: Walkthrough — Menos paradas y avisos llanos
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-24
date: 2026-09-24
---

# Walkthrough — Menos paradas y avisos llanos

## 1. Cambios realizados

- **Carril de task** (`fd19c86`):
  - `skills/sdd-start-task/SKILL.md`:
    - aviso de fase en la cabecera del checklist («Ahora: … Queda: …, ~min[, ~$]»);
    - opción «apruebo la spec por delegación, nos vemos en la validación» en la primera pregunta (paso 2), y el paso 4 que no para con ella;
    - paso 7: la decisión del dev-lead que sale de la revisión final, sola y antes de la validación, y el «sí» sin detalle como validación.
  - `skills/sdd-start-task/references/control-profiles.md`: filas «Review de spec recomendada» y «Spec» de la tabla de gates.
  - `skills/sdd-end-task/SKILL.md`: los pasos 0 y 1 aceptan el «sí» sin detalle y lo registran.
- **Carril de patch** (`b0f6dbf`):
  - `skills/sdd-start-patch/SKILL.md`:
    - paso 1 con la salida «no reproduce el fallo»: sin rama, carpeta, `patch.md`, fix ni id, y la fila re-medida; un fallo distinto sigue con el medido;
    - paso 3 con el síntoma medido junto al reportado;
    - red flag y racionalización del patch sin fallo.
  - `skills/sdd-end-patch/SKILL.md` paso 4: reescribe la fila que su re-medición contradice.
- **Tests**: `tests/FewerStops.Tests.ps1` (12 aserciones estáticas de los literales en su paso). RED en `tests/fewer-stops-red.md` (apertura `a74a6a6`) y GREEN en `tests/fewer-stops-green.md` (`691e60a`); molde, lanzador y salidas en `red/` y `green/` de esta carpeta.
- **Capacidades**: delta fusionado en `task-flow`, `control-profiles`, `routing` y `roadmap`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 1,9h — reloj del hilo, aproximado con las marcas de los commits: 0,4h la noche del 23 al 24 (00:26–00:50, T1, T2 y la primera ronda del GREEN) y 1,5h la mañana del 24 (~08:45–10:15, el resto del GREEN, la revisión final y el cierre). La pausa nocturna no cuenta. Spec y plan con el RED previo: ~0,8h (23:40–00:26).
- Desviación: -0,1h (-5 %)
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 508.850 en 5 despachos — implementador T1 Sonnet 112.880 / 2,7 min; revisor T1 Sonnet 98.304 / 3,4 min; implementador T2 Sonnet 83.542 / 1,7 min; revisor T2 Sonnet 80.331 / 1,9 min; revisor final Sonnet 133.793 / 3,2 min
- Coste de sujetos: 10,04 $ en 33 sujetos Sonnet — RED 4,61 $ (16, 2 descartados por el molde); GREEN 5,43 $ (17)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 3 (GREEN) se partió en dos sesiones: el dev-lead pidió parar de noche y se retomó por la mañana con la misma copia del kit.
- Dos merges de `develop` dentro de la rama: uno antes de despachar T1, con la 0031 ya fusionada como pidió el dev-lead, y otro antes del cierre, para fusionar el delta sobre la capacidad `control-profiles` que traía la 0026. El cierre no se junta con el de la última task: el rango contiene un merge (guarda de `commit-milestones.md`).

### Decisiones tomadas sin el dev-lead

- Effort de los subagentes — la sesión no cargaba `sdd-kit:effort-*` de la 0031; se despachó `general-purpose` + `model: sonnet`, que hereda el effort de la sesión, con la forma que fija la 0031 en el campo `Modelo` del plan — si está mal, esas revisiones salieron más caras, no peores.
- El bloque RED de la Task 2 salió del repo durante la Task 1 — el pre-commit corre la suite rápida y sus 5 rojos habrían bloqueado el commit de T1; volvió intacto antes de despachar T2, con el contrato comparado byte a byte — si está mal, nada: el contrato es el mismo.
- RED, s1-1: la recogida final se regeneró a mano desde su `.jsonl` completo — el hilo editó `subject.sh` mientras bash lo leía y la cola del script falló — si está mal, falta el diff del roadmap de ese sujeto, que s1 no mide.
- RED, s7: se descartaron los 2 primeros sujetos (0,41 $, sumados al techo) y se fijó en la fila el error literal del arreglo — el molde dejaba el arreglo por decidir y los sujetos pararon antes de lo medido; se arregló la petición, no la skill — si está mal, s7 mide con una fila más dirigida que la del ticket.
- Rutas locales: `texts.mjs` pasó a ocultar el usuario, y se limpiaron todas las salidas, también las del RED ya commiteadas — el extractor de la 0009 deja la forma «C--Users-…» y los listados de `ls -l` — si está mal, queda un dato de la máquina en el historial.
- GREEN interrumpido: al parar, el hilo cortó primero los procesos equivocados y el lanzador arrancó s6-1 después del «no arranques más» del dev-lead; se dejó terminar porque ya estaba pagado — si está mal, ~0,3 $ gastados contra su petición.
- Minor aparcado: el test del paso 7 comprueba que están los dos literales, no su orden — hoy el orden es el correcto y el GREEN (s3) mide la conducta — si está mal, una regresión de orden que Pester no vería.
- La fila de racionalización que pidió el dev-lead para el 0051 §2 no se escribió, solo la forma del paso 3 — el RED s7 no mostró fallo de conducta (Art. I); la spec lo proponía así y se aprobó con «si» — si está mal, se añade la fila en otra task.

## 4. Verificación

### 4.1 Builds

- Gate de cierre, suite entera con `Slow`: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Normal"` → 519 pasan, 0 fallan, 6 omitidos (171 s), sobre `691e60a`.
- Suite rápida del pre-commit en cada commit de la rama: en verde (472 en `691e60a`, 477 tras el merge de `develop`).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-24 · «ok, ya sabes que los test van en diferido» · disparador: el smoke de la release 2.0.0, a cargo del dev-lead

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | GREEN s1–s7, 2 sujetos por escenario (RED: las cuatro piezas 0/12, s7 falla en forma 2/2) | 14/14 pasan |
| 2 | Controles c2 (sin delegar para), c4 («cierra» sin validación para), c5 (el fallo que sí se reproduce abre el patch) | 3/3 |
| 3 | `tests/FewerStops.Tests.ps1` | 12/12 |
| 4 | Revisiones: T1 y T2 limpias; revisión final «Ready to merge: Yes», 1 Minor aparcado | limpias |

Todo lo anterior lo ha verificado el agente; el dev-lead no ha probado nada todavía.

### 4.3 Residuales / deuda generada

- La rama «spec delegada, no para» del paso 4 no tiene escenario de conducta propio: la cubren el literal y Pester (`tests/fewer-stops-green.md`, «Lo que no mide»).
- El coste en dinero del aviso de fase no se midió: s1 no cruza ningún paso que lance subagentes.

## 5. Aprendizajes

- Editar un script que bash está ejecutando rompe al sujeto en curso: bash lee el fichero a trozos, y la cola del script falló por sintaxis → `tech-stack.md`, «Sujetos headless».
- Para parar una campaña hay que matar el bucle del lanzador (`run.sh`, el padre de `subject.sh`), no el `bash -c` que lo envuelve, y comprobar que no queda ningún `run.sh`; si no, el siguiente sujeto arranca igual → `tech-stack.md`, «Sujetos headless».
- El extractor de la 0009 (`tools.mjs`) deja el usuario en la forma «C--Users-<usuario>» de las rutas de proyectos, y los `ls -l` de los sujetos lo dejan como propietario → `tech-stack.md`, «Ocultar la ruta de la campaña».
- Con tests RED de varias tasks en un mismo fichero, los de las tasks posteriores bloquean en el pre-commit el commit de la primera: van fuera del repo hasta su despacho → `tech-stack.md`, «Conjunto rápido y tests `Slow`».
- Los agentes `sdd-kit:effort-*` de la 0031 no llegan a una sesión que no carga el plugin del working tree: el effort declarado no se ejecuta → al ticket de esta task, para la fila 0016 (sesión fuera del script).

## 6. Adendas

- _Ninguna_
