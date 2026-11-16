---
id: 20261012-104247-feature-0166-worktrees-and-parallel-agents
title: Tasks — sdd-worktrees y sdd-parallel-agents
spec: ./spec.md
plan: ./plan.md
created: 2026-10-12
---

# Tasks — `sdd-worktrees` y `sdd-parallel-agents` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0166-worktrees-and-parallel-agents`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los dos desvíos de `sdd-implement` | done | `39868b0` | entra el del REFACTOR (RED 2/2, GREEN 2/2); el de «No entra» no (RED 0/2), enmienda 2026-10-12 |
| 2 | `sdd-worktrees` y el recableado | done | `d59bf7b` | humo `w1` 1/1 |
| 3 | `sdd-parallel-agents` y `review-spec.md` | done | `1d1fd15` | humo `a1` 1/1 |
| 4 | Documentos, avisos, roadmap y topes | done | `7a4fa5a` | |

## Verificación por task

- [x] Task 1 — `bash -n` de `subject.sh` y el campo `Petición` de `k1`
- [x] Task 2 — `Invoke-Pester tests/ForkSkills.Tests.ps1, tests/Skills.Tests.ps1, tests/WordBudget.Tests.ps1 -CI`
- [x] Task 3 — el mismo Pester
- [x] Task 4 — Pester con `WorkflowDocs` y `sdd roadmap check`

## Revisión

Revisión final: sdd-kit:effort-high + opus, con arreglos (0 Critical, 2 Important, 6 Minor), sobre 7a4fa5a
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN (Important 2); el Important 1, por enmienda aprobada
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (0 Critical, 0 Important, 5 Minor de texto arreglados en el hilo)

## Fixes adicionales

Ninguno.

## Rulings

Task 1: Ruling: effort — `sdd-kit:effort-high` está entre los agentes de la sesión: el revisor final va con su tipo y `opus`.
Task 1: Ruling: sin `app-0018.js` en la primera versión del molde — `mold-reservas` ya tenía `anular` — sin coste.
Task 1: Ruling: el primer molde de `k1` (dos THEN que se contradecían) no medía el «No entra»: 2/2 sujetos pararon por la contradicción, no por el README — se rehace fiel a la 0168 (un test existente, `test/readme.test.js`, exige tocar el README al añadir `ayuda`) y se relanza `k1`; las salidas del primero quedan en `red-k1v1/` — ~0,5 $ y un sujeto más por fila
Task 1: RED k2 2/2 falla (K2): los dos commitean «no escribir hasta que el usuario confirme» como `Ruling:` aunque dicen que cambia la salida observable — el texto del REFACTOR entra
Task 1: Ruling: el nombre de la skill del molde de `k2` es `guardar-nota`, no `sdd-avisos` como decía el plan — sin coste
Task 2: Ruling: `w1` informa la rama y no la ruta del worktree — el texto de la fuente ya pide «at `<path>`» y se conserva; no se añade guía por un detalle del informe — si importa, el dev-lead no ve la ruta en el chat (la tiene en el prompt de arranque de Orca)
Task 2: Ruling: el tope `Kit` de `WordBudget` está suspendido («mientras conviven las plantillas 2.x y 3.0.0», hasta la 0157): no se sube; la 0157 lo re-mide — sin coste
Task 4: Ruling: architecture.md quedaba en 1.903 de 1.900 por la línea nueva del árbol (la spec, decisión 7, solo contó el cambio de nombre) — las cuatro carpetas van en una entrada sdd-{tdd,debugging,worktrees,parallel-agents}/, sin recortar texto ajeno ni subir el tope — el árbol se lee algo peor
Task 4: Ruling: el RED de la Task 4 (WordBudget sin tope de las skills nuevas) ya lo pusieron en verde las Tasks 2 y 3, como dijo el escaneo previo — sin coste
Final: Ruling: Declined «el segundo molde de k1 deja una salida fácil (sacar ayuda de commands)» — mide que no toca lo excluido si puede evitarlo; el caso de la 0168 también tenía alternativa — si importa, el RED de «No entra» subestima el fallo y la fila espera su 2.º ticket
Final: Ruling: Declined «w1 solo cubre la rama tech-stack.md del orden del gate y las tandas no tienen sujeto» — el plan los deja en lectura (Review Focus) — un fallo en esas ramas solo se vería en campo
Final: Ruling: Declined «capabilities/control-profiles.md:295 dice que el tope lo define la task 0022» — no lo toca el delta; queda desfasado — pendiente del dev-lead, al informe final
Final: minor (deferred): sdd-parallel-agents:81 «omitted, both inherit the session's» deja abierta la herencia de modelo a un llamador que no los nombre (la 0148)
Final: minor (deferred): sdd-worktrees Step 0: rechazar el worktree en main no es consentir implementar en main; falta la frase que lo separa
Final: minor (deferred): sdd-implement:41, «also when you didn't write the AND» es ambiguo, y el GREEN de k2 usa el mismo molde que el contraejemplo cita; variante de código para la 0152
Final: minor (deferred): el cuarto punto del Review Focus del plan («what the spec leaves») quedó sin objeto con la enmienda de k1
Final: minor (deferred): contabilidad — commit de la Task 4 en tasks.md, enlace al walkthrough que nace en el cierre, «Esperar 2.º caso» en battery.md frente a «Esperar 2.º ticket» en el roadmap
Final: minor (deferred): environments-template.md:8 rompe el ajuste a ancho del bloque
Final: Ruling: TaskVerification.Tests.ps1 fijaba «closing gate … runs once»; pasa a «once in the final validation … never inside a task», la regla corregida por el Important 2 — sin coste
Final: Ruling: Important 1 — dos rondas de REFACTOR sin efecto (w1 0/3 escribe la ruta); se retiran y el THEN pasa a «con su rama» por enmienda aprobada («Enmienda: solo la rama (Recomendada)», 2026-10-12)
