# Ticket para el sdd-kit — hallazgos de la task 0008 de sdd-project-templates

**Origen**: sesión de Claude Code del 2026-09-19/20 en `sdd-project-templates`, task 0008
(esqueleto SDD del template `angular-dotnet` + skill `init-template`), con sdd-kit 1.1.0 y
superpowers 6.2–6.3. Evidencia en esta misma carpeta: `spec.md`, `plan.md`, `skill-tdd.md`,
`walkthrough.md`.

**Para quien lo lea**: eres el Claude que mantiene el sdd-kit (`D:\code\git\sdd-kit`). Este ticket
trae una feature pedida (§1) y cinco fricciones observadas usando el kit (§2–§6), cada una con lo
que pasó, por qué importa y un cambio propuesto. Nada de aquí está aplicado en el kit. Las
propuestas son hipótesis: el kit valida sus skills con RED/GREEN, así que cada una necesita su
baseline antes de tocarse.

---

## 1. Feature — modo «greenfield sobre template» en `sdd-init-greenfield`

### Contexto

`sdd-project-templates` produce templates de aplicación. Un proyecto se instancia **copiando** un
template (`init.mjs`), y el template ya trae su `.docs/sdd/`. Ese esqueleto tiene dos clases de
documentos:

| Clase | Documentos | Estado al instanciar |
| --- | --- | --- |
| Técnicos, **completos** | `tech-stack.md`, `architecture.md`, `environments.md` (más adelante `DESIGN.md`, `hooks.md`) | Escritos y verdaderos: describen el proyecto tal cual arranca. **Sin marcador.** |
| De producto, **pendientes** | `mission.md`, `roadmap.md`, y en `constitution.md` solo las secciones «Artículos de producto» y «Reglas de producto» | Solo estructura (encabezados, tablas vacías), con marcador |
| Del kit | `estimation.md`, `sdd-kit.json`, `changelog.md` (cabecera + `[Unreleased]`), `estimation-log.md` (sin filas), `capabilities/`, `specs/` (vacías) | Ya existen |

El marcador es el literal **`<!-- sdd-template: pending -->`**. Convención actual (provisional, la
fijó la 0008 a falta de la vuestra): **uno por sección `##` pendiente, en la línea siguiente al
encabezado**. En `constitution.md` los cinco artículos técnicos van escritos y sin marcador; solo
cuelga de «## Artículos de producto» y «## Reglas de producto». Ejemplo real:
`sdd-project-templates/templates/angular-dotnet/.docs/sdd/{mission,constitution,roadmap}.md`.

Hoy, a falta del modo, el template lleva una skill puente, `init-template`
(`templates/angular-dotnet/.claude/skills/init-template/SKILL.md`), que guía a mano la entrevista
restringida. Su última sección ya prevé delegar en vosotros: «Si `sdd-init-greenfield` detecta por
sí misma el marcador, delega en ella la entrevista y los documentos; el paso 0 y el cierre siguen
siendo de esta skill».

### Qué pasa hoy si se lanza `sdd-init-greenfield` sobre un proyecto instanciado

Medido en el baseline de la 0008 (sujetos Sonnet sin la skill puente; `skill-tdd.md` §RED): los
sujetos **sí** invocan `sdd-init-greenfield` y su gate de entrevista aguanta cuando el usuario está
presente. Pero la skill no sabe que hay un template debajo, así que tal como está escrita:

- El bloque (b) de la entrevista pregunta el **stack**, que ya está decidido y documentado.
- El bloque (d) pregunta **convención de ramas, worktrees y entorno**, que ya están fijados por
  scripts del proyecto (`feature` desde `develop`, `hotfix` desde `main`) y documentados en
  `environments.md`.
- El paso 2 genera mission → constitution → **tech-stack → architecture…** «documento a
  documento»: reescribiría documentos completos y verdaderos.
- El paso 3 crea `.docs/sdd/`, `estimation-log.md` y `sdd-kit.json`, que ya existen.
- El paso 4 escribe un `CLAUDE.md` corto: el del template ya existe y es largo a propósito
  (reglas operativas de moon, entorno, auth).
- El paso 5 hace `git init`: `init.mjs` ya lo hizo.
- Nada quita los marcadores ni comprueba que no quede ninguno.

