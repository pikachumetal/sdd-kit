---
kit_version: 2.3.2
superpowers_version: 6.4.2
lane: feature
id: 20261006-205241-feature-0093-repintado-rapido
task: 0093
mode: full
date: 2026-10-06
---

<!-- cspell:ignore remerge -->

# Ticket para el kit — feature 0093: la feature que siguió a un spike de rendimiento descubrió el límite de aguante

## Contexto

- Carril y modo: feature full, perfil delegate. Implementa la vía que eligió un spike de medida anterior.
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`.
  De superpowers: `brainstorming`, `writing-plans`, `executing-plans` (Native) y `systematic-debugging`.
- Proyecto: aplicación web interna con frontend SPA, API .NET y un editor de documentos embebido de terceros. Una
  persona.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes:
  - Opus 5.5 (`sdd-kit:effort-high`): revisión de spec de dominio, revisión final y tres re-revisiones.
  - Sonnet 5.5: revisión de spec técnica y cuatro búsquedas en paralelo.
- Coste en reloj: 5,9 h de implementación frente a 8 h estimadas, más ~0,8 h de spec y plan (walkthrough §2).
- Coste en tokens:
  - Hilo: 277.653.215.
  - Subagentes: 9.110.953 en 9 despachos (walkthrough §2), más dos re-revisiones posteriores de ~75.000 cada una.

## Cómo leer este ticket

Los hallazgos son hipótesis a probar con RED/GREEN, no cambios aprobados. Van ordenados por coste observado.

## Hallazgos

### 1. El spike de rendimiento midió una publicación ligera, y el límite de aguante lo descubrió la feature

- **Qué pasó**: el research del spike anterior daba la vía por buena con medidas de una publicación que cambiaba
  pocas celdas. Ya implementada, una medida con la peor carga realista mostró dos cosas: la mayoría de las celdas
  cambiadas y varias publicaciones seguidas con el documento abierto.
  - Escribir todas las celdas en cada publicación degradaba hasta 160 s en la décima.
  - El editor de terceros tiene un tope de cambios por sesión que bloquea el documento hacia la quinta publicación
    masiva.
  - Hizo falta enmendar la spec (dos techos de tiempo y subir el tope), abrir dos filas de deuda y lanzar cuatro
    búsquedas en paralelo para confirmar que el registro no se puede vaciar. El dev-lead lo vivió como «esta tarea
    parece un spike».
- **Dónde en el kit**: `skills/sdd-templates/templates/research-template.md` §4 «Spike (si se hizo)», y el paso de
  `skills/sdd-start-feature/SKILL.md` que arranca una feature desde un research.
- **Por qué el kit no lo evitó**: la plantilla del research no pide aguante. Pide el resultado del spike, no con qué
  carga se midió ni qué pasa al repetirlo. La spec de la feature heredó los objetivos de tiempo sin decir con qué
  carga los validó el spike.
- **Coste**: ~2,5 h de medidas e investigación del tope (walkthrough §2), una enmienda de spec (spec.md, enmienda del
  2026-10-06) y 4 subagentes de búsqueda (~2,5 M tokens, walkthrough §2).
- **Propuesta**: en un spike de rendimiento, el research incluye una tabla de aguante:
  - N ≥ 10 repeticiones seguidas con la peor carga realista, que el dev-lead confirma;
  - el tiempo de cada repetición;
  - el recurso que se acumula por repetición (memoria, tamaño de sesión o registro).

  La spec que sale de ese research cita esa tabla en cada objetivo de tiempo.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un spike cuyo objetivo es un tiempo, WHEN el agente escribe su `research.md`, THEN
  hay una tabla de al menos 10 repeticiones con la carga que el dev-lead dio por peor caso y una columna del recurso
  acumulado. RED de hoy: el research del spike anterior no tiene esa tabla y la plantilla no la pide.

### 2. El merge en la rama de integración solo pasa el gate rápido, y dos features juntas dejaron un E2E en rojo

- **Qué pasó**: al integrar la base en la rama antes del cierre, la suite E2E dio un test en rojo que no era de esta
  feature.
  - Otra feature cambió la letra de los documentos en blanco, y un E2E de una tercera, que contaba 120 párrafos para
    llevar un bloque a la página 2, lo dejaba en la 3.
  - Las dos se fusionaron en la rama de integración con 7 minutos de diferencia. La segunda pasó sus E2E antes de
    integrar la primera, y nadie ejecutó los E2E sobre las dos juntas.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, viñeta `-VerifyCommand`, y
  `skills/sdd-end-feature/SKILL.md` paso 10.
- **Por qué el kit no lo evitó**: la receta pide «la suite completa antes de llamar al script», pero no dice que el
  E2E contra el entorno levantado forme parte de ella. Tampoco obliga a ejecutarla después de integrar la base, que
  es cuando entran las features de otros.
- **Coste**: ~1 h en tres corridas E2E, el diagnóstico, el arreglo del test, una re-revisión y una pregunta al
  dev-lead (walkthrough §4.1, commit del arreglo del test).
- **Propuesta**: cuando la rama integró la base y la base trae commits de otras features, la suite completa de la
  validación final se ejecuta sobre el resultado integrado. Si `tech-stack.md` declara una suite E2E, cuenta como
  parte de esa suite. El mensaje final da el resultado.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una rama que integra la base con commits de otras features y un proyecto con E2E
  declarado en `tech-stack.md`, WHEN el agente llega al paso 10, THEN ejecuta los E2E sobre el resultado integrado
  antes de llamar a `Invoke-SddMerge.ps1`, y el mensaje final da su resultado.

## Lo que hice por iniciativa propia

- Tras integrar una base que añadía autenticación a todo el API, conté en el log del API los códigos de respuesta del
  endpoint nuevo de la feature durante los E2E: 19 `200`, ningún `401`. El plugin cae en silencio al camino lento si
  recibe `401`, así que unos E2E en verde no lo descartaban. Funcionó y zanjó la duda que planteó un agente lateral.
  Candidato a regla: tras integrar un cambio transversal de la base (auth, CORS, proxy), comprobar en el log el
  código de cada endpoint nuevo de la feature.
- La re-revisión del merge de sincronización se despachó con `git show --remerge-diff` como paquete, sin el contenido
  de las otras features: 196 líneas, Approved en un minuto. El kit cita `--remerge-diff` para lo que se revisa en el
  hilo, pero no para el paquete del revisor.
- Hice el merge de sincronización a mano, con conflictos en código y no solo en los registros, después de que el
  dev-lead eligiera «integrar la base y cerrar». La receta solo contempla el merge a mano cuando el conflicto está solo
  en los registros, y con conflictos de código no dice qué revisión pedir.
- Las medidas se hicieron con un arnés fuera de git, configurado por variables de entorno (repeticiones, reabrir,
  descargar el PDF, cerrar). Así se repitieron las tablas sin tocar la suite.

## Funcionó, no tocar

- El revisor en un worktree desanclado en el sha que revisa: el hilo siguió haciendo commits sin contaminar la revisión.
- `Merge-CapabilityDelta.ps1`, `Test-Roadmap.ps1` y `Build-EstimationLog.ps1`. Este último regeneró sin tocar las
  filas ajenas el `estimation-log.md` que había entrado en conflicto.
- Juntar el cierre desde la última task y reescribir sin sha las líneas de revisión de `tasks.md`.
- `Invoke-SddMerge.ps1` con `-Push` y `-VerifyCommand`: en el segundo intento fusionó, verificó y publicó.

## Menores

- Al reescribir sin sha las líneas de revisión de `tasks.md`, se pegaron hashes delante del `---` del frontmatter. El
  commit de cierre lo llevó así, y no lo cazó nada hasta el lint del gate tras el merge, que además cortó el resto del gate.
  Un lint de docs antes del commit de cierre lo habría cazado. — `skills/sdd-end-feature/SKILL.md` paso 10
- La verificación de `Invoke-SddMerge.ps1` falló porque una API levantada desde el checkout principal, donde está
  sacada la rama destino, bloqueaba una DLL del build. El script da `verificación:`, como si el código estuviera en
  rojo, sin distinguir un fichero bloqueado por otro proceso. — `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`
- La primera corrida E2E apuntó al API de otro worktree, en el puerto por defecto, porque no se pasaron los puertos
  del entorno del worktree, y dio un 404 confuso. — no localizado (quizá `templates/environments-template.md`)
- Un commit de 13 líneas que solo tocaba un test necesitó una re-revisión completa en Opus, porque la excepción para
  revisarlo en el hilo solo cubre documentación. — `skills/sdd-end-feature/SKILL.md` paso 9
