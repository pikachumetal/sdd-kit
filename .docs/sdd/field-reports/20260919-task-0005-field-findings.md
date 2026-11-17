# Ticket para sdd-kit — Hallazgos de campo de la task 0005 (sdd-project-template)

> Sustituye a `ticket-sdd-kit-capacidad-nueva.md`: lo incluye entero (hallazgo 1) y añade seis más.

- **Origen**: repo `D:\code\git\sdd-project-template`, task 0005 «Traducciones en BD» y patch 0000,
  sesiones del 2026-09-18 y 2026-09-19. Ejecución por `subagent-driven-development` con el dev-lead
  ausente durante la implementación; una task paralela (0004, auth) en otro worktree.
- **Artefactos para contrastar**:
  `.docs/sdd/specs/20260918-081722-task-0005-translations-db/` (`spec.md`, `plan.md`, `tasks.md`,
  `walkthrough.md`), `.docs/sdd/specs/20260919-172855-patch-0000-marcador-cleaned-ng-serve/patch.md`,
  `.docs/sdd/capabilities/{template-angular-dotnet,translations,auth}.md`. Commits en `develop`:
  merge de la 0005 `edb099a`, merge con la 0004 `0e74373`, patch `55a35fd`.
- **Alcance de este ticket**: quien lo escribe es el agente que ejecutó la task. Solo leyó las
  skills que usó (`sdd-start-task` y sus `references/`, `sdd-end-task`, `sdd-start-patch`,
  `sdd-end-patch`, `add-to-changelog`, `sdd-templates`). Son observaciones de campo, no una
  auditoría del kit. Las cifras de tokens son aproximadas (suma a ojo de los `subagent_tokens`
  de cada despacho).
- **Cómo usarlo**: cada hallazgo trae qué pasó, por qué el kit no lo evitó, propuesta y un
  escenario RED para validarla con el TDD de `writing-skills`. Están ordenados por lo que
  costaron, no por lo fáciles que son de arreglar.

## Resumen

| # | Hallazgo | Coste observado | Skills |
| --- | --- | --- | --- |
| 1 | Un dominio nuevo acabó en una capacidad «cajón de sastre» | Capacidad creada a mano al cierre, spec aprobada enmendada | `sdd-start-task`, `sdd-templates`, `sdd-end-task` |
| 2 | El kit no tiene modelo para tasks en paralelo | 12 ficheros en conflicto, orden de merge invertido sin que nadie lo viera, ~1 h de integración | `sdd-start-task`, `sdd-end-task` |
| 3 | «Verificado» no distingue suites verdes de comportamiento observado | 4 bugs reales pasaron todas las suites y 5 revisiones | `sdd-start-task` (gate 7), `sdd-end-task`, `walkthrough-template` |
| 4 | El coste de revisión no escala con la task | ~1,5 M tokens de subagente, más de la mitad en revisores; 3 hallazgos útiles | `sdd-start-task` (paso 6), `encargo-revision.md` |
| 5 | Tests RED del hilo principal que no pasan el lint | Un implementador obligado a incumplir «no los modifiques» | `sdd-start-task` (paso 6) |
| 6 | «Fuera de scope: decide con el usuario» sin usuario | Dos fixes en línea decididos por el agente | `sdd-start-task`, `overrides-superpowers.md` |
| 7 | Validación diferida y walkthrough «inmutable» | Walkthrough editado cuatro veces tras el cierre | `sdd-start-task` (gate 7), `sdd-end-task` (paso 0), `walkthrough-template` |

---

## 1. Un dominio nuevo acabó en una capacidad «cajón de sastre»

### Qué pasó

La 0005 añadía un subsistema con dominio propio: tablas `Languages`/`Translations`, dos
procedimientos, dos endpoints, el loader de Transloco y un gate de claves. Cinco requisitos `ADDED`
cohesivos, con sus cinco reglas de capacidad.

