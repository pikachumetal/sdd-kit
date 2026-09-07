## Overrides sobre superpowers

| Default de superpowers | En este flujo |
| --- | --- |
| Specs/planes en `docs/superpowers/` | SOLO en `.docs/sdd/specs/` |
| Formato de spec/plan del skill | Plantillas del skill `sdd-templates` (viven en el kit, no en el proyecto) |
| `using-git-worktrees` | El kit no gestiona worktrees desde el flujo (no invoca esta skill ni crea entornos): trabaja dentro del git-flow del proyecto —worktrees incluidos si el proyecto los usa— que el dev gestiona por su cuenta. No los prescribe ni los excluye. |
| `subagent-driven-development` | Se evita: ejecución en línea con checkpoints |
| Clasificación de `brainstorming` (spike / bounded / architectural) | Anúnciala junto al carril del kit. `bounded` y `architectural` no gobiernan los artefactos: la skill explora intención y requisitos, pero qué se escribe lo decide el modo del carril. Su rama `bounded` ("no spec file, no implementation plan document") NO aplica — en el kit toda task tiene `spec.md` y su gate de aprobación, en los dos modos. `spike` no es una task: sale por el enrutado (paso 2) a `sdd-consult`. |

## Cuándo NO aplicar SDD

Si el cambio se puede describir en una frase y no toca contratos ni datos, se hace directamente (commit correcto y listo). Un bug determinista va al carril patch. La planificación es proporcional a la incertidumbre, no un trámite universal.
