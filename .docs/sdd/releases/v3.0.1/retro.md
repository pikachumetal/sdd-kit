---
release: v3.0.1
created: 2026-11-17
---

# Retro — v3.0.1

## Repaso por causa

| Causa | En espera | Lista |
| --- | --- | --- |
| herramienta del kit | 2 | 2 |
| regla lejos de su paso | 1 | 2 |
| carga o paralelismo | 2 | 0 |
| prueba o molde | 1 | 0 |
| sin determinar | 20 | 0 |

## Abiertas en «Lista»

| Ítem | Causa | Casos | Destino | Abierta desde |
| --- | --- | --- | --- | --- |
| **Reescribir o mover una regla medida de una skill la pierde: sale sin A/B o cambia de fichero parafraseada sin su contraejemplo** ([ticket de la feature 0342](../field-reports/20261114-180756-feature-0342-interviewer-rewrite.md) §1 y §2; [patch 0172](../changes/20261011-194235-patch-0172-brainstorming-pieces/patch.md): repuso tres piezas de `brainstorming` que la 0168 quitó sin motivo) — en la 0342, el núcleo de `sdd-grilling` escrito de cero perdió «sin opciones ni recomendación» (R9) y el contraejemplo del boceto (B1); el revisor de dominio de la spec citó el Art. IX («quitar una frase sin sustituirla exige un A/B») y el hilo lo rechazó; y la frase del porqué bajó a `spec-writing.md` parafraseada, sin «not «a spreadsheet, a colleague, a backup?»», y dos escenarios cayeron hasta reponerla literal. La regla vive en la constitution (Art. IX), no en el paso donde se escribe la spec | regla lejos de su paso | 2 | 0345 | 3.0.0 |
| **Tras una compactación en Native con dos o más tasks sin `complete`, el hilo sigue en Native sin `Ruling: compactación`** ([ticket de la feature 0341](../field-reports/20261113-184632-feature-0341-interviewer-spike.md) §3; [de la 0312](../field-reports/20261104-162918-feature-0312-annotate-real-copies.md) §5; [de la 0305](../field-reports/20261106-102028-feature-0305-archive-rework.md), menores) — la regla vive en `skills/sdd-implement/SKILL.md`, «Method», y la misma regla dice que tras compactar se relee el plan y el ledger, no la skill; el resumen de la compactación no la trae | regla lejos de su paso | 3 | 0344 | 3.0.0 |
| **`sdd init --finish` escribe fuera de `.docs/` en un template y el resumen de cierre no lo dice: el commit de cierre del proyecto choca con su guard de rama protegida** ([ticket de la feature 0100 del proyecto de templates](../field-reports/20261117-085821-feature-0100-init-template-sdd-init.md) §1) — por el predicado 1 («Template»), `--finish` añadió un `UserPromptSubmit` a `.claude/settings.json`, creó `.claude/hooks/sdd-kit-loaded.mjs` y añadió `.temp/` a `.gitignore`; el paso 8 no los lista, el sujeto los presentó como «Cambios que no te había anunciado», el guard del proyecto bloqueó el commit en `develop` y su test de hooks de `settings.json` salió en rojo | herramienta del kit | 1 | 0347 | 3.0.1 |
| **El aviso de inicio de sesión ofrece migrar un template 2.x sin inicializar, con marcadores `sdd-template: pending`, antes de `sdd-init`** ([ticket de la feature 0100 del proyecto de templates](../field-reports/20261117-085821-feature-0100-init-template-sdd-init.md) §2) — `migrationWarning` de `cli/bin/session-start.js` solo compara la versión de `sdd-kit.json` con la última migración; en la validación manual de la 0100 la sesión lanzó `sdd-upgrade` antes que la skill de onboarding, y migrar el esqueleto le cambia la forma que `skills/sdd-init/references/structure.md:29` dice que conserva | herramienta del kit | 1 | 0347 | 3.0.1 |

Cerradas desde la 3.0.0: 0

## Propuestas

Sin propuestas
