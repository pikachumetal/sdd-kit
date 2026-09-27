# Constitution — agenda

## Art. 1 — Calidad de código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación.
- El revisor marca el incumplimiento como Important, no como estilo.

## Art. 2 — Política de modelos

Modelo y effort explícitos al despachar un subagente. Gama media (Sonnet) como suelo para revisores e implementadores que trabajan desde prosa; el tier más barato solo para transcripción de código ya escrito en el plan. `fable` y `opus xhigh` prohibidos por defecto, salvo justificación escrita en la task.

## Art. 3 — Tests

`npm test` (node --test) y `npm run lint` en verde antes de cada commit. Los tests RED los escribe el hilo principal desde los THEN de la spec; el implementador no los modifica.
