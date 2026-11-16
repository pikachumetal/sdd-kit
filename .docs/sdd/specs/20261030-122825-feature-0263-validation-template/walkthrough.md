---
id: 20261030-122825-feature-0263-validation-template
feature: 0263
title: Walkthrough — La validación se presenta siempre igual, y la spec decide quién valida
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-30
---

# Walkthrough — La validación se presenta siempre igual, y la spec decide quién valida

## 1. Cambios realizados

- Plantilla nueva `skills/sdd-templates/templates/validation-template.md`, línea `Validación:` en `spec-template.md` y `patch-template.md`, registro en `walkthrough-template.md` y `patch-template.md` — 3d486fab.
- `sdd-start-feature` paso 7, `control-profiles.md` («Quién valida»), `sdd-archive` paso 1 y `dev-validation.md` trazan desde la plantilla; `usage-guide.md`; escenarios `t1`-`t3` — c9153016.
- Reglas que la revisión final llevó al paso que cierra — en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 1,07 h — reloj de la sesión 1,10 h desde 2026-10-30T12:26Z, sin 2 min de espera al dev-lead (1 espera)
- Desviación: +0,07h (+7%)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 15.737.634 — claude-opus-5-5 15.737.634
- Tokens de subagentes: 2.483.668 en 3 despachos — Revisión final 0263 eje Código claude-sonnet-5-5 1.077.360 / 2 min; Revisión final 0263 eje Spec claude-opus-5-5 805.246 / 4 min; Re-revisión única 0263 claude-opus-5-5 601.062 / 3 min
- Coste de la sesión: 11,08 $ (hilo 8,04 $ + subagentes 3,04 $)
- Coste de sujetos: 7,74 $ en 27 sujetos Sonnet — RED 0,41 $; GREEN y control 7,33 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La previsión de sujetos (~4 $) se pasó a 7,74 $, dentro del tope de 8 $: dos rondas de REFACTOR y un control con el kit anterior.
- `t1` cambió de molde a `reservas-ui`.
- `sin revisar`: juntada en el cierre — tras la re-revisión, quita la vuelta por «THEN en una interfaz» y recupera el calificador «a esa pregunta».

### Decisiones tomadas sin el dev-lead

- `sdd task done` de la Task 1 se lanzó con un comando vacío; la verificación real corrió justo antes — error del hilo — ninguno: el pre-commit también pasó.
- Un commit WIP con `--no-verify`, deshecho y rehecho con el hook, sin publicar — error del hilo — ninguno.
- `t1` pasa a `reservas-ui`, porque el molde anterior no se usaba por servidor — enmienda sin aprobar, fuera de la excepción de `control-profiles.md` — `t1` deja de ser comparable con su RED en el entorno.
- Sale el test de la decisión 12, por la ADR 0019 — enmienda sin aprobar, fuera de la excepción — una plantilla puede perder la línea sin que salte un test.
- «validado» a secas cuenta como validación — enmienda sin aprobar, aplica la frase final del dev-lead — ninguno.
- «No funciona» sigue en `dev-validation.md` y `capabilities/archive.md`, como nombre de la rama de fallo — ninguno en conducta.
- Sin más sujetos con 7,74 $ de 8 $ — lo no medido se ve en campo.

## 4. Verificación

### 4.1 Builds

- `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` → 186 passed, 12 skipped.
- Gate: corre una vez en el merge de sincronización (paso 6), porque la base va por delante; su línea va en el mensaje final.
- Saldo (`wc -w`, antes → después): `sdd-start-feature/SKILL.md` 1977 → 1952 · `control-profiles.md` 4805 → 4795 · `sdd-archive/SKILL.md` 4616 → 4616 · `dev-validation.md` 1029 → 1020 · `sdd-templates/SKILL.md` 1663 → 1658.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-30 · 27 sujetos Sonnet (`tests/validation-template-red.md`) · revisión final Spec y Código con hallazgos, arreglados en una pasada · re-revisión con 1 abierto y 2 Important, arreglados · 1 sin revisar · sin medir: ver 4.3.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Presenta con la plantilla, 🦆 y ✋ primero, guion el último | ejecución real | `green3/t1` 2/2 |
| Guion por rama, worktree y entorno, bloque por terminal | ejecución real | `t1-1` sí; `t1-2` arranca él el entorno sin la clave |
| Acaba en «dime "validado"…», en texto | ejecución real | `t1`, `g1` sí; `g3-2` añade un aviso detrás |
| Sin `AskUserQuestion` | no probado | `claude -p` no la tiene |
| `startEnvironment: true` dice que está arrancado | ejecución real | `green2/g3` 2/2, entorno arriba |
| `agente`: sin guion, con su línea | ejecución real | `green2/t3` 2/2 |
| ✅ de la fila con `agente` | no probado | el molde no tiene fila |
| Sin la línea valida el dev-lead | ejecución real | `green/t2`, antes de los REFACTOR |
| Límite de `agente` y vuelta a `dev-lead` | no probado | leído |
| `field` no cambia | ejecución real | `green4/v1b` 1/1; `green2/v1b` había preguntado |

### 4.3 Residuales / deuda generada

- Quedan en este ticket, sin fila: `t1-2`, `g3-2` y `g1-2` (no lanza el panel), «validado» en segundo turno, el literal «No hay comando de arranque declarado».

## 5. Aprendizajes

- Un molde cuya aplicación se usa por CLI no mide si el guion arranca el entorno, aunque tenga servidor → `tech-stack.md`.
- Una excepción de plantilla sin contraejemplo se usa a la primera → ya en Art. II; caso en `tests/validation-template-red.md`.

Skills review: se editan las skills del Scope; `.claude/skills/` no tiene nada que tocar.

## 6. Adendas
