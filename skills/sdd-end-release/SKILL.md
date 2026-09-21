---
name: sdd-end-release
description: Usar cuando hay que cerrar una release/entrega en un proyecto con .docs/sdd/ — el usuario dice "cierra la release", "prepara la entrega", "el cliente espera el email", acaba de haber una demo de entrega con el cliente, o el changelog acumula tasks sin corte de versión. No para cerrar una task individual (eso es sdd-end-task).
---

# sdd-end-release

## Overview

Cerrar una release es la **Definition of Done del hito** y el **corte de publicación**: se lanza haya
habido apertura con `sdd-start-release` o no — el modo incremental (task y patch sin abrir release) llega
aquí igual. Se ejecuta SOBRE tasks ya cerradas (vía `sdd-end-task`) y produce los artefactos que
convierten trabajo acumulado en una entrega: changelog sellado, release notes de cliente, feedback
triado, roadmap colapsado y tag.

**Principio central: dos audiencias, dos documentos.** El changelog es exhaustivo y técnico (equipo);
las release notes se **destilan** de él, curadas y por beneficio (cliente). Nunca son el mismo documento.

**Violar la letra del checklist es violar su espíritu** — la prisa del "email de entrega hoy" es
exactamente cuando se salta lo que luego cuesta semanas recuperar.

## ⛔ Gate de entrada

Toda task/patch de la release cerrada vía `sdd-end-task` (walkthrough + changelog al día) y el build/lint
del proyecto en verde. Trabajo a medias → se decide CON el usuario si entra o se mueve, nunca en silencio.
Una task que figura cerrada en roadmap/changelog pero **sin walkthrough/patch.md es evidencia faltante**:
mismo tratamiento que el trabajo a medias — decisión del usuario, no "lo anoto en el acta y sigo".
Con el usuario ausente: se PREPARAN los pasos 1-6 y el paso 7 queda **pendiente** — nunca se resuelve el
gate en solitario.

## Checklist de cierre (crea un todo por paso)

1. **Congelar scope y versión** — explícito: qué entra, qué se mueve a la siguiente. La versión se propone
   y **la confirma el usuario** sobre la propuesta final de cierre. Reglas de numeración SemVer pre-1.0:
   [versionado.md](references/versionado.md). Si `.docs/sdd/sdd-kit.json` no tiene `release.hasRecipient`,
   pregúntale una vez al usuario si la release se entrega a alguien distinto de quien la hace, y escribe
   su respuesta en ese campo fusionando (sin tocar `version`, `channel` ni `ids`); con el campo ya
   presente, aplica el valor que tiene en este momento, sin preguntar. Nunca escribas ni cambies el campo
   por tu cuenta — solo con una respuesta o petición explícita del usuario.
2. **Acta + triage del feedback** *(si hubo demo/reunión con transcripción o notas)* — inventario COMPLETO
   en `.docs/sdd/releases/vX.Y.Z/feedback.md`, con la fuente archivada al lado. La **decisión es del
   usuario, item a item** — el feedback se procesa con criterio de producto, no se transcribe como
   compromisos. Estructura del acta, valores del triage y dónde va cada cosa:
   [acta-y-retro.md](references/acta-y-retro.md).
3. **Retro con evidencia** *(si existe `estimation-log.md`)* — como sección del MISMO `feedback.md`. Sin
   evidencia no es retro, es opinión. Qué debe contener: [acta-y-retro.md](references/acta-y-retro.md).
4. **Sellar el changelog** *(si existe `changelog.md`)* — `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` y nueva
   `[Unreleased]` vacía arriba. El contenido sellado no se toca.
5. **Release notes de cliente** *(solo con `release.hasRecipient: true`)* — `.docs/sdd/releases/vX.Y.Z/release-notes.md`,
   destiladas del changelog sellado en outcome para el usuario. Nunca son el changelog tal cual. Sin
   destinatario, el paso se omite: basta el changelog sellado. Receta, prohibiciones y la entrada del
   roadmap sin destinatario: [notas-y-roadmap.md](references/notas-y-roadmap.md).
6. **Colapsar el roadmap** — ANTES de sustituir nada, rescata los pendientes vivos de la sección de la
   release. Procedimiento: [notas-y-roadmap.md](references/notas-y-roadmap.md).
