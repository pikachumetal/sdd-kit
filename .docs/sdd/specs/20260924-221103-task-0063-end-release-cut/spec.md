---
id: 20260924-221103-task-0063-end-release-cut
task: 0063
title: sdd-end-release simplificado — solo el corte
mode: full
status: approved
created: 2026-09-25
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — `sdd-end-release` simplificado: solo el corte

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED/REMOVED (dos MODIFIED y un REMOVED en release-flow)
- Dominio: si el MODIFIED de «La carpeta de la release existe solo si tiene contenido» deja la carpeta obligatoria en los mismos casos que hoy, salvo el acta (señal: MODIFIED)
- Mínimo razonable: ninguna — deja sin mirar por otra mano que los dos MODIFIED copian el requisito entero; lo cubre el repaso de coherencia
```

Una señal de ocho: no toca contrato público, datos ni capacidad nueva, y todo lo que toca lo he leído en esta sesión. Sin review, decidido por delegación.

1. **Cinco pasos, en el orden del enunciado**: congelar scope y versión · sellar el changelog · release notes y comunicación · colapsar el roadmap · versión, tag y merge. El gate de entrada y el ⛔ de merge y tag, con su atajo de tres condiciones, no cambian de letra: solo cambia su número de paso (7 → 5).
2. **El paso 3 junta las release notes y el borrador de email, solo con `release.hasRecipient: true`**. Sale el «ack del triage» del paso 8 actual: sin acta no hay triaje que devolver. El envío sigue siendo del usuario.
3. **El acta y el triaje salen sin copia en ningún otro sitio**, como pediste. La skill deja una frase: el feedback de una demo o reunión no se procesa en el cierre, es entrada de `sdd-plan`. Nombra una skill que aún no existe (la 0062): es el hueco que aceptaste para `develop` hasta que estén las dos.
4. **La retro opcional se ofrece en la propuesta del paso 1** y solo con `estimation-log.md`: una línea en el mismo mensaje que ya espera la versión, sin pregunta aparte. Hoy es obligatoria si existe el log. Solo se escribe si el usuario la pide, y no retiene los demás pasos: si el roadmap ya está colapsado, se añade su enlace (enmienda del 2026-09-25).
5. **La retro va a `releases/vX.Y.Z/retro.md`**, calcando la sección «Retro» de `feedback-template.md`, no a `feedback.md`. En `feedback.md` se confundiría con el acta, que pasa a `sdd-plan`. No creo `retro-template.md`: tocaría `sdd-templates/SKILL.md`, que también toca la 0061. Queda como nota para la 0062: al llevarse el acta, decide si la retro sale a su propia plantilla.
6. **`references/acta-y-retro.md` pasa a `references/retro.md`** con solo la retro. `notas-y-roadmap.md` cambia «acta solo si existe» por «retro solo si existe» y renumera los pasos.
7. **Salen de la tabla y de las red flags las entradas del triaje y de la deuda de producto.** Se quedan la de la retro de memoria (aplica si se hace) y todas las de versión, merge, tag, colapso y evidencia faltante.
8. **La `description` pierde «acaba de haber una demo de entrega con el cliente»**: con esa frase, la skill del corte se dispararía para procesar una reunión. Se quedan «prepara la entrega» y «el cliente espera el email», que son el corte.
9. **Ficheros fuera**: `feedback-template.md`, `roadmap-template.md`, `mission.md`, `.docs/workflow/` y `sdd-start-release` describen el acta, pero son de la 0062 o se releen al subir la versión del kit. `control-profiles.md`, las init, `migrations/` y `sdd-templates/SKILL.md` son de la 0061. `plan-template.md`, `spec-template.md` y `sdd-start-task` son de la 0060. De la 0061 solo leo `ControlProfiles.Tests.ps1`: sigue pidiendo `🧪` y «disparador nuevo», que se quedan.
10. **README, una línea**: la fila de `sdd-end-release` deja de decir «acta, retro con números». La 0062 también toca el README, pero no esa línea.
11. **Test (Art. I, recorte)**: A/B de no-regresión en `tests/sdd-end-release-ab.md`, con una sección nueva para esta campaña. Control = `SKILL.md` y `references/` de `develop`. Tratamiento = versión recortada. Mismos escenarios en los dos brazos, un sujeto por brazo y Sonnet:
   - **A1**, sin destinatario y a dos turnos: atajo de merge y tag, tag anotado sobre el merge commit, merge de vuelta a `develop`, sin release notes. Molde `m5` de la 0004.
   - **A2**, con destinatario y `ids.mode: tracker`: release notes con borrador de email, gate de merge y tag que espera, y lista de tickets. Lleva `estimation-log.md` para medir la retro.
   - **A3**, con tasks `🧪 validación diferida`: pide validar el smoke antes de colapsar el roadmap.
   - **A4**, con la transcripción de una demo: el cambio buscado. El control escribe el acta; el tratamiento no la escribe, remite a `sdd-plan` y sigue. El brazo de control hace de RED de la frase nueva de la decisión 3.

   El corte se publica si el tratamiento reproduce el control en A1–A3, y en A4 y en la retro de A2 da la conducta nueva. Una diferencia con n=1 se repite antes de dar veredicto (tech-stack, A/B).
12. **Previsión y techo comunes a toda la campaña**: 8 sujetos (4 escenarios × 2 brazos), ~9 $ y ~45 min de reloj. Tope: `SUBJECT_CAP=12` (una tanda de repetición o de REFACTOR de 4) y techo de 16 $. El lanzador lo aplica, junto con el fichero `stop`, antes de cada sujeto. Si se llega a cualquiera de los dos, paro y decides tú.
13. **Pester**: `tests/ReleaseFlow.Tests.ps1` gana tres comprobaciones sobre el `SKILL.md`: cinco pasos numerados en el checklist, ninguna mención a `feedback.md` y la remisión a `sdd-plan`. (Repaso de coherencia: la versión anterior prohibía también la palabra «triaje», que la frase de remisión de la decisión 3 puede necesitar.) No miden conducta: vigilan que el recorte no se deshaga en un rebase con la 0062.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación — opción elegida en la primera pregunta: «Full + delegate, spec delegada» («Apruebo la spec por delegación, nos vemos en la validación»), 2026-09-25.
- Perfil `delegate`, modo full, fila 0063 del roadmap como enunciado — misma respuesta.
- El acta sale sin réplica — «No lo repliques en otro sitio: en develop habrá un rato sin acta, y la release no se corta hasta que estén las dos».
- La retro se queda como opcional — «La retro con el estimation-log se queda como opcional».

## Intent

`sdd-end-release` tiene 8 pasos y mezcla dos trabajos: el corte de lo hecho y procesar el feedback de una reunión. SDD se va a extender a toda la empresa y tiene que ser sencillo. La release pasa a ser solo el corte, como la rama de release de git-flow: se congela lo hecho, se sella, se comunica si hay destinatario y se publica. El feedback pasa a `sdd-plan` (task 0062), que es donde entra el trabajo nuevo.

## Scope

- Entra: `skills/sdd-end-release/SKILL.md` (checklist de 5 pasos, Overview, `description`, red flags y tabla); `references/acta-y-retro.md` → `references/retro.md`; `references/notas-y-roadmap.md` y `references/versionado.md` (renumeración); `release-notes-template.md` (su referencia al triaje); la fila de `sdd-end-release` del README; `tests/ReleaseFlow.Tests.ps1`; la campaña A/B y su evidencia en `tests/sdd-end-release-ab.md`; el delta de `release-flow`.
- No entra: `sdd-plan` y dónde vive el acta (0062); `feedback-template.md`, `roadmap-template.md`, `sdd-start-release`, `mission.md` y `.docs/workflow/`; los ficheros de la 0060 y de la 0061 (decisión 9); el bump de versión del kit.

## Approach

Recorte sobre el `SKILL.md` vigente, conservando literal lo que no es acta ni triaje: el gate de entrada, las reglas de `hasRecipient`, el ⛔ de merge y tag con su atajo, la validación de las tasks 🧪 y el colapso con rescate de pendientes. El detalle sigue en `references/` con el mismo reparto de la campaña de 2026-09-07. La conducta se mide con el A/B de la decisión 11, antes de dar el recorte por bueno.

## Delta de comportamiento

### Capacidad: `release-flow`

**ADDED — El cierre no procesa el feedback de una reunión**
- GIVEN un cierre en el que el usuario aporta la transcripción o las notas de una demo o reunión
- WHEN se ejecuta `sdd-end-release`
- THEN no escribe acta ni triaje (`feedback.md`) y dice que ese feedback es entrada de `sdd-plan`
- AND el cierre sigue con sus cinco pasos, sin esperar a que se procese

**ADDED — La retro es opcional**
- GIVEN un proyecto con `.docs/sdd/estimation-log.md`
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la misma propuesta ofrece la retro en una línea, sin pregunta aparte
- AND solo se escribe si el usuario la pide, en `.docs/sdd/releases/vX.Y.Z/retro.md`, y no retiene los demás pasos: si el roadmap ya está colapsado, se añade su enlace a la entrada de la release
- AND sin `estimation-log.md` no se ofrece

**MODIFIED — Sin destinatario no hay release notes ni email** (antes: «el paso «Comunicar» no aplica y la entrada del roadmap enlaza al changelog (y al acta si existe)»)
- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escriben `release-notes.md` ni el borrador de email, el paso de release notes y comunicación no aplica y la entrada del roadmap enlaza al changelog (y a la retro si existe)

**MODIFIED — La carpeta de la release existe solo si tiene contenido** (antes: «un cierre sin acta (no hubo demo ni retro)» y «con destinatario o con acta»)
- GIVEN `release.hasRecipient: false` y un cierre sin retro
- WHEN termina `sdd-end-release`
- THEN no se exige que exista `.docs/sdd/releases/vX.Y.Z/` ni se crea vacía
- AND con destinatario o con retro, la carpeta sigue siendo obligatoria

**REMOVED — El acta solo se escribe si hay fuente**
- motivo: el cierre ya no escribe acta; el feedback de una reunión es entrada de `sdd-plan` (task 0062)

## Enmiendas

- 2026-09-25 — El THEN de «La retro es opcional» deja de pedir la retro «antes de colapsar el roadmap»: no retiene los demás pasos y, si el roadmap ya está colapsado, se añade su enlace — en el A/B, 1 de 2 sujetos del tratamiento de A2 esperó a la respuesta sobre la retro y no preparó los pasos 1-4 con el dev-lead ausente («va antes del paso 4, por lo que habría que reabrir el roadmap», t-a2-2) — aprobada: «Arreglo + 2 sujetos (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
