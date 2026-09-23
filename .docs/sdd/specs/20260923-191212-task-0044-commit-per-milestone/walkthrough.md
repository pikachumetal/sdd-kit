---
id: 20260923-191212-task-0044-commit-per-milestone
task: 0044
title: Walkthrough — Un commit por hito: apertura, cada task y cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Un commit por hito

## 1. Cambios realizados

- **Apertura** (`95d1fc6`): spec aprobada, plan de 3 tasks y `tasks.md`. Un commit intermedio de la spec (`1a4b9a2`) se juntó con `git reset --soft` antes del primer despacho: la propia task estrena la receta.
- **Task 1 — la forma en el carril task** (`703fc0b`):
  - nueva referencia `skills/sdd-start-task/references/commit-milestones.md` (qué lleva cada hito, receta, guardas, hash en los artefactos, RED sin commitear);
  - constitution Art. IV (la forma que el kit fija a los proyectos) y Art. VI;
  - `sdd-start-task` pasos 5 y 6 y `sdd-end-task` paso 10, con una frase y un enlace cada uno;
  - una fila en `overrides-superpowers.md` («Frequent commits» y el ledger por rango);
  - la sección «Tests RED» de `encargo-revision.md`;
  - `plan-template.md` («Tests RED» y el «Step 4: Commit de la task») y la cabecera de `tasks-template.md`.
  
  Anclas en `tests/CommitMilestones.Tests.ps1` y RED de archivo en `tests/commit-milestones-red.md`.
- **Task 2 — el carril patch** (`9582af8`): `sdd-start-patch` paso 5 (un solo commit de fix con `patch.md`), `sdd-end-patch` pasos 1 y 2 (el hash del fix y el commit de cierre) y el comentario de `commit:` en `patch-template.md`.
- **Task 3 — GREEN** (`f480201`): 12 sujetos en `green/` y `tests/commit-milestones-green.md`, más el REFACTOR de `sdd-end-patch` paso 2: junta el fix si llega en varios commits.
- **Cierre** (este commit): walkthrough, `capabilities/commit-history.md` (nueva) y el MODIFIED de `capabilities/task-flow.md`, `tasks.md`, changelog, roadmap, estimation-log y los aprendizajes en `tech-stack.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 0,9h — reloj del hilo, aproximado con las marcas de los commits (apertura a las 21:26 locales, GREEN a las 22:02, cierre hacia las 22:25). Spec y plan: ~0,5h, con una parada de unos minutos porque el modo auto no evaluaba las ediciones.
- Desviación: -1,6h (-64%)
- Causa de la desviación:
  - el RED salió del archivo, sin sujetos;
  - las dos tasks de texto traían la redacción literal en el plan (transcripción, ~3 min cada implementador);
  - la campaña corrió en serie en segundo plano mientras el hilo redactaba;
  - la estimación contó la campaña como tiempo de espera, justo lo que avisa el tercer aviso de `estimation.md`.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 602k en 5 despachos — implementador Task 1 Sonnet 132k / 3 min; revisor Task 1 Sonnet 113k / 3 min; implementador Task 2 Sonnet 90k / 3 min; revisor Task 2 Sonnet 91k / 2 min; revisor final Sonnet 176k / 6 min
- Coste de sujetos: 3,93 $ en 12 sujetos Sonnet — GREEN 3,37 $ (10 sujetos); re-verificación de G4 0,56 $ (2 sujetos)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- `plan-template.md`: el «Step 4» se reescribió como «Commit de la task» en vez de quitarse (la spec, decisión 9, decía quitarlo). En la plantilla ese paso ya era por task, no por paso.
- La Task 3 incluyó un REFACTOR del hilo en `skills/sdd-end-patch/SKILL.md` paso 2 que el plan no preveía. Salió del fallo 0/2 de G4 y entró en la revisión final de rama.
- El molde del GREEN se corrigió a mitad de campaña: a la Task 2 de juguete le faltaba su THEN.

### Decisiones tomadas sin el dev-lead

- El «Step 4» de `plan-template.md` se reescribe en vez de quitarse — en la plantilla ya es por task — coste si está mal: borrar una línea.
- Rechazado el hallazgo Important de la revisión de la Task 2 («implementador Opus en vez de Sonnet») — el despacho fue `model: sonnet`; el trailer `Co-Authored-By: Claude Opus 5.5` es la regla de atribución de la sesión; la revisión final coincide — coste si está mal: solo de dinero, no de texto.
- `Start-KitSession.ps1` (modificado por el dev-lead con `--dangerously-skip-permissions`) y un `obj/` en un molde de la 0012 quedan fuera de todos los commits — no son de la task — coste si está mal: un fichero sin commitear.
- REFACTOR de `sdd-end-patch` paso 2 en el hilo, sin despachar implementador — la Task 3 va en línea y el cambio es una frase medida por el propio GREEN; entró en la revisión final — coste si está mal: una frase.
- Important de la revisión final (cuerpo de `703fc0b` sin tildes, Art. III): **no se reescribe**. Se le preguntó al dev-lead en la validación y no eligió, así que se aplica la opción conservadora: arreglarlo exige reconstruir tres commits y cambiar el hash que ya apunta `tasks.md` — coste si está mal: un cuerpo de commit sin tildes en `develop`.
- Minor de la revisión final «`sdd-end-patch` paso 1 escribe un hash que el paso 2 puede cambiar»: sin cambio. El GREEN lo resolvió bien 2/2, y sin fallo observado no se escribe guidance (Art. I) — coste si está mal: un hash viejo en `patch.md` hasta que falle en campo.
- Minor «qué va en `commit:` de `patch.md` cuando salta una guarda» y Minor «`Get-SkillStep` no corta en un paso con ⛔»: el primero, a deuda; el segundo, aparcado para la 0045 — coste si está mal: un agente improvisa el campo / un ancla más laxa.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester -Path tests` (con los `Slow`): 440 en verde, 0 fallos, 6 omitidos, 197 s. El `pre-commit` corrió el conjunto rápido en cada commit (393/0 en el último).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «al ser funcionamiento se prueba en suo, test diferido» · disparador: la primera task del kit que se cierre con la forma nueva después de esta (la 0031, siguiente de la 2.0.0), a cargo del dev-lead.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED de archivo: ramas 0040 (13 commits), 0042 (7) y patch 0043, y tickets 0002 y 0042 sobre los RED y el `pre-commit` | ❌ los cuatro frentes, como se esperaba (`tests/commit-milestones-red.md`) |
| 2 | Anclas RED de la Task 1 antes de implementar | 13/13 rojas por el texto ausente; verdes tras `703fc0b` |
| 3 | Anclas RED de la Task 2 antes de implementar | 4/4 rojas; verdes tras `9582af8` |
| 4 | RED intactos: copia fuera del repo contra lo commiteado, tras cada implementador | `git diff --no-index` vacío en las dos tasks |
| 5 | GREEN G1 apertura, G2 task, G3 cierre y G5 guarda | ✅ 2/2 cada uno (`tests/commit-milestones-green.md`) |
| 6 | GREEN G4 patch | ❌ 0/2 → REFACTOR → ✅ 2/2 |
| 7 | La rama de la propia 0044 | apertura + 3 tasks + cierre = 5 commits; el hash de cada task aparece en `tasks.md` en el commit siguiente (verificado por la revisión final) |

