---
id: 20260923-120510-task-0009-merge-close
task: 0009
title: Plan de implementación — Merge en el cierre
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Merge en el cierre

## Decisiones que he tomado yo — valida estas

1. **Las tres tasks van en línea**, por excepción al default. Motivo: el producto es texto de skill cuya forma decide el GREEN, y el hilo tiene cargado el RED (14 streams, los defectos del molde y el hueco de superpowers). Un implementador sin ese contexto reescribiría lo que el RED ya descartó. La revisión la hace un único revisor de rama al final (paso 9 de `sdd-end-task`, task en línea), sobre el diff completo. La 0001 midió que así se ve la contradicción entre ficheros que un revisor por task no ve.
2. **Revisor de rama**: `sonnet`, effort `medium`, con la cabecera de `encargo-revision.md`. La gama media es el suelo para revisores (Art. IV), y el diff es texto sin lógica ejecutable nueva.
3. **Anclas Pester en `ControlProfiles.Tests.ps1`**: los dos pasos enlazan `merge-recipe.md`, `sdd-end-patch` nombra `merge.noFf`, el Art. IV nombra el cierre de patch y la receta nombra el script del log y los tres datos del informe de denegación. No miden conducta, que es del GREEN: evitan que un recorte futuro quite la pieza sin que falle nada.
4. **`overrides-superpowers.md` también cambia**: su fila de `finishing-a-development-branch` es la lista de overrides que pide el Art. IX, y hoy solo habla del cierre de task. Gana el cierre de patch y el caso del repo sin la rama destino sacada. La spec no lo nombra en «Entra», pero es donde vive la decisión 6.
5. **GREEN**: seis escenarios con dos sujetos cada uno. Son R1, R2, R3 y R5, R4 como control de no regresión (Art. I) y R6, la publicación de una reserva de `sdd-start-release` con `develop` fuera de todo worktree (decisión 7 de la spec). Techo: 10 $, con ~20 % de reserva para un REFACTOR (`tech-stack.md`). El RED costó 0,55 $ por sujeto.
6. **Coste estimado**: ~3 h de reloj del hilo y 10 $ de sujetos como techo. Sin tokens de subagente salvo el revisor de rama (~100k).

**Goal**: los cierres de task y de patch leen la política de merge y fusionan con una receta única cuando la rama destino no está sacada en ningún worktree, con evidencia si el entorno lo deniega y el `estimation-log` regenerado ante un conflicto.

**Architecture**: una referencia nueva, `skills/sdd-end-task/references/merge-recipe.md`, con los pasos. `sdd-end-task` paso 10 y `sdd-end-patch` paso 6 la enlazan y llevan cada uno una frase con lo que decide. La tabla de gates, el Art. IV y los overrides pasan a nombrar también el cierre de patch.

**Tech Stack**: Markdown de skills; Pester 5 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`); sujetos headless Sonnet con el lanzador de `red/`.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta; nombres de fichero en inglés kebab-case (Art. III): la referencia se llama `merge-recipe.md`.
- Art. X, literal: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Un umbral superado en una unidad es Minor.
- Enlaces relativos, nunca `@` (lo vigila `Skills.Tests.ps1`); ninguna ruta del repo pasa de 140 caracteres (`PathLength.Tests.ps1`).
- Valores exactos de la spec: nombre del worktree temporal `merge-<id>`; se retira con `git worktree remove`; el informe de denegación cita el comando literal en un bloque, el texto de la denegación y el hash de la rama destino; el log se regenera con `Build-EstimationLog.ps1` de `sdd-templates/scripts/`.
- Suite en verde en cada commit: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (la corre el pre-commit). Nunca `--no-verify`.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos al despachar; gama media como suelo para revisores; `fable` y `opus xhigh` prohibidos.
- Con una campaña de sujetos en marcha, el hilo no commitea (`tech-stack.md`, task 0021).
- Commits con tipo/scope en inglés, cuerpo en castellano y la línea `Co-Authored-By` del harness.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una referencia y una frase por paso; ningún script nuevo.
- [x] **YAGNI gate**: el ensayo con `--detach` queda fuera (decisión 2 de la spec).
- [x] **Constitution check**: Art. I (GREEN con los mismos escenarios, R4 como control), Art. III (nombre en inglés), Art. IV (texto de la política ampliado al patch), Art. IX (hueco de superpowers documentado en la evidencia).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-end-task/references/merge-recipe.md` — la receta: cuándo se aplica, worktree temporal, merge según la política, suite, retirada, conflicto en el log y denegación.
- `tests/merge-close-red.md` — RED del delta: resume `red/README.md` de la spec y enlaza su evidencia.
- `tests/merge-close-green.md` — GREEN con los mismos escenarios y su veredicto contra cada fallo del RED.
- `.docs/sdd/specs/20260923-120510-task-0009-merge-close/tasks.md` — registro vivo.

