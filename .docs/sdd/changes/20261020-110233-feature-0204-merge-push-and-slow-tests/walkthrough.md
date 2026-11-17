---
id: 20261020-110233-feature-0204-merge-push-and-slow-tests
feature: 0204
title: Walkthrough — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-20
---

# Walkthrough — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo

## 1. Cambios realizados

- **Suite lenta y error de push** (`be8f1ce5`):
  - `cli:test-slow` y `cli:test-min` corren con `--maxWorkers 8`, y su porqué medido está en `tech-stack.md` «Conjunto rápido y tests lentos».
  - `push: no se pudo publicar …` añade el stderr de `git push`, en el cierre y en el push atómico del hotfix.
- **Commits ajenos** (`d3dd7bcd`):
  - Con `--push`, antes de `publicado en`, sale `push: también publica <n> commit(s) de '<destino>' que no son de <rama>:` con una línea `- <hash> <asunto>` por commit.
  - Son los de `<remoto>/<destino>..<destino>` tras integrar la remota y antes de fusionar. En el hotfix, una línea por rama publicada; la de vuelta, solo si ya estaba en el remoto.
  - Sin `--push`, sin remoto o sin commits así, no sale. `merge-recipe.md` gana su fila en «Its outputs».
- **Pasada de fix** (juntada en el cierre):
  - El comentario de `moon.yml` ya no cita la feature.
  - `report` vuelve a 3 parámetros, e `integrateHotfix` baja a 19 líneas con `syncBack`.
  - Los commits ajenos solo se calculan con `--push`.
  - `withGitOutput` pasa a llamarse `appendGitError`.
  - `localCommit` usa un contador.
  - Tests nuevos: la rama estable del hotfix, el stderr del push atómico y un commit local con un reintento.
  - El humo de la fila de la receta (`smoke.md`).
- **Al cerrar**, se arreglan los 2 Minor de formato de la re-revisión (una línea en blanco y el orden de un import en `hotfix.ts`) y se quita «(patch 0183)» de un comentario de `cli/moon.yml`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 1,79 h — reloj de la sesión 2,12 h desde 2026-10-20T07:56Z, sin 19 min de espera al dev-lead (3 esperas)
- Desviación: +0,29 h (+19 %)
- Causa de la desviación: dentro de ±30 %. Lo que más tiempo se llevó fue el diagnóstico de la 104, con 13 pasadas de la suite lenta de 4 a 5 min cada una, y la pasada de fix con los Minor, que el dev-lead decidió meter.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 26.065.459 — claude-opus-5-5 26.065.459
- Tokens de subagentes: 2.669.615 en 5 despachos — 0204 final re-review claude-opus-5-5 685.347 / 2 min; 0204 smoke GREEN — receta de la rama claude-sonnet-5-5 110.959 / 0 min; 0204 smoke RED — receta de develop claude-sonnet-5-5 110.939 / 0 min; 0204 final review — Code axis claude-sonnet-5-5 563.395 / 2 min; 0204 final review — Spec axis claude-opus-5-5 1.198.975 / 3 min
- Coste de la sesión: 10,95 $ (hilo 8,50 $ + subagentes 2,45 $)
- Medición: por ventana — transcripts de D:\code\.worktrees\sdd-kit\0193-better-merge desde 2026-10-20T07:56Z (la rama no tiene transcripts propios)
- Coste de sujetos: 0,23 $ (dos sujetos del humo, Sonnet, incluidos arriba)
- Review de spec: ninguna (2 señales)

## 3. Desviaciones del plan

Dos enmiendas aprobadas, las dos en la spec:
- «Dónde se prueba» gana el humo de la fila de `merge-recipe.md`.
- Los Minor de la revisión final entran en la pasada de fix.

### Decisiones tomadas sin el dev-lead

Los rulings de `tasks.md`, en resumen:
- No corrí el gate de línea base: la suite lenta ya había pasado sobre la misma base esa mañana.
- El stderr del push se escribió durante el diagnóstico, antes de la spec, y entró en la Task 1 con su RED.
- La copia RED de la Task 1 no se guardó fuera; el test no cambió.
- La fila de la receta se queda como entrada del catálogo de salidas: el humo da RED 1/1 y GREEN 1/1, así que no hace falta para que el agente cite los commits.
- Los 2 Minor de formato de la re-revisión y el comentario de `moon.yml` entran en el cierre sin revisar.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 1077/1077, `cli:test-slow` 265/265, `cli:test-min` 1343/1343, `kit:test` 1329 pass / 0 fail · 858 s · sobre la pasada de fix, juntada en el cierre. Antes de la pasada, verde también sobre `d3dd7bcd` (746 s).
- Revisión final:
  - Spec opus+high, con arreglos (1 Important, 5 Minor).
  - Código sonnet+high, con arreglos (1 Important, 8 Minor).
  - Arquitectura no (plan), sobre `d3dd7bcd`.
  - La re-revisión (opus+high) dio los 12 por ADDRESSED y dejó 2 Minor de formato, arreglados en el cierre: 1 sin revisar.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-20 · suite completa verde sobre la pasada de fix · humo de la receta RED 1/1 y GREEN 1/1 · revisión final Spec y Código y re-revisión sin hallazgos abiertos, 1 sin revisar (formato)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un commit local en `develop` se nombra antes de `publicado en`, en singular | suite | `push-retry.slow.test.ts`, «con un commit local en develop lo nombra…» |
| Dos commits, en plural | suite | «con dos commits locales los nombra en plural» |
| Sin `--push`, sin remoto o sin commits así, no sale | suite | «sin --push…», «sin remoto…» y el test del reintento |
| Los commits que trae un reintento no cuentan | suite | «si la rama destino avanzó…» y «con un commit local y un reintento solo nombra el local» |
| El hotfix da la línea de cada rama publicada | suite | `hotfix.slow.test.ts`, la de `develop` y la de `main` |
| Un push rechazado añade lo que contestó git, también el atómico del hotfix | suite | «un rechazo sin que la rama destino avance…» y «un push atómico rechazado dice lo que contestó git» |
| El mensaje final cita los commits ajenos | ejecución real | `smoke.md`: dos sujetos Sonnet, RED y GREEN, los citan |
| Con carga, el test más lento de la suite lenta baja a la mitad | ejecución real | medidas de la decisión 1 de la spec (58-81 s → 29-30 s); el gate final con `--maxWorkers 8`: `cli:test-slow` 265/265 |

### 4.3 Residuales / deuda generada

- La 104 queda **parcial**: los fallos sueltos de git con la máquina cargada (`not a git repository` en un repo que existe) siguen. Apuntan a Defender en `%TEMP%`, sin probar: hace falta una exclusión hecha como administrador para confirmarlo.
- 1 sin revisar: los 2 Minor de formato de la re-revisión y el comentario de `moon.yml`, en el commit de cierre (3 líneas).

## 5. Aprendizajes

- Un test lento que solo falla con carga se diagnostica midiendo cada test (`--reporter json`) con la suite entera y con otra suite a la vez. El primer test de cada fichero era el que se estiraba, porque todos los ficheros arrancaban a la vez. Queda en `tech-stack.md`.
- Un error que se traga el stderr de git deja el fallo sin diagnóstico: el push de la 0202 no se pudo explicar por eso. Ya lo cubre el cambio.
- Un humo con RED que ya pasa dice que la guidance no hace falta: la fila se quedó solo como catálogo.

## 6. Adendas
