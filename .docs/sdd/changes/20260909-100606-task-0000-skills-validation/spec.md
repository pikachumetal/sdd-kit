---
id: 20260909-100606-task-0000-skills-validation
task: 0000
title: Validación de frontmatter y estructura de las skills (T8)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Validación de frontmatter y estructura de las skills (T8)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

1. **La "CI" es la suite Pester del kit, ejecutada en local por un hook pre-commit** — el repo no tiene remoto y el hosting (GitHub / Azure DevOps) es decisión pendiente; el fichero de pipeline se escribe con esa decisión. Confirmado en el brainstorming.
2. **Hook versionado en `.githooks/pre-commit` y activado con `git config core.hooksPath .githooks`** — sin Husky ni Node: el kit no tiene `package.json` y "sin build" sigue vigente. La skill `setup-pre-commit` del usuario (Husky + lint-staged) no aplica. El README documenta el comando de activación.
3. **`claude plugin validate` se adopta, no se reimplementa** (Art. IX): la suite lo ejecuta en `--strict` sobre `skills/` y `.claude-plugin/marketplace.json`; se salta con aviso si `claude` no está en PATH. Sobre `plugin.json` se ejecuta sin `--strict`: su aviso por el `CLAUDE.md` de la raíz es inherente al repo.
4. **Lo que `validate` no cubre lo cubren tests propios** (comprobado: acepta `name: Sdd Consult!`): `name` igual a la carpeta y kebab-case; `description` que empieza por «Usar»; H1 igual al nombre; sección Overview; enlaces relativos a `references/`, `templates/` y `scripts/` que resuelven; ningún `references/*.md` huérfano; ningún `@` de carga forzada; el conjunto de `superpowers:*` citadas igual al del README; la tabla de `sdd-templates/SKILL.md` igual al contenido de `templates/`; el número de plantillas del README igual al real; `plugin.json` con SemVer y `marketplace.json` con `source: "."`.
5. **Se añade la `description` que falta en `marketplace.json`** para que `--strict` pase: es el único aviso real que hoy da `validate`.
6. **No se valida el contenido de las skills** (que la `description` no resuma el workflow, tablas de racionalizaciones, tamaño): eso lo mide el A/B (Art. I), no un test estructural.
7. **Sin delta ni capacidad nueva en `funcional/`**: la validación es infraestructura del kit, no comportamiento observable por un proyecto consumidor, y no toca ninguna capacidad existente. La spec lo declara aquí en vez de llevar una sección de delta vacía.

## Intent

El kit tiene 11 skills con una anatomía fija (architecture.md) y convenciones que hoy solo vigila la lectura humana: `name` en kebab igual a la carpeta, `description` que dice cuándo usarla, `references/` enlazados en el punto de uso y nunca con `@`, plantillas indexadas en `sdd-templates`, la lista de skills de superpowers del README. En T2 y T5 se movieron y renombraron ficheros a mano en siete sitios; un enlace roto o un `references/` huérfano no lo detecta nadie hasta que un agente lo pisa. Se quiere que cada commit del kit falle si rompe esa anatomía.

## Scope

- Entra: `tests/Skills.Tests.ps1` (estructura y convenciones), `tests/Manifests.Tests.ps1` (`claude plugin validate` y manifests), `.githooks/pre-commit`, `description` en `marketplace.json`, README (activación del hook y comando de tests), `tech-stack.md`.
- No entra: fichero de pipeline (GitHub Actions / Azure DevOps); validación de contenido o tamaño de las skills; tests de las plantillas más allá de su indexación; lint de Markdown.

## Approach

Dos ficheros Pester junto al de T7, con la misma convención (`tests/*.Tests.ps1`, `Invoke-Pester -Path tests` como único punto de entrada). Los tests leen `skills/` y los manifests reales, no fixtures: el contrato es el repo mismo. El hook llama a Pester y bloquea el commit si falla. TDD: cada regla nace con un test que falla sobre una copia rota (como el sondeo de `name: Sdd Consult!`) y pasa sobre el repo.

## Delta de comportamiento

Sin delta: no cambia el comportamiento observable de ninguna capacidad de `funcional/` (decisión 7).

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,3 h
- Estimación de implementación: 1 h (rango 0,7–1,5)
- Base de la estimación: ~15 reglas de test, cada una unas pocas líneas; el sondeo de `validate` ya está hecho; ancla: T7 (1,1 h real con tres rondas de revisión). Incertidumbre: cuántas convenciones actuales fallan al primer pase y hay que arreglar en el repo.
- Confianza: media

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 7 decisiones sin cambios) |
