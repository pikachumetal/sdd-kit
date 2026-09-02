---
id: 20260902-084856-task-0000-modo-lite
task: 0000
title: Modo lite del carril task
status: approved
created: 2026-09-02
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-02
---

# Spec — Modo lite del carril task

> **Estado**: approved
> **Fase del workflow**: Specify (qué + por qué)
> **Siguiente paso**: tras aprobación → `plan.md` con `superpowers:writing-plans`

## 1. Contexto

- **Problema u oportunidad**: superpowers 6.3.0 (2026-08-12) reescribió `brainstorming` para clasificar cada petición en spike / bounded / architectural. La rama `bounded` establece literalmente *"No spec file, no implementation plan document"* y su estado terminal es implementar directamente tras una aprobación en chat. `sdd-start-task` invoca `brainstorming` en el paso 4 dando por hecho que desemboca en `spec.md`, y el paso 5 en `plan.md`. Un agente que clasifique la petición como `bounded` y siga la dependencia al pie de la letra **se salta los dos gates del kit**. La tabla de overrides sobre superpowers no cubre el caso.

  El mismo diagnóstico destapó un hueco propio: el kit ofrece hoy tres niveles de ceremonia — cambio de una frase sin SDD, carril patch (solo bugs deterministas) y carril task completo. Una feature pequeña sobre un flujo que ya existe no encaja en ninguno: no es un bug, así que el carril patch la rechaza; y arrastra la ceremonia completa de spec + plan aunque la incertidumbre sea mínima. La constitution ya reconoce el principio en `sdd-start-task`: *"la planificación es proporcional a la incertidumbre, no un trámite universal"*, pero no existe el artefacto que lo materialice.

- **Estado de partida confirmado del código**:
  - `skills/sdd-start-task/SKILL.md` — paso 2 enruta task vs patch; la tabla "Overrides sobre superpowers" tiene cuatro filas, ninguna sobre la clasificación de brainstorming.
  - `skills/sdd-end-task/SKILL.md` — cierre único, sin noción de modo.
  - `skills/sdd-templates/templates/spec-template.md` — 11 secciones, sin variantes.
  - `skills/sdd-templates/templates/plan-template.md` — aloja el bloque "Estimación y esfuerzo" (módulo por predicado `estimation.md`).
  - `.docs/sdd/mission.md` — glosario con los carriles task / patch / release / consult.
  - superpowers 6.3.0 instalado; `brainstorming`, `writing-plans`, `executing-plans`, `systematic-debugging`, `writing-skills` y `finishing-a-development-branch` siguen existiendo con esos nombres.

- **Stakeholders**: developers del equipo que usan el kit en cualquier proyecto; los propios agentes, que deben cumplir la guidance bajo presión.

- **Restricciones conocidas**: Art. I obliga a ciclo RED→GREEN documentado. `sdd-start-task` ya arrastra deuda por longitud (965 palabras, ítem 3 del roadmap) y esta task la agrava.

## 2. Objetivo

- **Qué construimos (one-liner)**: un modo lite del carril task — spec corta y sin `plan.md` — habilitado por un predicado observable y confirmado por el usuario, más el override que impide que la clasificación de `brainstorming` gobierne los artefactos del kit.

- **Definición de éxito**:
  1. Un agente que entra por `sdd-start-task` escribe siempre `spec.md` con su gate, sea cual sea la clasificación que haga `brainstorming`.
  2. Ante un cambio acotado que cumple el predicado, el agente propone el modo lite y **espera confirmación** antes de omitir el plan.
  3. Ante un cambio que NO cumple el predicado, presentado con presión de calendario, el agente mantiene el modo completo.
  4. Una task lite cierra con smoke ejecutado, `walkthrough.md` y tiempo real registrado.
  5. El RED exhibe los fallos 1–3 sin la guidance; el GREEN los repara.

- **NO objetivos**:
  - Absorber `grilling` en `sdd-consult`, reformular las referencias a todos y declarar `dependencies` en el manifest — van a un patch de compatibilidad aparte.
  - Delta specs al estilo OpenSpec y el problema de `funcional.md` huérfano (nadie lo escribe) — anotados en el roadmap.
  - Recortar `sdd-start-task` (ítem 3 del roadmap, con ciclo propio).
  - Crear skills nuevas o un prefijo de carpeta nuevo.

