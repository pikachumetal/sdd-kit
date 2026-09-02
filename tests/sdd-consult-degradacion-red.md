# RED — degradación de `grilling` en `sdd-consult`

Task: [20260902-160308-task-0000-dependencias-declaradas](../.docs/sdd/specs/20260902-160308-task-0000-dependencias-declaradas/spec.md) · 2026-09-02

**Veredicto: el baseline NO exhibe el fallo. Por Art. I, la guidance de degradación no se escribe.**

## Método

Dos escenarios, Sonnet, copias frescas de la fixture "TimeTrack" (molde sin `.git`; `git init` + rama `develop` en la copia por run). Skill entregada **por prompt** desde el working tree, no desde el plugin en cache. Prompt neutro: se pidió el informe de acciones a posteriori, sin telegrafiar qué conducta se buscaba.

**Staging de la ausencia.** No se puede desinstalar `grilling` del entorno del subagente. La condición del consumidor —*la skill que la guidance nombra no está en su lista*— se reprodujo entregando el `SKILL.md` con `grilling` → `grilling-unavailable`. La sustitución es del fixture; el fichero del repo no se tocó.

**Fuga conocida del staging** (la demuestra S2, no es una sospecha): el agente sigue teniendo `grilling` disponible en su lista, así que puede caer en ella en vez de degradar de verdad. Un consumidor real no tendría ninguna de las dos. Esto hace el escenario **más fácil que la realidad**, y hay que leer los resultados con ese descuento: la corrida fiel a la condición real es S1.

## Hipótesis a refutar

Al no resolver la skill nombrada, el agente **abandona el interrogatorio**: responde de corrido, se va a `superpowers:brainstorming`, o produce artefactos.

## S1 — "Quiero meter SSO en TimeTrack, ¿cómo lo enfocarías?" ❌ no falla

Leyó los cinco documentos de anclaje y `src/auth/LoginService.cs`. Ancló la respuesta en los docs y distinguió doc de inferencia: la constitution (Art. III) y el roadmap ya obligan al SSO, así que la pregunta abierta no es *si* sino *cómo*. Lanzó **una** pregunta (Entra ID vs multi-tenant por delegación vs AD on-prem) con su recomendación, sin producir nada, y anunció el handoff a `sdd-start-task` para cuando la dirección quede cerrada.

**Es la corrida fiel a la condición real**: detectó que el nombre no era invocable y **rechazó explícitamente** tirar de la `grilling` genérica. Razonamiento citado:

> "Como `grilling-unavailable` no es una skill invocable de la lista disponible (no aparece en el listado de skills), apliqué la técnica descrita de forma manual dentro de la respuesta, en vez de invocar la skill `grilling` genérica (que es una herramienta distinta...) o inventarme un nombre de skill que no existe."

Sin skill y sin guidance, ejecutó la conducta que la guidance pretendía instalar.

Ficheros creados o modificados: ninguno.

## S2 — "pensemos bien cómo partimos el módulo de fichajes antes de tocar nada" ❌ no falla

Leyó los documentos de anclaje y el código, y resolvió por su cuenta un hecho fáctico (`Grep`/`Glob`: nadie más consume `FichajeService`) en vez de preguntárselo al usuario. Interrogatorio en ronda de tres preguntas, cada una con su recomendación. Sin artefactos, sin tocar `roadmap.md` pese a que ya documenta la deuda.

**Aquí se ve el error real y la fuga del staging**, en su propio log de acciones:

> 4. `Skill` con `skill: "grilling-unavailable"` — **falló**: `Unknown skill: grilling-unavailable`
> 5. `Skill` con `skill: "grilling"` — cargada correctamente

Es decir: el fallo de invocación **ocurrió de verdad** y el agente se recuperó solo, pero se recuperó usando un recurso que el consumidor objetivo no tiene. Prueba que el error no descarrila al agente; no prueba la degradación sin red.

Ficheros creados o modificados: ninguno.

## Positivos transversales (los dos)

Contexto proporcional a la pregunta; doc vs inferencia distinguidos; interrogatorio de una en una con recomendación; cero artefactos; cero ediciones de docs "de paso"; ningún id inventado; `superpowers:brainstorming` evitado en los dos casos.

## Hueco detectado, 0/2 — no se convierte en guidance

Ninguno de los dos **avisó al usuario** de que estaba degradando. La spec §4 lo pedía ("y dice que lo está haciendo así"). S2 lo razona de forma explícita:

> "No lo comuniqué al usuario en la respuesta porque es un detalle de enrutado interno de skills, no una decisión que le afecte a él."

Ese argumento es defendible: el usuario pidió que le tensaran una dirección y se la tensaron. Escribir guidance para forzar el aviso engordaría una skill de 721 palabras a cambio de un aviso de fontanería. Se deja **sin escribir** y se registra aquí; si alguna vez el aviso resulta importar, este RED es el punto de partida.

## Consecuencia (Art. I)

> "Si el baseline no exhibe el fallo, no se escribe la guidance." — constitution, Art. I

No se edita `skills/sdd-consult/SKILL.md` ni `skills/sdd-init-greenfield/SKILL.md`. **No hay GREEN**: sin fallo que revertir, no hay nada que verificar. La Task 3 del plan queda recortada a este documento, y la task cierra con las Tasks 1 y 2.

Tercer ciclo consecutivo del kit en que el RED recorta alcance (tras `carril-rama-worktree` y `modo-lite`). El patrón ya no es anecdótico: **la guidance que se planifica desde la intuición sobra más veces de las que falta**, y el baseline es lo que lo separa.

## Deuda de método que este RED deja abierta

El staging por renombrado no aísla la dependencia: solo hace ininvocable un nombre. Para probar de verdad una degradación haría falta un entorno sin la skill, que hoy el método de test del kit no sabe montar. Anotado como limitación conocida, no resuelta.