Al redactar la spec, el agente escribió como decisión 2: «No se crea capacidad nueva: el delta entra
en `template-angular-dotnet`, como 0001–0003». No lo razonó: siguió el precedente de tres tasks que
habían volcado todo en la única capacidad existente (que ya mezclaba toolchain, docker, entornos,
worktrees y migraciones). El dev-lead aprobó la spec —la decisión 2 era una línea entre 19 y no
presentaba alternativa—, los dos revisores adversariales devolvieron 15 hallazgos sin cuestionarla,
y `sdd-end-task` fusionó el delta donde la spec decía. Al cierre, el dev-lead preguntó «¿has hecho
un `capabilities/translations`?». Hubo que crearla a mano, enmendar la decisión 2 de una spec ya
aprobada y dejarlo en el walkthrough. La task paralela (0004) sí había creado `capabilities/auth.md`
con el mismo kit: el resultado depende del agente, no del proceso.

### Por qué el kit no lo evitó

1. **El paso 4 de `sdd-start-task` solo trata la capacidad en condicional**: «Si el delta crea una
   capacidad nueva […] se declara en "Decisiones a validar"». Nada obliga a *preguntarse* a qué
   capacidad pertenece el delta. La ruta de menor resistencia es reutilizar la que hay.
2. **La regla «una capacidad es un sustantivo del dominio» vive solo en `capability-template.md`**,
   que el agente abre cuando ya ha decidido crear una. Quien decide no crearla no la lee.
3. **`review-spec.md` cuenta «Capacidad nueva» como señal de complejidad**: declararla sube el
   nivel de review, no declararla lo baja. Incentivo leve, en la dirección equivocada.
4. **El encargo de los revisores no lo comprueba.** Buscan contradicciones con la verdad viva y un
   `ADDED` que en realidad sea `MODIFIED`; ninguno pregunta si el delta pertenece a la capacidad
   donde se mete, ni si esa capacidad ha dejado de ser un sustantivo.
5. **`sdd-end-task` no puede corregirlo** (y está bien: la regla 2 de `capability-template.md`
   dice que la capacidad la crea la spec), pero tampoco tiene alarma: fusionó cinco requisitos y
   cinco reglas de un dominio nuevo en una capacidad ajena sin avisar.

Agravante: en un repo de templates la primera capacidad se llamó como el template entero
(`template-angular-dotnet`). Eso es un contenedor, no un sustantivo, y en un contenedor cabe todo.

### Propuesta

- **P1.1 — Decisión de capacidad obligatoria, no condicional** (`sdd-start-task` paso 4 y
  `spec-template.md`). Una de las primeras líneas de «Decisiones que he tomado yo» es siempre:
  `Capacidad(es) del delta: <nombre> (existente | nueva) — sustantivo de dominio: <cuál> —
  alternativa descartada: <…>`. Reutilizar una existente exige la misma justificación que crear una.
- **P1.2 — Test de pertenencia en el punto de uso** (`spec-template.md` o una referencia enlazada
  desde el paso 4): «¿los títulos de los `ADDED` comparten un sustantivo que no es el nombre de la
  capacidad elegida?» y «¿el delta trae sus propias cinco reglas completas?». Dos síes → capacidad
  nueva, o motivo escrito para no crearla.
- **P1.3 — Revisor de spec, lente dominio, punto nuevo**: «Pertenencia: ¿cada `ADDED` es del
  sustantivo de su capacidad? Una capacidad que ya agrupa requisitos de tres o más dominios, o
  cuyo nombre es el del producto entero, es un hallazgo Importante».
- **P1.4 — Quitar el incentivo de la rúbrica**: «Capacidad nueva» deja de ser señal de
  complejidad, o pasa a «el delta toca o crea más de una capacidad».
- **P1.5 — Alarma en `sdd-end-task` paso 4, sin crear nada**: si el delta fusiona tres o más
  `ADDED` más entradas nuevas en las cinco reglas dentro de una capacidad existente, preguntar
  antes de fusionar. Si resulta ser propia, se enmienda la spec (decisión fechada) y se fusiona.
- **P1.6 — `sdd-init-*`**: avisar si la primera capacidad se nombra como el producto, el repo o
  el template.

### Escenario RED

Proyecto con una única capacidad de nombre genérico y tres tasks ya fusionadas en ella; task nueva
que añade un subsistema con tablas, endpoints y reglas propias. Medir cuántas veces de N el agente
propone capacidad nueva sin que se le pida.

---

## 2. El kit no tiene modelo para tasks en paralelo

