---
id: 20261103-115014-patch-0298-skill-size-gate
task: 0298
title: Patch — un SKILL.md de 20.000 bytes o más pone la release en rojo
type: patch
solution: dev-lead
status: done
created: 2026-11-03
branch: patch/0298-skill-size-gate
commit: 4ee21f58
---

# Patch 0298 — Un `SKILL.md` de 20.000 bytes o más pone la release en rojo

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Ninguna, porque ninguna capacidad describe las tareas de moon de este repo

## 1. Síntoma

Fila 0298 y [medida de la 0296](../20261103-101227-feature-0296-skills-survive-compaction/compaction-measure.md): tras compactar, Claude Code vuelve a adjuntar cada skill invocada cortada a 20.000 caracteres, y lo que queda detrás se pierde el resto de la sesión. Cinco skills del kit pasan del corte, y nada en el repo lo avisa; superpowers 7.0.1 tiene un test que falla en ese caso.

## 2. Solución fijada

Del dev-lead, en la petición: «una comprobación en Node, portada de `tests/skill-size/test-skill-size.sh` de superpowers 7.0.1, que mide en bytes cada `skills/*/SKILL.md`, falla con 20.000 o más y nombra cada skill con su tamaño y el límite. Corre como tarea propia de moon y entra en la orden de corte de la regla 5 de CLAUDE.md», fuera de `cli:test`, `cli:test-min`, la CI y el pre-commit (2026-11-03: «ahora en el release pero que lo veamos rojo, luego una vez acabemos en el precommit»). Mide bytes; el mensaje es el de la fuente, en castellano; se conserva su lógica (ADR 0013) con la procedencia en la cabecera.

Lo que da por existente, comprobado: `git -C <SDD_UPSTREAM_DIR>/superpowers show v7.0.1:tests/skill-size/test-skill-size.sh` existe, y las cinco skills pasan hoy (bytes): `sdd-implement` 62.117, `sdd-propose` 33.474, `sdd-archive` 31.184, `sdd-verify` 23.150 y `sdd-roadmap` 21.830.

## 3. Fix

- **Fichero(s)**: `tests/skill-size/check.ts` (y su `package.json` de módulo, como `tests/upstream/`), `moon.yml` (`kit:skill-size`), `CLAUDE.md` regla 5, `cli/test/kit/skill-size.test.ts`, `THIRD_PARTY_NOTICES.md`, `.docs/sdd/tech-stack.md`.
- **Cambio**: la comprobación recorre `skills/*/SKILL.md` por orden alfabético, como el glob de la fuente, y por cada uno de 20.000 bytes o más escribe `FALLA: skills/<skill>/SKILL.md ocupa <n> bytes (límite: menos de 20000)` y cierra con `Mueve a su references/ lo que la skill solo necesita a veces.`; sale con 1. Sin ninguno, `OK: …` y 0. La orden de corte de la regla 5 pasa a `moon run kit:skill-size cli:test-slow cli:test-min`.
- **Decisiones**:
  - La comprobación vive en `tests/skill-size/check.ts`, junto a `tests/upstream/check.ts`, y exporta `checkSkillSize(<raíz>)` para que el test la llame en proceso, sin lanzar Node: así va en `cli:test` y no en los lentos — sin el dev-lead
  - El aviso de la fuente va en `THIRD_PARTY_NOTICES.md`, como el de `cli/src/tasks/`, y la cabecera lo nombra — sin el dev-lead
  - `tech-stack.md` nombra `kit:skill-size` junto a `kit:upstream`, fuera de hooks y del gate — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cli/test/kit/skill-size.test.ts` antes de la comprobación | ❌ RED por import: `tests/skill-size/check.ts` no existe |
| 2 | el mismo test después: 19.999 bytes pasa, 20.000 falla y lo nombra con su tamaño y el límite, y mide bytes (10.000 `á` = 20.000 bytes) | ✅ 3/3 |
| 3 | `moon run kit:skill-size` hoy | ✅ rojo, exit 1, con `sdd-archive` 31184, `sdd-implement` 62117, `sdd-propose` 33474, `sdd-roadmap` 21830 y `sdd-verify` 23150 |
| 4 | `.github/workflows/ci.yml` y `.githooks/` no nombran `skill-size`; `cli:test` y `cli:test-min` corren el test de la comprobación, no la comprobación | ✅ |
| 5 | `pnpm exec tsc --noEmit` en `cli/` | ✅ |

Validación en campo: 2026-11-03 · RED→GREEN en `skill-size.test.ts` 3/3 · `moon run kit:skill-size` en rojo con las cinco skills y su tamaño (ejecución real) · el gate de cierre corre en la base integrada, porque `develop` va un commit por delante

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-03T11:50Z
- Esfuerzo real: 0,06 h — reloj de la sesión 0,06 h desde 2026-11-03T11:49Z, sin 0 min de espera al dev-lead (0 esperas). Desvío frente a 0,5 h: la petición fijaba límite, mensaje, tarea y ficheros, y la fuente son 30 líneas; sin esperas ni huecos
- Coste de sujetos: no aplica
