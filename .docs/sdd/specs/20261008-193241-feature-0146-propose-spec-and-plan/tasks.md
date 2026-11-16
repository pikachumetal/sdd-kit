---
id: 20261008-193241-feature-0146-propose-spec-and-plan
title: Tasks — Spec y plan de propose
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Spec y plan de propose (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0146-entry-explore-propose`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Batería de `sdd-start-feature`, escenarios nuevos y RED | done | 5fd09615 | RED: 7 reglas fallan, 3 salen limpias (T1, l2, P2) |
| 2 | La spec abre con 🦆 y ✋, y dice dónde se prueba | done | f5b0d1c7 | GREEN s1 2/2 tras una ronda de REFACTOR |
| 3 | Gate con opciones fijas y modelo del revisor de dominio | done | bcac584a | GREEN g1 y r1 2/2 |
| 4 | El plan declara `Tras` y su verificación sale de «Dónde se prueba» | done | 7f987c29 | GREEN p1: Tras 2/2 tras una ronda de REFACTOR; la verificación salió por el RED |
| 5 | Acción update | done | e7c502c9 | GREEN u1 2/2 tras subir la regla al paso 6 y afinarla (enmienda del 2026-10-09) |
| 6 | La validación abre con 🦆 y ✋ | done | 9e241b37 | GREEN v1a 2/2; v1b 2/2 tras dos rondas de REFACTOR (la forma va también al mensaje final de sdd-end-feature) |
| 7 | `sdd-grilling` contrasta el lenguaje | skipped | — | sale por el RED (`t1` 2/2 limpio); enmienda del 2026-10-08 |
| 8 | Ajustes de `sdd-rubber-duck` | done | b3ca088e | GREEN l2 2/2 y s2 3 de 6 tras dos rondas de REFACTOR; s2, a deuda |

## Verificación por task

- [x] Task 1 — `bash -n` de `subject.sh`; `battery.mjs plan` de las tres baterías; `PathLength` y `SubjectOutputPrivacy` con `-CI`; RED puntuado
- [x] Task 2 — `CapabilityRules` y `WordBudget` con `-CI`; GREEN de `s1`
- [x] Task 3 — `WordBudget` con `-CI`; GREEN de `g1` y `r1`
- [x] Task 4 — `PlanReviewFocus` y `WordBudget` con `-CI`; GREEN de `p1`
- [x] Task 5 — `WordBudget` con `-CI`; GREEN de `u1`
- [x] Task 6 — `WordBudget` con `-CI`; GREEN de `v1a` y `v1b`
- [x] Task 7 — skipped: sale por el RED
- [x] Task 8 — `WordBudget` con `-CI`; GREEN de `s2`, y `l2` como control

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: code-reviewer + opus (effort high), con arreglos (0 Critical, 5 Important), sobre b3ca088e
Pasada de fix: juntada en el cierre, 5 hallazgos (u2 RED→GREEN; 1, 2 y 5 de texto; 4 de rúbrica)

## Rulings

- Task 1: Ruling: lib.sh veta AskUserQuestion en todos los sujetos; añado ALLOW_ASK=1 para g1 y r1, que puntúan la llamada del stream — el plan suponía que el stream la registraría igual — si me equivoco, una variable más en el lanzador sin uso.
- Task 1: Ruling: retiro ALLOW_ASK — en `claude -p` AskUserQuestion no existe (prueba en el scratchpad: el sujeto la busca con ToolSearch y pregunta en prosa); G1 y R1 puntúan el intento de llamarla o las opciones literales que presenta — si me equivoco, G1 deja pasar un gate en prosa con las opciones bien escritas, que en una sesión interactiva sí sería AskUserQuestion.
- Task 1: Ruling: l2 con n=2 y no n=1 — umbral 2/2 como el resto de la batería — un sujeto más (~0,3 $).
- Task 1: Ruling: el molde de p1 llevaba la spec con «quién canceló», que la app no puede dar, y p1-2 paró a proponer una enmienda (conducta correcta, no medía el plan) — p1 usa la spec sin «quién», como v1, y su RED se repite — si me equivoco, p1 deja de cubrir un plan sobre una spec con un hueco.
- Task 1: Ruling: los rulings del molde de v1 contradecían el historial (v1a-1 los retiró por falsos); los sustituyo por dos que el código respalda (orden de cancelación, anuladas fuera) — V1 mide el 🦆 y el ✋ al abrir, que no dependen de su contenido — si me equivoco, el RED y el GREEN de v1 no comparten molde exacto.
- Task 2: Ruling: GREEN s1 ronda 0 dio S2 1/2 (s1-2 describió los avisos sin su literal); REFACTOR: la ayuda del ✋ en spec-template pide el literal con un contraejemplo de otro dominio — si me equivoco, una frase más en la plantilla.
- Task 4: Ruling: el párrafo de tasks verticales no se acorta (TestableTasks.Tests.ps1 exige sus literales); se amplía con el contexto nuevo, el prefactor y las dependencias, y la regla va solo a plan-template.md, sin frase en SKILL.md (en su tope) — si me equivoco, la plantilla crece unas 60 palabras y «una pieza sale» se queda en la prosa del gate.
- Task 5: Ruling: el total de sdd-start-feature (20.393) pasa de 20.255; aplico la subida a 20.600 aprobada en la decisión 16 de la spec, con SKILL.md en sus 8.430 — si me equivoco, 345 palabras más de referencias.
- Task 4: Ruling: GREEN p1 ronda 0, P1 0/2 por «sin paralelo» (iba en un bloque de ayuda que se borra); REFACTOR: una línea de contenido en «## 2. Tasks» — si me equivoco, una frase fija en cada plan.
- Task 4: Ruling: GREEN p1 ronda 1 — Tras 2/2; «sin paralelo» 1/1 aplicable (p1-1 hizo un plan de una sola task, sin nada que paralelizar); no relanzo — si me equivoco, la frase falta en planes de una task, donde no informa de nada.
- Task 5: Ruling: GREEN u1 ronda 0, U1 y U2 0/2: ninguno abrió control-profiles.md, y el paso 6 solo nombraba la acción; la regla sube al paso 6 en una frase, compensada quitando la lista de frenos del mismo párrafo (sigue en control-profiles.md y en los red flags) — si me equivoco, el paso 6 pierde un recordatorio de los cuatro frenos.
- Task 5: Ruling: retiro una línea «Task 5: complete» que sdd task done escribió sobre un rango vacío: el pre-commit había rechazado el commit y lo encadené en la misma orden — si me equivoco, ninguno: la task se vuelve a cerrar tras el commit.
- Task 5: Ruling: FileOverlap.Tests.ps1 exige en el paso 6 el literal de los frenos; los repongo en forma corta y compenso resumiendo «Trabajo descubierto fuera de scope», que repetía el paso 6 — si me equivoco, esa sección remite al paso 6 en vez de repetirlo.
- Task 8: Ruling: GREEN de l2 con la regla de lo pendiente salió entero en castellano a una petición en inglés (R7 0/2); el Overview pasa a «el idioma de su mensaje, no el del proyecto» — si me equivoco, una aclaración de seis palabras sin fallo propio; la mide la tanda siguiente de l2.
- Task 6: Ruling: GREEN v1b ronda 1, 1/2: v1b-2 invocó sdd-end-feature sin mensaje previo y el usuario lee el mensaje final del cierre; la forma (🦆 y ✋) va también al punto 2 del mensaje final de sdd-end-feature con validation.mode field — si me equivoco, una frase más en sdd-end-feature, que la 0149 reescribe.
- Task 8: Ruling: GREEN s2 ronda 1, 0/2 (opciones o recomendación tras el párrafo; ronda 0 dio 2/2) y l2 1/2 (una respuesta en castellano a una pregunta en inglés): contraejemplo de otro dominio para lo pendiente, y el Overview dice que una pregunta en inglés se contesta en inglés aunque los documentos estén en castellano — si me equivoco, dos frases más en la skill.
- Task 8: Ruling: s2 queda 3 de 6 tras dos rondas de REFACTOR (RED 0/2); mantengo la regla y llevo a deuda un escenario que separe la parada del pato — si me equivoco, la regla no corrige del todo el pato que pregunta, y la parada lo vuelve a preguntar.
- Final: Ruling: antes del revisor final, el plan corrige sus Restricciones (sin el tope de 750 de sdd-grilling) y su Review Focus (la línea de unattended según la regla afinada; fuera la de sdd-grilling, cuya Task 7 salió por el RED) — si me equivoco, el revisor no mira una línea que ya no tiene código.

Revisado en el hilo: plan.md · 5 líneas, juntado en el cierre (Restricciones y Review Focus sin lo que sacó el RED)
