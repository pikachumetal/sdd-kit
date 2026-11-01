---
id: 20261101-175419-feature-0163-spike-lane
feature: 0163
title: Walkthrough — Carril spike
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Carril spike

## 1. Cambios realizados

- **Plantillas** (a4c44190 y el cierre): `research-template.md` reescrita con la tabla de objetivos, sus estados, el aguante y «Lo que sale»; bloque «Forma spike» en `spec-template.md`; «Evidencia» en `plan-template.md`.
- **`sdd-propose`** (a4c44190 y el cierre): el spike tiene forma propia, siempre en Native; en `unattended` sigue con ella.
- **`sdd-implement`** (b831a670): «Evidencia» sustituye a los RED en una frase.
- **`sdd-verify` y `sdd-archive`** (90486b63 y el cierre): solo el eje Spec en un spike, con la ruta de `research.md`; smoke por objetivo.
- **Baterías** (las tres tasks): `k2` ampliado, `k2p`, `sp1`, `sp2`, `sp3` y `sv1`. Evidencia en `tests/spike-lane-red.md` y `tests/spike-lane-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 2,44 h — reloj de la sesión 2,56 h desde 2026-11-01T17:49Z, sin 7 min de espera al dev-lead (2 esperas)
- Desviación: -0,56h (-19 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 31.285.434 — claude-opus-5-5 31.285.434
- Tokens de subagentes: 4.698.922 en 3 despachos — Final review — Code axis claude-sonnet-5-5 2.274.187 / 3 min; Final review — Spec axis claude-opus-5-5 1.507.633 / 6 min; Single re-review of the 0163 fix pass claude-opus-5-5 917.102 / 4 min
- Coste de la sesión: 16,41 $ (hilo 12,41 $ + subagentes 4,00 $)
- Coste de sujetos: 24,80 $ en 36 sujetos sonnet y opus — campaña de la 0163 24,80 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Las cinco enmiendas de la spec, más la del alcance de `sp3`, aprobadas por el dev-lead (opción «Apruebo»).
- El RED de `sp2` y `sp3` corrió con el de la Task 1.

### Decisiones tomadas sin el dev-lead

- Baseline: Ruling: corre en este árbol, sin worktree desanclado — el árbol está limpio y sin RED aún; el pre-commit de apertura ya corrió cli — si fuera erróneo, repetir ~3 min.
- Baseline: Ruling: flaky en test/watch/loop.test.ts (timeout 5 s en suite entera, 3/3 solo; pasó al reintentar el commit) — fila de deuda al cerrar — coste si no: otro reintento.
- Task 1: Ruling: RED de sp2 y sp3 corre junto al de T1 (mismo montaje) — ahorra una tanda — si no: nada.
- Task 2: Ruling: sp3 limpio y sin caso de campo: n = 2, sale de lo que se arregla; no se escribe «production code never» en sdd-implement; sigue como control; el hueco §5 y el eje Spec lo cubren — si es erróneo, una línea más.
- Task 1: Ruling: añado el escenario k2p, porque k2 para en el gate de la spec y no llega al plan — la cláusula del plan se observa aparte — coste si erróneo: 1 $.
- Task 2: Ruling: sdd-implement solo gana una frase, no el párrafo del plan: sp1 y sp2 salieron 2/2 sin él — si en campo se salta, el párrafo vuelve con su RED.
- Task 3: Ruling: sv1 RED limpio 3/3 con caso de campo: sale de lo que se arregla; spec-reviewer-prompt.md no cambia; sv1 control 1/1 — si en campo falla, el bloque vuelve con su RED.
- Final: Ruling: Review Focus 1 sin frase nueva: sp1 con O4 medido con otra carga da `no medido` con la plantilla — coste si erróneo: una cláusula.
- Final: Ruling: M5 (Native aunque execution diga otra cosa) queda sin medir, y M8 sin ADR: decisión 8 aprobada — coste si erróneo: una tanda y una ADR.
- Final: Ruling: «Es lo único que el dev-lead…», el enlace a la tabla de gates y «(el criterio…)» siguen fuera de plan-template: orientan, no ordenan; sí vuelve «Sin tamaño fijo en horas» — coste: 18 palabras.
- Final: Ruling: la racionalización «It's only a version bump» sigue fuera: using-sdd lleva la misma fila — coste: una fila.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 286/286 · cli:typecheck: corrió · cli:test: corrió 1743/1754 (11 saltados por la suite) · configuración del gate · sobre el commit de cierre. La repetición sobre la base integrada va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · verificación del agente: gate verde · sujetos por objetivo de la spec · revisión final Spec y Código sobre 90486b63 · re-revisión con 1 hallazgo abierto y 2 Important arreglados después, sin revisar.

**✋ Sin revisar**: el arreglo de la rotura A y la B de la re-revisión (plan del molde con el script, O4 en `research-sv1.md`) y de sus menores, en el commit de cierre — ~20 líneas de baterías, plantillas y spec, medidas con `sp3` y `sv1`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `routing`: clasifica spike y escribe `mode: spike` | ejecución real, `k2` | 2/2 |
| `routing`: en `unattended` el spike sigue | no probado | texto que deja de excluir |
| `feature-flow`: spec corta con pregunta, objetivos y decisión | ejecución real, `k2` | 2/2 |
| `feature-flow`: peor carga en la spec | ejecución real, `sp2`, `k2` | 2/2 |
| `feature-flow`: plan con «Evidencia» | ejecución real, `k2p` | 3/3 |
| `feature-flow`: una fila por objetivo y los tres estados | ejecución real, `sp1` | 3/3, O4 incluido |
| `feature-flow`: tabla de aguante | ejecución real, `sp2` | 4/4 |
| `feature-flow`: sin código en `src/` | ejecución real, `sp3` | 6/6 |
| `feature-flow`: §5 nombra el arreglo y la fila por abrir | ejecución real, `sp3` | 2/2 con la plantilla final; ninguna fila abierta |
| `feature-flow`: scripts en la carpeta de la spec | ejecución real, `sp3` | 1/2 con el molde corregido: `final/out/sp3-2` no versionó el script |
| `verification`: solo el eje Spec | no probado | sin sujeto de despacho |
| `verification`: marca recomendación, fila y `src/` | ejecución real, `sv1` | 5/5 |
| `archive`: smoke por objetivo | no probado | este cierre lo hace por THEN, porque no es un spike |

### 4.3 Residuales / deuda generada

- Test inestable: fila de deuda en el roadmap.
- «Native aunque `execution` diga otra cosa» y «solo el eje Spec», sin medir: se quedan en este walkthrough hasta un caso de campo.

## 5. Aprendizajes

- Una regla de forma en la plantilla basta: `sp1` y `sp2` pasan sin texto en `sdd-implement` → `tests/spike-lane-green.md`, que refuerza la ADR 0014.
- Los techos de `SUBJECT_CAP` y `COST_CAP` son acumulados por campaña, no por tanda, y un heredoc de bash se come los escapes de un script de edición → ya los dice `tech-stack.md` (escapes) y queda en el ticket.

## 6. Adendas
