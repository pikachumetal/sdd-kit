---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-180657-feature-0029-explorador-completo
task: 0029
mode: full
date: 2026-09-28
---

# Ticket para el kit — feature 0029: explorador de ficheros con renombrar y mover, cerrado tras una enmienda en la validación

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native (`execution: auto`)
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates`, `add-to-changelog`,
  `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`,
  `executing-plans`, `test-driven-development`
- Proyecto: aplicación web interna, backend .NET con EF Core (tests sobre el provider InMemory) y
  frontend React; un solo desarrollador, que es también el dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5 (tres reviews de spec), Opus 5.5 con `effort-high` (revisión final
  y re-revisión)
- Coste en reloj: unas 4 h 20 min de hilo, con las esperas del dev-lead (spec y plan ~1,5 h,
  implementación ~2,7 h)
- Coste en tokens: 183,9 M del hilo y 6,9 M de subagentes en 5 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis que probar con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una exclusión con efecto visible se aprobó escondida en la descripción de una opción, y volvió como enmienda en la validación

- **Qué pasó**: la pregunta de producto «¿qué pasa con un nombre repetido al renombrar o mover?» tenía
  como opción recomendada «Se rechaza con un mensaje». Su descripción añadía «la subida sigue admitiendo
  repetidos», y la spec lo puso en «No entra». El dev-lead eligió la opción. Al validar encontró que
  «Nuevo» sí admitía repetidos y lo vio como incoherente. Lo mismo pasó con la decisión 4 (comparar
  distinguiendo mayúsculas), que iba en «Decisiones que he tomado yo». Salieron una enmienda, una task
  más, otra re-revisión y otra validación.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 4 (el gate de la spec y el bloque
  «Decisiones que he tomado yo»). La regla «decisión con efecto visible en pregunta aparte» es de la
  constitution del proyecto, no del kit.
- **Por qué el kit no lo evitó**: el kit pide abrir la presentación con las decisiones, pero no distingue
  una decisión que restringe de una que excluye a una operación hermana: la regla vale para renombrar y
  no para crear. Y la review de dominio (punto 3, alcance oculto) no la marcó porque el «No entra» la
  declaraba.
- **Coste**: ~1 h de reloj, una re-revisión con Opus (2,7 M tokens) y una segunda ronda de validación.
- **Propuesta**: en el repaso de coherencia del paso 4, buscar reglas que el delta aplica a una
  operación y no a su hermana (crear frente a renombrar, subir frente a mover, alta frente a edición). Si
  la excluida se ve en la aplicación, va en una pregunta propia, no en la descripción de una opción ni en
  un «No entra».
- **Criterio de aceptación**: GIVEN una spec cuyo delta rechaza nombres repetidos al renombrar y cuyo
  «No entra» deja la subida sin ese rechazo · WHEN el sujeto hace el repaso de coherencia · THEN pregunta
  aparte «¿la subida y el alta también rechazan repetidos?» antes del gate (hoy, 0 de 1 en esta sesión).

### 2. La verificación por task no toca el motor real de base de datos, y un fallo de traducción de consultas pasó la suite entera

- **Qué pasó**: en la Task 4 la suite (426/426, provider InMemory) estaba verde con
  `string.ToUpperInvariant()` dentro de las consultas. El smoke contra PostgreSQL devolvió `500` en todas
  las altas: el provider real no traduce ese método. Solo se vio porque la validación del paso 7 exige
  `ejecución real` para los THEN de interfaz. Lo mismo con un índice único que InMemory no hace cumplir:
  la guarda de la carrera solo se pudo probar contra el motor real.
- **Dónde en el kit**: `sdd-templates/templates/plan-template.md`, campos «Verificación» de cada task, y
  `skills/sdd-start-feature/SKILL.md` paso 6 (el cierre de la task en Native).
- **Por qué el kit no lo evitó**: el campo «Verificación» lista comandos de superficie (la suite). No hay
  un campo equivalente a «Verificación visual» para la persistencia cuando el provider de test no es el
  de producción, así que el primer contacto con el motor real llega en la validación final.
- **Coste**: se cazó a tiempo. Sin la regla de `ejecución real` del paso 7, habría llegado roto al
  dev-lead.
- **Propuesta**: un campo opcional «Verificación contra el motor real» en la plantilla del plan. Aplica
  cuando `tech-stack.md` dice que los tests no usan el motor de producción y la task cambia consultas,
  índices o restricciones. Lo ejecuta el hilo, igual que la visual, contra el entorno del worktree.
- **Criterio de aceptación**: GIVEN un proyecto con tests sobre un provider en memoria y una task que
  añade una consulta con una función de cadena · WHEN el sujeto escribe el plan · THEN la task lleva el
  campo con una petición real que ejercita esa consulta, y el hilo lo ejecuta antes de `task-done`.

### 3. El merge del cierre se bloqueó por un cambio de una línea del dev-lead en el checkout de la rama destino, y el mensaje no le dio salida

- **Qué pasó**: `Invoke-SddMerge.ps1` paró con `destino sacado: 'develop' tiene cambios sin guardar …
  roadmap.md`. El dev-lead había añadido una fila al backlog desde otra sesión y preguntó «¿por qué está
  bloqueado?». Hizo falta un turno para explicarlo, mirar el diff y proponer salidas. Al final lo guardó en un commit
  él y el merge integró su commit sin conflicto.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, sección «Cuándo no se
  llama», y `skills/sdd-end-feature/SKILL.md` paso 10.
- **Por qué el kit no lo evitó**: la receta dice parar y listar los ficheros, sin tocarlos. Es correcto,
  pero no dice ofrecer las salidas. Tampoco que un cambio que solo toca los registros (`roadmap.md`,
  `changelog.md`) de la persona que cierra puede viajar en la rama de la feature.
- **Coste**: dos turnos y una duda del dev-lead sobre si algo iba mal.
- **Propuesta**: con `destino sacado:`, el mensaje final da el `diff --stat` y ofrece tres salidas: que
  la persona lo guarde en un commit en su rama, llevarlo a la feature si toca solo los registros, o dejar el merge
  para luego. También explica en una frase por qué se para: el merge pisaría ficheros a medias.
- **Criterio de aceptación**: GIVEN el checkout de `develop` con una línea nueva sin commitear en
  `roadmap.md` · WHEN el cierre llega al merge · THEN el mensaje explica el motivo y ofrece las tres
  salidas en una pregunta, sin tocar el fichero.

### 4. La primera pregunta del turno mezcló partición y parada de la spec, y la palabra «migración» se leyó como migración de datos

- **Qué pasó**: la primera pregunta juntaba la partición (7 tasks, recomendado partir) y la parada de la
  spec. El dev-lead la rechazó dos veces para preguntar: primero «dime las tareas», y después «¿qué
  migración, si no hay datos?». El recuento hablaba de «migración» para un script de esquema sin copia
  de datos.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 2 (el recuento de tasks y la propuesta de
  partir).
- **Por qué el kit no lo evitó**: el paso usa «lleva migración» como criterio de partición, pero no pide
  decir si es de esquema o de datos, ni enseñar la lista de tasks antes de proponer partir.
- **Coste**: dos rondas de preguntas antes de arrancar.
- **Propuesta**: cuando se propone partir, la pregunta va precedida de la lista de tasks previstas, una
  línea cada una. «Migración» se dice como «script de esquema» o «migración de datos», según lo que sea.
- **Criterio de aceptación**: GIVEN una feature con 7 tasks previstas y un cambio de esquema sin datos
  que copiar · WHEN el sujeto hace la primera pregunta · THEN el mensaje lista las 7 tasks y dice «script
  de esquema, sin datos» antes de la opción de partir.

## Lo que hice por iniciativa propia

- **Una segunda instancia del API en otro puerto** para el smoke contra el motor real, con el API del
  dev-lead en marcha y con el código anterior. No se para el proceso de otro: se compila a otra salida y
  se arranca con otro endpoint. Funcionó, y es candidato a nota general en el paso 6 («si la verificación
  choca con un proceso de la persona, no lo pares: compila a otra salida y usa otro puerto»).
- **Reproducir contra el entorno real el hallazgo de un revisor** antes de arreglarlo: dos movimientos
  concurrentes cruzados que el revisor dio como Minor. Se reprodujo en la primera ronda, con el API caído
  por `StackOverflow`, y se subió a Critical. La regla «Reproducir antes de arreglar» del paso 6 lo cubre
  para Critical e Important; aquí se aplicó a un Minor cuya consecuencia descrita era grave.
- **Terminar a mano las animaciones** (`document.getAnimations().forEach(a => a.finish())`) antes de cada
  captura. El navegador del MCP las dejaba congeladas, y la captura enseñaba el diálogo invisible.

## Funcionó, no tocar

- **La regla de volver a clasificar por el efecto** de `executing-plans`. Un Minor («improbable con un solo
  usuario») que tumbaba el API y otro que mandaba «Atrás» a una ruta inexistente se subieron y se
  arreglaron con RED→GREEN.
- **La exigencia de `ejecución real` para los THEN de interfaz** en la validación (paso 7). Por ella se
  cazó el hallazgo 2.
- **La verificación visual del hilo en Native.** Cazó que un aviso de éxito se borraba al navegar tras
  renombrar, algo que ningún test unitario miraba.
- **El flujo de desvío con enmienda en la spec y aprobación explícita.** Mantuvo la trazabilidad de un
  cambio de alcance hecho a media validación.
- **La guarda de `Invoke-SddMerge.ps1` sobre el checkout sucio.** Protegió el cambio del dev-lead. Solo
  falta el mensaje del hallazgo 3.

## Errores míos, no huecos del kit

- Lancé un `python3` en Windows, que abrió el instalador de la tienda y colgó el comando; tuve que
  pararlo.
- Escribí un script de Node con regex dentro de un heredoc de Git Bash, que se comió las barras
  invertidas. Otra vez una regex se quedó en `/[\/]/`, y la cazó un test.
- Primero cambié a `ToUpperInvariant()` para contentar al analizador sin comprobar el provider real: el
  hallazgo 2.
- Un `Stop-Process` lanzado desde Bash con `pwsh -Command` falló al pasar los parámetros; lo repetí en
  PowerShell.
- Al juntar el cierre en un commit desapareció un hash que ya citaban `tasks.md` y el walkthrough, y hubo
  que rehacer el commit.
