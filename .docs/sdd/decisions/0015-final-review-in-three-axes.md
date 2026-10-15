---
status: accepted
date: 2026-10-14
rutas:
  - skills/sdd-verify/**
  - skills/sdd-implement/**
  - skills/sdd-start-feature/SKILL.md
  - skills/sdd-start-feature/references/control-profiles.md
  - skills/sdd-start-feature/references/commit-milestones.md
  - skills/sdd-end-feature/SKILL.md
  - skills/sdd-propose/references/plan-writing.md
  - skills/sdd-templates/templates/plan-template.md
---

# La revisión final sale en ejes y se cierra una vez

## Contexto y problema

La revisión final de rama la hacía un solo revisor en Opus con effort high («el techo del kit», de la [ADR 0006](0006-model-policy-and-execution.md)), con `code-reviewer.md` de superpowers. Su cierre no tenía tope: en Native la pasada de fix no la revisaba nadie, y en el cierre cada commit posterior abría otra re-revisión «hasta que vuelva sin Critical ni Important». En la feature 0128 se encadenaron tres re-revisiones (~5 M tokens), y la fricción del revisor final aparece en ~25 tickets de campo. La propuesta 0131 pide que la ceremonia se pague con calidad y velocidad, y saca superpowers del kit. Esta ADR sustituye solo la parte del revisor final de la ADR 0006; el resto de la 0006 sigue vigente.

## Opciones consideradas

- Un revisor Opus único, con re-revisiones hasta que vuelva limpio.
- La revisión en ejes con una lente cada uno, en paralelo, y un solo cierre.

## Decisión

La revisión final sale en ejes, en paralelo, desde `sdd-verify`:

- **Spec**, en Opus: el delta de capacidades, las capacidades que cambian sin delta, las ADR que cubren el diff y las decisiones del dev-lead.
- **Código**, en Sonnet: el estándar del proyecto, cinco libros de buen diseño y los comentarios.
- **Arquitectura**, en Opus, solo si el plan dice que el cambio cruza una frontera; el hilo puede subirlo, nunca bajarlo.

Todos van con effort high, y un eje cambia de modelo solo con datos del principio 5.

El cierre es único: una pasada de fix y una sola re-revisión justo antes de la validación. Lo que queda abierto se adjudica a ✋, salvo un Critical, que se arregla y va a ✋ como «sin revisar». Una re-revisión nunca abre otra.

### Consecuencias

- La revisión ve lo que el revisor único no miraba: un requisito retirado que sigue vivo, una capacidad cambiada sin delta, una ADR incumplida y una decisión del dev-lead cubierta a medias.
- Native paga una re-revisión cuando hubo fixes, y un fix posterior a ella llega al dev-lead como «sin revisar» en vez de abrir otra.
- El kit deja de invocar `verification-before-completion` y `requesting-code-review` de superpowers.

### Confirmación

`tests/VerifySkill.Tests.ps1` exige los tres ejes con su modelo en `sdd-verify` y que ningún fichero de `skills/` invoque las dos skills de superpowers. La batería de `sdd-verify` (`f1`-`f4`, `c1`-`c5`) mide el despacho, lo que ve cada eje y el cierre.