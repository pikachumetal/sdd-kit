---
id: 20260924-225741-task-0058-session-model-policy
task: 0058
title: Walkthrough — Modelo y effort de la sesión que ejecuta en Native
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Modelo y effort de la sesión que ejecuta en Native

## 1. Cambios realizados

- **Guía** (`088fca5`):
  - `skills/sdd-start-task/SKILL.md`, paso 4: en `delegate`, con la sesión en el modelo más capaz, el gate de la spec ofrece «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media». La opción no es la recomendada y lleva su motivo. Si el usuario la elige, el agente escribe el plan, junta la apertura en un commit y termina el turno diciendo cómo cambiar de modelo.
  - `skills/sdd-start-task/SKILL.md`, paso 5: en `pair`, con Native, el gate del plan ofrece «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media».
  - `plan-template.md`: con Native, la línea `Ejecución` recomienda gama media para la sesión.
  - `walkthrough-template.md`: «Modelo del hilo» pide el modelo y el effort de cada fase, en una sola línea.
  - Art. IV de la constitution: la política de modelo de la sesión en Native.
  - `tests/SessionModel.Tests.ps1`: cinco tests de literales.
- **Evidencia**:
  - `tests/session-model-red.md` (`a0ec8d3`).
  - `tests/session-model-green.md` (`656cbe8`, y `ec1d966` con `d5` tras la revisión final).
  - Lanzador y sujetos en `red/`, con `SUBJECT_CAP`, el techo común y el fichero `stop`.
- **Capacidades**: tres requisitos ADDED en `task-flow` y uno en `estimation`.
- **Integraciones de `develop`**: `bfc26d8` (la 0061, por el freno de alcance) y `fe0bb9e` (la 0063, la 0067 y el patch 0069, antes del cierre).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 1.3h — reloj del hilo, aproximado con las marcas de los commits:
  - de 01:01 a 01:20: la apertura y el RED;
  - la pausa del dev-lead no cuenta;
  - de 08:45 a 09:45: la guía, el GREEN, la revisión final y `d5`.
  - Aparte, spec y plan: ~0.5h.
- Desviación: -0.7h (-35 %)
- Causa de la desviación: la campaña fue más corta y barata de lo previsto. Un sujeto Opus de gate costó 0,40–1,02 $ y tardó pocos minutos, no hubo tanda de REFACTOR, y la guía cupo en dos frases de skill y dos de plantilla.
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: no medido
- Tokens de subagentes: 103k en 1 despacho — revisor final general-purpose + opus 103k / 1,6 min
- Coste de sujetos: 8,28 $ en 12 sujetos (10 Opus y 2 Sonnet) — RED 3,41 $; GREEN 3,26 $; `d5` 1,61 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Integración de `develop` a mitad de la Task 2 por un freno de alcance: la 0061 cambió los mismos párrafos de `sdd-start-task`. La decidió el dev-lead.
- Escenario `d5`, fuera del plan: se midió tras la revisión final, antes de decidir si hacía falta un arreglo, con los dos últimos sujetos del `SUBJECT_CAP`.

### Decisiones tomadas sin el dev-lead