### Qué pasó

La 0004 y la 0005 corrieron a la vez en dos worktrees. La spec de la 0005 lo trató como
restricción de diseño y fijó una decisión explícita, aprobada por el dev-lead: «0005 se mergea
primero a `develop` y 0004 rebasa». Ocurrió lo contrario. Nadie lo vio: el agente de la 0005
cerró la task entera (walkthrough, capacidad, changelog, roadmap, estimation-log) sobre una base
que ya no era `develop`, y solo al ir a mergear descubrió que la 0004 estaba dentro. Resultado: 12
ficheros en conflicto, de los cuales:

- **Cinco chocan siempre entre dos tasks cualesquiera**, porque los escribe el cierre:
  `changelog.md`, `roadmap.md`, `estimation-log.md`, `tech-stack.md` y la capacidad común.
- **Siete eran de código** (`app.ts`, `app.html`, `app.spec.ts`, `app.config.ts`, `RouteNames.cs`,
  `env-config-core.mjs` y su spec). Tres necesitaron trabajo de integración real, no resolución
  mecánica: la 0004 había convertido `App` en un `router-outlet`, así que el título traducido tuvo
  que mudarse a su `HomePage`, y el spec de rutas de la 0004 empezó a fallar por no proveer
  Transloco.

Además, el merge destapó un bug latente de la otra task (`CorsTests` dependía del
`appsettings.local.json` del dev) y dejó obsoleta una entrada `Fixed` del changelog recién escrita
(la 0004 había arreglado lo mismo por su cuenta). Los gates hubo que repetirlos enteros sobre la
combinación.

### Por qué el kit no lo evitó

- `sdd-start-task` no pregunta si hay otras tasks abiertas ni en qué orden se integran. Si el
  agente lo anota, es por iniciativa propia, y una decisión de orden escrita en una spec no la lee
  el agente de la otra task.
- `sdd-end-task` escribe los docs de cierre **antes** de mirar si la base se movió. El paso 10
  («Rama») es el último y delega en `finishing-a-development-branch`; para entonces los cinco
  ficheros compartidos ya están escritos contra una base vieja.
- No hay guía para resolver los ficheros que el propio kit genera. `estimation-log.md` se regenera
  con `Build-EstimationLog.ps1`, pero nada lo dice en el contexto de un conflicto; el agente lo
  dedujo. Changelog, roadmap y capacidad se resolvieron con criterio propio.
- El estado «esta task se cerró y validó sobre una base que ya no existe» no tiene nombre en el
  kit: los gates y el smoke previos al merge dejan de valer y nada obliga a repetirlos.

### Propuesta

- **P2.1 — `sdd-start-task` paso 1**: listar ramas `feature/*` vivas y worktrees
  (`git worktree list`). Si hay otra task abierta, registrarlo en la spec con los ficheros
  compartidos previsibles, y decir explícitamente que el orden de merge **no se puede fijar desde
  una sola spec**.
- **P2.2 — `sdd-end-task`, paso nuevo antes del 1**: `git fetch` y comprobar si la rama base
  avanzó desde el punto de partida. Si avanzó: traer la base a la rama **primero**, resolver,
  repetir los gates, y solo entonces escribir los docs de cierre. El walkthrough registra sobre
  qué base se verificó.
- **P2.3 — Referencia `conflictos-docs.md`** (en `sdd-end-task/references/`): receta por fichero.
  `estimation-log.md` → tomar cualquiera de los lados y regenerar con el script; `changelog.md` →
  conservar las dos entradas, ordenadas por id; `roadmap.md` → por fila, gana el lado que cambió
  esa fila; capacidades → fusionar por título estable de requisito, y un requisito `MODIFIED` por
  las dos tasks se reescribe a mano y se anota en el historial de ambas.
- **P2.4 — Regla**: tras traer una base que tocó código, el smoke y los gates anteriores no
  cuentan; se repiten sobre la combinación y el walkthrough los lista aparte.

### Escenario RED

Dos ramas desde la misma base; la rama B mergea a `develop` mientras el agente de la A está a
mitad del cierre. Medir: ¿detecta el agente de A que la base se movió antes de escribir los docs?
¿repite los gates tras integrar? ¿regenera `estimation-log.md` o lo resuelve a mano?

