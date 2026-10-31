---
id: 20261031-165052-feature-0177-release-cut-now-to-changelog
feature: 0177
title: Walkthrough — El corte saca lo hecho de Now al changelog, sin changelog de cliente ni email
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-31
---

# Walkthrough — El corte saca lo hecho de Now al changelog

## 1. Cambios realizados

- `skills/sdd-end-release/`: reescrita en inglés, con el corte desde Now en siete pasos; `notas-y-roadmap.md` pasa a `release-notes.md`.
- `skills/add-to-changelog/SKILL.md`: en inglés, la invoca el corte y recibe las categorías del patch.
- `skills/sdd-archive/` y `skills/sdd-start-feature/`: con `ROADMAP.md`, el cierre no toca `CHANGELOG.md`, y un cambio sin fila gana una en Now.
- Retirados `client-changelog-template.md` y la frase del email; `using-sdd`, plantillas y guías de `.docs/workflow/` al día.
- `tests/batteries/sdd-archive/`: rc1 y rc2 pasan a molde 3.0.0.
- ADR 0020 y delta en `release-flow`, `archive` y `onboarding`.

Saldo de palabras, con el conteo de `word-budget.test.ts`:

| Fichero | Antes | Después |
| --- | --- | --- |
| `sdd-end-release/SKILL.md` | 2.040 | 1.862 |
| `sdd-end-release`, total | 2.608 | 2.142 |
| `add-to-changelog` | 403 | 350 |
| `sdd-archive/SKILL.md` | 4.613 | 4.589 |

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 1,07 h — reloj de la sesión 1,12 h desde 2026-10-31T16:47Z, sin 3 min de espera al dev-lead (1 espera)
- Desviación: -1,93 h (-64 %): las tandas de sujetos corrieron más rápido de lo previsto (~30 s a 1 min por sujeto frente a los ~4 min estimados), y el plan contaba su espera
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 19.850.433 — claude-opus-5-5 19.850.433
- Tokens de subagentes: 2.812.435 en 3 despachos — Final review — Code axis claude-sonnet-5-5 1.049.603 / 2 min; Re-review final 0177 claude-opus-5-5 571.573 / 3 min; Final review — Spec axis claude-opus-5-5 1.191.259 / 6 min
- Coste de la sesión: 13,29 $ (hilo 9,63 $ + subagentes 3,66 $)
- Coste de sujetos: 7,34 $ en 32 sujetos Sonnet — RED 2,87 $ (10); GREEN 4,47 $ (22), con el tramo de la batería de `sdd-archive`
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La suma de la previsión eran 32 sujetos y se gastaron los 32, repartidos de otra forma: el tramo de batería fueron 6 sujetos en vez de 3, y la «medición tras la revisión» fueron `a4` y `k`.
- Un script de la pasada de fix dañó tres ficheros por un fallo mío de PowerShell (un array de un elemento se aplanó); se restauraron de `HEAD` y se reaplicó el cambio. La re-revisión comprobó que no quedó texto dañado.

### Decisiones tomadas sin el dev-lead

- Las de ✋ de la spec, aprobadas en el gate.
- El tramo de `sdd-archive` son a9, rc1 y rc2, con rc1 y rc2 en molde 3.0.0 — coste si mal: 1,5 $ más, dentro del techo.
- El hallazgo de un disparador ajeno reescrito no se reprodujo (`a3-1`); el texto se aclara igual.
- **`a4` no se relanza**: el techo de 32 sujetos está gastado. La parada «nada que publicar» queda por lectura, y el único sujeto en esa condición publicó la 0012 y la 0013 desde sus carpetas, con molde contaminado — coste si mal: un corte publica un cambio cerrado sin fila, con la versión aún por confirmar.
- `release-flow.md` sigue diciendo «sus cinco pasos» en «El cierre no procesa el feedback de una reunión»: cambiarlo es un THEN y una enmienda; va a la 0152 — coste si mal: un número desfasado.
- La fecha del rescate es «not earlier» frente al «posterior» de la spec: si no, migrar y cortar el mismo día no rescataría nada — coste si mal: una pregunta repetida.
- «prepare steps 1-6» con el validador en el paso 7 no se retoca tras la re-revisión; `a4-1` lo ejecutó y lo refuerza un red flag — coste si mal: con el usuario ausente, un corte preparado sin validador.
- `roadmap-template.md`, 2.x, sigue diciendo que el corte colapsa, y el `(0157)` del delta de `onboarding` es anterior a esta rama: no se tocan.

ADR: el changelog se escribe solo en el corte → decisions/0020-changelog-written-at-the-cut.md

## 4. Verificación

Verificado por el agente, en `tests/sdd-end-release-0177-green.md`, leído en disco. Smoke por THEN:

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Filas a `CHANGELOG.md`, Now sin lo hecho, 🧪 con disparador nuevo, smoke bajo la versión | ejecución real (`a-2`) | ✅ |
| Una fila ya publicada no gana otra línea | ejecución real (`a2-1`, `a4-1`) | ✅ |
| 🧪 validada en un corte posterior sale | no probado | solo texto |
| Sin changelog: tag y «Tras» a `—` | ejecución real (`i-1`) | ✅ |
| Caducidad y «Descartadas» | ejecución real (`b-1`) | ✅ |
| Saldadas fuera de «Lista» y rescate de la 0007 | ejecución real (`d-2`) | ✅ |
| Rescate mencionado por el dev-lead, y el corte siguiente no busca | no probado | solo texto |
| Forma 2.x para | ejecución real (`j-1`) | ✅ |
| Sin email ni cambios en `client-changelog.md` | ejecución real (`c-1`, `c-3`) | ✅ |
| Sin destinatario, sin notas | ejecución real (`a-2`) | ✅ |
| Tracker y retro | no probado | solo texto |
| Cierre 3.0.0 sin tocar `CHANGELOG.md` y con fila | ejecución real (`h-3`) | ✅ |
| Cierre 2.x con entrada | ejecución real (`k-1`) | ✅ |
| «Nada que publicar» (Review Focus) | no probado | por lectura; ver ✋ |

Validación en campo: 2026-10-31 · 32 sujetos, batería a9, rc1 y rc2 verde, y el gate del paso 6 del cierre; `no probado`: las filas de arriba.

### 4.1 Builds

El gate corre sobre el merge de sincronización: su línea va en el mensaje final.

## 5. Revisión

Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan). Pasada de fix: 5 Important y 13 Minor. Re-revisión con Opus: hallazgos resueltos; 2 Important nuevos (evidencia de `a4` mal contada y `greenfield.md`) arreglados en el hilo, con diff solo de documentos.

## 6. Aprendizajes

- **Un frente limpio con la guía vieja se puede romper al reescribirla** (`d-1`): el GREEN lo vuelve a medir aunque no lleve guía nueva. Una condición en prosa no se ejecuta; una orden literal, sí. En `tests/sdd-end-release-0177-green.md`.
- **Un `foreach` sobre `@(@('a','b'))` en PowerShell aplana la pareja**, y `$x[0]` pasa a ser un carácter; `R` es además alias de `Invoke-History`. Va a `tech-stack.md`.
- Revisión de skills: `.claude/skills/` no tiene ninguna skill que este cambio afecte.
