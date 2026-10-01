---
id: 20260930-211302-feature-0118-field-validation-mode
feature: 0118
title: Walkthrough — Validación en campo como modo del proyecto
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-01
---

# Walkthrough — Validación en campo como modo del proyecto

## 1. Cambios realizados

- **La regla** (`189d687d`): `control-profiles.md` gana la fila de `validation.mode` en «Claves de sdd-kit.json» (`manual` | `field`, solo en `sdd-kit.json`), la condición en la fila «Validación» de la tabla de gates y la sección `## Validación en campo`: en campo no se para en ningún perfil, se registra `Validación en campo: <fecha> · <verificación del agente>`, el roadmap queda ✅ sin 🧪, la decisión de producto se sigue preguntando, un valor desconocido cuenta como `manual` con aviso y una validación humana que llegue igual manda. El paso 7 de `sdd-start-feature` y su red flag la nombran; `walkthrough-template.md` y `patch-template.md` ganan la tercera forma.
- **Cierre de feature** (`a4f01f83`): pasos 0, 1 y 8 de `sdd-end-feature`.
- **Cierre de patch** (`e2be9067`): paso 0 de `sdd-end-patch` y su red flag; la frase de `unattended` queda «sin la clave».
- **Este repo** (`e2f56589`): `sdd-kit.json` con `validation.mode: field`; regla 6 del `CLAUDE.md` reescrita (tres paradas en `delegate`, la validación final en campo, con la frase del dev-lead); la 0115, la 0123 y el patch 0126 pasan de 🧪 a ✅ con su adenda; la fila de deuda «Validar una diferida después del corte…» se cierra.
- **Pasada de fix de la revisión final**, juntada en el cierre: las frases que decían que la validación no se quita nunca exceptúan el campo; los pasos dicen que, aun en campo, si el usuario dice qué probó se registra `Validado`, y que otro valor cuenta como `manual` con aviso literal; `validation.mode` entra en la regla del atajo autoconcedido (enmienda E1); el paso 7 en campo conserva las reglas de verificación que siguen.
- **Evidencia**: `tests/field-validation-red.md`, `tests/field-validation-green.md`, `tests/FieldValidation.Tests.ps1` (15 tests estáticos), y `red/`, `green/`, `refactor/` y `fix/` de esta carpeta.
- **Partición**: la 0127 (fila en la release 2.3.0) se lleva la pregunta de `sdd-config`, las init y la migración.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 1,6h — reloj del hilo aproximado con las marcas de los commits: 23:16-23:45 del 2026-09-30 (Task 1 y el GREEN de la Task 2, hasta la pausa del dev-lead) y 10:45-11:55 del 2026-10-01 (Tasks 2 a 4, revisión final y pasada de fix); spec y plan, ~0,45h aparte
- Desviación: -0,9h (-36 %)
- Causa de la desviación: el RED de los cuatro escenarios se lanzó junto y en paralelo antes de editar nada, y cada tanda de sujetos tardó 3-5 min; la estimación partía de la 0123, con RED por task
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 37.864.855 — claude-opus-5-5 37.864.855
- Tokens de subagentes: 2.838.528 en 1 despacho — Revisión final 0118 claude-opus-5-5 2.838.528 / 4 min
- Coste de la sesión: 19,49 $ (hilo 17,68 $ + subagentes 1,81 $)
- Coste de sujetos: 4,64 $ en 22 sujetos sonnet — RED 1,10 $; GREEN 2,52 $; REFACTOR 0,25 $; pasada de fix 0,77 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- El escenario `d1` (validación tardía de una fila ya cortada) salió limpio en el RED: no se escribió su guía ni su test estático.
- La primera ronda del GREEN de `f1` (paso 7) se repitió tras la Task 2, y la pasada de fix añadió `f3`, que entra por el paso 7.
- Un retoque de redacción del paso 0 de `sdd-end-patch` tras el GREEN, con un sujeto de control.
- Revisión final `sdd-kit:effort-high` + opus sobre `4ebd7ef0`: 0 Critical, 4 Important y 7 Minor. Los Important, en una pasada de fix con su test en RED y controles `f3`, `f2` y `p1` 3/3 (`tests/field-validation-green.md`); el Important 3 cambió una regla de la capacidad fuera del delta, como enmienda E1, que el dev-lead aprobó el 2026-10-01 («Apruebo E1 (Recomendada)»).

### Decisiones tomadas sin el dev-lead