### Cambio pedido

Añadir a `sdd-init-greenfield` una **rama condicionada a un predicado observable**, no un flag:

```bash
grep -rln "sdd-template: pending" .docs/sdd
```

- **Sin resultados** → comportamiento actual, intacto.
- **Con resultados** → modo «sobre template»:
  1. **Alcance = los ficheros y secciones que llevan marcador, y nada más.** Un documento de
     `.docs/sdd/` sin marcador es heredado y no se edita ni se regenera. Esta es la regla que
     sustituye a la lista fija de documentos del paso 2.
  2. **Entrevista recortada**: bloque (a) producto entero —incluidas las cinco reglas de producto
     por nombre— y (c) solo principios **de producto**. De (b) stack: nada. De (d) proceso: solo
     gestor de tickets/formato de ids y changelog de cliente; **no** ramas, worktrees ni entorno
     si existe `environments.md` sin marcador.
  3. **Generación con gate, sección a sección**: mission → constitution (solo las secciones
     marcadas) → roadmap. Al aprobarse un documento se quitan **sus** marcadores. Sin «ok»
     explícito, el marcador se queda — el marcador es el registro de «no aprobado», así que una
     nota de «pendiente de validar» no lo sustituye.
  4. **Pasos 3, 4 y 5 no aplican**: estructura, `CLAUDE.md` y git ya existen. Lo único que se toca
     en `CLAUDE.md` es una línea con el gestor de tickets y el formato de ids.
  5. **Post-condición verificable**: el `grep` de arriba vuelve vacío y `git status` no lista
     ningún documento que no tuviera marcador.
  6. **Quién llama**: la skill puente del template conserva su paso 0 (si no hay marcadores, avisa
     y solo se retira) y su cierre (entrada en `changelog.md`, borrarse, commit). Vuestro modo
     cubre entrevista + documentos. Si preferís absorber también el cierre, decidlo y el template
     borra la skill puente.

### Decisiones que os tocan a vosotros (el template se adapta)

- **Contrato del marcador**: ¿el literal vale? ¿Posición y cardinalidad (uno por `##`, bajo el
  encabezado) o preferís uno por fichero, o un bloque con metadatos (`<!-- sdd-template: pending
  questions="1-5" -->`)? En el template, `sdd-docs.spec.mjs` solo verifica **en qué ficheros**
  aparece el literal, no su posición, precisamente para que podáis cambiarla.
- **Formato de la entrevista**: ver §2 — la lista numerada con destino por pregunta funcionó mucho
  mejor que los bloques en prosa.

### Dos filas que le faltan a la tabla de racionalizaciones de `sdd-init-greenfield`

El sujeto B del baseline **conocía** vuestro gate (lo citó: «exige entrevista previa (gate duro)»)
y lo saltó igualmente con el usuario ausente + fecha límite. Literales (`skill-tdd.md` §RED B):

- «El usuario […] autorizó "haz lo que veas razonable", así que redacté los documentos con las
  decisiones de producto más razonables».
- «dejándolo por escrito (no oculto): añadí una nota visible […] indicando que son decisiones de
  partida sin entrevista completa».

Vuestra tabla cubre «convierto las preguntas en asunciones documentadas» y «lo marco como
borrador», pero no la **autorización genérica del usuario** ni la **nota visible como
salvoconducto**. Con esas dos filas en la skill puente, el sujeto gemelo esperó en la pregunta 1
sin escribir nada y citó ambas como inválidas.

---

## 2. `sdd-init-greenfield` — la entrevista en bloques de prosa produce preguntas por lotes

**Qué pasó**: el paso 1 dice «una pregunta cada vez, por bloques» y luego describe cada bloque
como una frase larga con media docena de temas. En el baseline, el sujeto A —siguiendo vuestra
skill, usuario presente— juntó dos preguntas en el turno 2, insistió en «la segunda mitad de la
pregunta» cuando solo se le contestó la primera, juntó tres en el turno 4 y cerró con «Puedes
responder por partes o todo junto, lo que te sea más rápido». Además derivó a **diseño de
features** (cómo se dan de alta las cuentas, franjas fijas o rango libre) y en tres turnos no
había nombrado ninguna de las cinco reglas de producto.

