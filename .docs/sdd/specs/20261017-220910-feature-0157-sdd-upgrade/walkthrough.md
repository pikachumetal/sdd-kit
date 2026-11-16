---
id: 20261017-220910-feature-0157-sdd-upgrade
feature: 0157
title: Walkthrough — sdd-upgrade, el hook ofrece la migración y lo determinista va a la CLI
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-18
---

# Walkthrough — `sdd-upgrade`: el hook ofrece la migración y lo determinista va a la CLI

## 1. Cambios realizados

- **Partición** (apertura): la 0157 se partió al arrancarla en tres features con fila propia: esta, la 0197 (`migrations/v3.0.0.md`, la retirada de `roadmap-template.md` y los topes) y la 0198 (migrar este repo). Las cuatro filas de deuda de la migración v3.0.0 pasaron a la 0197, y la propuesta 0131 apunta el reparto.
- **CLI** (Task 1): verbo `sdd upgrade --root`, en `cli/src/upgrade/`. Sin opciones, lista las migraciones pendientes en orden SemVer, o escribe `el proyecto ya está al día con el kit <versión>`, `sin sdd-kit.json: se aplican todas` o `init en curso: sigue con sdd-init`. Con `--mark X.Y.Z` escribe el marcador sin tocar las demás claves, y rechaza una versión sin migración o hacia atrás. `localDay` se comparte con `sdd init`, que además gana los menores de la 0156: `mergeNode` a tres parámetros, sin el cast, `--ignore` sin espacios al borde ni saltos de línea, y `kitVersion` sin el BOM.
- **Hook** (Task 2): `cli/bin/session-start.js` busca las migraciones en `skills/sdd-upgrade/references/migrations/`, solo cuenta los `vX.Y.Z.md` y pide «actualízame al kit». Con migraciones pendientes, el agente recibe la orden de ofrecerlas antes de atender la primera petición. Hay tests de orden SemVer y de los dos avisos a la vez.
- **Skill** (Task 3): `skills/sdd-upgrade/SKILL.md` con `references/migrations/`, movida desde `sdd-init`. El `README.md` de las migraciones se integra en la skill, y hay un gate nuevo para un paso sin marca que borra o reestructura. `sdd-init` enruta a `sdd-upgrade`, y `using-sdd` gana la puerta. La ruta nueva llega a skills, Pester, baterías, `lib.sh`, constitution, tech-stack, mission, architecture, README y CLAUDE.md (22 skills). `sdd-upgrade` tiene tope de 900 palabras, y `MigrationInitParity` no cuenta `skills/sdd-upgrade/` como fuente de la init.
- **Pasada de fix** (juntada en el cierre): el hook y la CLI comparten `isOlder` y `migrationVersions`. El test de las migraciones reales deja de fijar la lista exacta. La batería gana `h1` y `h2`.
- **Cierre**: delta fusionado en `migration`, `cli`, `routing` y `archive`; el Propósito de `migration`, cambiado a mano (decisión 14); changelog; roadmap (0157 y 0122 ✅, dos filas de deuda saldadas y una nueva); estimation-log.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 2 h — aproximado con las marcas de los commits; `sdd session tokens` midió 13,16 h (reloj de la sesión 13,19 h desde 2026-10-17T22:01Z, sin 2 min de espera al dev-lead, 4 esperas), con ~11 h de corte de luz con la máquina apagada dentro
- Desviación: −2 h (−50 %). El real sale de las marcas de los commits: ~0,4 h de spec y plan (de las 00:01 a las 00:24 del 2026-10-18, hora local) y ~1,6 h de implementación, campaña, revisión y cierre (de las 12:10 a las 13:45). El corte de luz, de las 00:30 a las 12:10, queda fuera.
- Causa de la desviación: la campaña salió verde a la primera y la reserva de REFACTOR no se usó. Las tres tasks no esperaron unas a otras: los RED del hook y la batería se prepararon mientras corrían la línea base y el RED.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 66.126.799 — claude-opus-5-5 66.126.799
- Tokens de subagentes: 8.921.464 en 6 despachos — Revisor de dominio de la spec claude-opus-5-5 443.597 / 2 min; Eje Arquitectura de la revisión final claude-opus-5-5 2.030.420 / 4 min; Revisor técnico de la spec claude-sonnet-5-5 328.944 / 1 min; Eje Spec de la revisión final claude-opus-5-5 3.742.434 / 5 min; Eje Código de la revisión final claude-sonnet-5-5 1.992.774 / 2 min; Re-revisión única del cierre claude-opus-5-5 383.295 / 1 min, en curso
- Coste de la sesión: 30,08 $ (hilo 23,72 $ + subagentes 6,36 $)
- Coste de sujetos: 3,06 $ en 19 sujetos sonnet — RED 0,90 $; GREEN 1,70 $; pasada de fix 0,46 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 17

