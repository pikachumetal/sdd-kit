---
id: 20261119-101604-feature-0347-template-instance-init-first
feature: 0347
title: Walkthrough — Una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-19
---

# Walkthrough — Una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/

## 1. Cambios realizados

- **Detección de la marca de template** (`cli/bin/session-start.js`, `7d4b3b9`, endurecida en la pasada de fix, juntada en el cierre): `templatePendingFiles` y `templatePendingFile` buscan `<!-- sdd-template: pending` sin backtick delante y fuera de bloques vallados (CommonMark: hasta tres espacios, cierre sin info string) en `PRODUCT.md`, `ROADMAP.md`, `.docs/sdd/*.md` y `.docs/sdd/steering/*.md`; un fichero ilegible o un directorio con nombre de documento cuenta como «sin marca».
- **Aviso de inicio** (`7d4b3b9`): con migraciones pendientes y una marca, el aviso de template sustituye al de migraciones, sin orden de migrar.
- **`sdd upgrade`** (`cli/src/upgrade/run.ts`, `7d4b3b9`): `template sin inicializar: sigue con sdd-init`, después de `init en curso` y sin escribir.
- **`sdd init --finish`** (`cli/src/init/run.ts`, `e52b323`): una línea por fichero que aún lleva la marca.
- **`sdd-init`, pasos 7 y 8** (`a0a2d19`; la enmienda del paso 8, en el cierre): el paso 8 lista, literales, las líneas de `--finish` fuera de `.docs/` que dicen `creado` o `actualizado` y dice que van en el commit de cierre; el paso 7 pierde la descripción del contenido de `settings.json`. Saldo: 2657 → 2649 palabras.
- **Baterías**: `t1` en `sdd-upgrade` (molde `salas3-template`) y `n8` en `sdd-init` (molde `template-finish`), con su rúbrica; `molds.test.ts` admite `salas3-template` por debajo de la última migración.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,86 h — reloj de la sesión 2,27 h desde 2026-11-19T09:13Z, sin 85 min de espera al dev-lead (6 esperas)
- Desviación: −0,64h (−43 %)
- Causa de la desviación: la estimación sumaba spec y plan aparte (1,5 h) y la sesión fue más corta; esperas: 09:19Z 18 min; 09:46Z 27 min; 10:29Z 2 min; 10:47Z 25 min; 11:15Z 6 min; 11:21Z 7 min
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 54.017.607 — claude-opus-5-5 54.017.607
- Tokens de subagentes: 3.598.809 en 6 despachos — Revisor de spec, lente dominio claude-sonnet-5-5 308.781 / 1 min; Final review — Spec axis claude-opus-5-5 1.800.672 / 4 min; Final review — Code axis claude-sonnet-5-5 530.107 / 1 min; Revisor de spec, lente técnica claude-sonnet-5-5 138.909 / 1 min; Segunda ronda de review de spec claude-sonnet-5-5 395.391 / 1 min; Re-review final fix pass claude-opus-5-5 424.949 / 1 min
- Coste de la sesión: 20,63 $ (hilo 17,34 $ + subagentes 3,29 $)
- Coste de sujetos: 1,06 $ en 8 sujetos sonnet — red 0,31 $ (`t1`, `n8`); green 0,49 $ (`t1`, `n8` ×2, `n5`); green2 0,26 $ (`n8` ×2)
- Review de spec: 2 revisores + segunda ronda · hallazgos 26, aceptados 19

## 3. Desviaciones del plan

- El molde `template-finish` de `n8` va sin marca de template, al revés que la decisión 8: con una, el predicado 1 de `sdd-init` vuelve a entrevistar y el sujeto no llega a `--finish`.
- El molde lleva además `estimation-log.md` y `CHANGELOG.md` aprobado: el primer GREEN se paró en el paso 5 porque `sdd estimation log` falla sin `changes/` ni `specs/`.
- Dos enmiendas de la spec, aprobadas por el dev-lead («1» las dos): `.gitignore` sin cambios queda fuera del commit de cierre en vez de no nombrarse; y sale del paso 8 la frase que repetía las marcas que quedan, sin sujeto que la midiera.

### Decisiones tomadas sin el dev-lead