- La plantilla del walkthrough pide las fases «en esta misma línea», un texto que el plan no traía. En el RED, el sujeto partió las fases en dos etiquetas inventadas. Coste si está mal: una frase de más.
- La línea `complete` de la Task 1 en el ledger se escribió tarde: el primer `task-done` falló con `bash -c` y la pausa lo dejó pendiente. Su rango llega a `088fca5`; el commit real es `a0ec8d3`, y así figura en `tasks.md`. Coste si está mal: ninguno.
- El revisor final se despachó como `general-purpose` + `opus`, con el effort heredado de la sesión. El tipo `sdd-kit:effort-high` no estaba cargado: la sesión reanudada no salió de `Start-KitSession.ps1`. Se avisó antes del despacho. Coste si está mal: una revisión con otro effort.
- La revisión final marcó como Minor que el paso 5 dice «en `delegate` sigue sin parar» sin excluir la parada elegida en el paso 4. Lo subí a Important por su efecto: si el agente obedece al paso 5, ejecuta con Opus. Antes de escribir la cláusula lo medí con `d5`: 2 de 2 sujetos paran antes de la Task 1 con el cambio de modelo, el segundo sin el hueco del molde. Por el Art. I no se escribe. Coste si está mal: un agente que ejecute con Opus tras elegir parar.
- El aviso del coste de caché tras `/model` (decisión 6 de la spec) no se añadió a la guía: es un coste de una vez, sin medir, y alarga el motivo del gate. Ese coste es este: la primera petición tras cambiar de modelo relee el contexto sin caché. Coste si está mal: el usuario no lo sabe al cambiar.
- Minors de la revisión final, diferidos (a la deuda del roadmap):
  - en `pair`, si el handoff recomienda SDD y el usuario elige Native, la opción de parar no aparece;
  - la línea `Ejecución` de `plan-template.md` tiene dos tramos «con native, añade»;
  - el test del Art. IV no está acotado al artículo.
- Evidencia de `p5` corregida tras la revisión final: el sujeto que llegó al gate no dio la opción literal y su motivo fue parcial.

## 4. Verificación

### 4.1 Builds

- Sin build: skills en Markdown.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «delegada al uso» · disparador: la primera task que el dev-lead arranque con la sesión en Opus y ejecute en Native con el kit de `develop` tras el merge, a cargo del dev-lead

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Invoke-Pester -Path tests` con los `Slow` (gate de cierre, verificado por el agente) | 658 pasan, 0 fallan, 7 omitidos |
| 2 | `tests/SessionModel.Tests.ps1` frente a su copia RED (`git diff --no-index`) | 5/5 en verde; test sin cambios |
| 3 | Gate de la spec en `delegate`, sesión Opus (`d4`) | RED 0/2 → GREEN 2/2 ofrecen la opción, no recomendada y con su motivo |
| 4 | Gate del plan en `pair`, sesión Opus (`p5`) | RED 0/2 → GREEN 1/1 de los que llegaron al gate: texto no literal y motivo parcial. El otro sujeto paró antes por el hueco del molde y anunció la opción |
| 5 | Línea `Ejecución` con Native (`p5`) | RED 0/2 → GREEN 2/2 con la frase literal |
| 6 | «Modelo del hilo» con las dos fases (`c1`) | RED 0/1 (forma) → GREEN 1/1 |
| 7 | Parada elegida en `delegate`, paso 5 (`d5`, con el kit del GREEN) | 2/2 paran antes de la Task 1 con el cambio de modelo |
| 8 | Revisión final de rama | 0 Critical, 0 Important tras resolver el hallazgo 1 |

### 4.3 Residuales / deuda generada

- Los tres minors diferidos → deuda del roadmap.
- El revisor final que se escribe en el plan del paso 5 no respeta el techo del Art. IV: 1 de 2 sujetos en el RED y 1 en el GREEN. Va a la deuda del roadmap y al ticket.
- La rama «effort no registrado» del walkthrough queda sin medir.

## 5. Aprendizajes

- Un sujeto cuya conducta depende del modelo de la sesión corre con ese modelo, y un sujeto Opus de gate cuesta 0,40–1,02 $ → `tech-stack.md`
- El molde `salas` sigue con el hueco «libres», que corta los escenarios de gate. `free_in_base` de la 0057 lo cierra, y un escenario que no mida ese hueco debe usarlo → `tech-stack.md`
- Antes de arreglar un hallazgo de la revisión final que toca una skill, se mide si el fallo existe: el Art. I ya lo exige, y `d5` lo aplicó. No es una convención nueva → no hay destino nuevo (Art. I)

## 6. Adendas
