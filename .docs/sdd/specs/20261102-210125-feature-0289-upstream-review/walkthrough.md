---
id: 20261102-210125-feature-0289-upstream-review
feature: 0289
title: Walkthrough — Revisar las fuentes de upstream antes del corte de la 3.0.0
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — Revisar las fuentes de upstream antes del corte de la 3.0.0

## 1. Cambios realizados

- **Revisión de fuentes** — [upstream-review.md](upstream-review.md): un veredicto por cambio de superpowers `v7.0.0 → v7.0.1`, OpenSpec `v1.14.1 → v1.16.0`, Spec Kit `v1.2.0 → v1.2.6`, mattpocock/skills `v1.3.1 → v1.3.2` e impeccable `skill-v4.5.2 → skill-v4.8.0`, leídos por los ficheros que usa el kit, con lo que no se leyó al pie de cada fuente. Tres candidatas: C1 y C2 a filas de la 3.0.0, C3 descartada (`5d1f31eb`, `d30df438`).
- **Versiones vistas** — `THIRD_PARTY_NOTICES.md`, tabla «Fuentes vigiladas»: las cinco fuentes a su último tag, con fecha 2026-11-02 (`750e00b5`).
- **Roadmap** — filas 0296 (skills de más de 20.000 caracteres tras una compactación) y 0297 (`sdd-verify` busca un `REMOVED` por su requisito vigente), en «Próximo», antes de la 0284 y la 0198, y la lista «tras» de la 0198 con las dos; publicadas en `develop` con `sdd roadmap publish` y en la rama (`d30df438`).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 0,5 h
- Esfuerzo real: 0,34 h — reloj de la sesión 0,44 h desde 2026-11-02T19:56Z, sin 6 min de espera al dev-lead (1 espera)
- Desviación: −0,16 h (−32 %)
- Causa de la desviación: Esperas y huecos: 20:04Z 6 min; el resto, sin medir
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 20.769.760 — claude-opus-5-5 20.769.760
- Tokens de subagentes: 1.722.351 en 2 despachos — Eje Código revisión final 0289 claude-sonnet-5-5 465.501 / 1 min; Eje Spec revisión final 0289 claude-opus-5-5 1.256.850 / 2 min
- Coste de la sesión: 9,35 $ (hilo 8,07 $ + subagentes 1,28 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La revisión se escribió antes del gate de la spec, y no en el plan, para que el dev-lead decidiera las candidatas en la única parada de `delegate` (decisión 1 del ✋ de la spec, aprobada).
- Spec Kit sube a `v1.2.6`, no a la `v1.2.5` del prompt de arranque: había avanzado.

### Decisiones tomadas sin el dev-lead

- Fila 0289 con «Spec Kit v1.2.0 → v1.2.5»: no se toca — la fila cuenta lo visto el 2026-11-01; la v1.2.6 la explican la spec (decisión 2) y la §3 — coste si está mal: una lectura confusa de la fila.
- «Si al arrancarla pasa de 5 tasks, se parte» en la 0296: se queda — es la regla de partir de `sdd-propose` aplicada a una medida previa — coste si está mal: ninguno.

## 4. Verificación

### 4.1 Builds

- `moon run kit:upstream` → `Fuentes al día: 7.`, exit 0 · `moon run kit:roadmap` → `Roadmap válido`, exit 0, sobre el commit de cierre.
- Gate: no corre — la rama solo toca `.docs/` y `*.md` (`THIRD_PARTY_NOTICES.md`). Línea base de la rama: `moon run cli:test` → 78/78 ficheros, 2078 tests en verde, sobre `5d1f31eb`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · `kit:upstream` «Fuentes al día: 7.» y `kit:roadmap` «Roadmap válido» con ejecución real · revisión final Spec opus+high y Código sonnet+high sobre `d30df438`, sin Critical ni Important; los 4 Minor, arreglados en el cierre (revisados en el hilo, 12 líneas de docs).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `moon run kit:upstream` sale con código 0 y «Fuentes al día: 7.» | ejecución real | `Fuentes al día: 7.`, exit 0 |
| La tabla sigue legible para `check.ts` (si no, «Sin la tabla de «Fuentes vigiladas»») | ejecución real | la misma ejecución lee las 7 filas |
| Las aceptadas, abiertas como filas antes de 0284 y 0198 | ejecución real | 0296 y 0297 entre 0289 y 0284, en la lista «tras» de 0198 y 0152; `Roadmap válido` |

### 4.3 Residuales / deuda generada

- Ninguna: lo que se trae va a las filas 0296 y 0297.

## 5. Aprendizajes

- Para separar texto movido de reglas nuevas cuando una fuente parte un `SKILL.md` en `references/`, basta comparar las líneas del viejo con las del nuevo más sus referencias: en `subagent-driven-development` y `writing-skills` de superpowers 7.0.1 todo era texto movido → `tech-stack.md`, párrafo de «Fuentes vigiladas».

Retro: sin señales

## 6. Adendas
