---
id: 20260920-220741-task-0002-sdd-feedback
task: 0002
title: Walkthrough — Skill sdd-feedback
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-21
---

# Walkthrough — Skill `sdd-feedback`

## 1. Cambios realizados

- **Skill nueva `skills/sdd-feedback/SKILL.md`** (`9c387da`, `d5b30bd`): cinco pasos (versiones → recorrer la sesión → calcar la plantilla → guardar en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md` → repaso de privacidad) y cuatro reglas, cada una con su fallo 2/2 en el RED: privacidad con descriptor genérico y sin omitir el hallazgo, criterio de aceptación por hallazgo, iniciativa propia en su sección y ruta del hallazgo siempre del kit. Sin tabla de racionalizaciones: el RED registró fallos de forma, no racionalizaciones (Art. II).
- **Plantilla `skills/sdd-templates/templates/kit-feedback-template.md`** (`9c387da`, `d5b30bd`, `521c019`): cabecera cosechable (versiones, carril, id compuesto + `task:`), contexto con «no medido» como valor válido, hallazgos con seis campos fijos, salida «Sin hallazgos» explícita, y las secciones de iniciativa propia, «Funcionó, no tocar» y errores propios.
- **Oferta en los cierres** (`9c387da`, `d5b30bd`): paso 11 de `sdd-end-task` y paso 7 de `sdd-end-patch`. No es un gate y no se repite si la sesión ya tiene ticket.
- **Índices**: fila en `sdd-templates/SKILL.md` y en el catálogo del README, que pasa a «13 plantillas canónicas».
- **Evidencia**: `tests/kit-feedback-red.md` (`ea3908c`, `a57c973`, `ddafe35`), `tests/kit-feedback-green.md` (`49ee2e8`), `tests/KitFeedback.Tests.ps1` (10 aserciones), y moldes, lanzadores y artefactos de los 14 sujetos en `evidencia-red/` y `evidencia-green/`.
- **Capacidad nueva `kit-feedback`** en `.docs/sdd/capabilities/`, fusionada en este cierre.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 1,3h de implementación (00:13 → 00:38 la primera noche; ~08:00 → 08:55 la mañana siguiente, con la máquina apagada en medio) + 0,3h de spec y plan = **1,6h en total**, aproximado por las marcas de los commits
- Desviación: −1,2h (−48%) sobre la implementación
- Causa de la desviación: la misma que en la task 0001. Los 14 sujetos corrieron **en paralelo y en segundo plano**, tres por oleada, y sus 5–10 minutos no suman al reloj del hilo; la implementación fueron cuatro ficheros markdown. Lo que sí costó reloj: rehacer el molde de sesión limpia y repetir E3 (~15 min) y el checkpoint forzado por el apagado (~10 min).
- Review de spec: 1 revisor (dominio) · hallazgos 8, aceptados 6
- Coste de subagentes: 448k tokens en 4 despachos (revisor de spec 88k, constructor de fixtures 92k, implementador 130k, revisor de task 138k) más 12,03 $ en 14 sujetos headless (RED 6,45 $ con ocho sujetos, GREEN 5,58 $ con seis). Reloj del hilo: **no medido** con contador.

## 3. Desviaciones del plan

- **Tests RED sin commitear antes del despacho.** El pre-commit del repo corre la suite entera y rechaza un test en rojo. Ruling: `KitFeedback.Tests.ps1` se aparcó en la carpeta de la spec y el implementador lo movió a `tests/` con `git mv` en el commit de la implementación. El contrato se mantuvo: escritos por el hilo y sin tocar por el implementador.
- **Ocho sujetos en el RED, no seis.** El primer molde de «sesión limpia» tenía el árbol contradiciendo su bitácora y E3 se repitió con un molde coherente.
- **Dos reglas recortadas** (Art. I): no inventar fricciones y separar los errores propios de los huecos del kit ya los cumplía el baseline 2/2. Quedan como forma de la plantilla, no como guidance; lo registra la sección «Enmiendas» de la spec, sin cambio de comportamiento observable.
- **Sin fila de racionalización en los cierres**, aunque el Step 4 del plan la pedía: el RED no registró ninguna racionalización y el Art. II manda un paso para un fallo de forma. El revisor de task la reclamó y se rechazó con ese motivo; el GREEN confirma que el paso solo basta (2/2).
- **Idioma del slug** enmendado tras el GREEN: sigue la convención de las carpetas de spec en vez de fijar el inglés, que es una decisión de la task 0016.
- **`tasks.md` creado en el cierre**, no antes de implementar (ver su nota).
- **Fixtures versionadas** dentro de la carpeta de la spec, contra lo que decía `tech-stack.md`: permitió apagar a mitad de campaña y retomar sin reconstruir.
- **Un subagente constructor de fixtures** que el plan no preveía.
- **Sin revisor final de rama**, como decidió el plan. Los dos fixes en línea posteriores a la implementación: `d5b30bd` lo cubrió el revisor de task; `521c019` son dos líneas de cabecera de plantilla que pidió ese mismo revisor.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester tests` (desde el pre-commit de `49ee2e8`): **202 passed, 0 failed, 6 skipped**. Los 10 tests de `KitFeedback.Tests.ps1`, en rojo por símbolo ausente antes de la implementación (10/10) y en verde después.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-21 · leyó el ticket del smoke (fila 5) y lo dio por bueno como ticket real. No probó la oferta del cierre en un proyecto propio: esa parte queda verificada solo por los sujetos del GREEN.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | El cierre ofrece el ticket en la misma sesión, sin gate (delta: «El cierre de una task y el de un patch ofrecen el ticket») | Verificado: GREEN E1, 2/2 (`evidencia-green/tickets/E1-offers.md`); RED 0/2 |
| 2 | El ticket vive en `.docs/sdd/kit-feedback/` con el nombre fijo (delta: «El ticket de mejora del kit vive en…») | Verificado: GREEN E2 + E3, 4/4; RED 0/4 |
| 3 | No lleva el dominio del cliente (delta: «El ticket no lleva el dominio del cliente») | Verificado: GREEN E2, 0 nombres en 2/2; RED 2/2 filtraban, uno con el nombre de una persona |
| 4 | Escrito para un agente: criterio de aceptación por hallazgo y cabecera con versiones (delta: «El ticket se escribe para un agente») | Verificado: 6 de 6 hallazgos con criterio; RED 0 de 7 |
| 5 | «Sin hallazgos» como salida válida (delta: «"Sin hallazgos" es una salida válida») | Verificado: GREEN E3, 2/2 escriben «Sin hallazgos» literal con la plantilla puesta |
| 6 | Separa el hueco del kit del error del ejecutor (delta: «El hallazgo separa…») | Verificado: 4/4 con sección de errores propios; en E2 el error del ejecutor cae ahí sin propuesta |
| 7 | Smoke real: la skill genera el ticket de esta misma sesión | Verificado: 3 hallazgos con criterio, 0 nombres de proyecto o cliente; movido a `field-reports/` como primer ticket que el kit se escribe a sí mismo |

### 4.3 Residuales / deuda generada

- **El paso 6 de `sdd-start-task` no se puede cumplir con un pre-commit que exige la suite en verde** → alcance de la **task 0007** (decisión del dev-lead, 2026-09-21: no se deja como deuda).
- **En modo lite no hay fuente para las «Restricciones globales»** de los encargos (lo destapó un sujeto del RED) → alcance de la **task 0005** (misma decisión).
- **El effort no se puede fijar al despachar**: tercera ocurrencia, ya en la task 0005.
- Riesgo asumido en la spec: la oferta de los cierres vive en `kit-feedback.md`, no en `task-flow.md`; quien lea solo `task-flow.md` no la ve. Lo recoge la task 0003, que reorganiza dónde viven estas reglas.

## 5. Aprendizajes

- **Una fixture que describe una sesión ya pasada tiene que dejar el árbol en el estado que la bitácora dice.** Si no, un sujeto competente audita la contradicción y el resultado parece invención sin serlo; aquí costó repetir E3. → `tech-stack.md` §Fixtures y baselines.
- **Versionar el molde y lo que produjo cada sujeto** dentro de la carpeta de la spec: pesa poco (~150 KB aquí), sobrevive a un apagado y deja cada veredicto de `tests/*.md` apuntando a un fichero que se puede abrir. Sustituye a la regla anterior («las fixtures no se versionan»). → `tech-stack.md` §Cómo se testean las skills y `architecture.md` §Anatomía de la evidencia.
- **Un pre-commit que corre la suite impide commitear tests en rojo**: en este repo, los tests del hilo se aparcan fuera de `tests/` hasta el commit de la implementación. → `tech-stack.md` §Cómo se testean las skills; la regla general del kit va a la task 0007.
- **Un recorte del Art. I puede dejar la regla como forma de la plantilla en vez de borrarla**: cuando el baseline escribía sin plantilla y la plantilla introduce la presión (huecos fijos para hallazgos), el contrapeso va en la propia plantilla, y el GREEN tiene que comprobar que funciona. → `tech-stack.md` §Fixtures y baselines.
- **La skill nueva sube el recuento del kit a 12 skills.** → `CLAUDE.md`, `mission.md` y `architecture.md`.
