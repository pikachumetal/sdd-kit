## Overrides sobre superpowers

| Default de superpowers | En este flujo |
| --- | --- |
| Specs/planes en `docs/superpowers/` | SOLO en `.docs/sdd/specs/` |
| Formato de spec/plan del skill | Plantillas del skill `sdd-templates` (viven en el kit, no en el proyecto) |
| `using-git-worktrees` | **El worktree lo crea, instala y borra superpowers** (`using-git-worktrees` en el setup de `subagent-driven-development`; `finishing-a-development-branch` ofrece borrarlo y **lo decide el usuario**). El kit no lo reimplementa. Lo que el kit añade es el **entorno**: si existe `.docs/sdd/environments.md`, `env:setup` tras crear el worktree y `env:clean` antes de borrarlo (contrato en `environments-template.md` de `sdd-templates`). |
| `subagent-driven-development` | **Es el default del kit.** La ejecución en línea es la excepción, y la declara el plan por task con su motivo. Al despachar, las "Restricciones globales" del plan viajan en el encargo del subagente. |
| Clasificación de `brainstorming` (spike / bounded / architectural) | Anúnciala junto al carril del kit. `bounded` y `architectural` no gobiernan los artefactos: la skill explora intención y requisitos, pero qué se escribe lo decide el modo del carril. Su rama `bounded` ("no spec file, no implementation plan document") NO aplica — en el kit toda task tiene `spec.md` y su gate de aprobación, en los dos modos. `spike` no es una task: sale por el enrutado (paso 2) a `sdd-consult`. |

## Cuándo NO aplicar SDD

Si el cambio se puede describir en una frase y no toca contratos ni datos, se hace directamente (commit correcto y listo). Un bug determinista va al carril patch. La planificación es proporcional a la incertidumbre, no un trámite universal.
