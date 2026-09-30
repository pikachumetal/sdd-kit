---
name: sdd-end-release
description: Usar cuando hay que cerrar una release/entrega en un proyecto con .docs/sdd/ — el usuario dice "cierra la release", "prepara la entrega", "el cliente espera el email", o el changelog acumula features sin corte de versión. No para cerrar una feature individual (eso es sdd-end-feature).
---

# sdd-end-release

## Overview

Cerrar una release es el **corte de publicación** de lo hecho, como la rama de release de git-flow: el
modo incremental (feature y patch sin abrir release) llega aquí igual. Se ejecuta SOBRE features ya cerradas (vía `sdd-end-feature`) y produce los
artefactos que convierten trabajo acumulado en una entrega: changelog sellado, release notes de cliente
(solo con destinatario), roadmap colapsado y tag.

**El feedback de una demo o reunión no se procesa en el cierre**: su acta y su triaje son de `sdd-roadmap`,
y el cierre sigue con sus cinco pasos sin esperar a que se procese.

**Principio central: dos audiencias, dos documentos.** El changelog es exhaustivo y técnico (equipo);
las release notes se **destilan** de él, curadas y por beneficio (cliente). Nunca son el mismo documento.

**Violar la letra del checklist es violar su espíritu** — la prisa del "email de entrega hoy" es
exactamente cuando se salta lo que luego cuesta semanas recuperar.

## ⛔ Gate de entrada

Toda feature/patch de la release cerrada vía `sdd-end-feature` (walkthrough + changelog al día) y el build/lint
del proyecto en verde. Trabajo a medias → se decide CON el usuario si entra o se mueve, nunca en silencio.
Una feature que figura cerrada en roadmap/changelog pero **sin walkthrough/patch.md es evidencia faltante**:
mismo tratamiento que el trabajo a medias — decisión del usuario, no "lo anoto y sigo".
Con el usuario ausente: se PREPARAN los pasos 1-4 y el paso 5 queda **pendiente** — nunca se resuelve el
gate en solitario.

## Checklist de cierre (crea un todo por paso)

1. **Congelar scope y versión** — explícito: qué entra, qué se mueve a la siguiente. La versión se propone
   y **la confirma el usuario** sobre la propuesta final de cierre. Reglas de numeración SemVer pre-1.0:
   [versionado.md](references/versionado.md). Si `.docs/sdd/sdd-kit.json` no tiene `release.hasRecipient`,
   pregúntale una vez al usuario si la release se entrega a alguien distinto de quien la hace, y escribe
   su respuesta en ese campo fusionando (sin tocar `version`, `channel` ni `ids`); con el campo ya
   presente, aplica el valor que tiene en este momento, sin preguntar. Nunca escribas ni cambies el campo
   por tu cuenta — solo con una respuesta o petición explícita del usuario.
   *(si existe `estimation-log.md`)* La misma propuesta ofrece la **retro**, en una línea y sin pregunta
   aparte. Es opcional: se hace solo si el usuario la pide, y no retiene los demás pasos: si el roadmap ya está colapsado, se añade su enlace a la entrada de la release. Qué
   contiene: [retro.md](references/retro.md).
2. **Sellar el changelog** *(si existe `changelog.md`)* — `[Unreleased]` → `[X.Y.Z] - YYYY-MM-DD` y nueva
   `[Unreleased]` vacía arriba. El contenido sellado no se toca.
3. **Release notes y comunicación** *(solo con `release.hasRecipient: true`)* —
   `.docs/sdd/releases/vX.Y.Z/release-notes.md`, destiladas del changelog sellado en outcome para el
   usuario, y el borrador del email de entrega en la misma carpeta. Nunca son el changelog tal cual. El
   envío lo hace el usuario; tú preparas. Sin destinatario, el paso se omite: basta el changelog sellado.
   Receta, prohibiciones y la entrada del roadmap sin destinatario:
   [notas-y-roadmap.md](references/notas-y-roadmap.md).
4. **Colapsar el roadmap** — antes de tocarlo, ejecuta
   `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Test-Roadmap.ps1" -Path .docs/sdd`
   (desde el `Base directory` de esta skill, el script está en `../sdd-templates/scripts/`). Con
   `Sin roadmap que validar`, el paso se salta. Si da un fallo de forma —una sección, prosa o una tabla
   fuera de la plantilla, como una «Versión siguiente» con el trabajo de la release—, **no cortes desde
   ella**: di que no es una sección `## Release <N>`, nombra la sección y propón llevar el roadmap a la
   forma con el paso «Roadmap en la forma de la plantilla» de
   [migrations/v2.3.0.md](../sdd-init-brownfield/references/migrations/v2.3.0.md), con su gate. Sin el visto
   del dev-lead a ese gate, el paso 4 queda pendiente y el paso 5 no se ejecuta. En el RED, 2 de 2 sujetos
   cortaron desde «Versión siguiente» sin decirlo y la dejaron en el roadmap (`tests/release-close-roadmap-red.md`, R1).
   ANTES de sustituir nada, rescata los pendientes vivos de la sección de la release. Las diferidas que
   dispara esta release son las filas `🧪 validación diferida a <esta release>` **y** los ids de las líneas
   `validaciones pendientes:` de releases cerradas cuyo walkthrough (o `patch.md`) pone el disparador en
   esta release: antes de colapsar pide al dev-lead que valide el smoke diciendo qué probó, nombrándolas
   todas. Cada una que menciona gana una adenda fechada en su `walkthrough.md` con lo que le toca y sale de
   las pendientes: su fila, en el colapso; su id, de la línea de la release anterior, que se borra si queda
   vacía. La que no menciona gana una adenda fechada con el disparador nuevo —la siguiente release, salvo
   que el dev-lead nombre otro—, **su fila sale igual** y su id va a la línea `validaciones pendientes:` de
   la release que cierras; el resumen de cierre la lista. En el RED, 4 de 4 sujetos dejaron la diferida
   como fila de una sección abierta además de en la línea, y ninguno preguntó por la de la release
   anterior (R3, R6). Procedimiento del colapso: [notas-y-roadmap.md](references/notas-y-roadmap.md).
   Tras colapsar, y antes del commit del cierre, vuelve a ejecutar el validador: tiene que escribir
   `Roadmap válido`. Cada línea de fallo se corrige en el roadmap, nunca en el validador; hasta que lo
   escriba, el paso 5 no se ejecuta. En el RED, 4 de 4 sujetos dejaron el roadmap en rojo sin ejecutarlo:
   la deuda saldada y el patch ya publicados seguían en sus tablas (R2, R5).