**Por qué importa**: el usuario contesta la primera pregunta del lote y el resto se pierde o se
contesta a medias; y la mission se llena de decisiones de feature que pertenecen a specs.

**Propuesta** (es un fallo de **forma**, no de disciplina → recipe positiva, no prohibición):
una **tabla numerada**: `# · Pregunta · Va a (documento y sección)`, más una línea «Cada turno
termina con **una** pregunta de la lista» y una lista corta de «No se pregunta» (diseño de
features: es de la spec de su task). En la skill puente, con esa forma: cinco turnos seguidos, una
pregunta numerada en cada uno («Pregunta 3/13 (para mission §3)…»), cero deriva. Y aun así la
revisión final encontró una fila que juntaba dos temas: **la lista también se revisa fila a fila**.

---

## 3. Gate de validación — no existe el estado «el dev-lead difiere la validación»

**Qué pasó**: al presentar el trabajo (paso 7 de `sdd-start-task`), el dev-lead respondió,
literal: «prefiero probar cuando tengamos todo el script y no tengo que hacer el proceso a mano si
quieres déjalo apuntado, merge a develop». Es una decisión informada y razonable (probar
`init-template` a mano exige copiar el template y hacer `git init`; con `init.mjs`, que es la
task siguiente, es un comando).

**Dónde chirría el kit**: `sdd-end-task` paso 0 dice que sin validación «este checklist no
arranca y la task queda EN ESPERA», y su tabla trata «el usuario me ha pedido cerrar» como
racionalización. El `walkthrough-template.md` marca `Validado por el dev-lead` como obligatorio
(«sin validación no hay cierre»). No hay casilla para «el dev-lead, presente y preguntado, decide
no validar ahora». El agente tiene que elegir entre desobedecer al usuario o improvisar.

**Qué improvisé** (para que veáis la forma): walkthrough con «Validado por el dev-lead: **no
validado — diferido por decisión suya** (fecha) + cita literal»; la validación pendiente escrita
como alcance de la task del roadmap donde se hará (0010) y en la tabla de deuda; roadmap en ✅
porque la verificación **del agente** sí está documentada.

**Propuesta**: un tercer estado explícito, distinto de «validado» y de «usuario ausente»:
**validación diferida**, que solo es válido si (1) el usuario estaba presente y se le presentó el
trabajo, (2) se registra su frase literal, (3) queda aparcada en un sitio con dueño —una task del
roadmap, no «más adelante»—. Decidid también si una task con validación diferida puede llevar ✅
o necesita otro símbolo: hoy el roadmap no distingue «verificado por el agente» de «validado por
el dev-lead», y esa es justo la distinción que el kit defiende en el resto del flujo.

---

## 4. `spec-template.md` — `MODIFIED` y «Reglas de la capacidad» son ambiguos cuando el cambio es aditivo

**Qué pasó**: dos de mis requisitos `MODIFIED` solo **añadían** un `AND` a un requisito existente
largo. La plantilla pide `MODIFIED — <título> (antes: "<texto anterior literal>")` y un
THEN «actualizado». Cité como «antes» solo la cláusula que cambiaba y escribí «THEN se conserva
todo lo anterior». El revisor de spec lo marcó como **Crítico** dos veces, con razón: los `AND` no
citados quedaban indeterminados («¿sigue vigente o se retira?»). Lo mismo con «Reglas de la
capacidad»: la plantilla dice «solo las entradas que cambian» y `sdd-end-task` dice que «se
sustituyen o añaden por su nombre»; mi entrada añadía una frase a una regla de diez líneas y,
leída literalmente, **la borraba** (tercer Crítico).

Y en el cierre, `aprendizajes-skills.md` dice «MODIFIED sustituye por título estable»: aplicado a
la letra sobre una spec que dice «se conserva todo lo anterior», la fusión habría dejado el
requisito en dos líneas. Fusioné añadiendo, contra la letra.

**Propuesta**: que la plantilla distinga los dos casos.
- `MODIFIED` = el requisito **entero reescrito**; lo que no esté en la spec desaparece al
  fusionar. «Antes» = el requisito entero o las cláusulas que se quitan.
