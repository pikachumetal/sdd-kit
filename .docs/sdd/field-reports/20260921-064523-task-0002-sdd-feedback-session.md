---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 20260921-064523-task-0002-sdd-feedback-session
task: 0002
mode: full
date: 2026-09-21
---

<!-- Generado el 2026-09-21 con sdd-feedback como smoke de la task 0002, en esta misma sesión: primer ticket que el kit se escribe a sí mismo. Copia literal de .docs/sdd/kit-feedback/. -->

# Ticket para el kit — task 0002: los tests RED del hilo chocan con un pre-commit que exige la suite en verde

## Contexto

- Carril y modo: task full, tres tasks (RED en línea, implementación por subagente, GREEN en línea). El dev-lead delegó el método («intenta ser lo más autónomo posible») y pidió verse antes de `sdd-end-task`.
- Skills del kit usadas: `sdd-start-task` (pasos 1–7), `sdd-templates` (spec, plan), `sdd-feedback` (este ticket, como smoke de la task). De superpowers: `brainstorming`.
- Proyecto: el propio kit — skills en markdown, suite Pester con hook de pre-commit que la ejecuta entera, un dev-lead.
- Modelo del hilo: Opus 5. Subagentes: Sonnet (revisor de spec, constructor de fixtures, implementador, revisor de task). Sujetos headless: Sonnet.
- Coste en reloj: ~2 h de agente, en dos sesiones (noche y mañana, con la máquina apagada en medio); aproximado, sin marcas de inicio exactas.
- Coste en tokens: subagentes 448k (revisor de spec 88k, constructor 92k, implementador 130k, revisor de task 138k); hilo principal no medido. Sujetos headless: 12,03 $ (RED 6,45 $ con ocho sujetos, GREEN 5,58 $ con seis).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. «Escribe los tests RED y commitéalos» no se puede cumplir con un pre-commit que corre la suite

- **Qué pasó**: el paso 6 manda al hilo escribir los tests de los THEN «en RED» y commitearlos antes de despachar. En este repo el hook de pre-commit ejecuta la suite entera y rechaza cualquier commit con un test en rojo. Los tests RED se escribieron, se vio que fallaban por el símbolo ausente (10 de 10) y no se pudieron commitear. Solución improvisada: aparcarlos fuera de `tests/`, en la carpeta de la spec, y pedir al implementador que los moviera con `git mv` y los commiteara junto con la implementación.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6 («… en RED por compilación o por fallo— y los commitea»).
- **Por qué el kit no lo evitó**: el paso asume que un test en rojo se puede commitear. No contempla el gate de commit del propio proyecto, que es justo lo que un proyecto con disciplina de tests suele tener. Tampoco dice si los tests RED pueden ir en el mismo commit que la implementación sin romper el contrato («de otra mano, antes del despacho»). Es la misma familia que el hallazgo del runner que compila la suite como una unidad (task 0007 de la release).
- **Coste**: un ruling improvisado, un paso extra en el encargo y un checkpoint que obligó a mover el fichero para poder commitear la evidencia del RED.
- **Propuesta**: que el paso 6 diga qué cuenta como «commiteados» cuando un hook lo impide: el contrato es que el fichero exista, escrito por el hilo, antes del despacho, en una ruta que el encargo nombra; el commit puede ir con la implementación si el proyecto rechaza tests en rojo. Nunca `--no-verify`.
- **Criterio de aceptación**: GIVEN un proyecto con pre-commit que ejecuta la suite, WHEN el hilo escribe los tests RED de una task, THEN el encargo del implementador nombra su ruta como contrato, los tests llegan intactos al commit de la implementación y nadie usa `--no-verify`. RED que hoy falla: sin la regla, el agente tiene que elegir entre saltarse el hook e incumplir «los commitea».

### 2. En modo lite no hay de dónde sacar las «Restricciones globales» de los encargos

