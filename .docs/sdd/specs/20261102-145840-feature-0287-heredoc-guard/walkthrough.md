---
id: 20261102-145840-feature-0287-heredoc-guard
feature: 0287
title: Walkthrough — Un hook del repo para el código escrito con heredoc, y node --check en battery.mjs run
spec: ./spec.md
status: done
created: 2026-11-02
---

# Walkthrough — Un hook del repo para el código escrito con heredoc, y node --check en battery.mjs run

## 1. Cambios realizados

- **Hook**: `.claude/hooks/heredoc-guard.mjs` y su entrada `PreToolUse` en `.claude/settings.json`. Deniega con `permissionDecision: deny` y nombra `Write`. Solo este repo.
- **Batería**: `runBattery` llama a `deps.syntaxError`, de `tests/headless/real-deps.mjs`, antes de lanzar nada.
- **Tests**: `cli/test/kit/heredoc-guard.test.ts`, `heredoc-guard.slow.test.ts`, `headless/battery.test.ts` y `headless/run.test.ts`.
- **Documentos**: la regla de `tech-stack.md` se acorta y apunta al hook; `architecture.md` cita el hook.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (de la spec): 1,5 h
- Esfuerzo real: 0,45 h — reloj de 2 sesiones 1,19 h desde 2026-11-02T14:56Z, sin 45 min de espera al dev-lead (1 espera)
- Desviación: -1,05 h (-70 %)
- Causa de la desviación: el hook y sus tests salieron de una pasada, y la estimación reservaba tiempo para lo que saliera del barrido, que se resolvió en la pasada de fix.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 8.581.702 — claude-opus-5-5 8.501.450; claude-haiku-5-5 80.252
- Tokens de subagentes: 2.267.314 en 3 despachos — Re-revisión pasada de fix 0287 claude-opus-5-5 483.472 / 3 min; Eje Código revisión final 0287 claude-sonnet-5-5 763.125 / 2 min; Eje Spec revisión final 0287 claude-opus-5-5 1.020.717 / 5 min
- Coste de la sesión: 8,37 $ (hilo 5,65 $ + subagentes 2,72 $)
- Coste de sujetos: 0,01 $ en 1 sujeto Haiku — humo del hook 0,01 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ respecto a la spec. El test de registro en `settings.json` nació en el fichero rápido y la pasada de fix lo llevó al `*.slow.test.ts`, donde lo pone «Dónde se prueba».

### Decisiones tomadas sin el dev-lead

- El barrido de la decisión 9 no se miró a mano parada a parada, porque son más de 500: se clasificó por forma, y el eje Spec señaló que esa clasificación no detecta un error del lexer (toda parada es de una de las dos formas por construcción). Lo que se miró de verdad, en 4.2 — un falso positivo raro que el campo avisará.
- `closingParen` cierra pronto con un `1)` dentro de `$(cat <<EOF)` y un cuerpo que imite una orden: se queda — solo sale en un caso sintético — un falso positivo raro.
- La evidencia de la 0144 sale de `tech-stack.md`: vive en su spec, y la spec pide acortar la regla — ninguno.
- `then node`, `env node`, `&>` y una variable con varias asignaciones pasan, por «ante la duda, deja pasar». El barrido no separa cuántos de esos escriben código: parte de esos scripts seguirá rompiendo.
- `\` con salto de línea tras el delimitador no lee el cuerpo como heredoc: exótico — un falso positivo raro.
- Re-revisión, N1: `let f='a.ts'; f += '.md'` y una asignación con `.replace(…)` en la línea siguiente paran con `a.ts`. Se quedan: no hay segunda pasada, son raros y el agente sale con `Write` — una parada de más.
- Re-revisión, N2: el test «delimitador escapado» no discrimina, y el `replaceAll` del delimitador queda sin test que lo proteja; la re-revisión lo sondeó en memoria — una regresión de `<<\EOF` no saldría en la suite.
- Re-revisión, N3 y N4: `\tee x.js <<EOF` y `<<'E\F'` pasan: exóticos, y van del lado de dejar pasar — un script que sigue rompiendo.

## 4. Verificación

### 4.1 Builds

- Otra rama abierta (`feature/0271-clean-red-rules`): el gate de cierre corre sobre la base integrada, y su línea `Gate:` va en el mensaje final.
- `moon run cli:typecheck cli:test` en el pre-commit del arreglo; `heredoc-guard.slow.test.ts`: 6/6, aparte, porque `cli:test` no corre los lentos.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · suite y smoke de abajo · humo headless del hook · revisión final Spec opus+high, con arreglos, y Código sonnet+high, lista, sobre 6045e8e5 · re-revisión opus+high de la pasada de fix, juntada en el cierre: hallazgos resueltos, 4 Minor adjudicados arriba.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un Bash con heredoc hacia `x.mjs` se para y nombra `Write` | ejecución real | sesión headless Haiku: `Este Bash escribe .temp/smoke-0287.mjs con un heredoc: … Escríbelo con la herramienta Write (para un cambio, Edit).`, sin fichero creado |
| Un heredoc hacia `git commit -F -` o un `.md` pasa | suite | `heredoc-guard.slow.test.ts`, por el proceso real: sin salida y con 0 |
| Un `subject.mjs` con error de sintaxis hace fallar `battery.mjs run` antes de contar sujetos, con la línea | ejecución real | `headless/run.test.ts`: código 1, `subject.mjs no compila:`, `subject.mjs:2`, `SyntaxError`, sin carpeta `live`; un mutante sin el `throw` da `expected 3 to be 1` |
| El intérprete en heredoc que escribe en una ruta literal de código se para | suite | `heredoc-guard.test.ts`, también con `2>&1` y `2>/dev/null` |

Barrido por los transcripts locales de este repo (recuentos, sin comandos copiados), con el hook final: más de 15.000 Bash, unos 2.050 heredocs y 519 paradas, 468 de redirección o `tee` y 51 de intérprete. Lo que dice y lo que no:

- **Falsos positivos**: ninguno visto en lo que se miró: la muestra de formas de las paradas, y el eje Spec, que miró las paradas con `git commit`, `git tag` o `gh` que llevan `$(cat <<`, y las de intérprete. No se miraron una a una.
- **Lo que se escapa, sin medir**: con un filtro laxo (un intérprete en heredoc, una llamada de escritura y un nombre de código en algún sitio), 66 se paran y 230 pasan. En una muestra de 45 de esos 230 hay rutas en variables que no se resuelven y escrituras de documentos; no se separaron ni se contaron.

### 4.3 Residuales / deuda generada

- `node -e` y `python -c` siguen sin pararse, por alcance: fueron los casos de la 0182 y la 0220. Queda la regla de `tech-stack.md`; un ticket nuevo los traerá si cuestan.

## 5. Aprendizajes

- El delimitador con comillas no protege en la herramienta Bash: `cat > a <<'EOF'` dejó `\\` en `\` (medido en esta máquina) → `.claude/hooks/heredoc-guard.mjs` lo para igual; no hace falta otra línea.
- Un barrido por transcripts reales detecta lo que un test de casos no ve: el anclaje de la variable pasó sus tests y bajó las paradas de intérprete de 55 a 39 → método de esta spec, no regla.

Retro: error que cazaría un chequeo → la propia feature (`.claude/hooks/heredoc-guard.mjs`)

## 6. Adendas
