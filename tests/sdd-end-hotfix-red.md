# Evidencia RED — sdd-end-hotfix (2026-07-09)

Dos baselines con Sonnet, sin la skill.

## Baseline v1 (fixture-d, sin git ni changelog)

Cerró bien lo disponible (verificación honesta con proyecto aislado de comprobación, tiempo 0,5h). La fixture no ofrecía superficie de fallo (sin git, roadmap ya rellenado, sin changelog) → evidencia insuficiente. Se repitió con fixture rica.

## Baseline v2 (fixture-i: repo git real, rama hotfix/217, fix sin commitear, changelog.md presente, tabla de hotfixes vacía en roadmap)

Positivos: hotfix.md completado (hash, smoke reportado vs revisión propia, 30 min), entrada `### Fixed` en `[Unreleased]` con link y formato correcto, commits bilingües separados (fix / docs), no borró la rama.

Fallos observados:

1. **`roadmap.md` sin tocar**: la tabla "Hotfixes" existía y quedó vacía — el hotfix cerrado es invisible en el índice forward-looking del proyecto.
2. **Merge unilateral**: fusionó `hotfix/217` en `develop` (`--no-ff`) sin decisión del usuario. Racionalización textual: *"por ser un cambio trivial y por la urgencia explícita del developer"* omitió el flujo de cierre de rama (`finishing-a-development-branch`), que presenta la decisión al usuario.
3. **estimation-log ignorado**: `.docs/sdd/estimation.md` presente (módulo activo) y tiempo registrado (30 min), pero ninguna fila añadida a un log agregado.

## Conclusión

El cierre documental "obvio" (hotfix.md, changelog) sale bien; la skill debe fijar lo que se pierde: la fila del roadmap, la fila del estimation-log cuando el módulo está activo, y sobre todo que **la decisión de merge es del usuario** — la urgencia y la trivialidad son precisamente las racionalizaciones a bloquear.