7. **Versión + tag** — bump con el tooling del proyecto y deja la rama lista. ⛔ **GATE: el merge al
   branch estable y el tag son SIEMPRE decisión del usuario** — prepáralos, preséntalos y espera su
   confirmación explícita; usuario ausente → quedan PENDIENTES en tu informe final. **Atajo, solo si se
   cumplen las tres a la vez**: (a) un mensaje del usuario en esta conversación ordena el cierre (p. ej.
   «cierra la release», o él mismo invocó `/sdd-end-release`) — que la skill se dispare porque lo sugiere
   su `description` no cuenta; (b) el usuario ha escrito o aceptado la versión exacta respondiendo a tu
   propuesta del paso 1; (c) `release.hasRecipient: false`, escrito por respuesta o petición explícita del
   usuario, y ningún item del scope se ha movido desde la orden de cierre. Con las tres, cita literal la
   orden y la versión en el resumen, y ejecuta merge + tag en el mismo turno, sin pedir otra confirmación.
   Si falta cualquiera de las tres: el gate de siempre — prepara, presenta, espera. Al ejecutarse: merge
   según el git-flow del proyecto, **tag ANOTADO `vX.Y.Z` sobre el merge commit del branch estable** (no
   sobre la feature, no antes del merge), push del tag. Con `ids.mode: tracker`, el resumen de cierre
   lista los ids de ticket de `[Unreleased]` que entran en la versión.
8. **Comunicar** *(solo con `release.hasRecipient: true`)* — entregar al destinatario las release notes Y
   el resultado del triage (qué se decidió con su feedback — el "ack" que cierra el ciclo). El envío lo
   hace el usuario; tú preparas. Sin destinatario, este paso no aplica.

## Red flags — STOP, no has cerrado

- Vas a mandar "un email resumen del changelog" en vez de release notes con su estructura.
- Has clasificado el feedback tú solo, o hay peticiones del cliente en la tabla de deuda técnica.
- Has elegido versión (o saltado a `1.0.0`) sin confirmación del usuario.
- El merge o el tag ya están ejecutados y el usuario no los confirmó — o el tag está sobre la rama de
  feature, o antes del merge al branch estable.
- Te has concedido el atajo tú mismo: escribiste `release.hasRecipient: false` sin que el usuario
  respondiera, o disparaste `sdd-end-release` sin una orden de cierre suya en la conversación.
- Hay tasks "cerradas" sin walkthrough/patch.md y has seguido con el cierre sin decisión del usuario.
- Has colapsado la sección del roadmap sin rescatar antes sus pendientes vivos.
- `.docs/sdd/releases/vX.Y.Z/` no existe al terminar, habiendo destinatario o habiendo existido acta (sin
  ninguno de los dos, la carpeta no es obligatoria).

| Racionalización | Realidad |
| --- | --- |
| "El changelog ya lo cuenta todo, lo mando tal cual" | Audiencias distintas: el cliente no lee IDs de task ni jerga. Las release notes se destilan, no se copian. |
| "Clasifico yo las peticiones, está claro" | El triage es decisión de producto del usuario, item a item. Tu recomendación acompaña, no sustituye. |
| "Las peticiones nuevas las apunto como deuda técnica" | Deuda = ingeniería interna. Las peticiones de producto viven en roadmap/backlog tras el triage. |
| "Hay un breaking change: toca 1.0.0" | En pre-1.0 no: `v1.0.0` marca producción, no un breaking. Y la versión la confirma el usuario. |
| "La retro la hago de memoria, fue hace nada" | Sin los números del estimation-log y los action items anteriores no hay aprendizaje, hay anécdota. |
| "Hay prisa con el email: colapso el roadmap y sigo" | Un pendiente vivo enterrado en el colapso es scope perdido en silencio. Primero rescatar, después colapsar. |
| "El usuario ya nombró la versión en su encargo: la doy por confirmada y ejecuto merge+tag" | Nombrar el hito describe el encargo. La confirmación se pide sobre la propuesta final de cierre; merge y tag esperan al usuario. |
| "Que me des la versión no cuenta como confirmación de estos pasos, así que pregunto otra vez" | Cuenta si citas la orden de cierre y la versión respondiendo a tu propuesta del paso 1, y `hasRecipient: false` lo escribió el usuario sin mover scope: ahí preguntar de más es la misma indecisión, en el otro sentido. Pero el atajo no te lo concedes tú: si el campo lo escribiste tú o disparaste la skill sin su orden, ninguna condición es válida y el gate sigue completo. |
| "El trabajo está entregado y demostrado; el walkthrough que falta no bloquea" | Evidencia faltante = gate de entrada fallido. Se regulariza o lo decide el usuario; documentarlo y seguir es la racionalización, no el remedio. |