### 4.3 Residuales / deuda generada

- Deuda: qué escribe `patch.md` en `commit:` cuando salta una guarda y el fix queda en varios commits.
- Deuda: el trailer `Co-Authored-By` nombra el modelo de la sesión y un revisor lo leyó como el del implementador (Important falso en la Task 2).
- `Get-SkillStep` de `tests/CommitMilestones.Tests.ps1` no corta en un paso con ⛔: queda para la 0045.
- El cuerpo de `703fc0b` va sin tildes: se queda así (decisión conservadora, ver §3).
- Sin medir: la guarda de lo ya publicado (el molde no tiene remoto) y el modo lite (3 commits, con la misma receta).

## 5. Aprendizajes

- Un molde de campaña que simula el paso 6 necesita un THEN por cada task de su plan de juguete: sin él, los sujetos paran a proponer una enmienda (conducta correcta) y el escenario deja de medir lo que buscaba → `tech-stack.md` (§Fixtures y baselines).
- La historia de una rama del kit es su propio RED: `git log --reverse --format='%h %p | %s' <merge>^1..<merge>^2` reconstruye la rama de una task ya fusionada sin lanzar sujetos → `tech-stack.md` (§Fixtures y baselines).
- La conducta de juntar commits vive en la skill del paso donde ocurre, y la del cierre no puede dar por hecho que el paso anterior se cumplió: G4 falló 0/2 con la regla solo en `sdd-start-patch` → corregido en `sdd-end-patch` paso 2; no pide doc vivo aparte (Art. II ya lo cubre).

## 6. Adendas