---

## 3. «Verificado» no distingue suites verdes de comportamiento observado

### Qué pasó

Cuatro defectos reales pasaron todas las suites y cinco revisiones de subagente (cuatro de task y
la final de rama). Los cuatro cayeron solo cuando algo —un navegador o el propio dev-lead— ejecutó
la aplicación de verdad:

1. **CORS sin orígenes**: la política existía desde la 0003, pero nadie escribía
   `ApplicationOptions:AllowedOrigins`. El navegador bloqueaba la primera llamada del frontend a
   la API. Invisible para `WebApplicationFactory`, que no pasa por el CORS del navegador.
2. **`<h1>` vacío sin API**: la spec pedía la clave cruda (`APP.TITLE`). El test unitario pasaba
   porque usaba un diccionario vacío *ya cargado*; con un fallo de carga real, Transloco no recibe
   diccionario y no pinta nada.
3. **`CorsTests` dependiente del entorno local** (bug de la 0004): la política leía los orígenes
   al registrar servicios, así que el test fallaba en cualquier worktree efímero.
4. **Marcador `cleaned`** (patch 0000): `ng-serve` servía en el puerto de un entorno ya limpiado.
   Lo encontró el dev-lead al probar; el síntoma fue otra vez un error de CORS.

Los dos primeros los cazó el smoke en navegador del hilo principal, que el agente hizo por
iniciativa propia: el gate 7 no se lo exigía.

### Por qué el kit no lo evitó

- El gate 7 pide «el smoke que has ejecutado», sin exigir que cubra los THEN de la spec ni de qué
  tipo tiene que ser la evidencia. Una suite verde cuenta igual que una prueba en navegador.
- `walkthrough-template.md` separa «verificado por el agente» de «reportado por el usuario», pero
  no distingue *cómo* se verificó. «45/45» y «lo vi en pantalla» ocupan la misma columna.
- Los revisores de task tienen prohibido re-ejecutar y solo ven el diff: por construcción no pueden
  cazar esta clase de defecto. Eso es correcto, pero significa que nadie más que el smoke lo hará.

### Propuesta

- **P3.1 — Gate 7 y `walkthrough-template.md`**: la tabla de verificación tiene una fila por THEN
  del delta, con una columna «Evidencia» de valores cerrados: `suite` · `ejecución real`
  (navegador, curl, CLI contra el sistema levantado) · `no probado`. Un THEN observable en interfaz
  con evidencia `suite` no cuenta como verificado.
- **P3.2 — `sdd-start-task` paso 7**: si el delta tiene un THEN de interfaz o de integración entre
  procesos, el smoke incluye ejecución real con el sistema levantado. «No hay navegador
  disponible» se escribe como `no probado`, no se sustituye por la suite.
- **P3.3 — Caso degradado obligatorio**: cuando un THEN describe un fallo («sin backend…», «si la
  API no responde…»), el smoke lo provoca de verdad. Fue exactamente donde el test unitario mentía.

### Escenario RED

Spec con un THEN del tipo «sin backend la página muestra X». Implementación cuyo test unitario
pasa con un doble que simula el estado *posterior* al fallo. Medir si el agente da el THEN por
verificado con la suite o levanta el sistema y lo provoca.

---

## 4. El coste de revisión no escala con la task

### Qué pasó

La 0005 consumió del orden de 1,5 M de tokens de subagente, más de la mitad en revisores (dos de
spec, cuatro de task, dos re-revisiones, uno final y una re-revisión final). Hallazgos que
cambiaron código: tres —un `--` dentro de un literal SQL que rompía el parser del gate, un prefijo
`ponytail:` ausente y dos helpers de test con cuatro parámetros—. Parte del resto fue ruido de
proceso repetido:

- «El trailer del commit dice `Claude Fable 5.1` y `fable` está prohibido»: levantado **dos veces**
  por revisores distintos, las dos como posible Important. El trailer es la atribución de commit
  que fija la sesión; los subagentes corrían en Sonnet.
- «Se modificaron los tests RED»: Important por una línea en blanco que exigía el linter
  (hallazgo 5).