- `sdd-upgrade` sin editar — el GREEN de `t1` entra por `sdd-init` desde el aviso; el error de `sdd upgrade` lo cubren los tests de `upgrade.test.ts` — si falla, un agente que llega a `sdd upgrade` y no sigue el error deja la instancia sin migrar y sin init.
- Molde de `n8` sin marca — ver §3 — la línea de `--finish` la cubre `finish-template.test.ts`.
- GREEN de `n8` relanzado (fase `green2`) con el molde corregido y F1-F2 admitiendo el backtick de `` `.claude/settings.json`: actualizado `` — el RED sigue rojo con la regex nueva — si es incorrecto, la regex deja pasar un formato que antes no.
- El paquete de la revisión final excluye `dist/**`, la copia construida de las mismas fuentes — un desfase lo caza `kit:test-headless`.
- Minors 5 y 6 del eje Código sin arreglar: `--finish --memory-off` repite las líneas de marca (cada pasada informa del estado actual); `''` como centinela, igual que `readJsonVersion`.
- Bloques indentados con cuatro espacios cuentan, y una valla dentro de una lista anidada con 4+ espacios ya no se reconoce — coherente con la decisión 2.
- El predicado 1 de `sdd-init` no aplica la regla del backtick ni de la valla, y la detección exige un espacio exacto tras `<!--` — fuera de Scope y fijado por la Restricción.
- Tres Minors de la re-revisión al ticket, sin arreglar tras la re-revisión única: el BOM está escrito literal (invisible) en `cli/bin/session-start.js` y en un dato del test; el test del BOM no ejercita su `replace` (BOM + valla en la línea 1); `readJsonVersion` del hook no tolera un `sdd-kit.json` ilegible (previo a la 0347).
- Punto e) del contraste con la sesión del template: su skill puente `init-template` envuelve `sdd-init` y el aviso nombra `sdd-init`; el dev-lead decidió que lo resuelve el template con una regla en su `CLAUDE.md` («si», 2026-11-19), y se le pasó.

## 4. Verificación

### 4.1 Builds

- Baseline: `moon run kit:test-headless cli:typecheck cli:test` (sin `--affected`, worktree detached en `200f76d`) → cli:typecheck: verde · cli:test: 2496/2508 (12 skipped) · kit:test-headless: 775/775.
- Tras la pasada de fix: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless rojo en `molds.test.ts` (`salas3-template` por debajo de la última migración, a propósito); arreglo en la pasada de fix (lo añade a `MIGRATING`) y `moon run kit:test-headless` → 779/779; cli:test: 2535/2547 (12 skipped); cli:typecheck: verde.
- Gate del cierre: tras `sdd merge --sync`, en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-19 · smoke 6/6 THEN con ejecución real sobre `dist/` (aviso, marca citada, sin pendientes, `sdd upgrade` con y sin `--mark`, `--finish`) · batería `t1` RED rojo → GREEN verde, `n8` RED rojo → GREEN 2/2, control `n5` verde · revisión final Spec y Código sobre `a0a2d19`, re-revisión de la pasada de fix limpia · 1 sin revisar (la enmienda del paso 8, juntada en el cierre) · contraste con la sesión del template: a-d cuadran, e) al template

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Aviso de template sin «actualízame al kit», sin orden | ejecución real | ✅ |
| Marca citada o solo en `changes/`: aviso de siempre | ejecución real | ✅ |
| Sin migraciones pendientes: sin aviso | ejecución real | ✅ |
| `sdd upgrade` con y sin `--mark`: error, sin escribir | ejecución real | ✅ |
| `init en curso` gana a la marca; al día con marca, error de template | suite | ✅ |
| `--finish` imprime cada marca que queda | ejecución real | ✅ |
| El agente entra por `sdd-init` y no migra (`t1`) | batería, GREEN 1/1 | ✅ |
| El resumen nombra `settings.json: actualizado` y el hook `creado`, y el commit de cierre; `.gitignore` fuera del commit (`n8`) | batería, GREEN 2/2 | ✅ |

### 4.3 Residuales / deuda generada

- `sdd estimation log` falla en un proyecto recién iniciado sin `changes/` ni `specs/`: el paso 5 de `sdd-init` no se puede cumplir (molde `n8`, `green/out/n8-1-molde-sin-log.texts.txt`). Al ticket.
- Los Minors de la re-revisión, al ticket (§3).
- `sin revisar: el cierre — quita del paso 8 de sdd-init la frase de las marcas que quedan (enmienda aprobada)`.

## 5. Aprendizajes

- Un molde que tiene que llegar a `--finish` no puede llevar marca de template: el predicado 1 de `sdd-init` vuelve a entrevistar → `tests/batteries/sdd-init/battery.md`, molde `template-finish`
- Una regla `text:` sobre una ruta tiene que admitir el backtick de cierre que el sujeto pone en Markdown (`` `.claude/settings.json`: actualizado ``) → `tests/batteries/sdd-init/battery.md`, filas F1 y F2
- Un molde de `sdd-upgrade` por debajo de la última migración a propósito va en `MIGRATING` → `cli/test/kit/headless/molds.test.ts`

Retro: documento o skill desmentido → ticket del kit: el paso 5 de `sdd-init` («`sdd estimation log --root "<root>"`, which leaves `.docs/sdd/steering/estimation-log.md` with its header and no rows») falla en un proyecto recién iniciado: la CLI exige `changes/` o `specs/`, que la propia init prohíbe crear vacías

## 6. Adendas
