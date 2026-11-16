---
kit_version: 2.3.3
superpowers_version: 6.4.2
lane: feature
id: 20261009-100932-feature-0162-validation-panel-spike
task: 0162
mode: full
date: 2026-10-09
---

# Ticket para el kit — feature 0162: un spike con artefactos no tiene carril en la 2.3.3

## Contexto

- Carril y modo: feature full, usada como spike (fila en el roadmap y `research.md`), a petición del dev-lead.
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates` (spec, plan, research, walkthrough), `sdd-end-feature`, `sdd-feedback`.
- Proyecto: el propio kit; medidas sobre una app web desechable en el navegador del dev-lead.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: Opus 5.5 (revisor final, `sdd-kit:effort-high`).
- Coste en reloj: 1,3 h frente a 2 h estimadas (walkthrough §2).
- Coste en tokens: 17,1 M del hilo y 0,35 M del subagente; 8,00 $ (walkthrough §2).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El spike con evidencia no tiene carril: el agente improvisa la forma y el vocabulario de los estados

- **Qué pasó**: el dev-lead pidió un spike con fila en el roadmap y `research.md`. El paso 2 de `sdd-start-feature` manda los spikes a `sdd-consult`, sin artefactos, así que el agente siguió por feature full con la forma de spike de la propuesta 0131 (spec corta con objetivos medibles, tasks con «Evidencia»), leída de la propuesta y no de ninguna skill. `research-template.md` está pensada como investigación previa a una spec: no tiene tabla de objetivos ni un vocabulario fijo de estados. El agente escribió «cumple en parte» y dio por cumplido un objetivo medido por debajo del umbral de la spec (2,5 min frente a ≥ 5). La revisión final lo marcó (1 Critical y 7 Important sobre estados y alcance del research) y hubo que hacer una pasada de fix.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 2 (enrutado del spike); `skills/sdd-templates/templates/research-template.md`.
- **Por qué el kit no lo evitó**: el carril spike con artefactos solo existe en la propuesta 0131 (feature 0146), y la regla «objetivo → medido / no medido / no cumple; la recomendación solo cita lo medido» vive en el eje Spec de la revisión de la 0131, no en una plantilla que el agente calque al escribir.
- **Coste**: una pasada de fix de 10 hallazgos (commit `fe666d49`) y un revisor final de 0,74 $ que revisó estados en vez de fondo; en reloj, ~15 min (de `2c377bfa` a `fe666d49`).
- **Propuesta**: en la 0146, el carril spike calca una plantilla de research de spike con la tabla «Objetivo · Estado (cumple | no cumple | no medido) · Detalle · Evidencia» y la regla escrita en la plantilla: un objetivo medido por debajo del umbral de la spec es «no cumple tal como se definió»; la recomendación solo cita lo medido; una opción no medida no condiciona la decisión.
- **Verificada**: sin verificar (contrastado con `skills/sdd-templates/templates/research-template.md`, que no tiene la tabla).
- **Criterio de aceptación**: GIVEN un spike con un objetivo «≥ 5 min» medido en 2,5 min WHEN el agente escribe el research con la plantilla THEN la fila dice «no cumple tal como se definió», y la recomendación no lo cuenta como cumplido.

### 2. El aviso de fase acabó el turno con el dev-lead ausente

- **Qué pasó**: el dev-lead dijo «estas una hora solo, vete avanzando». El agente escribió el aviso de fase («Ahora: research.md… Queda: tu prueba a mano… unos 10 min tuyos») y terminó el turno sin hacer el paso. Al volver, el dev-lead: «te has `parado???? te pedi que siguieras :_(».
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, «Aviso de fase» del checklist.
- **Por qué el kit no lo evitó**: el aviso fija la forma de la línea, pero no dice que va en el mismo mensaje que la primera acción del paso. Un «Queda: <próxima parada del usuario>» al final de un mensaje se lee como un relevo, y el agente lo trató así.
- **Coste**: el tiempo de ausencia del dev-lead desde ese mensaje hasta su vuelta sin avanzar el research; cifra sin respaldo.
- **Propuesta**: una frase en el «Aviso de fase»: «El aviso abre el mensaje que ya ejecuta el paso: nunca es la última línea de un turno. Con el dev-lead ausente o con una orden de seguir, un turno que acaba en un aviso de fase es una parada no prevista.»
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN el perfil `delegate` y el dev-lead ausente con «vete avanzando» WHEN el agente pasa de una task a la siguiente THEN el mensaje del aviso de fase contiene la primera llamada a una herramienta del paso nuevo, y el turno no termina en él.

## Lo que hice por iniciativa propia

- Con el dev-lead ausente, simulé sus clics con el ratón del navegador para medir O1 y O3, lo registré como enmienda de la spec y repetí O1 a mano a su vuelta. Funcionó: la medida a mano destapó lo que la simulada no veía (el panel desaparece y el dev tiene que avisar). Candidato a regla del carril spike: lo simulado se etiqueta y no cuenta como medido con una persona.
- La app de las medidas la levantó el agente (desechable, fuera del repo) cuando el dev-lead no tenía una a mano; después se versionó una versión mínima en `probe/app/` para que otra persona repita las medidas.
- Una opción no pedida (Playwright con navegador visible que maneja el dev) añadida al research sobre el papel, marcada «no medida» y fuera de la recomendación.

## Funcionó, no tocar

- `sdd id next --reserve` y el renombrado de la rama sin commits propios (`nombrado.md`): sin colisión de ids.
- `validation.mode: field`: el cierre no paró a pedir una validación que ya era de campo.
- El revisor final anclado en un worktree desanclado mientras el hilo seguía escribiendo borradores.
- `sdd merge --push`: merge y push en una orden, con el gate en el `pre-merge-commit`.
- `sdd session tokens`: las tres líneas de coste sin escribirlas de memoria.

## Menores

- La regla de puertos del paso 6 (comprobar que el puerto está libre antes de arrancar) no detecta los rangos reservados de Windows: `netstat` dio el 5199 por libre y Vite falló con `Error: listen EACCES: permission denied ::1:5199` (rango `5199-5298` en `netsh int ipv4 show excludedportrange protocol=tcp`) — `skills/sdd-start-feature/SKILL.md` paso 6.
- Un `python - <<'EOF'` con una ruta de Windows dentro de una cadena falló con `SyntaxError: (unicode error) 'unicodeescape' codec can't decode bytes … truncated \UXXXXXXXX escape`; se rehízo con Edit — no localizado (shell, no kit).