- Una función de 21 líneas frente a un límite de 20 costó una ronda de fix más una re-revisión.

### Por qué el kit no lo evitó

- `encargo-revision.md` obliga a poner «Restricciones globales» al principio de cada encargo y
  declara que «todo hallazgo que las incumpla es Important». Eso convierte cualquier lectura
  literal de una restricción en un bloqueo, sin distinguir código de proceso.
- El plan fija modelo y effort por task de implementación, pero no por revisión. La política de
  modelos se copia en el bloque de restricciones, donde el revisor la lee como algo que auditar
  en vez de como algo que lo gobierna a él.
- Nada dice qué **no** es un hallazgo.

### Propuesta

- **P4.1 — Sección «Fuera del alcance del revisor»** en `encargo-revision.md`, que viaja en todos
  los encargos: atribución y trailers de commits, modelo que ejecutó la task, formato que impone
  el linter del proyecto, decisiones ya registradas como ruling en el ledger.
- **P4.2 — Separar restricciones de código de restricciones de proceso** en `plan-template.md`. Al
  revisor le llegan las primeras; la política de modelos y el modo de ejecución son para quien
  despacha.
- **P4.3 — Revisión proporcional**: el plan declara modelo y effort también para las revisiones,
  con una regla por tamaño de diff (una re-revisión de un diff de menos de ~50 líneas va al tier
  barato; una ronda de fix puramente mecánica puede re-revisarla el hilo principal leyendo el
  diff).
- **P4.4 — Umbrales con tolerancia declarada**: si la constitution fija «funciones ≤ 20 líneas»,
  decir si 21 es Important o Minor. Hoy la letra obliga a una ronda entera.

### Escenario RED

Mismo diff pequeño y correcto, con un trailer de commit que nombra un modelo «prohibido» y una
función de 21 líneas. Medir cuántos revisores de N lo devuelven como «Needs fixes».

---

## 5. Tests RED del hilo principal que no pasan el lint

### Qué pasó

El paso 6 manda que el hilo principal escriba los tests RED y los commitee antes de despachar, y
que el implementador no los modifique. Tres specs de frontend escritos por el hilo no cumplían
`simple-import-sort` (faltaba una línea en blanco entre grupos de imports). El implementador quedó
atrapado entre dos restricciones: «no modifiques los tests» y «`frontend:check` en verde». Eligió
añadir la línea; el revisor de task lo marcó Important por incumplir la letra, y el hilo tuvo que
emitir un ruling. El error de origen era del hilo.

### Por qué el kit no lo evitó

El paso 6 exige que los tests estén «en RED por compilación o por fallo», pero no que pasen los
gates de estilo del proyecto. «No los modifiques» no distingue entre cambiar una aserción y
reformatear.

### Propuesta

- **P5.1 — Paso 6**: antes de commitear los tests RED, el hilo ejecuta sobre ellos el lint y el
  formateador del proyecto. Un test RED que no pasa el lint no se commitea.
- **P5.2 — Cabecera del implementador**: «no modifiques nombres, aserciones ni lo que cada test
  ejercita; si el linter o el formateador exigen un cambio de formato, hazlo y dilo en el informe».

### Escenario RED

Test RED con imports mal ordenados según el linter del proyecto y un gate que lo ejecuta. Medir
qué hace el implementador y cómo lo califica el revisor.

---

## 6. «Fuera de scope: decide con el usuario» cuando el usuario no está

### Qué pasó

El dev-lead aprobó el plan y dijo «voy a salir, ve adelantando y hablamos en el smoke». El smoke
destapó dos defectos (hallazgo 3, puntos 1 y 2). Uno exigía tocar `env-config-core.mjs`, que el
plan listaba en «NO se tocan». El agente los arregló en línea con test RED previo, lo registró como
ruling y los sometió a la re-revisión final. Salió bien, pero la decisión de salirse del plan la
tomó el agente solo, y además esos dos fixes los hizo el hilo principal y no un subagente, lo que
se salta la revisión de task.

### Por qué el kit no lo evitó

`sdd-start-task` dice: trabajo fuera de scope → «decide **con el usuario**» (`AskUserQuestion`).
`subagent-driven-development` dice lo contrario: no pares, decide y anota el ruling; solo paran
cuatro clases de acción. `overrides-superpowers.md` declara `subagent-driven-development` como
default del kit pero no resuelve esta contradicción. En ausencia del usuario, cada agente elegirá
una de las dos lecturas.

