---
id: 20260923-143450-task-0040-close-push
task: 0040
title: Final del cierre — push autorizado y aviso de terminado
mode: full
status: approved
created: 2026-09-23
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — Final del cierre: push autorizado y aviso de terminado

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (`merge.push` en `sdd-kit.json`, que leen los dos cierres y escriben las init y la migración), MODIFIED (tres requisitos), datos (dato persistente nuevo y migración v1.2.0), tres capacidades (`control-profiles`, `onboarding`, `migration`)
- Dominio: si la pregunta 3 y el MODIFIED de la migración dejan igual a un proyecto que ya tiene `merge` declarado, y la recomendación con una convención que no es git-flow (señal: MODIFIED + datos)
- Técnica: si «El cierre acaba con una línea de terminado» cubre el merge denegado y el push fallido sin contradecir «Un merge que el entorno deniega se informa con su evidencia» (señal: contrato público)
- Mínimo razonable: ninguna — deja sin mirar la forma de la línea de terminado frente a los requisitos del merge ya vigentes
```

Nivel elegido por el dev-lead: dos revisores (2026-09-23).

1. **`merge.push` es opcional dentro del bloque `merge`**, booleano, con default `false`: ausente equivale a no hacer push. No entra en la definición de «bloque completo» (`into`, `noFf`, `removeWorktree`). Si entrara, este repo y cualquier proyecto con la política ya declarada volverían a preguntar el merge en cada cierre.
2. **El push es solo de la rama de integración**, tras el merge del cierre y con la suite en verde sobre el resultado. Va al upstream de `merge.into` (`git rev-parse --abbrev-ref <into>@{upstream}`), sin `--force` ni tags, y nunca empuja la rama de la feature. Sin upstream no hay push, y el mensaje final lo dice. No se inventa el remoto.
3. **Un push que no sale no se arregla**: rechazado porque el remoto avanzó, sin credenciales o denegado por el entorno. No hay `pull`, `rebase`, `--force` ni otra herramienta. El mensaje final cita el comando y el error, y deja el merge local con su hash. Es la misma regla que ya tiene el merge denegado. Si el merge no se hizo, no se intenta el push.
4. **Perfiles**: en `delegate` y `unattended`, con `merge.push: true`, el push se hace sin preguntar. En `pair` se presenta con el merge y se espera, igual que el merge. La fila «Merge a main, tag, push, PR, publicar» de la tabla de gates se parte: el push de la rama de integración sigue `merge.push`, y el resto sigue siendo de una persona.
5. **La pregunta es la 3 del bloque de claves de control**. Solo se hace si la 2 dejó el bloque `merge` declarado. Los frenos pasan a ser la 4, y las init renumeran su referencia sin copiar el texto (Art. V, una sola fuente). Recomendación «sí» con git-flow; con otra convención de ramas, sin recomendación. «No sé» no escribe nada.
6. **La migración que cambia es `v1.2.0.md`**, porque la 1.2.0 no se ha publicado todavía: no nace una v1.3.0.
7. **El paso «Mensaje final» es el último del cierre**: 12 en `sdd-end-task` y 8 en `sdd-end-patch`. El paso del ticket vuelve a decidir solo si se ofrece. El aviso del disparador concretado (patch 0037) se muda del paso 11 al 12 con el mismo texto.
8. **Orden del mensaje final**: disparador concretado · decisiones tomadas sin el dev-lead · instrucciones del dev-lead y cómo quedó cada una · pendiente · oferta del ticket · **línea de terminado**, siempre la última. Solo incluye lo que tenga contenido.
9. **Cuándo se puede borrar el worktree**: con la rama fusionada en `merge.into` y el worktree sin cambios sin commitear. Un push fallido no lo impide, porque el merge vive en el repo, no en el worktree. Si el merge no se hizo, la línea dice «No terminado» y qué falta.
10. **Si el dev-lead acepta el ticket después de la línea de terminado**, al escribirlo se repite la línea. El ticket es un fichero nuevo en el worktree, y hasta que no se commitee y se fusione el worktree ya no se puede borrar.
11. **F4 no lleva guidance propia**: cumplir una instrucción del dev-lead dada al validar pasó 2/2 en el RED. Solo entra como línea del mensaje final y como control de no regresión en el GREEN.
12. **No escribo `merge.push` en el `sdd-kit.json` de este repo.** La regla del atajo autoconcedido pide tu frase, así que te lo pregunto en la validación.
13. **Capacidades tocadas**: `control-profiles` (push y mensaje final: los dos son del paso de rama del cierre, que ya vive ahí), `onboarding` y `migration`. No nace ninguna capacidad nueva.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, perfil `delegate` y **spec aprobada por delegación**: opción «Full + delegate, spec aprobada por delegación» de la primera pregunta (2026-09-23). Su texto: «Apruebas la spec por delegación ("nos vemos en la validación")».
- «Sí» recomendado cuando la política es git-flow. Es decisión del dev-lead del 2026-09-23, escrita en la fila 0040 del roadmap.

## Intent

El dev-lead lo pidió así: «siempre tengo que decirle quiero merge a develop no ff y push y que me avise claramente cuando hemos acabado y puedo borrar el worktree». El merge ya lo aplica la política `merge` desde la 0009. Faltan dos cosas.

El push: la tabla de gates lo reserva a una persona, y con `"push": true` escrito en `sdd-kit.json` 1 de 3 sujetos lo intentó, y se contradijo al contarlo (RED F1).

El final: ningún mensaje de cierre dice que el worktree se pueda borrar (0/5, F2) ni nombra las decisiones que el agente tomó solo (0/3, F3). Lo que tiene que acabar en el mensaje final no llega si no tiene un paso propio (patch 0037 §2).

## Scope

- Entra: clave `merge.push` en `control-profiles.md` (tabla de claves, tabla de gates y pregunta 3 del bloque); push tras el merge en el paso 10 de `sdd-end-task`, el paso 6 de `sdd-end-patch` y `merge-recipe.md`; paso «Mensaje final» en los dos cierres; referencias renumeradas en las dos init; `migrations/v1.2.0.md` (aplica, paso 2, paso 5, «Escribe» y verificación); `mission.md` (acciones hacia fuera); tests estructurales de `ControlProfiles.Tests.ps1`.
- No entra: push de la rama estable, de tags o de la feature; crear PR; borrar el worktree por el agente (sigue siendo `merge.removeWorktree`); cambiar `sdd-feedback`; escribir `merge.push` en el `sdd-kit.json` de este repo sin la frase del dev-lead.

## Approach

La clave se declara donde viven las demás (`control-profiles.md`) y se pregunta desde su bloque, que ya enlazan las dos init y la migración. El push es una sección más de la receta del merge, porque ocurre en el mismo sitio y con la misma regla de denegación; cada cierre lo enuncia en una línea en su paso de rama. El mensaje final es un paso propio y el último de cada checklist, con la línea de terminado en forma fija: es la forma que el RED mostró que falta (Art. II, fallo de forma → receta).

## Delta de comportamiento

### Capacidad: `control-profiles`

**MODIFIED — El perfil de control decide dónde para el agente** (antes: «en los tres perfiles se confirman siempre las acciones hacia fuera (push, PR, publicar)»)

- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una task
- THEN para en estos puntos y en ningún otro: `pair` en la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND en los tres perfiles se confirman siempre las acciones hacia fuera (push, PR, publicar), salvo el push de la rama de integración que autoriza `merge.push`, y el merge a `main` y el tag los decide una persona

**ADDED — El push de la rama de integración sigue `merge.push`**
- GIVEN un cierre de task o de patch que acaba de fusionar en `merge.into` según la política, con la suite en verde sobre el resultado, y `merge.push: true` en `sdd-kit.json`
- WHEN el perfil vigente es `delegate` o `unattended`
- THEN el agente hace push de `merge.into` a su upstream sin preguntar, y no empuja ninguna otra rama ni tags
- AND en `pair` presenta el push junto con el merge y espera
- AND con `merge.push` ausente o `false`, o sin upstream en `merge.into`, no hace push, y el mensaje final lo dice

**ADDED — Un push que no sale se informa y no se fuerza**
- GIVEN `merge.push: true` y un push que falla: el remoto lo rechaza, faltan credenciales o el entorno lo deniega
- WHEN el cierre termina
- THEN el mensaje final cita el comando literal y el error, y dice que el merge queda en local con el hash de `merge.into`
- AND el agente no reintenta con `--force`, `pull`, `rebase` ni otra herramienta

**ADDED — El cierre acaba con una línea de terminado**
- GIVEN un cierre de task (`sdd-end-task`) o de patch (`sdd-end-patch`) que ha recorrido su checklist
- WHEN el agente escribe su último mensaje
- THEN el mensaje nombra, si los hay, el disparador que concretó el agente, las decisiones tomadas sin el dev-lead que registra el walkthrough (o el `patch.md`), cada instrucción que el dev-lead dio antes del cierre y cómo quedó, y lo pendiente; y ofrece el ticket del kit si toca
- AND su última línea es la de terminado: si la rama está fusionada en `merge.into` y el worktree no tiene cambios sin commitear, dice rama, destino, hash, estado del push (hecho, no hecho y por qué) y que se puede borrar el worktree, con su ruta; si no, dice «No terminado», qué falta y que el worktree no se borra todavía
- AND si después el agente escribe el ticket del kit en ese worktree, repite la línea de terminado con el ticket como pendiente hasta que se commitee y se fusione

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge`, con `merge.push` opcional); el perfil de la task, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap.

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las claves de control**
- GIVEN una init greenfield o brownfield con el usuario presente
- WHEN la entrevista llega a las claves de control
- THEN el agente hace, en turnos distintos, las preguntas del bloque de `control-profiles.md`, cada una con su opción recomendada y su motivo: perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow) y frenos (3 agentes; 8 y 20 minutos)
- AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND en brownfield sin usuario, las cuatro quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults

### Capacidad: `migration`

**MODIFIED — La migración a v1.2.0 pregunta las claves de control que faltan**
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo, `merge.push` con el bloque `merge` completo, o las claves de frenos (`control.maxParallelAgents`, `control.silence.*`)
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el agente hace, una por turno, las preguntas del bloque de `control-profiles.md` que corresponden a lo que falta, las mismas que hace la init, y escribe solo lo que responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults, con el paso 10 del cierre preguntando el merge y sin push, y el informe dice cómo reanudarlo

## Enmiendas

- _Ninguna_

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada por delegación: «Full + delegate, spec aprobada por delegación» |