- **Qué pasó**: lo destapó un sujeto del RED, no esta sesión: al auditar una task lite señaló que el paso 6 y `encargo-revision.md` mandan copiar el bloque «Restricciones globales» de `plan.md` en cada encargo, y en lite no hay `plan.md` ni `spec-template.md` tiene ese bloque.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6; `skills/sdd-start-task/references/encargo-revision.md`; `skills/sdd-templates/templates/spec-template.md`.
- **Por qué el kit no lo evitó**: el modo lite suprime el plan, pero las reglas del despacho siguen apuntando a él.
- **Coste**: no observado en esta sesión; un encargo lite sale sin el artículo de calidad de código, que es lo que el bloque existe para evitar.
- **Propuesta**: en lite, el bloque se construye desde la constitution (artículo de calidad de código y política de modelos), o `spec-template.md` gana un bloque opcional para lite.
- **Criterio de aceptación**: GIVEN una task lite que despacha un implementador, WHEN se construye el encargo, THEN su primera sección es «Restricciones globales» con el artículo de calidad de código literal.

### 3. El effort no se puede fijar al despachar

- **Qué pasó**: el plan declaró «Sonnet, effort high» para el implementador y «effort medium» para los revisores, como exige la constitution. El tool de despacho solo admite el modelo; el encargo tuvo que decirle al implementador el effort en prosa.
- **Dónde en el kit**: `.docs/sdd/constitution.md` Art. IV (política de modelos) y el campo `Modelo` de `skills/sdd-templates/templates/plan-template.md`.
- **Por qué el kit no lo evitó**: ya reportado dos veces y asignado a la task 0005 de esta release; se anota como tercera ocurrencia, no como hallazgo nuevo.
- **Coste**: ninguno medible; el valor que el plan declara no llega al subagente.
- **Propuesta**: la de la task 0005.
- **Criterio de aceptación**: el de la task 0005.

## Lo que hice por iniciativa propia

- **Versionar las fixtures y los artefactos de los sujetos dentro de la carpeta de la spec** (`evidencia-red/`, `evidencia-green/`): moldes, lanzadores, los tickets que escribió cada sujeto y el `git status` de cada run. `tech-stack.md` dice lo contrario: que las fixtures de las campañas son desechables y no se versionan. Funcionó: el dev-lead tuvo que apagar la máquina a mitad del RED y la campaña se retomó por la mañana sin reconstruir nada; además, cada veredicto de `tests/kit-feedback-*.md` cita un fichero que se puede abrir. Candidato a regla: versionar al menos el molde y lo que produjo cada sujeto, que pesa poco (121 KB aquí) y es lo único que permite auditar la narrativa.
- **Un subagente constructor para las fixtures**, sin que el plan lo previera: lo recoge `tech-stack.md` para reconstruir fixtures antiguas, y aquí sirvió para construirlas de cero sin gastar contexto del hilo.

## Funcionó, no tocar

- **La review de spec con un revisor de dominio** (`skills/sdd-start-task/references/review-spec.md`): 88k tokens, 8 hallazgos y 6 aceptados. Cazó que el nombre del ticket incumplía el naming del Art. IV, y el rechazo del `MODIFIED` que proponía quedó escrito con su motivo en la spec.
- **El Art. I recortando el alcance**: dos de las cuatro reglas que la spec atribuía a la skill no se escribieron porque el baseline ya las cumplía, y el GREEN confirmó que la plantilla sola las sostiene.
- **El gate de validación separado del cierre** (paso 7): el dev-lead pidió por su cuenta «vernos antes del end-task», que es exactamente lo que el paso ya garantiza.
- **Dos niveles en el plan**: «Decisiones que he tomado yo» con el coste arriba permitió al dev-lead aprobar el gasto de las campañas con una sola pregunta.

## Errores míos, no huecos del kit

- El molde de «sesión limpia» del RED salió con el árbol contradiciendo su bitácora; el primer E3 no valió y costó dos sujetos más (~1,1 $). Fue un fallo al revisar la fixture del constructor, no una regla del kit que faltara: `tech-stack.md` ya pide verificar las fixtures en disco.
- El encargo del implementador pedía enlazar la plantilla «como hacen las demás skills», y ninguna lo hace así: salió un enlace relativo entre skills que tuve que corregir después.
- El lanzador de sujetos creaba siempre la rama `feature/0007`, también en el molde de la task 0004; un sujeto lo detectó como discrepancia. Corregido antes del GREEN.