## 3. Desviaciones del plan

- La Task 2 se escribió (RED y código) mientras se esperaba la línea base, antes del commit de la Task 1. Quedó fuera de ese commit, porque se commiteó con rutas explícitas.
- `m2` usa el proyecto en 2.3.4 y `v2.3.5.md`, no 9.9.8 y `v9.9.9.md`, para no mezclar el aviso de kit viejo.
- `architecture.md` recorta «del kit» de la línea nueva para caber en su tope.
- La pasada de fix añade `h1` y `h2` a la batería, que el plan no preveía: los pidieron los ejes Spec y Arquitectura.

### Decisiones tomadas sin el dev-lead

- La línea base cortada por el corte de luz se relanzó. Dio 5 rojos por tiempo con vitest corriendo a la vez; no se repitió y la cubre el gate de cierre — coste si mal: un rojo real de la base se vería en el cierre y no al empezar.
- El test del `settings.json` con raíz no objeto es de caracterización: pasa sin código nuevo — coste si mal: ninguno.
- «lists the real kit migrations» se escribió con la carpeta ya movida y pasó a la primera — coste si mal: ninguno.
- La reserva de REFACTOR no se usó: GREEN 11/11 a la primera — coste si mal: ninguno.
- La orden del hook solo mira `unattended` en `sdd-kit.json`. No se arregla: es literal de la spec aprobada, y va a deuda con destino 0152 — coste si mal: una sesión desatendida con `unattended` solo en local se para en la oferta.
- El bucle `sdd-upgrade` ↔ `sdd-init` con un `sdd-kit.json` sin `version` no se reproduce (h2 0/2), así que los predicados de `sdd-init` no se reescriben — coste si mal: un agente con menos contexto podría dar vueltas entre las dos skills.
- El `git grep` de la decisión 13 excluye `tests/batteries/sdd-upgrade/subject.sh`, cuyo retroceso a la ruta vieja es para el RED — coste si mal: ninguno.
- El gate de cierre da 3 timeouts en tests lentos que la rama no toca y que pasan solos: no frena el cierre (fila de deuda de la 0156) — coste si mal: un rojo real en el merge o en los publish se colaría.
- `.at(-1)` en el hook (Minor de la re-revisión) se queda: Node < 16.6 está sin soporte, y el arreglo dejaría un commit de código sin revisar — coste si mal: en un Node de 2021 la sesión arranca sin el router.

**Minors diferidos** (ledger): `sin sdd-kit.json` también con un marcador sin `version`; lectura y escritura del marcador duplicadas entre `init` y `upgrade`, con distinto orden de claves; los retrocesos del RED en `subject.sh`; faltan tests de `--mark` sin marcador previo y con raíz no objeto; el paso «Marcador» de cada `vX.Y.Z.md` pide escribir `version` a mano (la 0197 usa `--mark`, anotado en su fila); `sdd upgrade` con una raíz sin `.docs/sdd/`; la excepción a la Anatomía §6 sin justificar por escrito; el hook lee `version` con regex y la CLI con `JSON.parse`; el test de `--root` inexistente solo mira el código; el hook ofrece migrar durante una init sobre template; `migrationVersions` sin carpeta da «al día»; la procedencia de `h1` y `h2` en la batería.

