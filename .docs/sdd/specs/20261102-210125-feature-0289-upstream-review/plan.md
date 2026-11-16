---
id: 20261102-210125-feature-0289-upstream-review
feature: 0289
title: Plan de implementación — Revisar las fuentes de upstream antes del corte de la 3.0.0
spec: ./spec.md
status: draft
created: 2026-11-02
---

# Plan de implementación — Revisar las fuentes de upstream antes del corte de la 3.0.0

## Decisiones que he tomado yo — valida estas

1. Modelo: las dos tasks las hace la sesión (Native), sin subagentes; la revisión final, con los ejes de `sdd-verify`.
2. Ejecución: Native (ver la línea `Ejecución`).
3. Las filas de C1 y C2 se abren con `sdd-roadmap` en «Próximo», marcadas **Release 3.0.0**, antes de la 0284 y la 0198, con su origen en [upstream-review.md](upstream-review.md). C1 empieza por medir el corte de 20.000 caracteres en Claude Code; el dato hoy es de superpowers.
4. Coste: ~0,5 h de implementación, sin despachos.
5. Review Focus: ninguna entrada (ver la sección).

**Goal**: dejar `moon run kit:upstream` en verde con las versiones revisadas y abrir las filas de C1 y C2.

**Architecture**: dos ediciones de documentos: la tabla «Fuentes vigiladas» de `THIRD_PARTY_NOTICES.md`, que lee `tests/upstream/check.ts`, y dos filas de `roadmap.md`.

**Tech Stack**: Node con `tests/upstream/check.ts` y `sdd roadmap check` (`moon run kit:upstream`, `moon run kit:roadmap`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks de documentos sin interfaces entre ellas, un error lo caza el comando de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de documentos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (Art. X). Esta feature no toca código.
- No se tocan reglas de skills ni `tests/upstream/check.ts` ni `moon.yml`.

### De proceso

- Commits: tipo y scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By` de la sesión.

## Review Focus

- ninguna: comprobado — las dos tasks se observan enteras con su comando.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos ediciones de documentos.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. V (revisión de fuentes en cada release) y Art. XI (el trabajo pendiente va al roadmap).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `THIRD_PARTY_NOTICES.md` — «Versión vista» y «Fecha» de cinco filas de «Fuentes vigiladas».
- `.docs/sdd/roadmap.md` — dos filas nuevas en «Próximo» (C1 y C2).

**NO se tocan**:

- Los `NOTICE` de `skills/` y los avisos de forks de `THIRD_PARTY_NOTICES.md`: no se trae texto.
- `tests/upstream/check.ts`, `moon.yml`: fuera de alcance.

### 1.6 Dependencias

- Los clones de `SDD_UPSTREAM_DIR` (`D:/code/github/upstream`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una fuente publica otro tag antes del cierre | baja | `kit:upstream` vuelve a rojo | se repite el comando en el cierre; un tag nuevo se revisa y se añade a la revisión |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Versiones vistas al día

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: `moon run kit:upstream` en rojo antes del cambio (ya medido el 2026-11-02: cinco fuentes con versión nueva)
**Superficies**: docs
**Verificación**: `moon run kit:upstream` → `Fuentes al día: 7.`, código 0
**Interfaces**:
- Consume: la tabla «Fuentes vigiladas» (`| Fuente | Repo | Versión vista | Fecha |`), que `check.ts` lee por esa cabecera literal.
- Produce: nada.

**Ficheros**: modificar `THIRD_PARTY_NOTICES.md`

- [ ] **Step 1: Implementación** — en «Fuentes vigiladas»: superpowers `v7.0.1`, OpenSpec `v1.16.0`, Spec Kit `v1.2.6`, mattpocock/skills `v1.3.2`, impeccable `skill-v4.8.0`, las cinco con fecha 2026-11-02. MADR y Wondel no cambian.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — `moon run kit:upstream` → `Fuentes al día: 7.`
- [ ] **Step 4: Commit de la task**.

### Task 2 — Filas de C1 y C2 en la 3.0.0

**Tras**: —
**Modelo**: la sesión (Native), con `sdd-roadmap` invocada con `Skill`
**Tests RED**: no aplica: es planificación; lo valida `sdd roadmap check`
**Superficies**: docs
**Verificación**: `moon run kit:roadmap` → verde, código 0
**Interfaces**:
- Consume: C1 y C2 de [upstream-review.md](upstream-review.md) y las decisiones del dev-lead de `spec.md` (2026-11-02: «Fila en la 3.0.0» para las dos).
- Produce: dos ids nuevos de la secuencia, que la revisión cita en su columna «Destino».

**Ficheros**: modificar `.docs/sdd/roadmap.md` y `upstream-review.md` (el id de cada fila en «Destino»)

- [ ] **Step 1: Implementación** — con `sdd-roadmap`, dos filas en «Próximo», **Release 3.0.0**, antes de 0284 y 0198:
  - C1: «Skills de más de 20.000 caracteres tras una compactación»: (1) medir en Claude Code si una skill se recorta a 20.000 caracteres al volver a adjuntarla tras compactar; (2) si se confirma, un test de tamaño de `SKILL.md` en `cli/test/kit/` y mover secciones a `references/` que se leen en el paso que las usa, empezando por `sdd-implement` (61.562), con RED/GREEN por skill; si no se confirma, se cierra con la medida. Tamaño M–L.
  - C2: «`sdd-verify`: un `REMOVED` se busca por el comportamiento de su requisito vigente»: el revisor lee el requisito vigente de `capabilities/` por su título exacto antes de buscar; sin requisito utilizable, la comprobación queda «no verificada». Fichero: `skills/sdd-verify/references/spec-reviewer-prompt.md`, con su RED (Art. I). Tamaño S.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — `moon run kit:roadmap` → verde.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h (lectura de los cinco diffs incluida)
- Estimación de implementación: 0,5 h
- Estimación de revisión: 0,3 h
- Estimación de cierre: 0,6 h
- Base de la estimación: 2 tasks de documentos; referencia, la 0181 (revisión de fuentes con más lectura)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` (`tech-stack.md` §Testing)
- [ ] `moon run kit:upstream` en verde
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `moon run kit:upstream` sale con código 0 y «Fuentes al día: 7.» → Task 1, su Verificación. ✓
- La tabla sigue legible para `check.ts` → Task 1, la misma ejecución. ✓
- Las aceptadas, abiertas como filas antes de 0284 y 0198 → Task 2, `moon run kit:roadmap` y la posición de las filas. ✓
- La revisión da un veredicto por cambio y nombra lo no leído → hecha en la spec (`upstream-review.md`); la Task 2 añade los ids. ✓
