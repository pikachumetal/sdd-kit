## Overrides sobre superpowers

| Default de superpowers | En este flujo |
| --- | --- |
| Specs/planes en `docs/superpowers/` | SOLO en `.docs/sdd/specs/` |
| Formato de spec/plan del skill | Plantillas del skill `sdd-templates` (viven en el kit, no en el proyecto) |
| `using-git-worktrees` | **El worktree lo crea, instala y borra superpowers** (`using-git-worktrees` en la preparación de `sdd-implement`; `finishing-a-development-branch` ofrece borrarlo y **lo decide el usuario**). El kit no lo reimplementa. Lo que el kit añade es el **entorno**: si existe `.docs/sdd/environments.md`, `env:setup` tras crear el worktree y `env:clean` antes de borrarlo (contrato en `environments-template.md` de `sdd-templates`). |
| `finishing-a-development-branch` | En el cierre de feature y en el de patch, con un bloque `merge` completo en `sdd-kit.json` y perfil `delegate` o `unattended`, se aplica esa política de merge a `develop` sin ofrecer las opciones del Step 4 de la skill. Con el bloque ausente o incompleto, o en `pair`, se ofrecen como hoy. Si la rama destino no está sacada en ningún worktree, la opción 1 (merge local) se sustituye por la [receta del merge](../../sdd-end-feature/references/merge-recipe.md): su `cd` a la raíz del repo principal falla en un repo bare. Push y creación de PR se confirman siempre, en los tres perfiles. |

## Cuándo NO aplicar SDD

Si el cambio se puede describir en una frase y no toca contratos ni datos, se hace directamente (commit correcto y listo). Un bug determinista va al carril patch. La planificación es proporcional a la incertidumbre, no un trámite universal.