5. **Versión, tag y merge** — bump con el tooling del proyecto y deja la rama lista. ⛔ **GATE: el merge al
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
   sobre la feature, no antes del merge), push del tag y, si el git-flow tiene rama de integración
   (`develop`), **merge de vuelta del branch estable a esa rama**, para que el tag quede en su historia.
   Con `ids.mode: tracker`, el resumen de cierre lista los ids de ticket de
   `[Unreleased]` que entran en la versión.

## Red flags — STOP, no has cerrado

- Vas a mandar "un email resumen del changelog" en vez de release notes con su estructura.
- Has elegido versión (o saltado a `1.0.0`) sin confirmación del usuario.
- El merge o el tag ya están ejecutados y el usuario no los confirmó — o el tag está sobre la rama de
  feature, o antes del merge al branch estable.
- Te has concedido el atajo tú mismo: escribiste `release.hasRecipient: false` sin que el usuario
  respondiera, o disparaste `sdd-end-release` sin una orden de cierre suya en la conversación.
- Hay features "cerradas" sin walkthrough/patch.md y has seguido con el cierre sin decisión del usuario.
- Has colapsado la sección del roadmap sin rescatar antes sus pendientes vivos.
- Vas a cortar desde una sección que no es `## Release <N>` («Versión siguiente») sin decirlo, o a
  colapsar con el validador dando un fallo de forma.
- Vas a commitear el cierre, o a proponer merge y tag, sin que `Test-Roadmap.ps1` haya escrito
  `Roadmap válido` sobre el roadmap colapsado.
- Una feature publicada en esta release sigue como fila de «Próximo» o de otra sección abierta, también
  una `🧪`: su sitio es la línea `validaciones pendientes:`.
- `.docs/sdd/releases/vX.Y.Z/` no existe al terminar, habiendo destinatario o habiendo retro (sin
  ninguno de los dos, la carpeta no es obligatoria).

| Racionalización | Realidad |
| --- | --- |
| "El changelog ya lo cuenta todo, lo mando tal cual" | Audiencias distintas: el cliente no lee IDs de feature ni jerga. Las release notes se destilan, no se copian. |
| "Hay un breaking change: toca 1.0.0" | En pre-1.0 no: `v1.0.0` marca producción, no un breaking. Y la versión la confirma el usuario. |
| "La retro la hago de memoria, fue hace nada" | Sin los números del estimation-log y los action items anteriores no hay aprendizaje, hay anécdota. |
| "Hay prisa con el email: colapso el roadmap y sigo" | Un pendiente vivo enterrado en el colapso es scope perdido en silencio. Primero rescatar, después colapsar. |
| "El usuario ya nombró la versión en su encargo: la doy por confirmada y ejecuto merge+tag" | Nombrar el hito describe el encargo. La confirmación se pide sobre la propuesta final de cierre; merge y tag esperan al usuario. |
| "Que me des la versión no cuenta como confirmación de estos pasos, así que pregunto otra vez" | Cuenta si citas la orden de cierre y la versión respondiendo a tu propuesta del paso 1, y `hasRecipient: false` lo escribió el usuario sin mover scope: con las tres condiciones, la segunda ronda sobra. |
| "Escribo yo `hasRecipient: false`: el proyecto es claramente de una persona" | El campo solo lo escribe el usuario, por respuesta o petición explícita suya. Sin eso, ninguna condición es válida y el gate sigue completo. |
| "«Versión siguiente» hace de sección de la release: colapso desde ahí" | Es la forma que dejó los cortes de la 2.1.0 y la 2.2.0 del kit con las filas publicadas dentro. Un fallo de forma del validador se dice y se lleva a la migración, con su gate. |
| "La 0022 no se validó: la dejo con 🧪 en «Próximo» para que no se pierda" | No se pierde: su id queda en `validaciones pendientes:` y el disparador en su walkthrough. Como fila, el validador la da por publicada y en una sección abierta (R3, 4/4). |
| "El roadmap se ve bien, no hace falta pasar el validador" | 4 de 4 sujetos lo dieron por bueno con la deuda saldada y el patch publicado aún en sus tablas. `Roadmap válido` es la prueba, no la lectura. |
| "El trabajo está entregado y demostrado; el walkthrough que falta no bloquea" | Evidencia faltante = gate de entrada fallido. Se regulariza o lo decide el usuario; documentarlo y seguir es la racionalización, no el remedio. |
