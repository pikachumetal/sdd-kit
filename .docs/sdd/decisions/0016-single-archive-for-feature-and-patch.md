---
status: accepted
date: 2026-10-16
rutas:
  - skills/sdd-archive/**
  - skills/sdd-start-patch/SKILL.md
  - skills/sdd-worktrees/SKILL.md
---

# Un solo cierre para feature y patch, con ramas por carril

## Contexto y problema

El kit cerraba con dos skills, `sdd-end-feature` y `sdd-end-patch`, que compartían el 84 % del texto y se desviaban entre sí (la fila «Patch:» de «Próximo» se marcaba o se quitaba según el sujeto), y su paso de rama delegaba en `finishing-a-development-branch` de superpowers, que la 3.0.0 saca del kit. La feature 0149 tenía que funderlas y absorber esa skill.

## Opciones consideradas

- Una skill, `sdd-archive`, con un tronco común y ramas cortas marcadas `Feature only:`, `Patch only:` y `Hotfix only:`.
- Dos skills de cierre con un núcleo copiado en las dos, como hasta la 2.x.
- Una skill por carril con una referencia común que las dos lean.

## Decisión

Una sola skill con ramas por carril: una regla que cambia se escribe una vez, y la batería mide que un patch no hereda pasos de feature (`a2`, P3). Las ADR 0005 y 0015, que nombran en sus `rutas` las skills retiradas, siguen vigentes en su contenido y aplican también a `skills/sdd-archive/**`.

### Consecuencias

- El cierre de feature, patch y hotfix entra por la misma `description`; el enrutado lo miden `r1` y `r2`.
- `sdd-archive` necesita un tope de palabras propio (3.850 en `SKILL.md`, 6.300 en total) y su detalle va a `references/`.
- Un cambio de un carril toca el `SKILL.md` de los tres: la batería entera de `sdd-archive` corre en cada edición de su tronco.

### Confirmación

`tests/ArchiveSkill.Tests.ps1` comprueba las marcas de carril y que ningún fichero de `skills/` nombra las skills retiradas; la batería de `sdd-archive` (`a1`, `a2`, `r1`, `r2`) mide el cierre de cada carril.