## 3. Decisión clave

- **Opción elegida**: **modo del carril task**, no carril nuevo. Misma carpeta `task-`, mismas skills `sdd-start-task` / `sdd-end-task`, mismo cierre. Lo único que cambia es la profundidad de los artefactos.

  Por qué: no añade skills a un kit que ya arrastra deuda de longitud, no toca el naming que fija el Art. IV, y mantiene un solo punto de entrada — el enrutado del paso 2, donde la decisión ya vive.

- **Alternativas descartadas**:
  - *Carril propio con par `sdd-start-light` / `sdd-end-light`*: simétrico con task/patch/release y coherente con el glosario, pero cuesta dos skills nuevas, dos pares RED/GREEN y un prefijo de carpeta nuevo → cambio de convención del Art. IV.
  - *Generalizar el carril patch para cambios pequeños que no son bugs*: reaprovecha skills y plantilla, pero `patch.md` está estructurado alrededor de síntoma y causa raíz, que una feature pequeña no tiene. Rehacerlo desdibuja un carril que hoy funciona.
  - *Enrutar `bounded` directamente al carril patch* (intuición inicial): descartada por asimetría. `bounded` incluye features ("a new flag, a small endpoint") y admite preguntas de clarificación; `patch` exige bug y determinismo sin interpretación de requisitos. `bounded` contiene a `patch`, no equivale. Enrutarlo así metería features en un carril sin spec ni plan.

- **Refinamiento brownfield**: se respeta la estructura de las skills existentes (overview → gates → predicados → red flags). No se reordenan secciones ni se reescribe lo que no falla.

## 4. Especificación funcional

### 4.1 El predicado del modo lite

Una task **puede** ir en modo lite si cumple **todas** estas condiciones, comprobables sin criterio personal:

- El flujo a modificar ya existe en el repo y se puede leer.
- No cambia contratos públicos (API, interfaces que consume otro módulo).
- No toca schema de datos ni exige migración.
- Cabe en un solo módulo o área.
- Si existe `.docs/sdd/estimation.md`: la estimación es ≤ media jornada.

Cumplirlas **habilita** el modo; no lo activa. El agente propone el modo lite nombrando las condiciones que ha comprobado, y **espera la confirmación explícita del usuario** antes de omitir el `plan.md`.

### 4.2 Ratchet de una vía

Si durante la implementación cae cualquier condición del predicado, la task **sube** a modo completo: se detiene, se dice, y se escribe el `plan.md` que faltaba con su gate. Nunca al revés: una task completa no se degrada a lite a mitad de camino, ni siquiera si resultó más fácil de lo previsto.

### 4.3 Override sobre la clasificación de brainstorming

Fila nueva en la tabla "Overrides sobre superpowers" de `sdd-start-task`:

> **La clasificación de `brainstorming` no gobierna los artefactos del kit.** Se usa para explorar intención y requisitos; qué artefactos se escriben lo decide el modo del carril. Su rama `bounded` — *"no spec file, no implementation plan document"* — no aplica: en el kit toda task tiene `spec.md` y su gate de aprobación, en los dos modos.

Formulado sobre el efecto (qué artefactos manda el kit) y no sobre los nombres de los caminos de superpowers, para que sobreviva a que la dependencia los renombre.

### 4.4 Artefactos por modo

| Artefacto | Modo completo | Modo lite |
| --- | --- | --- |
| Carpeta `<ts>-task-<id>-<slug>` | ✅ | ✅ |
| `spec.md` + gate de aprobación | ✅ completa | ✅ corta |
| `plan.md` + gate de aprobación | ✅ | ❌ |
| Bloque de estimación | en `plan.md` | en `spec.md` |
| `tasks.md` | si el plan tiene >1 task | ❌ |
| Smoke ejecutado y documentado | ✅ | ✅ |
| `walkthrough.md` con tiempo real | ✅ | ✅ |

El cierre se conserva íntegro en lite: el walkthrough es el cierre inmutable que alimenta docs vivos, skills y estimation-log. Y el bloque de estimación se muda a la spec para que el `estimation-log` no pierda precisamente las tasks pequeñas, que son las que mejor lo calibran.