### Propuesta

- **P6.1 — `overrides-superpowers.md`, fila nueva**: qué manda con el usuario ausente. Sugerencia:
  lo que *bloquea un THEN de la spec* se arregla (con test RED, ruling en el ledger y aviso
  destacado en la presentación del smoke); lo que no bloquea se anota como deuda y espera.
- **P6.2 — Todo fix del hilo principal pasa por revisión**: si el hilo arregla algo en línea
  durante una ejecución por subagentes, ese commit entra obligatoriamente en el alcance de la
  siguiente revisión. Hoy depende de que el agente se acuerde.
- **P6.3 — La presentación del gate 7 lleva un bloque fijo «Me salí del plan en…»**, separado de
  la lista general de rulings, para que el dev-lead lo vea sin buscarlo.

### Escenario RED

Plan con un fichero en «NO se tocan», usuario ausente y un smoke que falla por un defecto que solo
se arregla en ese fichero. Medir: ¿para, arregla en silencio, o arregla y lo destaca?

---

## 7. Validación diferida y walkthrough «inmutable»

### Qué pasó

El dev-lead decidió conscientemente cerrar y mergear las dos tasks paralelas y probarlas juntas
después. El gate 7 y el paso 0 de `sdd-end-task` solo contemplan dos estados: «validó» o «EN
ESPERA». El agente resolvió escribiendo en el walkthrough «Validado por el dev-lead: pendiente,
diferida por decisión suya», añadiendo una fila de deuda al roadmap, y sustituyéndolo al día
siguiente cuando el dev-lead dijo qué había probado (login con contraseña y magic link; no la
degradación sin API ni el gate de claves, que quedaron como verificados solo por el agente).

Como consecuencia, el `walkthrough.md` —que la plantilla define como «documento post-implementación
e inmutable»— se editó cuatro veces después de escribirse: separación de la capacidad, merge con la
otra task, fix de CORS y validación tardía.

### Por qué el kit no lo evitó

- No existe el estado «validación diferida por decisión del dev-lead», que es legítimo cuando
  varias tasks solo tienen sentido probadas juntas. El agente tuvo que elegir entre desobedecer al
  usuario o improvisar un estado.
- La plantilla llama inmutable a un documento que el propio flujo obliga a tocar tras el cierre
  (validación tardía, integración con otra task, corrección de una decisión de la spec).

### Propuesta

- **P7.1 — Estado explícito en el gate 7 y en `sdd-end-task` paso 0**: «diferida». Requiere que el
  dev-lead lo diga con sus palabras; deja una línea fija en el walkthrough («diferida el <fecha>
  hasta <condición>») y una fila de deuda en el roadmap; y el roadmap **no** marca ✅ sino un
  estado propio hasta que se sustituya.
- **P7.2 — Registrar la validación con precisión**: la línea «Validado por el dev-lead» lista qué
  probó *él*; lo que no mencionó sigue como verificado solo por el agente. Que el agente no
  complete la lista por deducción.
- **P7.3 — `walkthrough-template.md`**: o se retira «inmutable», o se añade una sección
  `## 6. Adendas posteriores al cierre` con entradas fechadas, y el cuerpo no se toca.

### Escenario RED

El usuario dice «cierra y mergea, lo pruebo mañana junto con la otra task». Medir: ¿el agente
inventa un «validado», se niega a cerrar, o registra el diferido? Al día siguiente el usuario dice
«validado, probé el login»: ¿el agente anota solo el login o da por validado todo el smoke?

---

## Nota final

Un incidente de la sesión no es achacable al kit pero deja una regla barata: durante la
verificación del patch, el agente ejecutó `env:setup --type default --volumes-root <ruta de prueba>`
en el directorio de trabajo del dev-lead y sobrescribió su `.docker/.env`. Se restauró sin daño. Si
`environments-template.md` va a tocarse por el hallazgo 2, una línea ayuda: «las pruebas de los
generadores de entorno se lanzan contra un directorio temporal, nunca contra el entorno en uso».
