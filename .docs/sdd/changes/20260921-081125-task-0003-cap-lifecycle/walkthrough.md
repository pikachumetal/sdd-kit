---
id: 20260921-081125-task-0003-cap-lifecycle
task: 0003
title: Walkthrough — Capabilities, ciclo de vida completo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-21
---

# Walkthrough — Capabilities: ciclo de vida completo

## 1. Cambios realizados

La task entró con seis frentes y el RED la recortó a dos reglas y un arreglo de forma. El kit de develop ya resolvía el resto (detalle en §3 y en [`tests/capabilities-red.md`](../../../../tests/capabilities-red.md)).

- **Slug de capacidad nueva en inglés kebab-case**, escrito donde se crea: ayuda del delta en `spec-template.md`, regla 1 de `capability-template.md` y paso 4 de `sdd-start-task` (`9a2089a`).
- **El comportamiento observable vive solo en `capabilities/`**: los documentos de anclaje enlazan la capacidad y no copian el valor. Está en la regla de reparto de `spec-template.md`, en §1.1 de `plan-template.md`, en el paso 4 de `aprendizajes-skills.md` y en la red flag y la racionalización de `sdd-end-task` (`9a2089a`).
- **`MODIFIED` copia el bloque entero y la fusión lo sustituye entero**: `spec-template.md`, regla 3 de `capability-template.md` y `aprendizajes-skills.md` (`9a2089a`, `b82f8ee`).
- **Tests estructurales**: `tests/CapabilityRules.Tests.ps1`, 10 casos (`9a2089a`, `b82f8ee`).
- **Validador `Test-Capabilities.ps1`**: implementado (`79bec32`) y revertido (`ca51ef4`); neto cero.
- **Evidencia**: `tests/capabilities-red.md` (`0341f2d`) y `tests/capabilities-green.md` (`eee671f`), con moldes y salidas en `red/` y `green/`.
- **Capacidad nueva `capabilities`**, con cinco requisitos movidos desde `task-flow`; fusión en este cierre.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h (plan enmendado tras el RED; el original decía 6h)
- Esfuerzo real: 3h de implementación, desde la aprobación del plan hasta el cierre (12:30 → 15:05 por las marcas de los commits, más ~0,4h de cierre). A eso se suman 1,75h de spec y plan, con dos reescrituras. Total **4,75h**, **aproximado**.
- Desviación: −1h (−25%) sobre la implementación
- Review de spec: 2 revisores (dominio y técnica) · hallazgos 12, aceptados 11 (sobre la versión anterior al recorte)

## 3. Desviaciones del plan

- **El RED recortó la spec** (Art. I), y el dev-lead aprobó el recorte dos veces: primero «recorte estricto» y luego «recorte + `MODIFIED` + deuda». Se cayeron:
  - la línea fija de capacidad y el test de pertenencia;
  - el cambio de rúbrica y el punto 8 de la lente dominio;
  - el paso de fusión propio en task y patch, y `(retira: …)`;
  - la alarma de fusión y la frontera patch/task;
  - el sitio único (skill contra referencia) y el validador.

  Las Tasks 5 y 6 no se ejecutaron. El GREEN pasó de 18 sujetos a 4.
- **El RED tuvo una segunda ronda** (m5 y m6, 4 sujetos): la escritura de un `MODIFIED` y la frontera patch/task no tenían escenario en el plan, y hacían falta antes de recortar.
- **El validador se implementó antes del RED**, en paralelo con la campaña, y se revirtió al leerla. Costó ~167k tokens de implementador. Con el RED primero no se habría escrito.
- **La Task 3 se ejecutó en línea**, declarado en el plan enmendado.
- **Volcado inicial de capacidades**: sale de la 0003 y pasa a la 0012, junto con el funcional aportado en un greenfield.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"`: 212 pasados, 0 fallidos, 6 omitidos (los preexistentes), antes y después de integrar develop (`272a336`).
- `claude plugin validate --strict skills/`: «Validation passed».
- Longitud de rutas de la carpeta de la spec y de `tests/`: ninguna llega a 140 caracteres.

### 4.2 Smoke / tests