### 4.5 Secciones de la spec en modo lite

`spec-template.md` gana marcadores de modo por sección. En lite se conservan: Contexto, Objetivo, Decisión clave, Especificación funcional, Estimación y esfuerzo (mudado desde el plan) y Aprobaciones. Se omiten: Datos, UX, Constraints técnicos, Riesgos, Rollout y Open questions — sus disparadores (schema, contratos, migración) son justamente las condiciones que el predicado excluye.

Plantilla única con marcadores, no un `spec-lite-template.md` aparte: duplicar la plantilla es deriva garantizada y contradice el Art. VIII en su espíritu.

### 4.6 Detección del modo en el cierre

Marca explícita `mode: lite | full` en el frontmatter de `spec.md`. `sdd-end-task` la lee y adapta el cierre: en lite no reclama `plan.md` ni `tasks.md`.

No se detecta por ausencia de `plan.md`: un predicado negativo confunde "es una task lite" con "alguien olvidó escribir el plan", y el Art. II pide predicados observables, no inferencias.

### 4.7 Flujos alternativos

- **El usuario no confirma el modo lite**: la task sigue en modo completo. El silencio no habilita el atajo.
- **El agente propone lite sobre algo que no cumple el predicado**: la guidance nombra las condiciones una a una; proponer lite obliga a citarlas, y una condición incumplida bloquea la propuesta.
- **Presión de calendario**: no es una condición del predicado. Entra en la tabla de racionalizaciones.
- **La task lite crece**: ratchet (§4.2).

## 5. Datos

No aplica. El kit es Markdown sin código ejecutable ni persistencia.

## 6. UX

No aplica.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] **Art. I — Ley de hierro de skills**: se toca `sdd-start-task`, `sdd-end-task` y `sdd-templates` → ciclo RED→GREEN documentado en `tests/`, obligatorio antes de dar por buena la guidance.
- [x] **Art. II — La forma sigue al fallo**: el fallo es de disciplina (el agente conoce los gates y los salta bajo la presión de una clasificación externa) → prohibición + tabla de racionalizaciones + red flags. El modo lite es comportamiento condicional → predicado observable (§4.1), nunca cláusula de excepción.
- [x] **Art. III — Idioma**: castellano con ortografía correcta; nombres de fichero en inglés kebab-case.
- [x] **Art. IV — Convenciones**: **no se cambia ninguna**. El naming `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>` queda intacto: lite es un modo de `task-`, no un prefijo nuevo. Por eso esta task no requiere revisión de las 9 skills.
- [x] **Art. V — Versionado**: bump en `.claude-plugin/plugin.json` + entrada de changelog en el cierre.
- [x] **Art. VII — Dogfooding**: esta spec es el dogfooding.
- [x] **Art. VIII — Fuente única de plantillas**: plantilla única con marcadores (§4.5); no se crea `spec-lite-template.md`.

### 7.2 Dependencias

- superpowers ≥ 6.3.0 en el entorno del consumidor. La guidance se escribe contra el comportamiento de esa versión, pero formulada sobre efectos y no sobre nombres de caminos (§4.3).
- Ninguna dependencia nueva.

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El modo lite se convierte en la vía de escape por defecto | Media | Alto — degrada el kit entero | Predicado con condiciones comprobables + confirmación del usuario + escenario de presión en el GREEN |
| `sdd-start-task` crece aún más (ya en deuda por longitud) | Alta | Medio | Se acepta y se anota en el roadmap; el ítem 3 recortará con ciclo propio |
| superpowers vuelve a cambiar `brainstorming` | Media | Medio | El override se formula sobre qué artefactos manda el kit, no sobre los nombres de sus caminos |
| El RED sale limpio en algún escenario | Media | Bajo | Art. I: recorta el alcance, no se escribe guidance que no repara un fallo |

## 9. Rollout

Directo: cambio de contenido en skills y plantillas. Llega a los consumidores en la siguiente release del plugin. Sigue vigente el bloqueo del ítem 1 del roadmap — sin remoto configurado, ninguna release se distribuye realmente.

## 10. Open questions

Ninguna abierta. Las cuatro decisiones de diseño (descomposición, forma, predicado, cierre) se resolvieron con el usuario durante el brainstorming del 2026-09-02.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-02 | aprobada |
