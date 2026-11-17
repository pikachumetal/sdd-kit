---
id: 20261029-153348-feature-0244-merge-docs-conflicts
feature: 0244
title: Walkthrough — Al unir los registros y las capacidades, dos cambios que no se tocan no son conflicto
spec: ./spec.md
status: done
created: 2026-10-29
---

# Walkthrough — Al unir los registros y las capacidades, dos cambios que no se tocan no son conflicto

## 1. Cambios realizados

- **Unión por celdas y clave sin prefijo** (`0be5c761` y el cierre): `cli/src/merge/keyed.ts` quita de la clave de una fila los prefijos de cierre, con la expresión construida desde `CLOSING_PREFIX` de `cli/src/roadmap/releases.ts` (Feature, Task o Patch; saldada o parcial), y `resolveRow` une celda a celda una fila que cambian los dos lados (`mergeCells`, con los prefijos aparte del texto de cada celda).
- **Líneas de un requisito** (`0be5c761` y el cierre): `cli/src/merge/requirement-lines.ts` (nuevo) une un trozo hecho solo de `- THEN`/`- AND` si cada lado cambia tramos distintos de la base (subsecuencia común más larga); misma línea, mismo punto o una inserción en el hueco que el otro alarga son conflicto. `registries.ts` lo aplica a `.docs/sdd/capabilities/` (`mergeRequirements`), con los trozos de base vacía unidos como antes (`joinAdded`).
- **Pruebas**: `keyed.test.ts` (celdas, prefijos, Task e id corto), `requirement-lines.test.ts` (nuevo) y tres `--sync` de punta a punta en `registries.slow.test.ts` (deuda saldada con «Destino» cambiado, THEN y AND, y el mismo cambio fuera de `capabilities/`).
- **Capacidad `control-profiles`**: tres requisitos sustituidos y uno añadido por el delta.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (de la spec): 2,5 h, más el gate de cierre
- Esfuerzo real: 0,54 h — reloj de la sesión 0,67 h desde 2026-10-29T14:29Z, sin 8 min de espera al dev-lead (2 esperas)
- Desviación: −1,96 h (−78 %): estimé la unión línea a línea como incierta y sin utilidad de diff en el repo; salió en una función de LCS de 12 líneas, y la unión por celdas encajó en `resolveRow` sin tocar el resto de `keyed.ts`
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 23.612.340 — claude-opus-5-5 23.612.340
- Tokens de subagentes: 3.159.888 en 4 despachos — Re-revisión única de la 0244 claude-opus-5-5 658.128 / 1 min; placeholder claude-opus-5-5 568.006 / 0 min; Final review — Spec axis claude-opus-5-5 1.325.097 / 5 min; Final review — Code axis claude-sonnet-5-5 608.657 / 2 min
- Coste de la sesión: 11,35 $ (hilo 8,80 $ + subagentes 2,56 $)
- Review de spec: no (lite) · revisión final: Spec opus+high, con arreglos (1 Important, 1 Minor) · Código sonnet+high, con arreglos (1 Important, 4 Minor) · Arquitectura no (lite, sin señales), sobre el refactor de la task, juntado en el cierre; pasada de fix juntada en el cierre, 7 hallazgos (2 RED→GREEN, 1 con tests nuevos, 4 sin test que los reproduzca: nombres, tipos y comentarios) y una enmienda aprobada · re-revisión del tramo de la pasada y la enmienda, sdd-kit:effort-high + opus, limpia (2 Minor: el `tsc` tras la pasada sí corrió; la decisión 6 de la spec, corregida)

## 3. Desviaciones del plan

- Enmienda del 2026-10-29, sin aprobar (corrige una decisión mía, ningún escenario): la decisión 3 deja de decir que un cambio del texto del ítem queda detrás del prefijo; ese texto es la clave.
- Enmienda del 2026-10-29, aprobada (opción «Corregir el AND»): el AND «añaden líneas en el mismo hueco → conflicto» vale para los trozos que conservan líneas de la base; los que solo añaden se unen como en «El merge del cierre une los registros que solo añaden líneas». Lo encontró el eje Spec con git real.

### Decisiones tomadas sin el dev-lead

