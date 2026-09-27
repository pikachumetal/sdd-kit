# Evidencia GREEN — auto-enrutado frente a superpowers (2026-09-21)

Verificación de la task [auto-routing](../.docs/sdd/specs/20260921-162213-task-0014-auto-routing/spec.md) contra el RED de [`auto-routing-red.md`](auto-routing-red.md). Mismos moldes, mismas peticiones y mismo lanzador; lo único que cambia es la copia del kit: ahora lleva `hooks/` (hook `SessionStart` con el router de `hooks/router.md`), las `description` reescritas y el frontmatter nuevo. Los cambios entran **juntos**, así que la campaña no separa cuánto aporta cada capa (ver «Límites»).

## Criterio de la spec (decisión 4), fijado antes de medir

- `h1` y `h4` ×3 cada uno con **6 de 6** el kit primero (RED: 3 de 6).
- Las seis peticiones cotidianas sin regresión.
- Los controles de edición trivial, sin ninguna skill invocada.

## Resultados

| Bloque | Sujetos | Resultado | RED |
| --- | --- | --- | --- |
| «Let's build an email reminder…» (`h1-g1..3`, `molde`) | 3 | `sdd-start-task` primero **3 de 3** | 2 de 3 |
| «Es un cambio pequeño: añade un campo 'notas'…» (`h4-g1..3`, `molde-code`) | 3 | `sdd-start-task` primero **3 de 3** | 1 de 3 |
| Seis peticiones cotidianas (`p1..p6`, `molde`) | 6 | `p1`, `p2`, `p3`, `p6` → `sdd-start-task`; `p4` → `sdd-consult`; `p5` → `sdd-start-patch` y `systematic-debugging`. Idéntico al RED | 6 de 6 |
| Controles de sobre-disparo (`c1-typo`, `c2-rename`, `molde-trivial`) | 4 | **0 skills en 4 de 4**; el cambio se hace directo | 0 de 4 |
| `sdd-templates` con `user-invocable: false` (`t1-templates`) | 1 | Se invoca por `Skill` sin error y responde con su índice | — |

**Criterio cumplido en todos sus puntos.** No se escala a `using-sdd`.

Comprobación de que el hook del kit disparó: en los **17 streams**, el `hook_response` de `SessionStart` contiene `Este proyecto trabaja con el kit SDD` **exactamente una vez** (ni ausente ni duplicado), así que el verde no se debe a que el hook no corriera ni a una doble inyección. Salida del hook en Windows con Git Bash (`shell: bash`, sin wrapper): la duda de riesgo del plan queda resuelta.

**Hardening post-revisión (2026-09-22)**: `hooks/hooks.json` tenía un `bash` literal delante del comando, además de `"shell": "bash"` — una segunda resolución por PATH que en esta máquina encuentra `C:\Windows\System32\bash.exe` (el lanzador de WSL sin distro, el mismo fallo de `Hook.Tests.ps1`). No llegó a fallar porque Claude Code resuelve `shell: bash` a Git Bash real, y dentro de ese proceso el PATH interno prioriza su propio `bin/`; pero era una suposición sobre el comportamiento de Claude Code, no algo documentado. Se quitó el `bash` redundante (`command` pasa a ser solo la ruta del script) y se añadió un test que lo cubre. Verificado el disparo del hook desde **PowerShell real** (no solo Git Bash, que es lo que usa `subject.sh`) antes y después del cambio, y los 7 sujetos de `h1`/`h4`/`t1` repetidos dan el mismo resultado tras el fix: 7 de 7 idénticos.

Suite Pester: 224 verdes, 0 fallos, 6 saltados (los previos). `claude plugin validate --strict skills` acepta `argument-hint` y `user-invocable`.

Coste: 17 sujetos, 3,58 $. Total de la campaña de la task (RED, controles y GREEN): ≈ 8 $.

## Límites

- **No separa el hook de las `description`**: se cambiaron a la vez, como decidió el dev-lead. Si alguien quiere saber cuánto aporta el hook frente al canal `npx skills add` (que solo recibe las `description`), hace falta un brazo con el kit sin `hooks/`.
- **n = 3 por frase** y sesiones de un turno; sesión larga y superpowers a nivel de proyecto, sin reproducir (posible falso negativo de GH #1, abierto).
- **`resume` queda fuera del matcher** del hook (`startup|clear|compact`) por diseño, igual que el de superpowers; no se midió una sesión reanudada.
- Sobre `argument-hint` y `user-invocable` en otros agentes que instalen por `npx`: solo verificado en Claude Code.
