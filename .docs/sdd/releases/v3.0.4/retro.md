---
release: v3.0.4
created: 2026-11-19
---

# Retro — v3.0.4

## Repaso por causa

| Causa | En espera | Lista |
| --- | --- | --- |
| regla lejos de su paso | 1 | 2 |
| carga o paralelismo | 2 | 0 |
| herramienta del kit | 2 | 0 |
| prueba o molde | 1 | 0 |
| sin determinar | 20 | 0 |

## Abiertas en «Lista»

| Ítem | Causa | Casos | Destino | Abierta desde |
| --- | --- | --- | --- | --- |
| **Tras una compactación en Native con dos o más tasks sin `complete`, el hilo sigue en Native sin `Ruling: compactación`** ([ticket de la feature 0341](../field-reports/20261113-184632-feature-0341-interviewer-spike.md) §3; [de la 0312](../field-reports/20261104-162918-feature-0312-annotate-real-copies.md) §5; [de la 0305](../field-reports/20261106-102028-feature-0305-archive-rework.md), menores) — la regla vive en `skills/sdd-implement/SKILL.md`, «Method», y la misma regla dice que tras compactar se relee el plan y el ledger, no la skill; el resumen de la compactación no la trae | regla lejos de su paso | 3 | 0344 | 3.0.0 |
| **Reescribir o mover una regla medida de una skill la pierde: sale sin A/B o cambia de fichero parafraseada sin su contraejemplo** ([ticket de la feature 0342](../field-reports/20261114-180756-feature-0342-interviewer-rewrite.md) §1 y §2; [patch 0172](../changes/20261011-194235-patch-0172-brainstorming-pieces/patch.md): repuso tres piezas de `brainstorming` que la 0168 quitó sin motivo; [ticket de la feature 0359](../field-reports/20261119-185254-feature-0359-spec-plan-phase-skills.md) §2) — en la 0342, el núcleo de `sdd-grilling` escrito de cero perdió «sin opciones ni recomendación» (R9) y el contraejemplo del boceto (B1); el revisor de dominio de la spec citó el Art. IX («quitar una frase sin sustituirla exige un A/B») y el hilo lo rechazó; y la frase del porqué bajó a `spec-writing.md` parafraseada, sin «not «a spreadsheet, a colleague, a backup?»», y dos escenarios cayeron hasta reponerla literal. En la 0359, al partir `sdd-propose` en fases, tres reglas quedaron donde la sesión ya no las lee (el bloque del anuncio, `a1` 0/3; «prevé <n> tasks»; la tabla de topes de la plantilla): la puerta automática dio verde 41 de 43 y solo las cazó un agente leyendo las filas de prosa; propuesta del ticket, un test de `cli/test/kit/` que busque en `dist/` cada literal de la tabla «regla que se mueve». La regla vive en la constitution (Art. IX), no en el paso donde se escribe la spec | regla lejos de su paso | 3 | 0345 | 3.0.4 |

Cerradas desde la 3.0.3: 3

## Propuestas

| Ítem | Puerta | Propuesta |
| --- | --- | --- |
| Reescribir o mover una regla medida de una skill la pierde (fila 0345) | abierta desde la 3.0.0, antes de la retro de la 3.0.3 (el «3.0.4» de arriba sale de que el triaje de la 0359 reescribió la fila; la retro de la 3.0.3 la da abierta desde la 3.0.0) | prioriza o descarta; tercer caso en la 0359, con ~6 $ y dos paradas |
| Tras una compactación en Native, el hilo sigue en Native sin `Ruling: compactación` (fila 0344) | abierta desde la 3.0.0, antes de la retro de la 3.0.3 | prioriza o descarta |