- **Validado por el dev-lead: no. Validación diferida al uso real de la 1.2.0**, por decisión suya el 2026-09-21, estando presente y con el trabajo presentado. Sus palabras: «esta parte de capabilities la forma mejor para probar es cuando publiquemos si vemos que las genera bien» y «entendemos que los test que has corrido tu son la mejor manera de probarlas […] mi prueba será diferida cuando use el kit». Leyó el diff de `skills/` sin validarlo («me cuesta mucho entender el diff así en frío»). Es el tercer caso con la misma forma, tras la 0001 y la 0011. La prueba queda en el smoke del tramo 1 de la release 1.2.0, y el caso va a la task 0008.

Verificado por el agente (campaña GREEN, 4 sujetos headless Sonnet con el kit de la rama):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | E1: la task crea una capacidad nueva (en el RED, `avisos` 2 de 2) | ✅ `email-notifications` y `booking-notifications` |
| 2 | E2: cierre con un plan que pide «documentar los tiempos en tech-stack» (en el RED, valores copiados 2 de 2) | ✅ 2 de 2 enlazan `capabilities/bookings.md` y nombran la constante sin copiar el valor |
| 3 | E2: `MODIFIED` aditivo fusionado sin perder los `AND` vigentes | ✅ 2 de 2 (igual que en el RED) |
| 4 | E2: se fusiona lo construido (12 h), no lo del delta (24 h) | ✅ 2 de 2 |
| 5 | E2: lo fusionado sale de `legacy.md` | ✅ 2 de 2 |
| 6 | E1: capacidad nueva en vez del cajón `aulario` | ✅ 2 de 2 |

### 4.3 Residuales / deuda generada

- **Fila de deuda en el roadmap: lo que el RED no reprodujo.** Cubre la defensa bajo presión (cajón de sastre y fusión en sesiones largas con subagentes), el validador de forma y el delta en `patch.md`. Baseline: `tests/capabilities-red.md`. Se reabre con un ticket de `sdd-feedback` que lo muestre en campo.
- **Task 0012**: el volcado inicial de capacidades como excepción de greenfield (decisión del dev-lead del 2026-09-20, sin RED propio) y el sitio del funcional aportado en un greenfield. Ese funcional **no** va a `legacy.md`: describe lo que se quiere construir, no lo construido.
- **Task 0008**: validación diferida en tasks cuyo usuario es un agente (tooling, kit, arquitectura). La evidencia principal es el GREEN con sujetos y la validación del dev-lead llega con el uso. Hace falta un estado de roadmap distinto de ✅. Precedentes: 0001, 0011 y 0003.

## 5. Aprendizajes

- **Una task XL armada desde tickets de campo puede estar mayoritariamente resuelta ya.** De catorce conductas medidas, el kit de develop fallaba en dos. Los fallos de campo salieron en sesiones largas y cargadas, y un baseline limpio no los reproduce. Medir antes de diseñar la forma (sitio único, skill contra referencia) habría ahorrado la mitad de la spec. → `tech-stack.md` (fixtures y baselines).
- **No se implementa en paralelo al RED lo que el RED puede recortar.** El validador se despachó mientras corría la campaña «porque no dependía de ella», y dependía: su valor era vigilar errores que el RED no mostró. → `tech-stack.md`.
- **La letra de una plantilla que los agentes desobedecen con razón se arregla aunque el RED salga limpio.** Ejemplo: «`MODIFIED` sustituye», cuando todos fusionan añadiendo. No es guidance para un fallo de conducta, sino la corrección de un texto que ya produjo falsos Críticos de revisor. → evidencia en `tests/capabilities-red.md` (sin doc vivo: es criterio de aplicación del Art. I y queda como precedente citado).
- **En el kit, el usuario de una task es a menudo un agente, y la validación del dev-lead es diferida por naturaleza.** → task 0008 (roadmap).
- **El plan del molde pidiendo «documentar en tech-stack» fue la presión que produjo el duplicado, y la regla del paso de aprendizajes le ganó.** Una regla en el punto donde se ejecuta la orden vence a la orden. → confirmación del patrón «el artefacto vence a la prosa» (T11), ya en `tech-stack.md`.
