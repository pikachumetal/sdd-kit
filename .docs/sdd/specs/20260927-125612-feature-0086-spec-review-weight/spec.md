---
id: 20260927-125612-feature-0086-spec-review-weight
feature: 0086
parent: 0032
title: La review de la spec pesa el delta, respeta el paralelismo y busca cada MODIFIED
mode: lite
profile: delegate
status: approved
created: 2026-09-27
author: agente
approvers:
  - role: dev-lead
    name: Àngel Delgado (por delegación)
    approved_at: 2026-09-27
---

# Spec — La review de la spec pesa el delta, respeta el paralelismo y busca cada MODIFIED

## Capacidades

- Modificadas: `feature-flow` — «La spec propone su propio nivel de review por complejidad» (tamaño del delta y paralelismo restringido) y «La spec se repasa antes del gate» (búsqueda de cada `MODIFIED`)

## Decisiones que he tomado yo — valida estas

1. **Tamaño del delta**: menos de ~50 líneas estimadas en lo que lista el Scope, texto y código juntos, bajan un escalón: dos revisores pasan a uno con los siete puntos, nunca a ninguno. El umbral es el del criterio del ticket 0040 §1b («menos de ~50 líneas de texto de skill»). La propuesta lleva `· tamaño: ~<N> líneas en <M> ficheros`.
2. **Paralelismo restringido**: solo con la spec aprobada por delegación (el enunciado; `unattended` queda fuera). Un revisor con los siete puntos y sin preguntar; la segunda lente, en la línea del mínimo.
3. **Búsqueda de cada `MODIFIED`**: en el repaso de coherencia del paso 4, en los dos modos, fuera de la spec y en el código («en el kit, en `skills/`»).
4. **RED previo, con fichero y línea para la pieza (1)**: `review-spec.md:20-21` decide solo por señales. Las piezas (2) y (3) se midieron con 2 sujetos cada una y fallaron 2/2 (`tests/spec-review-weight-red.md`).
5. **Previsión de la campaña** (Art. I, RED y GREEN juntos): 11 sujetos Sonnet, ~7 $, ~1 h de redacción. Techo: 13 sujetos y 9 $ en el lanzador, con un `RUNS_DIR` por fase hasta que se fusione el patch 0084.
6. **Fuera del Scope, con motivo** (la pieza (3) aplicada a esta spec): `spec-template.md:36` solo remite a `review-spec.md` y no repite la regla; el ejemplo de `review-spec.md` sigue en dos revisores porque su delta es grande, y gana la línea de tamaño; `ControlProfiles.Tests.ps1:35` fija «4 señales o más», que se conserva; la racionalización de `SKILL.md:92` no cambia.
7. **La tabla de ficheros calientes del roadmap no se toca**: sus filas son líneas compartidas con la 0032, que va en paralelo.
8. **Molde**: el `subject.sh` comprueba que el molde es su propio repo. El primer ensayo en seco, sin `git init`, escribió en el repo vacío de `%TEMP%` (restaurado).

### Decisiones tomadas con el dev-lead

- Modo lite, perfil `delegate` (del proyecto) — respuesta a la primera pregunta, 2026-09-27
- La spec se aprueba por delegación — «Apruebo por delegación» («apruebo la spec por delegación, nos vemos en la validación»), 2026-09-27
- Restaurar el repo vacío de `%TEMP%` que tocó el ensayo en seco — «Sí, restaurar», 2026-09-27

## Intent

La rúbrica de review de la spec cuenta señales y no mira el tamaño, así que un cambio de unos pocos párrafos puede pagar dos revisores (0040). Con la spec delegada, si las instrucciones del usuario piden confirmar antes de paralelizar, el agente para a pedir permiso que nadie va a dar (0061). Y el repaso de coherencia contrasta la spec consigo misma, pero no busca las otras entradas de un requisito que cambia (0060).

## Scope

- Entra: `skills/sdd-start-feature/references/review-spec.md` §2 (tamaño, paralelismo restringido y la línea `tamaño` de la propuesta, también en su ejemplo); `skills/sdd-start-feature/SKILL.md` paso 4 (repaso de coherencia); la evidencia `tests/spec-review-weight-red.md` y `-green.md`; la fila 0086 del roadmap.
- No entra: `encargo-revision.md` y `plan-template.md` (0032); `control-profiles.md` y los pasos 6 y 7 (0085); `unattended` con el paralelismo restringido; dimensionar la campaña del Art. I.

## Approach

Dos viñetas nuevas en §2 de `review-spec.md`, cada una con su contraejemplo o su medida, y una frase en el repaso de coherencia del paso 4.

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — La spec propone su propio nivel de review por complejidad**
- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND si el Scope cambia menos de ~50 líneas (texto y código), el nivel baja de dos revisores a uno con los siete puntos, nunca a ninguno: con contrato público + datos y dos líneas en `db/002-site.sql` y `src/api.js`, un revisor
- AND si la spec va aprobada por delegación y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra; en modo lite no se propone

**MODIFIED — La spec se repasa antes del gate**
- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 2 h (texto ~15 min; RED y GREEN, ~11 sujetos en paralelo, y su evidencia)
- Base de la estimación: la 0040, del mismo tamaño de texto, llevó ~3,5 h con 44 sujetos; aquí son 11, con previsión y techo en el lanzador
- Confianza: media

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-27 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