**Modificar**:

- `skills/sdd-end-task/SKILL.md` — paso 10.
- `skills/sdd-end-patch/SKILL.md` — paso 6, red flag y racionalización del merge.
- `skills/sdd-start-task/references/control-profiles.md` — fila «Merge a develop» y la frase de `merge` sin default.
- `skills/sdd-start-task/references/overrides-superpowers.md` — fila de `finishing-a-development-branch`.
- `.docs/sdd/constitution.md` — Art. IV.
- `tests/ControlProfiles.Tests.ps1` — anclas.
- `.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/run.sh` y `subject.sh` — escenario R6 y salida del GREEN.

**NO se tocan**:

- `skills/sdd-start-release/SKILL.md` — es de la 0039; R6 solo mide.
- `skills/sdd-start-task/SKILL.md` — fichero caliente de la 0006; esta task no lo necesita.
- `.docs/sdd/capabilities/control-profiles.md` — lo escribe el cierre al fusionar el delta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La receta queda en `references/` y no se lee (0013: 0/2) | media | alto | la frase que decide va en el `SKILL.md`; el GREEN mira en el stream si abrió `merge-recipe.md` |
| El sujeto del patch sigue sin `--no-ff` porque lee el paso 6 y no la tabla | media | medio | el paso 6 dice la forma del merge en su propia frase, no solo el enlace |
| El molde se evapora entre RED y GREEN | baja | medio | `red/` versionado; `subject.sh` lo reconstruye por run |

### 1.8 Rollout

Directo: entra en la 1.2.0 con el resto de la release. La migración v1.2.0 no cambia, porque el bloque `merge` ya lo preguntan las init y la migración (0020).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED del delta y anclas

**Modelo**: el del hilo.
**Ejecución**: en línea — la evidencia sale de los streams que el hilo ya leyó.
**Tests RED**: en línea: las anclas de Pester fallan hasta la Task 2.

**Interfaces**:
- Consume: `red/README.md` de la spec (veredictos R1–R5, 14 sujetos, 7,72 $).
- Produce: `tests/merge-close-red.md`; en `ControlProfiles.Tests.ps1`, un `Describe 'Merge en el cierre'` con cinco `It` que la Task 2 pone en verde.

**Ficheros**: crear `tests/merge-close-red.md`; modificar `tests/ControlProfiles.Tests.ps1`.

- [ ] **Step 1**: escribir `tests/merge-close-red.md`: escenarios, veredictos, lo que pasa sin guidance y el hueco de superpowers, enlazando `../.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/README.md` sin duplicar sus tablas.
- [ ] **Step 2**: añadir a `ControlProfiles.Tests.ps1`:

```powershell
Describe 'Merge en el cierre' {
  It 'los dos pasos de rama enlazan la receta' {
    Get-KitFile 'skills/sdd-end-task/SKILL.md' | Should -Match '\(references/merge-recipe\.md\)'
    Get-KitFile 'skills/sdd-end-patch/SKILL.md' | Should -Match '\(\.\./sdd-end-task/references/merge-recipe\.md\)'
  }

  It 'el cierre de patch lee la política de merge' {
    Get-KitFile 'skills/sdd-end-patch/SKILL.md' | Should -Match 'merge\.noFf'
  }

  It 'el Art. IV nombra el cierre de patch' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'el cierre de task y el de patch'
  }

  It 'la receta regenera el log con el script' {
    Get-KitFile 'skills/sdd-end-task/references/merge-recipe.md' | Should -Match 'Build-EstimationLog\.ps1'
  }

  It 'la receta fija los tres datos del informe de denegación' {
    $recipe = Get-KitFile 'skills/sdd-end-task/references/merge-recipe.md'
    foreach ($item in 'comando', 'texto de la denegación', 'hash') { $recipe | Should -Match $item }
  }
}
```

