# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md
Pre-flight: 1 task, 1 fichero (skills/guardar-nota/SKILL.md); sin pares que compartan fichero. Task 1 coherente consigo misma: dos humos RED contra dos cambios en la misma skill. Nota: constitution.md tiene dos «Art. I» (humo obligatorio; sin fallo en el baseline no se escribe) — compatibles, se aplican ambos.
Task 1: Ruling: base sin cambios (merge-base 08ba5b7..develop vacío, sin remoto) — sigo.
Task 1: Ruling: h0 limpio 3/3 — la frase del paso 2 («si el RED lo exhibe») sale del alcance; no se escribe (constitución, Art. I bis) — si el fallo existe con otra petición, queda sin guía hasta otra feature.
Task 1: Ruling: h1 falla 0/2 (n=2, no 3) — basta para el aviso del paso 1: la regla de n=3 solo rige la salida de los ítems «si el RED lo exhibe» — si se exigía n=3 al RED de h1, falta un sujeto.
Task 1: Ruling: copia RED en scratchpad/kit-z-0152/red-copy-0026 (fuera del repo).
Task 1: Ruling: aviso del paso 1 escrito en skills/guardar-nota/SKILL.md, sin commit — el humo GREEN de h1 no se puede lanzar en esta sesión («claude anidado bloqueado en un sujeto», exit 1); `node --test` pasa con 0 tests y no prueba nada: no ejecuto `sdd task done` — la task queda abierta hasta que corra h1 en GREEN.
