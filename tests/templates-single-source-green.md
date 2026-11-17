# Evidencia GREEN — fuente única de plantillas (2026-07-21)

Verificación dirigida de la edición de las 7 skills existentes que consuma el Art. VIII (las plantillas viven SOLO en `skills/sdd-templates/templates/`; los proyectos no llevan carpeta `templates/`).

## RED (comportamiento anterior, documentado en git)

Antes de la edición, las propias skills instruían la copia: `sdd-templates` se describía como "*el proyecto no tiene la plantilla correspondiente en `.docs/sdd/templates/` — se copia desde aquí*" y `sdd-init-greenfield` ordenaba "*crear `.docs/sdd/` completa, copiar plantillas*". El fallo no es una racionalización del agente sino la instrucción misma: cada proyecto acumulaba una copia que derivaba respecto al kit (deriva observada en el estreno real que motivó el cambio). El RED es el texto anterior, observable en el historial (`git log -p skills/sdd-templates/SKILL.md`).

## Escenario GREEN

Subagente Sonnet sobre la fixture "TimeTrack" (proyecto SIN carpeta `templates/`), con las skills editadas accesibles por ruta (`sdd-start-task`, `sdd-templates` + `templates/`). Encargo: "Arranca la task del informe mensual (ticket 210). Quiero la spec encima de la mesa para revisarla — no toques código todavía", con el dev-lead ilocalizable.

## Resultado (verificado en disco)

- ✅ **No creó `.docs/sdd/templates/` en el proyecto** (`Test-Path` → False) ni copió plantilla alguna: calcó `spec-template.md` directamente desde la ruta del kit.
- ✅ Spec en `.docs/sdd/specs/20260721-091448-task-210-informe-mensual/spec.md` con el naming estándar (timestamp UTC, `task`, id de ticket real, slug), en rama `feature/210` desde `develop` (constitution del proyecto).
- ✅ Se detuvo en el gate de aprobación: ni `plan.md` ni código; las asunciones quedaron como open questions (la más crítica —partes aprobados vs horas registradas— señalada como decisión del usuario).
- ✅ Autorrevisión de placeholders (sin `<...>` residuales).

## Incidente registrado (no atribuible a las skills)

La herramienta PowerShell del subagente no persistía el cwd y apuntaba al repo del kit: el agente creó dos veces una rama `feature/210` en `sdd-kit`, lo detectó (`git rev-parse --show-toplevel`), lo revirtió y verificó el estado. **Comprobado de forma independiente tras el run**: `sdd-kit` solo tiene `master` y el working tree quedó idéntico. Aprendizaje operativo para futuros tests: fijar en el prompt del subagente el uso de rutas absolutas o Bash con `cd` explícito.

## Alcance de la verificación

El escenario ejercita las rutas editadas de `sdd-start-task` (calcar spec-template del skill) y `sdd-templates` (fuente única + regla de sustitución de huecos). Las ediciones de las otras 5 skills (`sdd-end-task`, `sdd-start-hotfix`, `sdd-end-hotfix`, `sdd-init-greenfield`, `sdd-init-brownfield`) son el mismo patrón de sustitución de referencia (`.docs/sdd/templates/` → "del skill `sdd-templates`"; `tools/sdd/` → `.tools/sdd/` con fallback), deterministas y verificadas por lectura del diff.

## Veredicto

GREEN: la fuente única funciona de extremo a extremo sin carpeta `templates/` en el proyecto. Ediciones de las 7 skills listas para commit.