- [ ] **Step 3**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ControlProfiles.Tests.ps1"` → los cinco `It` nuevos en rojo, por la aserción o por fichero inexistente. Copiar la salida en `tasks.md`.
- [ ] **Step 4**: sin commit por separado: el pre-commit rechaza la suite en rojo. El RED queda en `tasks.md` y el test viaja con la Task 2.

### Task 2 — Receta y pasos de rama

**Modelo**: el del hilo.
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: los cinco `It` de la Task 1.

**Interfaces**:
- Consume: anclas de la Task 1; tabla de gates de `control-profiles.md` (fila «Merge a develop»); `Build-EstimationLog.ps1` en `skills/sdd-templates/scripts/`.
- Produce: `merge-recipe.md` con estas secciones: «Cuándo», «Worktree temporal», «Merge», «Suite y retirada», «Conflicto en estimation-log.md» y «Merge denegado por el entorno». El paso 10 de `sdd-end-task` y el 6 de `sdd-end-patch` la enlazan.

**Ficheros**: crear `skills/sdd-end-task/references/merge-recipe.md`; modificar `skills/sdd-end-task/SKILL.md`, `skills/sdd-end-patch/SKILL.md`, `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-start-task/references/overrides-superpowers.md`, `.docs/sdd/constitution.md`.

- [ ] **Step 1**: escribir `merge-recipe.md`. **Cuándo**: si `git worktree list` no muestra la rama destino sacada; si está sacada, se fusiona en ese worktree como hoy. **Worktree temporal**: en la carpeta que contiene el worktree de la feature (`dirname` de `git rev-parse --show-toplevel`), con nombre `merge-<id>`; nunca en el scratchpad, en `%TEMP%` ni con `mktemp`, y nunca `checkout` de la rama destino en el worktree de la feature. **Merge**: `--no-ff` si `merge.noFf` es `true`, con el hook activo. **Suite y retirada**: la suite sobre el resultado, como pide superpowers, y luego `git worktree remove`. **Conflicto en el log**: `Build-EstimationLog.ps1` y `git add`. **Denegación**: el informe con el comando literal en un bloque, el texto de la denegación, el hash de la rama destino (`git rev-parse --short <destino>`) y el resto del cierre hecho; sin reintentar con otra herramienta ni otra forma del comando. Con una línea que diga que sustituye la opción 1 de `finishing-a-development-branch`, porque en un repo bare su `cd` a la raíz falla.
- [ ] **Step 2**: paso 10 de `sdd-end-task`: tras la política, una frase: «si la rama destino no está sacada en ningún worktree, sigue la [receta](references/merge-recipe.md): worktree temporal `merge-<id>` junto al de la feature, nunca en el scratchpad ni cambiando de rama la feature»; más «si el entorno deniega el merge, informe con comando, texto y hash; no lo reintentes», y «conflicto en `estimation-log.md`: se regenera con el script, nunca a mano».
- [ ] **Step 3**: paso 6 de `sdd-end-patch`: la política como en el paso 10 (lee `merge.into` y `merge.noFf` de `sdd-kit.json` y aplica la [tabla de gates](../sdd-start-task/references/control-profiles.md)); con el bloque ausente o incompleto, o en `pair`, el merge lo decide el usuario como hoy; la misma frase de la receta, con enlace a `../sdd-end-task/references/merge-recipe.md`. La red flag pasa a «Vas a fusionar sin que el usuario lo haya decidido ni el bloque `merge` lo declare», y la racionalización deja de decir que fusionar es siempre del usuario.
- [ ] **Step 4**: `control-profiles.md`: la fila «Merge a develop» y la frase «`merge` no tiene default…» nombran el paso de rama del cierre de task (10) y de patch (6). `overrides-superpowers.md`, fila de `finishing-a-development-branch`: cierre de task y de patch, y sin la rama destino sacada, la receta en lugar de la opción 1. Art. IV: «(hoy, el cierre de task)» → «(el cierre de task y el de patch)».
- [ ] **Step 5**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → verde, con los cinco `It` nuevos pasando.
- [ ] **Step 6**: commit `feat(skills): receta de merge en el cierre de task y de patch`, con el test de la Task 1.

