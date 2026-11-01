---
id: 20261101-140903-feature-0272-using-sdd-templates-english
feature: 0272
title: Walkthrough — using-sdd y sdd-templates en inglés
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — `using-sdd` y `sdd-templates` en inglés

## 1. Cambios realizados

- `skills/using-sdd/SKILL.md` y `skills/sdd-templates/SKILL.md` en inglés, con sus `description`, el texto de la tabla de reglas de la spec (46c3ecf0).
- `tests/batteries/using-sdd/battery.md` cita los literales nuevos (46c3ecf0).
- Evidencia en `tests/english-using-templates-green.md` (160a84fe).
- La fila de `r1` en el roadmap lleva el A/B.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1 h
- Esfuerzo real: 0,73 h — reloj de la sesión 0,81 h desde 2026-11-01T14:06Z, sin 5 min de espera al dev-lead (3 esperas)
- Desviación: −0,27 h (−27 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 10.030.008 — claude-opus-5-5 10.030.008
- Tokens de subagentes: 2.346.936 en 2 despachos — Final review — Spec axis claude-opus-5-5 1.242.742 / 5 min; Final review — Code axis claude-sonnet-5-5 1.104.194 / 2 min
- Coste de la sesión: 7,71 $ (hilo 5,43 $ + subagentes 2,28 $)
- Coste de sujetos: 9,92 $ en 63 sujetos Sonnet — batería 5,17 $; A/B de `r1` 4,60 $, en dos tandas; humo 0,15 $. Techo: ~13 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Batería 23 de 24 filas: `r1` dio 1/2 con umbral 2/2. Enmienda aprobada por el dev-lead, tras un A/B de 14 sujetos por idioma: 11/14 en inglés y 9/14 en castellano.
- `KIT_DIR` es una copia con `git archive` de 46c3ecf0, no el worktree: el lanzador rechaza una copia con `.docs/` o `tests/`.
- Revisión final: 2 Important de Spec, arreglados en una pasada (lectura de idioma de los 34 sujetos y fila de `r1`).

### Decisiones tomadas sin el dev-lead

- A/B de `r1` en su primera tanda, 8 sujetos, 1,33 $ — separar traducción de inestabilidad, sin relanzar para sacar verde — 1,33 $.
- Humo con un sujeto en el scratchpad — `sdd-templates` no tiene batería — repetirlo, 0,15 $.
- La Verificación de `sdd task done` de la Task 2 es `moon run cli:test` — el veredicto de la batería sale con 1 por `r1`, cubierto por la enmienda — ninguno: la evidencia sigue en su fichero.
- Los Minor de redacción no se aplican («only the scenarios pass», «leaves it as it was», «unrepeated numbers», «No `.docs/sdd/`», comillas de `battery.md`) — son el texto aprobado en la tabla y cambiarlo pide otra medición — un retoque de redacción.
- La fuga de inglés en mensajes intermedios se queda en la evidencia, sin fila — 4 de 34, y el mensaje final siempre en castellano — mensajes intermedios en inglés a quien escribe en castellano.
- La ADR del humo no se conservó — el rc=0 de `sdd decision check` fija los encabezados — repetir un sujeto, 0,15 $.
- Sin re-revisión — tras los ejes solo hay documentos, menos de 20 líneas, revisado en el hilo — un error en la evidencia.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 285/285 · cli:test: corrió 1693/1704, 11 saltados · cli:typecheck: corrió, en caché · ~1 min · configuración: la del gate · sobre el commit de cierre, con su mismo árbol de skills
- Línea base en worktree desanclado: las 3 tareas en verde, 53 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 1693/1704 y 285/285 · batería `using-sdd` 23 de 24 filas, `r1` por la enmienda · humo de `sdd-templates` con `sdd decision check` en verde · sujetos en `green/`, `ab-en/`, `ab-es/` y `humo/`, resumen en `tests/english-using-templates-green.md` · revisión final Spec y Código sobre 160a84fe

| Criterio | Evidencia | Resultado |
| --- | --- | --- |
| Dos skills y sus `description` en inglés, frases del usuario intactas | ejecución real | comparación con `develop`: solo faltan entre «» las cuatro racionalizaciones |
| Tabla de reglas igual antes y después | ejecución real | 74 filas, 0 diferencias con el diff (eje Spec) |
| Batería entera sin bajar de umbral | ejecución real | 23 de 24; `r1` por la enmienda |
| Filas en prosa leídas a mano | ejecución real | `d1` 2/2, `s1` 2/2; mensaje final en castellano en los 34 |
| Humo de `sdd-templates` calca una plantilla | ejecución real | `Decisiones válidas`, rc 0 |
| Topes en verde | suite | 524/570 y 1590/1700 |

### 4.3 Residuales / deuda generada

- El umbral 2/2 de `r1` no se sostiene con ~70 % de acierto: anotado en su fila del roadmap.
- `f2`, petición en inglés, recibe el mensaje final en castellano; no es regresión.
- Un primer intento de commit falló en el pre-commit en 184 ms, antes de correr tests, y no se repitió: causa sin averiguar.

## 5. Aprendizajes

- Con `r1`, n=2 no distingue una regresión de una fila inestable: lo medido ya está en su fila del roadmap, y la regla «un rojo no se relanza: se lee» no impide un A/B contra el texto anterior → va al ticket.

## 6. Adendas
