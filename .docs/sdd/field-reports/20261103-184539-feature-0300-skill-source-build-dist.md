---
kit_version: 2.3.4
lane: feature
id: 20261103-184539-feature-0300-skill-source-build-dist
task: 0300
mode: full
date: 2026-11-03
---

# Ticket para el kit — feature 0300: fuente intermedia, build y dist/ sin las tripas del kit

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo.
- Skills del kit usadas: `sdd-propose`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro` y `sdd-feedback`.
- Proyecto: el repo del kit (CLI en TypeScript sin build, Vitest, moon).
- Modelo del hilo: Opus 5.5, en todas las fases. El dev-lead eligió «Apruebo», no la opción de parar antes de la Task 1 para bajar a gama media.
- Modelos de los subagentes: un revisor de spec en Sonnet; revisión final en ejes (Spec y Arquitectura en Opus, Código en Sonnet, effort high) y re-revisión en Opus.
- Coste en reloj: 1,30 h, frente a 4 h estimadas de implementación.
- Coste en tokens: 96,3 M del hilo y 15,5 M de subagentes. En total 37,49 $: 29,17 $ del hilo y 8,32 $ de subagentes.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El repaso de coherencia no busca el literal retirado en el código ni en los tests

- **Qué pasó**: la tabla «Lo que se retira o cambia de forma» de la spec se quedó sin cuatro sitios:
  - `cli/test/kit/skills.test.ts:96`, que fijaba `expect(entry?.source).toBe('.')`. Bloqueó el primer commit de la Task 1 con `AssertionError: expected './dist' to be '.'`.
  - Las reglas 3 y 4 de `CLAUDE.md`, que mandaban leer `skills/…` de la fuente.
  - `tech-stack.md:139` y `:148`, que describían la copia vieja del kit para sujetos. El eje Spec de la revisión final lo marcó Important.
- **Fuente**: el log del pre-commit de la Task 1 (`Commit bloqueado: fallan las comprobaciones del kit`); las líneas `Task 1: Ruling: cli/test/kit/skills.test.ts:96…` y `Task 2: Ruling: CLAUDE.md, reglas 3 y 4…` de `tasks.md` §Rulings; y el hallazgo Spec I1 de `tasks.md` §Revisión final.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass», la frase «search each name and each id in `capabilities/`, the project's documents and, in a skills kit, `skills/`».
- **Por qué el kit no lo evitó**: el paso limita la búsqueda a `capabilities/`, los documentos y `skills/`. Los tests que fijan el literal y los ficheros de instrucciones del repo (`CLAUDE.md`, hooks) quedan fuera. Además, una forma del literal (`toBe('.')` frente a `"source": "."`) no la encuentra la búsqueda que escribí.
- **Coste**: un commit bloqueado y un hallazgo Important de la revisión final, con su arreglo en la pasada de fix (unos 10 min, `tasks.md` §Revisión final).
- **Propuesta**: sustituir esa frase del paso 4 por una que diga dónde se busca: «en todo el repo con `git grep`, salvo las carpetas de evidencia, cada forma del literal (la cadena y su valor suelto)». Sustituye la lista de carpetas, no se añade al lado.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que retira `"source": "."` y un test que asserta `toBe('.')` WHEN el agente hace el repaso de coherencia THEN la tabla lista el test con su línea.

### 2. Deuda para la 0302: las versiones de las fuentes siguen escritas en el texto de 7 skills

- **Qué pasó**: la regla «la versión de cada fuente, solo en `upstream.json`» deja fuera versiones escritas en el texto de siete ficheros de skills:
  - `skills/sdd-tdd/SKILL.md:10`, `skills/sdd-debugging/SKILL.md:10` y `skills/sdd-agent-writing/SKILL.md:8`;
  - `skills/sdd-propose/references/spec-writing.md:3` y `plan-writing.md:3`;
  - `skills/sdd-verify/references/architecture-reviewer-prompt.md:87` y `code-reviewer-prompt.md:210`.

  La 0300 no podía tocarlas, porque ninguna frase de skill cambia en ella.
- **Fuente**: el hallazgo Spec I2 de la revisión final y su ruling en `tasks.md` §Rulings; las líneas citadas, con `git grep -n "7.0.0\|1.8.0\|v1.3" skills`.
- **Dónde en el kit**: esas siete líneas, y la capacidad `kit-distribution`, regla «Dónde viven los datos».
- **Por qué el kit no lo evitó**: la 0300 se especificó como base sin cambio de texto, y la 0302 es la que toca las copias.
- **Coste**: ninguno aún. Será una segunda versión divergente en cuanto la 0302 suba una entrada del registro.
- **Propuesta**: que la 0302 saque esas versiones del texto o las compare contra `upstream.json` en un test.
- **Verificada**: sí — contrastado con `skills/sdd-tdd/SKILL.md:10`.
- **Criterio de aceptación**: GIVEN `upstream.json` con `sdd-tdd` en `v7.0.1` WHEN la frase de `skills/sdd-tdd/SKILL.md` dice 7.0.0 THEN un test de `cli:test` falla.

### 3. El corte de la 3.0.0 saldrá rojo en más copias que las de superpowers

- **Qué pasó**: con el registro, `moon run kit:upstream` da rojo en todas las copias que no siguen la última versión de su fuente, no solo en las de superpowers 7.0.0 → 7.0.1:
  - OpenSpec en `sdd-verify` (v1.14.1 → v1.16.0);
  - mattpocock en `code-review` (v1.3.1), `grilling` (85f83d3) y `rubber-duck` (v1.2.3 → v1.3.2);
  - `cli/src/tasks` (superpowers v6.4.2).

  Antes, la «versión vista» por fuente lo escondía.
- **Fuente**: la salida de `moon run kit:upstream` del 2026-11-03 en el worktree de la 0300, con `SDD_UPSTREAM_DIR` de esta máquina; y el ruling de la Task 3 en `tasks.md`.
- **Dónde en el kit**: `upstream.json` y `tests/upstream/check.ts`; y las filas 0302 y 0311 del roadmap.
- **Por qué el kit no lo evitó**: es el estado real, que la tabla «Fuentes vigiladas» tapaba.
- **Coste**: ninguno aún. El corte (0311) parará en rojo si la 0302 no actualiza o anota esas copias.
- **Propuesta**: que la 0302 cuente con estas entradas además de las de superpowers, o que su fila las nombre.
- **Verificada**: sí — reproducido con `moon run kit:upstream` en Git Bash.
- **Criterio de aceptación**: GIVEN el registro de hoy WHEN corre `moon run kit:upstream` antes del corte THEN sale `Fuentes al día`.

## Lo que hice por iniciativa propia

- Medí la instalación real antes de escribir la spec, sin que ningún paso lo pidiera, porque la decisión de dónde vive `dist/` dependía de ella. Usé un marketplace git servido por HTTP en local, un `CLAUDE_CONFIG_DIR` aislado y `core.longpaths`. La spec salió con datos (20.117 ficheros frente a 234), y la receta quedó en `install/install.mjs` y en `tech-stack.md`. Funcionó.
- La retro arregló `cli:typecheck`, que salía de la caché en verde con un error de tipos en `build/`: sus `inputs` no miraban fuera de `cli/`. Ahora lee el repo entero (`cli/moon.yml`), comprobado con un error puesto a mano.

## Funcionó, no tocar

- El revisor único de la spec (Sonnet, siete puntos) cazó el choque con el Art. VIII, que nadie había visto, antes del gate.
- Los tres ejes de la revisión final dieron hallazgos distintos y reales, sin pisarse: el `NOTICE` huérfano, el texto tras una marca cerrada y la rama de fallo sin test.
- La re-revisión única cerró la pasada de fix sin abrir otra.

## Menores

- El hook de heredoc bloqueó dos veces un script escrito con `cat <<EOF`, y tres `node -e` con barras invertidas se rompieron al escaparlos en Git Bash. La salida fue siempre Write o Edit. — no localizado (reglas del repo, no del kit)
- La receta del paquete de revisión, lanzada dentro del worktree de revisión, da en `sdd workspace` una carpeta de ese worktree, que se borra al retirarlo. Fijé la salida a mano en el workspace del plan. — `skills/sdd-verify/references/encargo-revision.md`, receta del paquete
- Las decisiones 7 y 8 de la spec daban dos versiones distintas para un concepto (la tomada y la revisada). Lo resolvió un ruling, y el repaso de coherencia no lo vio. — `skills/sdd-propose/SKILL.md`, paso 4
