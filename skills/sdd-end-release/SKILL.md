---
name: sdd-end-release
description: Usar cuando hay que cerrar una release/entrega en un proyecto con .docs/sdd/ — el usuario dice "cierra la release", "prepara la entrega", "el cliente espera el email", acaba de haber una demo de entrega con el cliente, o el changelog acumula tasks sin corte de versión. No para cerrar una task individual (eso es sdd-end-task).
---

# sdd-end-release

## Overview

Cerrar una release es la **Definition of Done del hito**: se ejecuta SOBRE tasks ya cerradas (vía
`sdd-end-task`) y produce los artefactos que convierten trabajo acumulado en una entrega: changelog
sellado, release notes de cliente, feedback triado, roadmap colapsado y tag.

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
   [versionado.md](references/versionado.md).
2. **Acta + triage del feedback** *(si hubo demo/reunión con transcripción o notas)* — inventario COMPLETO
   en `.docs/sdd/releases/vX.Y.Z/feedback.md`, con la fuente archivada al lado. La **decisión es del
   usuario, item a item** — el feedback se procesa con criterio de producto, no se transcribe como
   compromisos. Estructura del acta, valores del triage y dónde va cada cosa:
   [acta-y-retro.md](references/acta-y-retro.md).
3. **Retro con evidencia** *(si existe `estimation-log.md`)* — como sección del MISMO `feedback.md`. Sin
   evidencia no es retro, es opinión. Qué debe contener: [acta-y-retro.md](references/acta-y-retro.md).
4. **Sellar el changelog** *(si existe `changelog.md`)* — `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` y nueva
   `[Unreleased]` vacía arriba. El contenido sellado no se toca.
5. **Release notes de cliente** — `.docs/sdd/releases/vX.Y.Z/release-notes.md`, destiladas del changelog
   sellado en outcome para el usuario. Nunca son el changelog tal cual. Receta y prohibiciones:
   [notas-y-roadmap.md](references/notas-y-roadmap.md).
6. **Colapsar el roadmap** — ANTES de sustituir nada, rescata los pendientes vivos de la sección de la
   release. Procedimiento: [notas-y-roadmap.md](references/notas-y-roadmap.md).
7. **Versión + tag** — bump con el tooling del proyecto y deja la rama lista. ⛔ **GATE: el merge al
   branch estable y el tag son SIEMPRE decisión del usuario** — prepáralos, preséntalos y espera su
   confirmación explícita; usuario ausente → quedan PENDIENTES en tu informe final. Al ejecutarse: merge
   según el git-flow del proyecto, **tag ANOTADO `vX.Y.Z` sobre el merge commit del branch estable** (no
   sobre la feature, no antes del merge), push del tag.
8. **Comunicar** — entregar al cliente las release notes Y el resultado del triage (qué se decidió con su
   feedback — el "ack" que cierra el ciclo). El envío lo hace el usuario; tú preparas.

## Red flags — STOP, no has cerrado

- Vas a mandar "un email resumen del changelog" en vez de release notes con su estructura.
- Has clasificado el feedback tú solo, o hay peticiones del cliente en la tabla de deuda técnica.
- Has elegido versión (o saltado a `1.0.0`) sin confirmación del usuario.
- El merge o el tag ya están ejecutados y el usuario no los confirmó — o el tag está sobre la rama de
  feature, o antes del merge al branch estable.
- Hay tasks "cerradas" sin walkthrough/patch.md y has seguido con el cierre sin decisión del usuario.
- Has colapsado la sección del roadmap sin rescatar antes sus pendientes vivos.
- `.docs/sdd/releases/vX.Y.Z/` no existe al terminar.

| Racionalización | Realidad |
| --- | --- |
| "El changelog ya lo cuenta todo, lo mando tal cual" | Audiencias distintas: el cliente no lee IDs de task ni jerga. Las release notes se destilan, no se copian. |
| "Clasifico yo las peticiones, está claro" | El triage es decisión de producto del usuario, item a item. Tu recomendación acompaña, no sustituye. |
| "Las peticiones nuevas las apunto como deuda técnica" | Deuda = ingeniería interna. Las peticiones de producto viven en roadmap/backlog tras el triage. |
| "Hay un breaking change: toca 1.0.0" | En pre-1.0 no: `v1.0.0` marca producción, no un breaking. Y la versión la confirma el usuario. |
| "La retro la hago de memoria, fue hace nada" | Sin los números del estimation-log y los action items anteriores no hay aprendizaje, hay anécdota. |
| "Hay prisa con el email: colapso el roadmap y sigo" | Un pendiente vivo enterrado en el colapso es scope perdido en silencio. Primero rescatar, después colapsar. |
| "El usuario ya nombró la versión en su encargo: la doy por confirmada y ejecuto merge+tag" | Nombrar el hito describe el encargo. La confirmación se pide sobre la propuesta final de cierre; merge y tag esperan al usuario. |
| "El trabajo está entregado y demostrado; el walkthrough que falta no bloquea" | Evidencia faltante = gate de entrada fallido. Se regulariza o lo decide el usuario; documentarlo y seguir es la racionalización, no el remedio. |
