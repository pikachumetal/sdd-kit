---
name: sdd-consult
description: Usar cuando el usuario quiere preguntar, entender, planificar o estructurar algo del proyecto con el contexto cargado, sin arrancar el flujo SDD — "una duda", "¿por qué…?", "¿dónde tocaría…?", "¿cómo enfocarías…?", "¿qué hacemos ahora?". No para implementar una feature (sdd-start-task), arreglar un bug determinista (sdd-start-patch) ni investigar un fallo (superpowers:systematic-debugging).
---

# sdd-consult

## Overview

El **anti-carril**: preguntar, entender, planificar o estructurar **con el contexto del proyecto cargado**, sin producir artefactos. No es SDD clásico — no hay spec, plan, rama ni cierre. Su valor es doble: **respuestas ancladas en los documentos de anclaje** (no en suposiciones) y **la disciplina de no sobre-disparar** el proceso ante lo que solo era una pregunta.

A diferencia del Gate 1 de `sdd-start-task`, aquí **la pregunta ES el enunciado**: explorar el código (semble/Grep/Read) está permitido desde el inicio, en la medida que la pregunta lo pida.

## Cómo se trabaja (ligero, sin gates)

1. **Primar contexto proporcional a la pregunta** — leer los documentos de anclaje relevantes (`mission`, `constitution`, `tech-stack`, `roadmap`, `architecture`, `capabilities/<capability>`, actas de `releases/`) antes de responder, y el código si la pregunta lo pide. Proporcionalidad: una duda de estructura lee `architecture` + el código; un "¿qué hacemos ahora?" lee `roadmap` + el acta. **Distingue siempre lo que dice el doc de lo que infieres tú.**
2. **Elige el modo:**
   - **Entender / explicar** ("¿por qué…?", "¿dónde tocaría…?", "¿esto cómo va?") → lee y responde. **Nada de interrogatorio**: lanzar un grilling a una pregunta puntual molesta tanto como sobre-disparar.
   - **Sondear / probar viabilidad** ("¿se puede…?", "pruébalo rápido", salida = una respuesta) → es un spike: explora y prueba lo que haga falta, pero todo lo que construyas es **desechable y se etiqueta así**; la salida es una recomendación en la conversación. Nada persiste: ni carpeta de spec, ni rama, ni código conservado. Si la respuesta es "sí, y lo queremos", eso es una petición nueva: handoff al carril (paso 5).
   - **Pensar / estructurar / tensar una dirección** ("¿cómo enfocarías X?", "pensémoslo bien") → `grilling` (interroga una a una, recomienda respuesta, sin artefactos, no ligado a SDD). **NUNCA `superpowers:brainstorming`**: ese es el motor de construir features y acaba en spec → plan → implementación; aplicado a una consulta, la convierte en lo que no era.
3. **Cero artefactos por defecto** — sin carpeta de spec, sin rama, sin tocar código, sin editar `roadmap`/docs "de paso". La respuesta vive en la conversación.
4. **Salida durable opcional (con aprobación)** — si la consulta destapa un doc de anclaje desactualizado o produce una decisión que merece registrarse, **proponlo** y espera el OK del usuario; solo entonces se escribe, en el doc que le corresponde. Actualizar un doc **no** es "aprovechar y dejarlo hecho".
5. **Handoff cuando se vuelve trabajo** — si la conversación pide hacerlo de verdad, **anúncialo y transiciona al carril**: feature/cambio no trivial → `sdd-start-task`; bug determinista → `sdd-start-patch`; abrir/planificar release → `sdd-start-release`; investigar un fallo → `superpowers:systematic-debugging`. El carril destino **gatea y asigna el id**. La consulta **no** ejecuta el trabajo por su cuenta.

## Red flags — STOP, esto ya no es consulta

- Vas a crear una carpeta en `.docs/sdd/specs/` (o un `patch.md`, o una rama) desde la consulta.
- Estás **reproduciendo un carril a mano** (calcando el naming de una spec/patch) en vez de invocar `sdd-start-task`/`-patch`.
- Vas a escribir un **id de ticket que te has inventado** porque "es el siguiente libre".
- Vas a editar `roadmap`/`changelog`/un doc de anclaje sin que el usuario lo haya aprobado.
- Has lanzado un interrogatorio (`grilling`) a una pregunta que se contestaba leyendo y respondiendo.
- Has agarrado `brainstorming` para "solo pensarlo".

| Racionalización | Realidad |
| --- | --- |
| "Me pide 'arréglalo' directamente, así que creo yo el patch.md" | "Arréglalo" es el disparo del handoff, no permiso para fabricar el artefacto. Se transiciona al carril, que gatea la causa raíz y el id — o, si hay que interpretar el enfoque, es task, no patch. |
| "Elijo el id de ticket siguiente libre y lo marco tentativo" | La consulta puede **calcular y proponer** el siguiente id con `Get-NextSddId.ps1`, pero no lo reserva ni lo escribe en ningún artefacto: la reserva es del carril. |
| "Reproduzco la convención de naming a mano, total la sé" | Reproducir el carril a mano se salta sus gates. Si es trabajo, se invoca el carril; si no, no hay artefacto. |
| "Ya que he mirado el roadmap y está desfasado, lo actualizo de paso" | La salida durable se propone y se aprueba. Editar "de paso" es exactamente lo que este carril no hace. |
| "Para estructurar esto uso brainstorming" | Brainstorming construye features (acaba en spec). Para estructurar/tensar una dirección sin artefactos: `grilling`. |
| "Un spike, aunque sea rápido, ya es implementar: no toco código, lo mando al carril task" | Sondear no es implementar. "Cero artefactos" prohíbe lo que persiste, no la prueba desechable que responde la pregunta. Negarse a probar y abrir una task es sobre-disparar. |