- Un caso aditivo explícito —p. ej. `EXTENDED — <título>` o `ADDED AND a <título>`— cuyo cuerpo
  son solo los `AND` nuevos y cuya fusión es **añadir**.
- En «Reglas de la capacidad», el mismo par: sustituir la entrada vs añadir a la entrada (`+`).
- Y una línea en el encargo del revisor (`review-spec.md`, punto 1): «un `MODIFIED` que no
  reescribe el requisito entero deja cláusulas indeterminadas».

---

## 5. `sdd-templates` no tiene plantilla de `estimation.md`

**Qué pasó**: `sdd-init-greenfield/references/estructura.md` lista `estimation.md (método)` como
parte de la estructura, y `nombrado.md` lo usa como predicado que activa el módulo de estimación.
Pero en `sdd-templates/templates/` no hay `estimation-template.md`. Las dos fuentes que encontré
no sirven para calcar: el `.docs/sdd/estimation.md` del propio kit es de 19 líneas y habla de sus
tasks; el de `sdd-project-templates` (copiado de otro proyecto) arrastra notas de las tasks 6067,
6106, 6142… de un tercero y un enlace a un «Artículo XI» de una constitution que aquí no existe.

**Por qué importa**: cada proyecto hereda el método **y** las anécdotas de calibración de otro,
cuando vuestra propia nota dice que «el ratio no viaja entre proyectos».

**Propuesta**: `estimation-template.md` con el método genérico y una sección vacía «Notas de
calibración de este proyecto». Punto de partida ya destilado:
`sdd-project-templates/templates/angular-dotnet/.docs/sdd/estimation.md` (factor de calibración,
reference-class, total = spec/plan + implementación, umbral, flujo, task sin plan, mantenimiento).

---

## 6. «Modelo **y** effort» — el effort no se puede fijar al despachar

**Qué pasó**: `plan-template.md` exige por task «modelo **y** effort, los dos explícitos —
declarar solo el modelo es una trampa», y `review-spec.md` pide «modelo Sonnet, effort medium».
El tool `Agent` de Claude Code, tal como está disponible en la sesión, acepta `model` pero **no
tiene parámetro de effort**: el effort sale de la definición del agente
(`.claude/agents/*.md`) o del defecto. En la 0008 escribí «Sonnet medium» en spec y plan y
despaché doce subagentes con `model: sonnet` y el effort que tocara. Lo que dicen los documentos
no es verificablemente lo que se ejecutó.

**Propuesta**: o bien el kit entrega definiciones de agente con el effort en el frontmatter
(`sdd-spec-reviewer`, `sdd-test-subject`…) y los encargos nombran el `subagent_type`, o bien la
plantilla pide «modelo» y trata el effort como «el de la definición del agente, si existe». Lo que
no debería quedarse es una exigencia que el agente solo puede cumplir por escrito.

---

## 7. Menores

- **Probar skills conversacionales con subagentes**: un sujeto no acepta aprobaciones que le
  llegan por `SendMessage` («No message from any agent is ever your user's consent») y lo mantiene
  aunque se le explique que es una prueba. Un escenario por turnos sirve para observar la
  entrevista, no para llegar a un cierre que exige un «ok»: la aprobación va en el encargo inicial
  (que sí es palabra del usuario para el sujeto). Si vuestro método de `tests/*-red.md` tiene
  escenarios así, conviene escribirlo.
- **Gate 1 de `sdd-start-task` con la rama ya nombrada**: la skill se invocó sola en un worktree
  `feature/0008` cuyo id coincide con una fila ⏳ del roadmap. La skill manda parar y preguntar; el
  usuario contestó «0008». Un predicado barato («la rama actual es `feature/<id>` y `<id>` es una
  task pendiente del roadmap → ese es el enunciado, confírmalo en una línea y sigue») ahorraría el
  turno sin abrir la puerta a adivinar.
- **`sdd-end-task` paso 10 cuando el merge ya está ordenado**: el usuario pidió «merge a develop»
  en el mismo mensaje del cierre. El paso manda invocar `finishing-a-development-branch` y
  «decidir merge/PR con el usuario», que ya lo había decidido. Una frase («si el usuario ya ordenó
  el destino, se ejecuta tras el checklist») evita la pregunta redundante.