- El conflicto de la 0248 se arregla aquí (decisión 1 de la spec, aprobada): su causa era la fila tratada como una pieza, no la clave — coste si está mal: ninguno, la unión por celdas la pedía el THEN de la 0244.
- El RED «prefijo parcial encima de otro» cambiaba el texto del ítem, que es la clave: se cambió por el «Destino» — coste si está mal: un test de un caso que no existe.
- Un despacho por error de un subagente vacío («placeholder») mientras esperaba al eje Spec, sin herramientas ni cambios — coste: 568.006 tokens (medido por `sdd session tokens`).
- El smoke de la 0248 dejó una rama local `tmp-0244-r248`: el hook del dev-lead bloquea `git branch -D` y no se forzó — coste: una rama que borrar a mano.

## 4. Verificación

### 4.1 Builds

- Línea base: `moon run kit:test-headless cli:typecheck cli:test` (sin filtro: rama recién abierta) → `kit:test-headless`: 239/239 · `cli:typecheck`: verde · `cli:test`: 1642/1654 (12 saltados), 62 s, sobre `066fb4ba`.
- Tras la pasada de fix: `npx vitest run test/merge --test-timeout 120000` (lentos incluidos) → 224/224 en 262 s, y `tsc --noEmit` sin errores, sobre la pasada de fix (juntada en el cierre).
- El gate de cierre corre una sola vez en el paso 6, sobre el merge de sincronización (la base, 4 commits por delante): su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

Validación en campo: 2026-10-29 · verificación del agente: el merge de la 0248 (`d797f13d` + `a7c10780^2`) repetido con la CLI de la rama, resuelto sin conflicto y con `sdd roadmap check` en verde · `cli/test/merge` 224/224 · revisión final Spec y Código con pasada de fix y re-revisión limpia · la suite del gate de cierre corre una vez sobre el merge de sincronización · no probado: un `--sync` real con una fila de deuda saldada (solo el e2e del fixture)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Dos ramas cambian celdas distintas de la misma fila: queda con los dos cambios (la `0248` con `✅` y el caso añadido) | ejecución real: merge de `a7c10780^2` sobre `d797f13d`, `resolveConflicts` de la rama | sin ficheros sin resolver; una fila `0248` con `✅` y «Cuarto caso, el patch 0239»; `Roadmap válido` |
| La misma celda cambiada de forma distinta, o distinto número de celdas: conflicto | suite: `keyed.test.ts` | verde |
| La rama salda una fila de deuda y `develop` le cambia el «Destino»: una fila, con el prefijo y el «Destino», sin aviso `registros:` | suite: `registries.slow.test.ts` (`--sync` real en un fixture) y `keyed.test.ts` (Feature, Patch parcial apilado, Task, id corto) | verde |
| Prefijos de cierre distintos en los dos lados: conflicto | suite: `keyed.test.ts` | verde |
| `develop` cambia el `THEN` y la rama los `AND`: quedan los dos, sin conflicto | suite: `registries.slow.test.ts` (`--sync`) y `requirement-lines.test.ts` | verde |
| Un `AND` añadido o quitado por un lado y otra línea cambiada por el otro: se unen, en su sitio | suite: `requirement-lines.test.ts` | verde |
| Misma línea, o líneas en el mismo hueco de un trozo con líneas de la base: conflicto | suite: `requirement-lines.test.ts` (también cambiar un AND y añadir otro detrás frente a otro añadido ahí) | verde |
| Un trozo en el que los dos solo añaden: se une, primero la rama destino | suite: `sync.slow.test.ts` («integra la base y se queda con los dos requisitos») | verde |
| Una línea que no es `- THEN` ni `- AND` (GIVEN, WHEN, título, prosa, en blanco): conflicto | suite: `requirement-lines.test.ts` | verde |
| Fuera de `.docs/sdd/capabilities/` no se aplica | suite: `registries.slow.test.ts` (`docs/routing.md`: `base: conflicto en docs/routing.md.`) | verde |

### 4.3 Residuales / deuda generada

- Ninguna.

## 5. Aprendizajes

- La clave de una fila de los registros es el texto de su celda de id: un cambio de ese texto ya es otra fila, también tras quitar el prefijo de cierre → comportamiento observable, en `capabilities/control-profiles.md` por el delta («Los registros se unen por id»).
- Revisión de skills: `.claude/skills/` tiene `skill-creator`, `writing-for-agents` y `writing-skills`, de autoría de skills; esta feature no les toca nada. En el kit, el paso 6 de `sdd-archive` sigue pidiendo al agente resolver «un prefijo de cierre en una fila cuyo «Destino» cambió la base»: con este cambio lo resuelve `sdd merge` y el paso queda para lo que el kit no une; no se toca (ningún texto queda falso).

## 6. Adendas