## 4. Verificación

### 4.1 Builds

- Pre-commit de cada commit (`kit:test-fast` + `cli:test`): verde en los cinco.
- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min --force` sobre la pasada de fix (juntada en el cierre) → `kit:test` 1301/1301, `cli:typecheck` verde, `cli:test` 1020/1020 y `cli:test-min` 1205/1208 (~25 min). Los 3 rojos de `cli:test-min` son timeouts de 120 s en `roadmap/publish.slow`, `merge/lock-and-base.slow` y `merge/hotfix.slow` con la máquina cargada: la rama no toca esos ficheros, y repetidos solos con Node 22.18 pasan (24/24 y 14/14). Es la fila de deuda «Dos tests lentos ajenos fallan con la suite entera y pasan solos» de la 0156. moon cortó antes de `cli:test-slow`, que corrida sola da 188/188 (7 min).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-18 · suite completa sobre la pasada de fix (3 timeouts ajenos que pasan solos) · smoke con ejecución real de la CLI y el hook (13/13 THEN de `cli` y del aviso) · campaña de sujetos 19 (RED o1 0/2, m2 0/2; GREEN 11/11; h1 1/1, h2 sin bucle) · revisión final en tres ejes sobre 2aeab4d y re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `migration` · Cada release lleva su migración (ruta nueva) | suite (`MigrationInitParity`: la versión de `plugin.json` con su fichero) | ✅ |
| `migration` · Una migración sin cambios solo avanza el marcador, con `--mark` y commit | ejecución real (sujetos `m1-1`, `o2-1`, `h1-1`: `--mark 2.3.4` y `chore(sdd): migrar al kit v2.3.4`) | ✅ |
| `migration` · El aviso al usuario pide «actualízame al kit» | ejecución real (`sdd hook session-start` con el marcador en 2.3.3) | ✅ |
| `migration` · El agente recibe la orden de ofrecer tras el aviso | ejecución real (mismo hook: `additionalContext` con la orden antes de `using-sdd`) | ✅ |
| `migration` · «hasta la 0.10.0» con `v0.9.0.md` y `v0.10.0.md` | suite (`orders migrations by semver`) | ✅ |
| `migration` · los dos avisos, primero el de la versión | suite (`shows both warnings, the version one first`) | ✅ |
| `migration` · sin aviso con el marcador al día | ejecución real (hook con el marcador en 2.3.4: sin `systemMessage` ni orden) | ✅ |
| `migration` · ofrece antes de atender y nada cambia antes de la respuesta | ejecución real (`o1-1`, `o1-2`, `o2-1`) | ✅ |
| `migration` · con el «no», atiende por `sdd-propose` | ejecución real (`o1-1`, `o1-2`) | ✅ |
| `migration` · con el «sí», migra y vuelve a la petición | ejecución real (`o2-1`) | ✅ |
| `migration` · «Actualízame al kit.» invoca `sdd-upgrade` sin preguntar | ejecución real (`u1-1`, `m1-1`) | ✅ |
| `migration` · con `unattended` ni ofrece ni migra | no probado (spec, decisión 18: sin sujeto; lo fija el texto de la orden) | — |
| `migration` · `sdd upgrade` lista lo posterior en orden SemVer | ejecución real (`sdd upgrade --root` con el marcador en 2.3.1: v2.3.2, v2.3.3, v2.3.4) | ✅ |
| `migration` · sin `sdd-kit.json`, la pregunta la hace `sdd-init` | ejecución real (`h2-1`, `h2-2`: una pregunta, nada cambia) | ✅ |
| `migration` · no regenera anclaje ni vuelca capacidades | ejecución real (`m1-1`: `git status` solo con `sdd-kit.json`) | ✅ |
| `migration` · «el proyecto ya está al día con el kit 2.3.4» | ejecución real | ✅ |
| `migration` · init en curso no se migra | ejecución real (`init en curso: sigue con sdd-init`, exit 1) | ✅ |
| `migration` · pedida a `sdd-init`, la migración la hace `sdd-upgrade` | ejecución real (`h1-1`) | ✅ |
| `migration` · un paso sin marca que borra para con el dev-lead ausente | ejecución real (`m2-1`, `m2-2`: `legacy.md` sigue, marcador en 2.3.4, sin commit) | ✅ |
| `migration` · con el dev-lead presente, presenta el borrado y espera | no probado (el molde es de dev-lead ausente; los dos sujetos piden el «sí» en su informe) | — |
| `migration` · la paridad no cuenta `skills/sdd-upgrade/` | suite (`MigrationInitParity`) | ✅ |
| `cli` · `--help` lista `upgrade` | ejecución real (`sdd --help`) | ✅ |
| `cli` · el hook escribe la fixture `pending-migration.json` | suite (`matches the bash hook output for pending-migration`) | ✅ |
| `cli` · `sdd upgrade` sin marcador: «se aplican todas» y las rutas | ejecución real | ✅ |
| `cli` · `--mark 2.3.2` escribe version, channel, updated y conserva `ids` | ejecución real | ✅ |
| `cli` · `--mark 2.9.9` → «el kit no trae esa migración», exit 2 | ejecución real | ✅ |
| `cli` · `--mark` hacia atrás → «el proyecto ya está en…», exit 1 | ejecución real | ✅ |
| `cli` · marcador roto → «no es JSON válido: no se toca», exit 1 | ejecución real | ✅ |
| `cli` · `--mark 2.x`, `--mark ../x`, `--foo`, `--root` inexistente → uso, exit 2 | ejecución real | ✅ |
| `cli` · `--mark` sin valor → exit 2 | suite (`exit 2 with ["--mark"]`) | ✅ |
| `cli` · `--ignore ' x'` → exit 2 | ejecución real | ✅ |
| `routing` · `using-sdd` nombra `sdd-upgrade` | suite (`UsingSdd`, `Skills`) | ✅ |
| `routing` · «Actualízame al kit.» entra por `sdd-upgrade` | ejecución real (`u1-1`) | ✅ |
| `archive` · el hotfix escribe en `skills/sdd-upgrade/references/migrations/` | suite (`ArchiveSkill`) | ✅ |

### 4.3 Residuales / deuda generada

- Fila nueva de deuda: la orden de ofrecer solo mira `unattended` en `sdd-kit.json` → 0152.
- La 0197 recibe en su fila que su paso de marcador use `sdd upgrade --mark 3.0.0`.
- Los minors diferidos de §3 no pasan a deuda: los recogen la 0197 (marcador, migraciones) y la 0152 (coherencia).
- Suite de más de 10 min: ~25 min — ya registrada como deuda del repo.

## 5. Aprendizajes

- Una migración de juguete para una batería va en una copia del kit propia de su escenario: los demás sujetos comparten `KIT_DIR`, y una `vX.Y.Z.md` añadida ahí les cambia el aviso → `tests/batteries/sdd-upgrade/battery.md` (su párrafo de moldes) y el comentario de `subject.sh`. `tech-stack.md` está a 4 palabras de su tope.
- Un bucle entre skills que un revisor deduce del texto se mide antes de reescribir (`h2` 0/2): el texto lo permitía, pero el agente lo resolvía, y el Art. I no reescribe una regla sin un RED que falle → ya está en el Art. I y en `tech-stack.md` («Un baseline que no falla es evidencia válida de que la guidance sobra»).
- Revisión de skills: abiertas `.claude/skills/` (`skill-creator`, `writing-for-agents`, `writing-skills`); ninguna afirma algo que esta feature desmienta → no aplica.

## 6. Adendas