- `d1` limpio (1/1): no se escribe la guía de la decisión 5 de la spec y se retira su test estático; `d1` queda como control (1/1 en el GREEN). El sujeto sacó la conducta de la línea `validaciones pendientes:` del roadmap, una fuente que toda validación tardía tiene delante (Art. I) — si dependía del azar, una validación tardía deja la línea sin tocar.
- Los sujetos de `f1` («sigue con la feature 0030… revisión final limpia») entran directos por `sdd-end-feature` y nunca leen el paso 7: se re-midieron tras la Task 2, con 2/2, y el paso 7 se midió con `f3` — si el paso 7 no se lee en ese enrutado, su guía solo actúa cuando la sesión sigue dentro de `sdd-start-feature`.
- «sigues con el paso 1.» cortaba la sección que extrae `tests/FrontendVerification.Tests.ps1` (delimita por «1. ») y el pre-commit lo rechazó: se cambió a «sigues con el cierre sin parar», sin tocar el test, con un sujeto de control de `p1` (1/1).
- `SUBJECT_CAP` pasó de 20 a 22 sujetos, dentro de la reserva de 4 de la spec: los dos sujetos apartados de la primera ronda de `f1` cuentan en el recuento del lanzador.
- Los siete Minor de la revisión final se difieren a una fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` sobre `726282b9` → 1.157 pasados, 0 fallos, 10 saltados · 405 s
- `Test-Roadmap.ps1 -Path .docs/sdd` → `Roadmap válido`; `Test-Capabilities.ps1 -Artifact spec.md` → `Capacidades válidas: 14`

### 4.2 Smoke / tests

- Validación diferida: 2026-10-01 · «Diferir: lo pruebo en la primera feature de este repo con field, a cargo del dev-lead» · disparador: la primera feature de este repo con `validation.mode: field`, a cargo del dev-lead
- Esta feature para en su validación aunque la rama ya active `field` (spec, decisión 8): la clave entra en `develop` con su merge, y la validación se presentó como el dev-lead pidió al delegar («nos vemos en la validación»).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `field`: no pregunta ni ofrece diferir y sigue con el cierre | ejecución real (sujetos `f1` 2/2, `f2` 3/3, `p1` 4/4, `f3` 1/1; RED 0/6) | ✅ |
| `field`: walkthrough o `patch.md` §4 con `Validación en campo: <fecha> · <verificación>` | ejecución real (los mismos) | ✅ |
| `field`: fila ✅; el patch sin 🧪 ni fila en la release | ejecución real (`f2`, `p1`) | ✅ |
| Sin la clave, la validación de hoy | ejecución real (`f2m`, `p1m`, 2/2 paran) | ✅ |
| Diferida cuya fila ya salió en el corte: quita el id de `validaciones pendientes:` | ejecución real (`d1`, RED y GREEN 1/1) | ✅ |
| `field` en el paso 7: el smoke y la suite se ejecutan igual y la decisión de producto se pregunta sola | ejecución real (`f3` 1/1) | ✅ |
| Resto de THEN de «La validación puede diferirse…» y «El trabajo se valida…», sin cambios | suite (texto sin cambios) | ✅ |

### 4.3 Residuales / deuda generada

- `sdd-end-release` no escribe «Validación: en campo» en la release cerrada de un proyecto en campo; las de este repo la llevan a mano desde la migración de la 0115. Fuera del alcance (spec, decisión 9).
- Los siete Minor de la revisión final, en una fila de deuda del roadmap:
  - La fila de deuda «Validar una diferida después del corte…» quedó como saldada con `[spec]`; encaja mejor como descartada (RED limpio), y la plantilla pide `[walkthrough]`.
  - El delta MODIFIED de la diferida fija una conducta que ningún texto del kit escribe: se cumple por conducta observada (`d1`).
  - La rama de campo de `sdd-end-patch` no nombra la verificación visual `no probado`, y la fila visual de `patch-template.md` dice «enseñadas en la validación».
  - El estado ✅ de `control-profiles.md` dice «cerrada y validada», sin «o en campo».
  - El test «el roadmap marca ✅ en campo» busca la frase, no el ✅.
  - El paso 1 de `sdd-end-feature` termina en «validada o diferida — no hay cierre», sin «o en campo».
  - La fila 0126 decía «validación diferida a el próximo cierre» (heredado).

## 5. Aprendizajes

- Una petición de «sigue con la feature, la revisión final ya está limpia» entra por `sdd-end-feature`, no por el paso 7 de `sdd-start-feature`: una regla de la validación tiene que estar en los dos pasos, y un escenario que quiere medir el paso 7 tiene que nombrar `sdd-start-feature` en la petición → `tech-stack.md` (campañas headless).
- Los tests estáticos que cortan un paso por su número (`'0. **Validación**' '1. '`) se rompen con una frase de la guía que contiene «paso 1.»: al escribir guía en un paso numerado, no citar otro paso con número y punto → `tech-stack.md` (campañas headless).

## 6. Adendas

- **2026-10-01 · corte de la 2.3.0**: la validación diferida sigue pendiente. El disparador anterior (la primera feature de este repo con `validation.mode: field`) ya ocurrió con las features 0127, 0050, 0124 y 0117, sin que el dev-lead dijera qué probó. Disparador nuevo, decidido con el dev-lead al cortar: la release siguiente a la 2.3.0, a cargo del dev-lead. La fila sale del roadmap y el id queda en `validaciones pendientes:` de la v2.3.0.