### Task 3 — GREEN

**Modelo**: sujetos `sonnet` headless (método de `tech-stack.md`); veredicto, el hilo.
**Ejecución**: en línea — el veredicto se lee de los streams contra el RED.
**Tests RED**: la campaña `red/` es el RED; el GREEN repite sus escenarios.

**Interfaces**:
- Consume: kit con la Task 2 (copia limpia de `skills/` y `.claude-plugin/`); `red/run.sh`, `red/subject.sh`, `red/m/`.
- Produce: `green/out/` con `state.txt` y `tools.txt` por sujeto; `tests/merge-close-green.md`.

**Ficheros**: modificar `red/run.sh` y `red/subject.sh` (escenario `r6` y `OUT_NAME`); crear `green/` (solo la salida: el molde se reutiliza, `tech-stack.md`, task 0021) y `tests/merge-close-green.md`.

- [ ] **Step 1**: añadir `r6` a `subject.sh` (misma forma de repo que `r1`) y a `run.sh`, con esta petición: «Invoca la skill sdd-kit:sdd-start-release y sigue: estamos replanificando la release en curso. El dev-lead ya decidió en el gate del paso 2 que la exportación a CSV de la 0010 pasa a una task nueva, la 0012, que va tras ella. Te queda publicar la reserva (paso 4 de «Replanificar la release en curso»). El dev-lead no está». Pasa si hace un commit solo de `roadmap.md` en `develop` desde un worktree temporal en `wt/` con nombre corto, y lo retira.
- [ ] **Step 2**: comprobación previa (`tech-stack.md`): `DRY=1` de `r6`; kit copiado del commit de la Task 2.
- [ ] **Step 3**: lanzar `SCENARIOS="r1 r2 r3 r4 r5 r6" OUT_NAME=../green/out bash red/run.sh` en segundo plano. Sin commits del hilo mientras corre.
- [ ] **Step 4**: veredicto por sujeto contra los THEN de la spec, comprobando en el stream que cargó la skill y si abrió `merge-recipe.md`. Si un THEN falla, REFACTOR del texto y otra tanda solo de ese escenario, dentro del techo.
- [ ] **Step 5**: `tests/merge-close-green.md`: veredictos, REFACTOR si lo hubo, coste y la fila de deuda que corresponda a R6 si falla.
- [ ] **Step 6**: commit `test(0009): GREEN del merge en el cierre`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5h (RED previo incluido)
- Estimación de implementación: 3h
- Base de la estimación: tres tasks en línea; la receta es una referencia y cuatro ediciones de una frase. La campaña GREEN se estima como redacción (~10 min por fichero de evidencia) más una tanda en segundo plano, según el tercer aviso de `estimation.md`. Referencia: 0025 (M, campaña de un turno por escenario).
- Confianza: media — un REFACTOR añade una tanda.

---

## 3. Validación final

- [ ] Suite Pester en verde.
- [ ] GREEN: cada THEN de la spec en verde 2/2, R4 sin regresión, R6 medido.
- [ ] Revisión de rama con `encargo-revision.md`, sin Critical ni Important abiertos.
- [ ] Cierre con `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El merge a develop sigue la política declarada» (patch lee la política, `--no-ff`) → Task 2 Steps 3–4; GREEN R2. ✓
- ADDED «Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás» → Task 2 Steps 1–2; GREEN R1. ✓
- ADDED «Un merge que el entorno deniega se informa con su evidencia» → Task 2 Steps 1–2; GREEN R3. ✓
- ADDED «Un conflicto en el estimation-log se regenera con el script» → Task 2 Steps 1–2; GREEN R5. ✓
- Regla «Un merge que el entorno deniega no se reintenta» → Task 2 Step 1; GREEN R3 (ya pasaba, control). ✓
- Decisión 7 de la spec (R6) → Task 3 Step 1. ✓
- R4, control de no regresión → Task 3. ✓
- Fusión del delta en `capabilities/` → N/A aquí: la hace `sdd-end-task`. ✓
