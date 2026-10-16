---
id: 20261016-105021-feature-0149-archive
feature: 0149
proposal: 0131
title: archive — sdd-archive, cierre único de feature y patch, con su receta de merge, ADR, deuda saldada y suite sobre la base integrada
mode: full
profile: delegate
status: approved
created: 2026-10-16
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-16
---

# Spec — archive: `sdd-archive`, cierre único de feature y patch

🦆 Cerrar una feature y cerrar un patch pasa a ser lo mismo: dices «cierra la feature» o «cierra el patch» y entra una sola skill, `sdd-archive`, que recorre un tronco común con un par de pasos propios de cada carril. Tras su commit, el cierre integra lo último de `develop` en la rama y, si eso trae código nuevo, vuelve a pasar la suite completa sobre el resultado. Si sale en rojo, prueba si `develop` también falla sin la rama y, en ese caso, busca el fallo en la deuda del proyecto antes de investigarlo. Al terminar, si la pieza era parte de algo más grande, te dice qué falta: «para acabar la 0131 falta la 0151», con el prompt para arrancarla. También escribe las ADR que la spec dejó apuntadas y comprueba que están todas.

## Capacidades

- Nuevas: `archive` — el cierre de una feature o de un patch con `sdd-archive`: lo que comprueba antes de escribir, la base integrada y la suite, los registros, las ADR, «qué sigue» y el merge.
- Modificadas: `routing` — el cierre entra por `sdd-archive`; los requisitos de patch dejan de nombrar `sdd-end-patch`
- Modificadas: `feature-flow` — tres requisitos del cierre pasan a `archive`; la validación nombra `sdd-archive`
- Modificadas: `control-profiles` — la suite completa corre sobre la base integrada; el conflicto de los registros ya lo resuelve el script; los pasos del cierre nombran `sdd-archive`
- Modificadas: `capabilities` — el cierre busca el literal viejo de un `MODIFIED` en toda la capacidad; los tres requisitos del cierre nombran `sdd-archive`
- Modificadas: `commit-history` — todo sha que cita un artefacto sigue alcanzable tras juntar
- Modificadas: `roadmap` — en `ROADMAP.md` lo hecho queda en Now y la deuda saldada sale de «Lista»; la fila «Patch:» de la 2.x se marca
- Modificadas: `decisions` — el cierre escribe las ADR candidatas y ejecuta `sdd decision check`
- Modificadas: `estimation`, `kit-feedback` y `verification` — nombran `sdd-archive`

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`archive`), contrato público (los nombres de skill que nombran los proyectos y las otras skills), MODIFIED/REMOVED (20 requisitos), tres o más capacidades (10) · tamaño: ~600 líneas en ~60 ficheros
- Dominio: si cada MODIFIED copiado conserva todas las cláusulas del vigente, si el patch hereda algún paso de feature, y si «qué sigue» y el rojo ajeno contradicen `control-profiles` (señal: MODIFIED + capacidad nueva)
- Técnica: si la retirada deja nombres vivos fuera del Scope, si las salidas de `sdd merge` citadas son las de `control-profiles` y `cli`, y si la previsión cubre cada ADDED (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja menos mirado el contrato de las salidas de la CLI y la retirada de los nombres
```

1. **Capacidad nueva `archive`** (slug en inglés, como `verification` de la 0148), con los requisitos nuevos del cierre y tres de `feature-flow` que se mueven a ella: «Un aprendizaje sin destino no se redirige en silencio», «Una carpeta `-task-` se cierra como legado» y «El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite» — la propuesta parte `feature-flow` por acción y deja el nombre para cada feature. Los requisitos de cierre que viven en `control-profiles`, `roadmap`, `commit-history`, `capabilities`, `estimation` y `kit-feedback` se quedan en su capacidad, porque su tema es ese y no el cierre.
2. **`sdd-archive` se escribe en inglés** (Art. III) y habla con el usuario en su idioma. Lleva `NOTICE` y anexo de procedencia, porque trae texto de `finishing-a-development-branch` 7.0.0 (MIT, ADR 0013).
3. **Sin skill puente**: `sdd-end-feature` y `sdd-end-patch` desaparecen de `skills/` sin dejar un alias. Las frases «cierra la feature», «cierra el patch», «hemos acabado» y «haz el walkthrough» entran por la `description` de `sdd-archive`, y la batería mide ese enrutado.
4. **La revisión de skills se queda** en la rama de feature con el texto de hoy hasta que la 0151 la cambie por `sdd-retro`.
5. **El orden del tronco**: comprobaciones previas → validación (con la suite completa del gate de cierre) → registro del evento → docs vivos → índices → historia (commit de cierre) → base integrada (merge de sincronización, último commit de la rama) → merge → ticket y mensaje final. «Qué sigue» va en el mensaje final, antes de la oferta del ticket. La base se integra después del commit de cierre para no juntar a través de un merge (`commit-history`, Art. IV).
6. **Comprobaciones previas, en este orden y antes de escribir nada**: `git status --porcelain` vacío en el worktree; `sdd merge --check` (en un hotfix, `sdd merge --check --into <rama estable>`); las otras ramas `feature/*` y `patch/*` con worktree en `git worktree list`; el pre-check de la spec o del `patch.md`; y la revisión final (paso 9 de hoy). Con un borrador sin commitear, para y pregunta: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?». No descarta nada sin la respuesta.
7. **Otras ramas abiertas** (0047): no para; avisa en una línea antes de seguir: «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.».
8. **Base integrada tras el commit de cierre** (0048 y fila 205): tras `git fetch`, si `<remoto>/<merge.into>` no es antecesor de `HEAD`, el cierre hace `git merge --no-edit <remoto>/<merge.into>` en la rama como merge de sincronización, que queda como último commit. Con conflicto solo en `changelog.md`, `roadmap.md` o `estimation-log.md` lo resuelve con la regla de hoy («Un conflicto solo en los registros se resuelve con un merge de sincronización»); con cualquier otro, `git merge --abort` y lo resuelve una persona. No hay segunda integración que mande sobre esta: la que hace `sdd merge` dentro del cerrojo es la de la rama destino local con su remoto, y la de esta decisión es la de la rama de la feature.
9. **La suite completa, una vez por árbol** (filas 175 y 283): corre en la validación, como gate de cierre. Tras el merge de sincronización se repite solo si desde el sha de esa suite cambia algo fuera de `.docs/` que no sea `*.md` (el mismo predicado que `--verified-at`), y el merge lleva `--verified-at <sha de la última suite en verde>`. La pasada de fix de la revisión final corre la verificación de sus tasks, no la suite completa.
10. **Rojo de la suite**: la que corre el agente se contrasta a mano: el mismo comando en un worktree temporal desanclado de `<remoto>/<merge.into>` (`git worktree add --detach`, retirado al acabar), igual que la línea base de `sdd-worktrees`. El rojo de `sdd merge --verify` trae su línea `base:`. Si la base está en verde, el rojo es de la rama: el cierre vuelve a la rama, arregla y repite. Si también falla sin la rama, busca las primeras líneas de error en la deuda del proyecto (`debt.md` o «Deuda técnica» del roadmap 2.x). Si las encuentra, cita la fila; si no, abre una en «Por triar» (o en «Deuda técnica» en la 2.x) con la evidencia. En los dos casos para con el informe y pregunta si fusiona igual. No investiga el fallo ajeno antes de esa búsqueda.
11. **Forma del informe de rojo** (fila 202): un bloque con el comando, el código de salida, la ruta del log, las últimas 20 líneas, el veredicto de la base (la línea `base:` del script o la del contraste a mano: `base: en rojo: el mismo comando también falla sin la rama`) y el estado del destino, que el agente lee con `git rev-parse <merge.into>`: «`develop` sin tocar en `<hash>`».
12. **Paso 3 de `sdd-worktrees`**: un rojo en la línea base se contrasta con el mismo comando en la rama de integración y se busca en la deuda, con la misma regla del punto 10 (fila 293).
13. **Hotfix**: el cierre de una rama `hotfix/*` solo fusiona en la rama estable con una frase del dev-lead que lo pida (Art. IV), y la usa literal en `--order`: `sdd merge --into <rama estable> --tag <versión> --order "<frase>"`, previo `git fetch` (fila 419, lo documental). `--push` va solo si esa frase pide también publicar; la política `merge` no basta. Antes de fusionar pregunta: «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?». Con un sí, si el repo tiene `skills/sdd-init-brownfield/references/migrations/` (el repo del kit), escribe el paso en `v<versión>.md` de esa carpeta antes de etiquetar (fila 165); en otro proyecto, el mensaje final lo lista como pendiente del dev-lead. Con `vuelta: conflicto en`, el script ya lo ha deshecho todo: el cierre queda «No terminado» y una persona porta el arreglo y relanza el hotfix.
14. **«Qué sigue»**: la familia sale del `parent:` y el `proposal:` del frontmatter de la spec o del `patch.md` que se cierra, y de las filas del roadmap que llevan el texto `parent: <id>` o `proposal: <id>` (en la 2.x, en «Ítem»; en `ROADMAP.md`, en el brief). Son las filas abiertas (`⏳`, `🔄`) con ese `parent:` o ese `proposal:`; la pieza que se cierra cuenta como cerrada, porque los índices van antes del mensaje final. Recomienda la primera en el orden del roadmap cuyas dependencias (la columna «Tras» en `ROADMAP.md`, «tras <id>» en la 2.x) estén todas cerradas. Literales: «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.», seguido de su prompt de arranque con `launch-prompt-template.md`; con todas bloqueadas, en lugar de la recomendación: «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.»; con solo `proposal:`, la madre es la propuesta: «Para acabar la propuesta `<N>` falta: …»; sin piezas abiertas y con la madre abierta: «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.». El cierre no marca la fila de la madre: lo decide el dev-lead. Sin familia, no dice nada.
15. **Forma 3.0.0 por predicado**: con `ROADMAP.md` en la raíz, la fila de Now se marca `✅` o `🧪 validación diferida a <disparador>` y no se mueve; las filas de «Lista» de `.docs/sdd/steering/debt.md` cuyo «Destino» es el id que se cierra se quitan, y una saldada en parte se queda con «Ítem» reescrito a lo que falta. Sin `ROADMAP.md`, como hoy en `roadmap.md`.
16. **La fila «Patch:» de Próximo** (2.x) se marca `✅` y se queda; no se quita (fila 411).
17. **Workaround** (fila 327): un aprendizaje que el cierre vuelca en `tech-stack.md` (u `operations.md`) como workaround lleva su fila en la deuda, con el enlace a la línea.
18. **El literal de un `MODIFIED`** (fila 243): antes de `capability merge`, el cierre busca la cláusula de `(antes: …)` —o, sin ella, cada frase del requisito vigente que el `MODIFIED` cambia— en todo el fichero de la capacidad. Cada aparición fuera del requisito se corrige por el delta, no a mano: el cierre añade al delta del artefacto un `MODIFIED` del otro requisito o la entrada de «Reglas de la capacidad» con su valor completo, `sdd capability merge` lo fusiona, y el walkthrough o `patch.md` lo nombra.
19. **ADR**: por cada «ADR candidata» de la spec el cierre escribe `decisions/NNNN-<slug>.md` desde `adr-template.md` y apunta en el walkthrough `ADR: <candidata> → decisions/NNNN-<slug>.md`; después `sdd decision check --path .docs/sdd` sale con 0, o el cierre para. Sin candidatas, ejecuta el check igual. Un patch no tiene candidatas.
20. **Shas citados** (filas 181 y 279): antes de juntar hitos, todo sha de 7 a 40 caracteres hexadecimales del walkthrough, `tasks.md`, `patch.md`, la deuda o una ADR de la rama que caiga en el tramo se reescribe sin sha («juntada en el cierre») o no se junta. Tras el commit de cierre, `git merge-base --is-ancestor <sha> HEAD` sale bien para todos.
21. **El commit del fix no toca la deuda** (fila 275): el paso 5 de `sdd-start-patch` dice que la fila que salda el patch la cierra `sdd-archive`.
22. **`patch-template.md`**: la ayuda del bloque «Capacidades» dice «con la salida de `sdd capability index`» (fila 233).
23. **La receta de merge** pasa a `skills/sdd-archive/references/merge-recipe.md` y se reescribe con las salidas de hoy (filas 282 y 344): sale «Conflicto solo en los registros» (lo hace el script desde el patch 0107) y `base: conflicto en` va a «lo resuelve una persona».
24. **`estimation.md` y `aprendizajes-skills.md`** pasan a `skills/sdd-archive/references/` sin cambiar su contenido salvo los nombres.
25. **Retirada**: se borran `skills/sdd-end-feature/` y `skills/sdd-end-patch/`; se renombra a quien los nombra en `skills/`, `.docs/sdd/` (salvo ADR, specs, tickets y releases, que son historia), `.docs/workflow/`, `README.md`, `CLAUDE.md` («las 23 skills» pasa a 22), los Pester y las constituciones de los moldes de las baterías. Las migraciones v0.4.0 y v2.0.0 y la fixture `roadmap-0fc231e-parent.md` no se tocan: describen versiones pasadas.
26. **`overrides-superpowers.md`** pierde la fila de `finishing-a-development-branch`, y `environments-template.md` dice que el entorno lo borra `sdd-archive`.
27. **Los proyectos que nombran las skills viejas** (su `CLAUDE.md`, su constitution) se migran en la v3.0.0: la fila 0157 gana el punto «`sdd-end-feature` y `sdd-end-patch` pasan a `sdd-archive` en `CLAUDE.md`, `AGENTS.md` y `.docs/sdd/*.md`». La 0149 no escribe migración.
28. **La batería** se mueve de `tests/batteries/sdd-end-patch/` a `tests/batteries/sdd-archive/` (con `patch-0008.md` y `subject.sh`) y gana los escenarios de la previsión.
29. **Requisito de `migration`** «La migración a v2.0.0 cambia los nombres de las skills de feature»: no se toca, porque describe la v2.0.0, en la que la skill se llamaba `sdd-end-feature`.
30. **Topes de las skills que se editan**: no suben. Si una edición no cabe, se recorta en la misma task. Los dos más justos son `sdd-start-feature` (11.458 de 11.464 en total) y `sdd-verify` (2.885 de 2.900 en `SKILL.md`).
31. **Lo que se descarta de `finishing-a-development-branch`**: el menú de opciones (lo decide la política `merge` o el dev-lead), «Announce at start» (lo sustituye el aviso de cambio de paso de `control-profiles`), la PR (solo si el dev-lead la pide) y el descarte (solo con la palabra del dev-lead). El detalle, en el anexo.
32. **El 4.1 del walkthrough gana el sha** sobre el que corrió la suite completa, para que `--verified-at` y el lector citen el mismo commit.
33. **Marcas de carril** en la skill: `Feature only:`, `Patch only:` y `Hotfix only:`.
34. **Eventos que no se editan**: las campañas `tests/*-red.md`, `*-green.md` y `*-ab.md` (`sdd-end-patch-ab.md`, `sdd-consult-ab.md`). La entrada del changelog del kit (`Changed`: el cierre único; `Removed`: `sdd-end-feature` y `sdd-end-patch`) la escribe el cierre de esta feature.

### Hallazgos de la review

Dominio (Opus):

- **Aceptado** — Crítico: el merge de la base antes del registro dejaba un merge dentro del tramo que se junta (`commit-history`, Art. IV) → la base se integra como merge de sincronización tras el commit de cierre (decisiones 5 y 8, ADDED «El cierre integra la base tras su commit…»).
- **Aceptado** — Crítico: la suite corría dos veces o la validación iba sin suite → la suite completa corre en la validación y solo se repite tras el merge de sincronización si la base trae código (decisión 9, MODIFIED «El gate de cierre se ejecuta una vez»).
- **Aceptado** — Crítico: el push del hotfix «si la política lo dice» chocaba con el Art. IV → el merge a la rama estable, el tag y su push solo con la frase del dev-lead (decisión 13, «Regla ante conflicto»).
- **Aceptado** — el conflicto de la base sale del merge del agente, no de `sdd merge`, y el `MODIFIED` perdía el `git merge --abort` → se recupera «Un conflicto solo en los registros…» como `MODIFIED` del merge de sincronización y el `--abort` vuelve a «Un conflicto que no se puede conservar entero…».
- **Aceptado** — tras `vuelta: conflicto en`, no relanzar dejaba el hotfix fuera de `main` → «No terminado»: una persona porta el arreglo y relanza.
- **Aceptado** — `migrations/` es del repo del kit → el paso solo se escribe si existe esa carpeta; en otro proyecto, pendiente del dev-lead en el mensaje final.
- **Aceptado** — corregir «Límites» a mano contradecía «no fusiona a mano» → la corrección entra por el delta y la fusiona `capability merge` (decisión 18).
- **Aceptado** — el paso 3 de `sdd-worktrees` cambiaba sin `MODIFIED` → «MODIFIED — El worktree de la implementación lo prepara `sdd-worktrees`».
- **Aceptado** — `add-to-changelog` fuera del Scope → entra.
- **Aceptado** — dónde viven `parent:` y `proposal:`, el complemento (no cerrar la madre) y las entradas que faltaban en «Avisos» y «Límites» → decisión 14 y «Reglas de la capacidad». La vida de la fila «Patch:» marcada en Próximo es la de cualquier fila de Próximo (sale en el corte de la release); no se añade entrada nueva a los «Límites» de `roadmap`.

Técnica (Sonnet):

- **Aceptado** — Crítico: la línea `base:` solo la da el `--verify` de `sdd merge` → el rojo de la suite del agente se contrasta a mano en un worktree desanclado, y el hash del destino lo lee el agente con `git rev-parse` (decisiones 10 y 11).
- **Aceptado en parte** — Crítico: `base: conflicto en` no está en ninguna capacidad → el script ya lo escribe (`cli/src/merge/attempt.ts:24` con `stepName: 'base'`); se fija en la capacidad con `MODIFIED — El merge del cierre parte de la rama destino publicada`. No es un cambio de CLI.
- **Aceptado** — dos integraciones sin decir cuál manda → decisión 8: la del script es la rama destino con su remoto; la del cierre, la rama de la feature.
- **Aceptado** — `--check` de un hotfix → `sdd merge --check --into <rama estable>` (decisión 6 y su escenario).
- **Aceptado** — «qué sigue»: la pieza que se cierra cuenta como cerrada, todas bloqueadas, y solo `proposal:` → decisión 14 y sus escenarios.
- **Aceptado** — cuatro comportamientos sin prueba → `a9` (forma 3.0.0), `a3` ampliado (conflicto de registros y `--verified-at`), `a6` con una ADR ajena rota, `w1` (línea base).
- **Aceptado** — GIVEN incompletos → el hotfix fija la respuesta «sí» y la ADR fija la más alta, `0015`.
- **Aceptado** — decisiones del cuerpo fuera de ✋ → decisiones 31 a 33.
- **Aceptado** — `*-ab.md` y la entrada del changelog → decisión 34 y Scope.
- **Aceptado** — la exención de las migraciones → «Límites» de `archive`.

### Decisiones tomadas con el dev-lead

- Partir la 0149 en cuatro: esta (`sdd-archive`, su receta de merge y su batería), la 0187 (CLI del cierre), la 0188 (estimación y plantillas del cierre) y la 0191 (`capability check --artifact`), las tres ya fusionadas — «Partir en tres, CLI antes (Recomendada)» (2026-10-15), y la 0191 partida de la 0187 al arrancarla (dev-lead, 2026-10-15)
- Del prompt de arranque: la receta de `sdd-archive` describe las salidas de `sdd merge` de la 0187 (destino sacado y `--check`, `--verified-at`, línea `base:`, push que reintenta, `--into` para el hotfix) y de `sdd capability check --artifact` de la 0191 (los fallos ajenos salen aparte y no cambian el código de salida); sus cierres escriben en Now y en `debt.md` con las plantillas de la 0150; el cierre ejecuta `sdd decision check --path .docs/sdd` y comprueba que cada «ADR candidata» de la spec quedó escrita en `decisions/`, sin reparto de fallos ajenos para las ADR (2026-10-15). Absorbe la 0047 («Tasks abiertas al arrancar») y la 0048 («La base se mueve durante el cierre»), y retira las dos invocaciones de `superpowers:finishing-a-development-branch`
- Diseño por secciones: la sección 1 (forma de `sdd-archive`, con la revisión de skills en la rama de feature hasta la 0151 y sin skill puente con los nombres viejos), «si»; la sección 2 (base integrada, suite y merge), «ok, seguimos con archive»; las secciones 3 (registros, deuda y ADR) y 4 (deuda saldada), «si» (2026-10-16)
- La parte de código de la fila 419 (la etiqueta inválida con código 2 antes de tocar nada, «varias release/» con los refs remotos y los 14 menores de código de la 0187) va a la 0193, y la 0149 solo documenta en la receta el `git fetch` previo al hotfix — «A la 0193 (Recomendada)» (2026-10-16)
- La 0193, «Merge mejor que el de git por defecto», fila nueva tras la 0149 — «apúntalo, pero con número y que va detrás de la 149, que luego nos olvidamos» (2026-10-16)
- «Qué sigue» al cerrar una pieza de una familia (`parent:` o `proposal:`) entra en la 0149, con su RED; la entrada «qué sigue» de `sdd-roadmap` va en la 0194 — requisito traído por otra sesión del dev-lead («Cierre en la 0149, roadmap aparte», 2026-10-16), confirmado aquí: «Sí, en la 0149 (Recomendada)» (2026-10-16)
- Tareas, pruebas y tope de `sdd-archive`: `SkillMd = 3600; Total = 6000` — «Sí, SkillMd 3600 / Total 6000 (Recomendada)» (2026-10-16)
- Review de la spec — «Dos, dominio en Opus (Recomendada)» (2026-10-16)
- Aprobación de la spec con sus hallazgos aplicados — «Apruebo (Recomendada)» (2026-10-16)

## Intent

Hoy el cierre son dos skills que comparten el 84 % del texto y se han desviado entre ellas (la fila «Patch:» se marca o se quita según el sujeto), y su paso de rama delega en `finishing-a-development-branch`, que la 3.0.0 saca del kit. La suite completa corre sobre la rama, no sobre la base integrada: dos features fusionadas con 7 minutos de diferencia dejaron un E2E en rojo que nadie corrió. Los cierres escriben sus registros sobre una base que puede haberse movido, y un rojo ajeno se investiga antes de mirar la deuda. Además, `sdd-end-feature` está en su tope de palabras.

El éxito tiene cinco partes:

- un patch cierra por `sdd-archive` sin heredar ningún paso de feature;
- ninguna feature fusiona sin la suite completa en verde sobre la base integrada, y esa suite corre una vez;
- un rojo ajeno se cita desde la deuda antes de investigarlo;
- toda ADR candidata acaba escrita, y ningún sha citado se pierde al juntar;
- al cerrar la pieza de una familia, el dev-lead sabe qué falta.

Fracasaría si un cierre de patch arrastra el walkthrough o la revisión de skills, si el tronco común deja al patch sin un paso que hoy tiene, o si la fusión pierde una regla de las tres fuentes sin decirlo en el anexo.

## Scope

- Entra:
  - `skills/sdd-archive/` (nueva): `SKILL.md`, `NOTICE`, `references/merge-recipe.md`, `references/estimation.md` y `references/aprendizajes-skills.md`.
  - Borrado de `skills/sdd-end-feature/` y `skills/sdd-end-patch/`.
  - `skills/sdd-start-patch/SKILL.md`: pasos 5 y 6.
  - `skills/sdd-worktrees/SKILL.md`: Step 3.
  - `skills/sdd-start-feature/references/commit-milestones.md`: la guarda de los shas citados en cualquier artefacto.
  - `skills/add-to-changelog/SKILL.md` (su `description` y su cuerpo nombran las dos skills); `skills/sdd-start-feature/references/control-profiles.md`, `overrides-superpowers.md` y `frontend-verification.md`; `skills/sdd-start-feature/SKILL.md`; `skills/sdd-propose/SKILL.md`; `skills/sdd-verify/SKILL.md`; `skills/sdd-feedback/SKILL.md`; `skills/sdd-end-release/SKILL.md`; `skills/sdd-templates/SKILL.md` y las plantillas que nombran las skills (`architecture`, `capability`, `debt`, `environments`, `estimation`, `now-next-later`, `patch`, `plan`, `roadmap`, `spec`): los nombres.
  - `skills/sdd-templates/templates/patch-template.md`: la ayuda del bloque «Capacidades».
  - `.docs/sdd/capabilities/`: el delta, más `archive.md` (nueva).
  - `.docs/sdd/mission.md`, `tech-stack.md` y `architecture.md` (el árbol y las referencias); `.docs/workflow/usage-guide.md`, `greenfield.md` y `brownfield.md`; `README.md` (catálogo); `CLAUDE.md` (número de skills); `THIRD_PARTY_NOTICES.md` (la fuente de `finishing-a-development-branch`).
  - `tests/batteries/sdd-archive/` (movida y ampliada), `tests/batteries/sdd-start-feature/battery.md` y `tests/batteries/sdd-verify/battery.md` (nombres), las constituciones de los moldes.
  - Pester: `tests/WordBudget.Tests.ps1` (tope de `sdd-archive`, fuera los dos viejos) y los que leen las skills viejas por su ruta o buscan sus frases (`AnchorTemplates`, `CapabilityRules`, `ClosingEstimation`, `ClosingOffCriticalPath`, `CommitMilestones`, `ControlProfiles`, `FeatureRename`, `FewerStops`, `FieldValidation`, `FrontendVerification`, `KitFeedback`, `LocalConfig`, `MigrationInitParity`, `NativeAdapt`, `PatchLane`, `PostFinalReview`, `ReleaseFlow`, `RoadmapClosing`, `SessionTokensClose`, `SilenceWatch`, `SyncMerge`, `TestableTasks`, `VerifySkill`, `VisualPatch`), y uno nuevo, `ArchiveSkill.Tests.ps1`, para las reglas nuevas y para que ningún fichero de `skills/` nombre `finishing-a-development-branch`, `sdd-end-feature` ni `sdd-end-patch`. Las campañas `tests/*-red.md`, `*-green.md` y `*-ab.md` son eventos: no se editan.
  - `.docs/sdd/changelog.md`: la entrada de esta feature, que escribe su cierre.
  - El roadmap: la fila 0149, las 19 filas de deuda con destino 0149, la 419 con su parte de código a la 0193, la 0157 con el punto de la migración. La propuesta 0131: su línea de «Enmiendas».
- No entra:
  - `sdd-retro` ni la revisión de skills nueva (0151).
  - La entrada «qué sigue» de `sdd-roadmap` (0194).
  - Código de la CLI: la etiqueta inválida, «varias release/» con refs remotos, los 14 menores de la 0187 y el merge semántico (0193).
  - La migración de los proyectos (0157, decisión 27).
  - `pricing` en `sdd-config` (0178).
  - Traducir al inglés las skills que se tocan solo para renombrar.

## Approach

`sdd-archive` es un tronco común en el orden de la decisión 5, con ramas cortas marcadas por carril (`Feature only:`, `Patch only:`, `Hotfix only:`) en lugar de un checklist por carril. El tronco sale del texto de las dos skills de hoy, que se funden paso a paso; donde las dos dicen lo mismo con palabras distintas, queda una. El paso de rama trae el texto de `finishing-a-development-branch` 7.0.0 donde el kit trabaja igual (verificar sobre el resultado integrado, detectar el entorno, limpiar solo el worktree propio) y lo cambia donde el kit decide de otra forma (no hay menú: la política `merge` de `sdd-kit.json` o la decisión del dev-lead; el merge lo hace `sdd merge`), con su fila en el anexo.

La receta de merge (`references/merge-recipe.md`) no repite lo que hace la CLI: dice qué significa cada salida de `sdd merge` y de `capability check --artifact`, y qué hace el agente después. Lo que no cabe en `SKILL.md` va a las referencias, con el tope de la decisión del dev-lead.

## Dónde se prueba

- El cierre de una feature y el de un patch por el tronco común, y que el patch no herede pasos de feature: sujetos de la batería de `sdd-archive` sobre el molde de reservas, como `x1` de la batería de hoy de `sdd-end-patch` (`a1`, `a2`).
- El enrutado («cierra la feature», «cierra el patch»): sujetos que reciben la frase sin nombrar la skill, como los de `tests/batteries/using-sdd/` (`r1`).
- El merge de sincronización tras el commit de cierre, el conflicto de registros, la suite repetida solo si la base trae código, `--verified-at` y el rojo contrastado a mano y buscado en la deuda: sujetos sobre un repo con un `develop` que avanzó en `src/` y en `roadmap.md` y un E2E que falla en los dos lados (`a3`).
- La línea base de `sdd-worktrees` en rojo también en la rama de integración: sujeto que prepara el worktree de una feature (`w1`).
- La forma 3.0.0 (Now `✅`, filas de «Lista» de `debt.md` quitadas o reescritas): sujeto con `ROADMAP.md` y `debt.md` (`a9`).
- El hotfix con `--into`, la pregunta de la migración y el `git fetch` previo: sujeto con una rama `hotfix/*` sobre un repo con `main` y `develop` (`a4`).
- «Qué sigue»: sujeto que cierra la 0201 con `parent: 0200` en un roadmap con la 0202 abierta tras ella (`a5`).
- Las ADR candidatas y `decision check`, también con una ADR ajena rota: sujeto con una spec con una candidata (`a6`).
- El literal de un `MODIFIED` repetido fuera del requisito: sujeto con el caso del patch 0078 (`a7`).
- La guarda de los shas citados: sujeto con un walkthrough que cita un sha del tramo que se junta, como `c2` del RED de la 0096 (`a8`).
- Topes, rutas, nombres y literales; que ningún fichero de `skills/` nombre las skills retiradas: Pester.

## Términos y ADR

- Términos resueltos:
  - **cierre**: la acción `archive` de un cambio, sea feature, patch o hotfix. Se evita «end-task», «end-feature» y «finishing».
  - **familia**: una madre y las filas que la nombran en `parent:` o en `proposal:`. Se evita «epic» fuera de las citas.
  - **base integrada**: la rama con el último `merge.into` remoto fusionado dentro, sobre la que corre la suite.
- ADR candidatas: «Un solo cierre para feature y patch con ramas por carril» — la alternativa descartada era mantener dos skills de cierre con un núcleo copiado en las dos.

## Delta de comportamiento

### Capacidad: `archive`

**ADDED — El cierre de una feature y el de un patch van por la misma skill**
- GIVEN la rama `feature/0081-booking-reminders` con su `spec.md` aprobada y todas sus tasks hechas, y la rama `patch/0082-slot-overlap` con su `patch.md` y el fix commiteado
- WHEN se cierra cada una
- THEN las dos se cierran con `sdd-archive`
- AND el cierre de la 0081 escribe `walkthrough.md`, actualiza `tasks.md` y hace la revisión de skills
- AND el cierre de la 0082 no escribe `walkthrough.md`, no toca `tasks.md` ni hace la revisión de skills: completa `patch.md` y su fila del roadmap

**ADDED — El cierre comprueba el árbol, el destino y las otras ramas antes de escribir**
- GIVEN la rama `feature/0081-booking-reminders` con `notes.md` sin seguimiento en su worktree y la rama `feature/0083-room-photos` con worktree en `../0083-room-photos`
- WHEN empieza el cierre de la 0081
- THEN antes de escribir ningún registro pregunta «Hay cambios sin commitear: `notes.md`. ¿Los commiteo en la rama, los descarto o paro?» y no descarta nada sin la respuesta
- AND ejecuta `sdd merge --check`; con `destino sacado:`, para con su salida antes de escribir
- AND avisa en una línea, sin parar: «Abiertas a la vez: `feature/0083-room-photos` (`../0083-room-photos`). La que fusione segunda integra la base y repite sus gates.»

**ADDED — El cierre integra la base tras su commit y repite la suite solo si la base trae código**
- GIVEN la 0081 con la suite completa en verde en `a1b2c3d`, en la validación, y `origin/develop` que avanzó desde que se abrió la rama con el merge de la 0080, que cambia `src/rooms.js`
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `git merge --no-edit origin/develop` en la rama, que queda como último commit, y corre la suite completa (E2E incluidos si el proyecto los declara) sobre el resultado, porque la 0080 cambia `src/`
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre la suite y el merge lleva `--verified-at a1b2c3d`
- AND con conflicto solo en `roadmap.md` y `changelog.md`, deja cada línea con el cambio del lado que la tocó, regenera `estimation-log.md` con `sdd estimation log` y sigue; con conflicto en `src/slots.js`, hace `git merge --abort` y el cierre queda «No terminado» para una persona
- Se valida en: `worktree con la base al día`

**ADDED — Un rojo ajeno se busca en la deuda antes de investigarlo**
- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN corre el mismo comando en un worktree temporal desanclado de `origin/develop`, y lo retira al acabar
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` (o en «Deuda técnica» del roadmap 2.x) con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- AND si sin la rama pasa, el rojo es de la rama: vuelve a ella, arregla y repite la suite
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

**ADDED — Un hotfix se cierra en la rama estable solo con la frase del dev-lead**
- GIVEN el repo del kit, con `skills/sdd-init-brownfield/references/migrations/`, la rama `hotfix/0200-fix-login` salida de `main`, y el dev-lead que dijo «fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo»
- WHEN se cierra
- THEN ejecuta `sdd merge --check --into main` en las comprobaciones previas, y antes de fusionar pregunta «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?»
- AND con la respuesta «sí, la clave `auth.sameSite`», escribe el paso en `migrations/v3.0.1.md` antes de etiquetar
- AND hace `git fetch` y ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo" --push`
- AND si la frase no pide publicar, va sin `--push`, aunque `merge.push` sea `true`; sin ninguna frase del dev-lead, no fusiona en `main`
- AND en un proyecto sin esa carpeta de migraciones, el paso que pide el patch va al mensaje final como pendiente del dev-lead
- AND con `vuelta: conflicto en <ficheros>`, el cierre queda «No terminado»: una persona porta el arreglo a `develop` y relanza el hotfix

**ADDED — Al cerrar una pieza de una familia, el cierre dice qué falta**
- GIVEN un roadmap con la 0200 `⏳` («partida en 0200, 0201 y 0202»), la 0201 con `parent: 0200` en su spec y en su fila, que se cierra, y la 0202 «Fotos de las salas», `⏳`, con `parent: 0200` y «Tras: 0201»
- WHEN el cierre de la 0201 escribe su mensaje final
- THEN antes de la oferta del ticket dice «Para acabar la 0200 falta: 0202 — Fotos de las salas. Recomiendo 0202, la primera del roadmap sin dependencias abiertas.» y da su prompt de arranque con la forma de `launch-prompt-template.md`
- AND si la 0202 fuera «Tras: 0203», con la 0203 abierta, dice «Ninguna se puede arrancar todavía: 0202 espera a 0203.»
- AND si la 0202 ya está cerrada y la 0200 sigue `⏳`, dice «La 0200 ya no tiene piezas abiertas: su fila se puede cerrar.» y no marca la fila de la 0200
- AND con solo `proposal: 0131` en la spec que se cierra, la familia son las filas abiertas con `proposal: 0131`, y la línea dice «Para acabar la propuesta 0131 falta: …»
- AND una pieza sin `parent:` ni `proposal:` no lleva esa línea

**ADDED — El cierre escribe las ADR candidatas y las comprueba**
- GIVEN `decisions/` con la ADR más alta `0015-final-review-in-three-axes.md`, y la spec de la 0081 con «ADR candidatas: Los recordatorios salen de una cola — alternativa descartada: un cron por reserva»
- WHEN el cierre llega a los docs vivos
- THEN escribe `decisions/0016-reminders-from-a-queue.md` desde `adr-template.md` y apunta en el walkthrough `ADR: Los recordatorios salen de una cola → decisions/0016-reminders-from-a-queue.md`
- AND ejecuta `sdd decision check --path .docs/sdd`, que sale con 0; si sale con 1, por esa ADR o por otra, el cierre para y lo corrige antes del commit de cierre
- AND con «ADR candidatas: ninguna», o en un patch, ejecuta el check igual

**ADDED — Un workaround que el cierre escribe en el stack lleva su fila de deuda**
- GIVEN el walkthrough de la 0081 con el aprendizaje «la suite del backend corre en serie para esquivar la carrera del logger estático»
- WHEN el cierre lo vuelca a `tech-stack.md`
- THEN abre en la deuda una fila con ese workaround y el enlace a la línea de `tech-stack.md`

**ADDED — El kit no invoca `finishing-a-development-branch`**
- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch`
- THEN ninguno aparece salvo en el `NOTICE` y el anexo de procedencia de `sdd-archive`, y en las migraciones de versiones pasadas

**ADDED — Un aprendizaje sin destino no se redirige en silencio** (movido de `feature-flow`)
- GIVEN un cierre de feature cuyo walkthrough tiene un aprendizaje estructural y un proyecto sin `architecture.md`
- WHEN `sdd-archive` vuelca los aprendizajes a los docs vivos
- THEN crea `architecture.md` calcando `architecture-template.md` de `sdd-templates`, vuelca ahí el aprendizaje y lo dice en el informe final («`architecture.md` no existía: creado desde la plantilla»)
- AND no escribe el aprendizaje estructural en `tech-stack.md` ni en otro documento en su lugar
- AND lo mismo con cualquier otro destino que falte (`constitution.md`, `tech-stack.md`): se crea calcando su plantilla y se dice en el informe; si un destino no tiene plantilla, no se inventa: se dice y se añade una fila en la deuda

**ADDED — Una carpeta `-task-` se cierra como legado** (movido de `feature-flow`)
- GIVEN la rama `feature/0064-task-to-feature-rename` con su carpeta `20260925-163055-task-0064-task-to-feature-rename/`, cuyo `spec.md` lleva `task: 0064`
- WHEN `sdd-archive` cierra la feature
- THEN escribe `walkthrough.md` en esa misma carpeta, sin renombrarla
- AND el estimation-log regenerado tiene una fila con id `0064` y carpeta `20260925-163055-task-0064-task-to-feature-rename`

**ADDED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite** (movido de `feature-flow`)
- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración y el sha sobre el que corrió (el de la base integrada si se repitió tras el merge de sincronización)
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

**Reglas de la capacidad**
- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md` (3.0.0) o en «Deuda técnica» de `roadmap.md` (2.x)
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; marcas de carril de la skill `Feature only:`, `Patch only:`, `Hotfix only:`
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.600 y total 6.000 (`tests/WordBudget.Tests.ps1`); la suite completa una vez por árbol (en la validación, y otra tras el merge de sincronización solo si la base trae cambios fuera de `.docs/` que no sean `*.md`); el informe de rojo lleva las últimas 20 líneas; una suite de más de 10 minutos va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md`
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que no sea solo de los tres registros lo resuelve una persona; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre

### Capacidad: `feature-flow`

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: «antes de invocar `sdd-end-feature`»)
- GIVEN una feature con la implementación terminada y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-archive` presenta, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

**MODIFIED — El gate de cierre se ejecuta una vez** (antes: «el gate completo aparece una sola vez, en la validación final»)
- GIVEN una constitution que pide el gate completo en verde al cerrar cada task
- WHEN se escribe el plan y se despacha una task de solo frontend
- THEN el gate completo aparece una sola vez, en la validación final, y lo ejecuta el hilo principal
- AND no aparece en «De código» ni en la verificación de esa task, y el encargo de su implementador le dice que ejecute su verificación y no la suite completa
- AND el cierre de `sdd-archive` solo lo repite tras su merge de sincronización, y solo si la base trajo cambios fuera de `.docs/` que no sean `*.md`

**MODIFIED — El worktree de la implementación lo prepara `sdd-worktrees`** (antes: «si la baseline falla, informa de los fallos y pregunta si sigue o investiga»)
- GIVEN la 0010 con la spec y el plan aprobados, abierta en un worktree que creó Orca en la rama `feature/0010-cancel`, y un proyecto con `.docs/sdd/environments.md` y `.docs/sdd/operations.md` §Testing `Gate de cierre: node --test`
- WHEN `sdd-implement` hace su preparación
- THEN invoca `sdd-worktrees`, que detecta que ya está en un worktree enlazado, lo dice con su rama, y no crea otro
- AND ejecuta `env:setup` después de instalar las dependencias, y los encargos de implementador dicen dónde está `.sdd-env.json`
- AND la baseline ejecuta `node --test`, el gate de cierre del proyecto; sin gate declarado en `operations.md`, `tech-stack.md` ni la constitution, lo dice y pregunta qué ejecutar
- AND si la baseline falla, corre el mismo comando en un worktree temporal desanclado de la rama de integración; si también falla allí, busca las primeras líneas de error en la deuda del proyecto y cita la fila o abre una en «Por triar»; después informa de los fallos con ese veredicto y pregunta si sigue o investiga
- AND ningún fichero de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`

**REMOVED — Un aprendizaje sin destino no se redirige en silencio**
- motivo: pasa a `archive`

**REMOVED — Una carpeta `-task-` se cierra como legado**
- motivo: pasa a `archive`

**REMOVED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite**
- motivo: pasa a `archive`, con el sha de la base integrada

### Capacidad: `routing`

**REMOVED — El cierre de una feature entra por `sdd-end-feature`**
- motivo: el cierre entra por `sdd-archive`; lo sustituye «El cierre de una feature o de un patch entra por `sdd-archive`»

**ADDED — El cierre de una feature o de un patch entra por `sdd-archive`**
- GIVEN un proyecto con `.docs/sdd/`, en la rama `feature/0081-booking-reminders` con su `plan.md` y su `tasks.md` con todas las tasks hechas
- WHEN el usuario escribe «hemos acabado, cierra la tarea»
- THEN la primera skill que se invoca es `sdd-kit:sdd-archive`
- AND en la rama `patch/0082-slot-overlap` con su `patch.md` y el fix commiteado, «cierra el patch» también invoca primero `sdd-kit:sdd-archive`

**MODIFIED — Un patch visual se verifica con una captura y se registra como `Changed`** (antes: «lo cierra con `sdd-end-patch`» y «la validación del paso 0 de `sdd-end-patch`»)
- GIVEN un patch abierto para un ajuste solo de presentación o una retirada
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-archive`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `sdd-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación del cierre de `sdd-archive` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `tech-stack.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`; en una retirada, en `Removed`
- AND en una retirada, §4 lleva además la búsqueda de cada símbolo retirado, sin otros usos
- AND un bug determinista sigue con la causa raíz de `sdd-debugging` y cierra en `Fixed`

**MODIFIED — El patch registra quién fijó la solución y quién decidió cada cosa** (antes: «el mensaje final de `sdd-end-patch`»)
- GIVEN un patch abierto con `sdd-start-patch`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` hace que el agente pare el patch y lo suba a feature por el paso de la spec de `sdd-propose`, y se lo diga al usuario
- AND el mensaje final del cierre de `sdd-archive` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

### Capacidad: `control-profiles`

**MODIFIED — Con `validation.mode: field`, la validación es en campo** (antes: «paso 0 de `sdd-end-feature`» y «paso 0 de `sdd-end-patch`»)
- GIVEN un proyecto con `"validation":{"mode":"field"}` en `.docs/sdd/sdd-kit.json` y la feature 0030 con el cierre de su revisión final terminado, su smoke por THEN y la suite en verde, en cualquier perfil
- WHEN el agente llega a la validación (paso 7 de `sdd-start-feature`, o el paso de validación de `sdd-archive`), o cierra el patch 0031 con `sdd-archive`
- THEN no pregunta qué ha probado el usuario ni ofrece diferir, y sigue con el cierre sin parar
- AND el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación en campo: <fecha> · <verificación del agente>`, con la evidencia que ejecutó (p. ej. `suite 412/412 en 96 s · smoke 5/5 THEN con ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia`)
- AND con un `sin revisar` o un «no verificado» sin resolver, esa línea no dice «limpia»: dice cuántos quedan (`…, re-revisión limpia, 1 sin revisar`)
- AND la fila de la 0030 en el roadmap queda ✅, y la del patch 0031 en «Patches» no lleva el prefijo 🧪 ni tiene fila en la tabla de la release abierta
- AND sin la clave, o con `"mode":"manual"`, la validación es la de hoy: para en `pair` y `delegate` y se difiere al smoke de la release en `unattended`

**MODIFIED — El merge a develop sigue la política declarada** (antes: «paso 10 de `sdd-end-feature`, paso 6 de `sdd-end-patch`» y «el paso 0 de `sdd-end-patch`»)
- GIVEN una feature o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso del merge de `sdd-archive`
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta salvo en un hotfix con la frase del dev-lead en `--order`
- AND el bloque autoriza el merge, no la validación: en `pair` y `delegate`, la validación de `sdd-archive` para con el smoke y la pregunta de validación antes de tocar nada

**MODIFIED — El cierre acaba con una línea de terminado** (antes: «un cierre de feature (`sdd-end-feature`) o de patch (`sdd-end-patch`)»)
- GIVEN un cierre de feature o de patch con `sdd-archive` que ha recorrido su checklist
- WHEN el agente escribe su último mensaje
- THEN el mensaje nombra, si los hay, el disparador que concretó el agente, las decisiones tomadas sin el dev-lead que registra el walkthrough (o el `patch.md`), cada instrucción que el dev-lead dio antes del cierre y cómo quedó, lo pendiente y lo que falta de su familia; y ofrece el ticket del kit si toca
- AND su última línea es la de terminado: si la rama está fusionada en `merge.into` y el worktree no tiene cambios sin commitear, dice rama, destino, hash, estado del push (hecho, no hecho y por qué) y que se puede borrar el worktree, con su ruta; si no, dice «No terminado», qué falta y que el worktree no se borra todavía
- AND con el merge o el push denegados o fallidos, sus bloques de evidencia van antes, y la línea de terminado sigue siendo la última: «No terminado» si falta el merge; con el merge hecho y el push fallido, dice «push no hecho» y el motivo
- AND solo se ofrece borrar un worktree enlazado: si la rama está en el checkout principal del repo, la línea acaba en el push, sin cláusula de borrado
- AND si después el agente escribe el ticket del kit en ese worktree, repite la línea de terminado con el ticket como pendiente hasta que se commitee y se fusione

**MODIFIED — La verificación del merge es el gate de merge, no la suite completa** (antes: «la suite completa ya corrió antes del script, en la validación final»)
- GIVEN un proyecto cuyo `tech-stack.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `sdd merge`
- THEN `--verify` es el conjunto rápido, que corre sobre el resultado del merge y antes del push; con una sola suite, es esa
- AND la suite completa ya corrió antes del script: en la validación final y, si la base trajo cambios fuera de `.docs/` que no sean `*.md`, otra vez tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; la suite completa no se omite nunca

**MODIFIED — El merge del cierre parte de la rama destino publicada** (antes: «con cualquier otro conflicto, falla con la lista de ficheros»)
- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND si en cada fichero en conflicto cada trozo solo añade líneas por los dos lados, los une (primero la rama destino) y regenera `estimation-log.md` con `sdd estimation log`; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros

**MODIFIED — Un conflicto solo en los registros se resuelve con un merge de sincronización** (antes: «un cierre de feature o de patch cuyo `sdd merge` falla con `merge: conflicto en`» y «relanza el script una vez»)
- GIVEN un cierre de feature o de patch con su commit de cierre hecho y `origin/develop` por delante, cuyo merge de sincronización (`git merge --no-edit origin/develop` en el worktree de la feature) deja conflicto solo en `changelog.md`, `roadmap.md` o `estimation-log.md` de `.docs/sdd/`
- WHEN el agente sigue la receta del merge
- THEN en `changelog.md` y `roadmap.md` deja cada línea con el cambio del lado que la tocó, sin duplicar ninguna, regenera `estimation-log.md` con `sdd estimation log`, commitea el merge y sigue con `sdd merge`, sin parar a preguntar
- AND la rama destino acaba con las entradas de las dos features en cada registro y el log regenerado

**MODIFIED — Un conflicto que no se puede conservar entero es de una persona** (antes: «un cierre cuyo script falla con `merge:`»)
- GIVEN un cierre cuyo merge de sincronización o cuyo `sdd merge` deja conflicto (`base: conflicto en` o `merge: conflicto en`) y en la lista hay un fichero que no es uno de los tres registros, o los dos lados tocaron la misma línea de `changelog.md` o `roadmap.md`, o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: aborta el merge de sincronización si lo empezó (`git merge --abort`), cita el mensaje del script o de git y los ficheros, y el cierre queda «No terminado», como hoy
- AND con `vuelta: conflicto en <ficheros>` de un hotfix, el script ya lo ha deshecho todo: una persona porta el arreglo a la rama de integración y relanza el hotfix

### Capacidad: `capabilities`

**MODIFIED — El delta declara el comportamiento por capacidad** (antes: «porque `sdd-end-feature` sustituye o añade cada entrada entera por su nombre»)
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un THEN o un AND no cita las decisiones de la spec por número (`- THEN se rechaza, por la decisión 10`): la capacidad no tiene esas decisiones, y `sdd capability merge` lo rechaza
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una feature que añade C, la entrada dice A, B y C, porque el cierre de `sdd-archive` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

**MODIFIED — El cierre fusiona el delta en la verdad viva** (antes: «una feature cerrándose vía `sdd-end-feature`» y «`sdd-end-feature` no crea ningún fichero»)
- GIVEN una feature cerrándose con `sdd-archive` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN el agente ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`, que añade cada `ADDED` a `capabilities/<capability>.md`, sustituye entero con cada `MODIFIED` el requisito con ese título, quita cada `REMOVED` y sustituye o añade por su nombre cada entrada de «Reglas de la capacidad»; el walkthrough referencia los escenarios del delta como casos del smoke
- AND si el script falla, el agente corrige lo que dice su mensaje (el delta de la spec, o la línea «Nuevas» del bloque) y lo vuelve a ejecutar; no fusiona a mano
- AND el borrador del delta fusionado que el paso 7 de `sdd-start-feature` escribe mientras trabaja el revisor final sale del mismo script
- AND la capacidad no gana ninguna línea de historial
- AND tras fusionar y antes del commit de cierre, `sdd capability check --path .docs/sdd --artifact <spec.md>` pasa; si falla en lo fusionado o en el bloque, se corrige eso, no el validador
- AND un fallo en una capacidad que el delta no toca (`rooms.md` con un requisito sin THEN, mientras la 0020 fusiona en `bookings`) no bloquea el cierre: `rooms.md` no se edita y el informe final lo lista como pendiente del dev-lead
- AND `sdd-archive` no crea ningún fichero de capacidad que la spec no haya declarado

**MODIFIED — El cierre de un patch fusiona su delta** (antes: «se cierra con `sdd-end-patch`»)
- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-archive` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` abre con `## Capacidades` y `- Modificadas: \`bookings\` — cambia «Consultar salas libres»`, y lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `sdd capability merge --path .docs/sdd --artifact <patch.md>` sustituye ese requisito en `bookings.md`, sin línea de historial
- AND `sdd capability check --path .docs/sdd --artifact <patch.md>` pasa antes del commit de cierre, salvo en una capacidad que el delta no toca: esa no se edita y el mensaje final la lista como pendiente del dev-lead
- AND el cambio de `bookings.md` va en el commit de cierre del patch, y el fix con su `patch.md` queda en un solo commit
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna, el bloque dice `Ninguna, porque ninguna capacidad describe <pieza>` y el mensaje final lo dice

**ADDED — El cierre busca el literal viejo de un `MODIFIED` en toda la capacidad**
- GIVEN `split.md` con el requisito «El umbral de partir» que dice «más de 6 tasks» y la sección «Límites» de sus «Reglas de la capacidad» que repite «más de 6 tasks», y un patch cuyo `MODIFIED — El umbral de partir` (antes: «más de 6 tasks») pasa a «más de 4 tasks»
- WHEN `sdd-archive` cierra el patch, antes de `sdd capability merge`
- THEN busca «más de 6 tasks» en todo `split.md`, y por la aparición de «Límites» añade al delta de `patch.md` la entrada **Límites** de «Reglas de la capacidad» con su valor completo y «más de 4 tasks», sin editar `split.md` a mano
- AND `sdd capability merge` sustituye esa entrada, `patch.md` nombra la corrección y, tras la fusión, `split.md` no dice «más de 6 tasks» en ningún sitio

### Capacidad: `commit-history`

**MODIFIED — El cierre de una feature queda en un commit** (antes: «la documentación de `sdd-end-feature`» y «para todo sha de `tasks.md`»)
- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de cierre de `sdd-archive` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama; el cierre no se vuelve a juntar
- AND antes de juntar, cada línea `Pasada de fix:`, `Re-revisión:` o `Revisión final:` de `tasks.md` cuyo sha cae en el tramo que se junta se reescribe sin sha: `Pasada de fix: 7ea5c37, 1 hallazgo RED→GREEN` pasa a `Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN`, y `Re-revisión: 7ea5c37..21c1f70, sdd-kit:effort-high + opus, limpia` pasa a `Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia`
- AND lo mismo con cualquier sha del tramo que cite `walkthrough.md`, `patch.md`, la deuda o una ADR de la rama: se reescribe sin sha o ese tramo no se junta
- AND tras el commit de cierre, `git merge-base --is-ancestor <sha> HEAD` sale bien para todo sha que citen `tasks.md`, `walkthrough.md`, `patch.md`, la deuda y las ADR de la rama

**MODIFIED — El patch queda en dos commits** (antes: «se cierra con `sdd-end-patch`»)
- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-archive`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap, deuda y estimation-log si existen)
- AND el `commit:` de `patch.md` es el hash del commit del fix
- AND el commit del fix no toca la fila de deuda que el patch salda: la cierra el commit de cierre
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama
- AND si el dev-lead fija otra forma de commits, manda la suya y el fix no se junta; un test en RED va en el commit de su arreglo o en uno posterior, y el RED queda registrado en `patch.md` §4

### Capacidad: `roadmap`

**MODIFIED — Cerrar una fila de deuda o de backlog deja un prefijo contable** (antes: «WHEN se cierra con `sdd-end-feature` o con `sdd-end-patch`»)
- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap 2.x que una feature o un patch salda entera o en parte
- WHEN se cierra con `sdd-archive`
- THEN la celda «Ítem» empieza por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`
- AND la fila saldada dura hasta el corte de la release siguiente: el `grep` cuenta lo saldado desde la última release cerrada
- AND el prefijo `Task` de antes de la 2.0.0 se sigue leyendo igual que `Feature` y ya no se escribe

**MODIFIED — Los cierres de feature y de patch avisan del roadmap fuera de forma sin bloquear** (antes: «WHEN `sdd-end-feature` marca su fila (o `sdd-end-patch` añade la suya a «Patches»)»)
- GIVEN un roadmap con la sección heredada `## Versión siguiente`, que `sdd roadmap check` rechaza, y la feature 0030 (o el patch 0031) que se cierra
- WHEN `sdd-archive` marca su fila (o añade la del patch a «Patches»)
- THEN tras editar el roadmap y antes del commit de cierre ejecuta `sdd roadmap check`, y un fallo en una línea que escribió el cierre lo corrige
- AND los fallos de líneas que el cierre no escribió no se tocan ni paran el cierre: el mensaje final dice cuántos son y que los arregla el paso «Roadmap en la forma de la plantilla» de la migración a v2.3.0

**ADDED — Con `ROADMAP.md`, lo hecho queda en Now y la deuda saldada sale de «Lista»**
- GIVEN un proyecto con `ROADMAP.md` en la raíz, la fila 0081 en Now con `🔄`, y en «Lista» de `.docs/sdd/steering/debt.md` la fila «El recordatorio sale dos veces» con «Destino» `0081` y la fila «Los recordatorios no respetan la zona horaria» con «Destino» `0081`, que la 0081 salda solo en parte
- WHEN `sdd-archive` cierra la 0081 validada
- THEN la fila 0081 se queda en Now con `✅` (o `🧪 validación diferida a <disparador>`) y no se mueve de sección
- AND «El recordatorio sale dos veces» sale de «Lista»
- AND «Los recordatorios no respetan la zona horaria» se queda en «Lista» con «Ítem» reescrito a lo que falta
- AND `sdd roadmap check` pasa tras el cierre

**ADDED — En el roadmap 2.x, la fila «Patch:» de Próximo se marca y se queda**
- GIVEN un roadmap 2.x con la fila `| 0190 | Patch: **El gate de cierre no corre a la vez…** | ⏳ |` en «Próximo»
- WHEN `sdd-archive` cierra el patch 0190
- THEN esa fila queda con `✅` en «Próximo», y además el patch tiene su fila en «Patches»

### Capacidad: `decisions`

**ADDED — El cierre ejecuta `sdd decision check`**
- GIVEN un proyecto con `.docs/sdd/decisions/` y el cierre de una feature o de un patch
- WHEN `sdd-archive` llega a los docs vivos, después de escribir las ADR candidatas de la spec
- THEN ejecuta `sdd decision check --path .docs/sdd` y sigue solo si sale con 0
- AND un fallo en una ADR que el cierre no escribió también para el cierre: las ADR no separan fallos ajenos

### Capacidad: `estimation`

**MODIFIED — El script vive en el kit y las skills de cierre lo invocan** (antes: «`sdd-end-feature` o `sdd-end-patch` llegan al paso estimation-log»)
- GIVEN un proyecto con `.docs/sdd/estimation.md` y el kit instalado
- WHEN `sdd-archive` llega al paso estimation-log
- THEN ejecuta `sdd estimation log` desde el kit, sin buscar ni crear copia en el proyecto
- AND solo si `pwsh` no está disponible añade la fila a mano

**MODIFIED — El cierre rellena los tokens y el coste de la sesión** (antes: «el paso de tiempo real de `sdd-end-feature` o el paso 1 de `sdd-end-patch`»)
- GIVEN una feature o un patch en Claude Code que llega al paso de tiempo real de `sdd-archive`, en un proyecto con `.docs/sdd/estimation.md`
- WHEN se rellena la sección 2 del walkthrough o la §5 de `patch.md`
- THEN `Esfuerzo real` (en los dos) y `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión` (en el walkthrough) son las líneas que imprimió `sdd session tokens --path <worktree> --branch <rama>`, ejecutado desde el kit
- AND en otro harness, las cuatro dicen «no medido», con el motivo, y el esfuerzo real se aproxima con las marcas de los commits y se dice

### Capacidad: `kit-feedback`

**MODIFIED — El cierre de una feature y el de un patch ofrecen el ticket en la misma sesión** (antes: «un cierre por `sdd-end-feature` o `sdd-end-patch`»)
- GIVEN un cierre por `sdd-archive` con el resto del checklist terminado
- WHEN el agente da el cierre por cerrado
- THEN ofrece generar el ticket con `sdd-feedback` en esa misma sesión, diciendo que al limpiar el contexto ese conocimiento se pierde
- AND la oferta no es un gate: sin respuesta, el cierre termina y no deja nada pendiente ni anotado en ningún artefacto
- AND si esa feature o ese patch ya tiene su ticket, la oferta no se repite; si la sesión generó el de otra feature, la oferta se hace igual

### Capacidad: `verification`

**MODIFIED — El kit no invoca las skills de superpowers que sustituye `sdd-verify`** (antes: «el paso 9 de `sdd-end-feature`»)
- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `superpowers:verification-before-completion`, `superpowers:requesting-code-review` y `code-reviewer.md` de superpowers
- THEN ninguno aparece: el contrato de cierre de `sdd-implement` y la comprobación de la revisión final de `sdd-archive` invocan `sdd-verify`
- AND los nombres de las fuentes solo aparecen en el `NOTICE` de `sdd-verify` y en su anexo de procedencia

**MODIFIED — El cierre no repite la revisión final** (antes: «WHEN se entra en `sdd-end-feature`»)
- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión `sobre a1b2c3d`, y después de ese commit solo hay commits que se revisan en el hilo
- WHEN se entra en `sdd-archive`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué ejes y modelos
- AND si después del último revisado hay un commit `e4f5a6b` que cambia `src/slots.js` y `tasks.md` no tiene `Re-revisión:`, antes de escribir el walkthrough despacha la única re-revisión del tramo `<último revisado>..HEAD` (`sdd-kit:effort-high` + `opus`) y apunta `Re-revisión: <último revisado>..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND si `tasks.md` ya tiene `Re-revisión:`, no despacha: el walkthrough lleva `sin revisar: e4f5a6b — <qué cambia>` en ✋
- AND el último revisado es el segundo sha de la `Re-revisión:`; si no hay, el `sobre` de `Revisión final:`; y si la línea dice «juntada en el cierre», el commit de cierre
- AND una línea en el formato 2.x (`Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d`, sin ejes) cuenta como revisión final, y el tramo de la única re-revisión empieza en su `sobre`, con la pasada de fix dentro, como en el cierre único
- AND solo sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe de los ejes en esta sesión) invoca `sdd-verify` para la revisión final

## Previsión de la prueba (Art. I)

Sonnet como sujeto. Los RED corren con el kit de `develop` (las dos skills de hoy) y los GREEN con la rama. RED con n = 1 y GREEN con n = 2, salvo que la fila diga otra cosa.

| Paso nuevo o cambiado | Escenario | Sujetos | Motivo si no se mide |
| --- | --- | --- | --- |
| Tronco y rama de feature | `a1`: cierre de la 0081 en el molde de reservas, en campo | 3 | — |
| Rama de patch: no hereda pasos de feature; la fila «Patch:» se marca | `a2`: el `x1` de hoy (`patch-0008.md`) con su fila «Patch:» en Próximo | 3 | — |
| `description` de `sdd-archive` | `r1`: «hemos acabado, cierra la tarea» y «cierra el patch» sin nombrar la skill | 2 | Solo GREEN: con las skills de hoy entran por su nombre viejo, que es lo que se retira |
| Comprobaciones previas, merge de sincronización tras el commit de cierre, conflicto de registros, suite repetida solo con código nuevo, `--verified-at`, rojo ajeno y su informe | `a3`: `develop` avanzó en `src/` y en `roadmap.md`, un borrador sin commitear, otra rama abierta y un E2E que falla también en la base y ya está en la deuda | 3 | — |
| Step 3 de `sdd-worktrees` | `w1`: la línea base falla también en la rama de integración | 3 | — |
| Forma 3.0.0 de los registros | `a9`: `ROADMAP.md` con la fila en Now y `debt.md` con una fila saldada entera y otra en parte | 3 | — |
| Rama de hotfix y receta de `--into` | `a4`: `hotfix/0200-fix-login` con un patch que pide una clave nueva al proyecto | 3 | — |
| «Qué sigue» | `a5`: la 0201 con `parent: 0200` y la 0202 abierta tras ella | 3 | — |
| ADR candidatas y `decision check` | `a6`: spec con una candidata y una ADR ajena sin `### Confirmación` | 3 | — |
| El literal de un `MODIFIED` en toda la capacidad | `a7`: el caso del patch 0078 | 3 | — |
| Guarda de los shas citados en `commit-milestones.md` | `a8`: walkthrough que cita un sha del tramo, como `c2` del RED de la 0096 | 3 | — |
| Paso 5 de `sdd-start-patch`: el fix no toca la deuda | — | 0 | Lo cubre `a2`: su patch salda una fila |
| Workaround en el stack con su fila de deuda | — | 0 | Lo cubre `a1`: su walkthrough lleva el workaround |
| `patch-template.md`, `overrides-superpowers.md`, `environments-template.md` y los renombrados | — | 0 | Texto de ayuda y nombres; lo comprueba Pester |

Total: ~32 sujetos, ~3 h y ~35 $, con una tanda de REFACTOR. Si la prueba lo supera, se para y decide el dev-lead.

**Palabras** (medido el 2026-10-16, palabras / tope):

| Skill | SKILL.md | Total | Margen |
| --- | --- | --- | --- |
| `sdd-end-feature` + `sdd-end-patch` | 2.975 + 2.454 | 4.508 + 2.454 = 6.962 | se retiran |
| `sdd-archive` (nueva) | — / 3.600 | — / 6.000 | tope de la decisión del dev-lead; ~300 para la pasada de fix |
| `sdd-verify` | 2.885 / 2.900 | 8.798 / 8.800 | 15 y 2 |
| `sdd-end-release` | 1.855 / 1.900 | 2.420 / 2.500 | 45 y 80 |
| `sdd-start-feature` | 2.028 / 2.100 | 11.458 / 11.464 | 72 y 6 |
| `sdd-worktrees` | 1.209 / 1.300 | 1.209 / 1.300 | 91 |
| `sdd-start-patch` | 1.825 / 2.300 | 1.825 / 2.300 | 475 |
| `sdd-feedback` | 711 / 800 | 711 / 800 | 89 |
| `add-to-changelog` | 404 / 500 | 404 / 500 | 96 |

Los renombrados restan («`sdd-end-feature` o `sdd-end-patch`» pasa a «`sdd-archive`»). `commit-milestones.md` y `control-profiles.md` cuentan en el total de `sdd-start-feature`: sus añadidos se compensan con recortes en la misma task.

## Anexo — regla retirada → dónde vive ahora

Una fila por paso, red flag y racionalización de las tres fuentes. «Se conserva» quiere decir que el texto pasa traducido o literal; «kit distinto» lleva su motivo (ADR 0013).

| Fuente | Pieza | Dónde vive ahora | Se conserva o motivo |
| --- | --- | --- | --- |
| `sdd-end-feature` | Overview | `sdd-archive/SKILL.md`, Overview | Se conserva, para los dos carriles |
| `sdd-end-feature` | 0. Pre-check de coherencia | Tronco, comprobaciones previas | Se conserva; el patch comprueba su `patch.md` |
| `sdd-end-feature` | 1. `walkthrough.md` | Tronco, registro del evento (`Feature only:`) | Se conserva, con el sha de la base integrada |
| `sdd-end-feature` | 2. Tiempo real | Tronco, registro del evento; `references/estimation.md` | Se conserva, común con el paso 1 del patch |
| `sdd-end-feature` | 3. estimation-log | Tronco, índices; `references/estimation.md` | Se conserva, común con el paso 5 del patch |
| `sdd-end-feature` | 4. Aprendizajes → docs vivos | Tronco, docs vivos (`Feature only:`) | Se conserva; gana el workaround con fila de deuda y el literal del `MODIFIED` |
| `sdd-end-feature` | 5. Revisión de skills | Tronco, docs vivos (`Feature only:`); `references/aprendizajes-skills.md` | Se conserva hasta la 0151 |
| `sdd-end-feature` | 6. `tasks.md` | Tronco, registro del evento (`Feature only:`) | Se conserva |
| `sdd-end-feature` | 7. Changelog | Tronco, índices | Se conserva, común con el paso 3 del patch |
| `sdd-end-feature` | 8. `roadmap.md` | Tronco, índices | Se conserva; gana la forma 3.0.0 (Now y `debt.md`) |
| `sdd-end-feature` | 9. Code-review | Tronco, comprobaciones previas (`Feature only:`) | Se conserva |
| `sdd-end-feature` | 10. Rama | Tronco, merge; `references/merge-recipe.md` | Kit distinto: sin `finishing-a-development-branch`; la base integrada va antes de los registros |
| `sdd-end-feature` | 11. Ticket para el kit | Tronco, ticket | Se conserva, común con el paso 7 del patch |
| `sdd-end-feature` | 12. Mensaje final | Tronco, mensaje final | Se conserva; gana «qué sigue» |
| `sdd-end-feature` | Para patches | — | Desaparece: el patch es una rama del tronco |
| `sdd-end-feature` | Red flag: mergear sin `walkthrough.md` | Red flags (`Feature only:`) | Se conserva |
| `sdd-end-feature` | Red flag: tiempo real en blanco o sin fila en el log | Red flags | Se conserva, común con «`patch.md` sin commit hash o con el tiempo en blanco» |
| `sdd-end-feature` | Red flag: no has abierto `.claude/skills/` | Red flags (`Feature only:`) | Se conserva |
| `sdd-end-feature` | Red flag: no has tocado `roadmap.md` | Red flags | Se conserva, común con «la tabla de patches no tiene la fila» |
| `sdd-end-feature` | Red flag: la spec sigue en `draft` | Red flags (`Feature only:`) | Se conserva |
| `sdd-end-feature` | Red flag: un valor de `capabilities/` copiado en el stack | Red flags | Se conserva |
| `sdd-end-feature` | Red flag: aprendizaje estructural sin `architecture.md` | Red flags (`Feature only:`) | Se conserva |
| `sdd-end-feature` | Racionalización «Sin `architecture.md` no hay doc vivo…» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «Pedir cerrar ya es validar» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «Feature lite, cierre ligero» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «Prisa: walkthrough mínimo» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «El aprendizaje ya está en el walkthrough» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «Sin skills, me salto el paso» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «Los tiempos en tech-stack» | Racionalizaciones | Se conserva |
| `sdd-end-feature` | Racionalización «El tiempo quedó en el walkthrough» | Racionalizaciones | Se conserva |
| `sdd-end-patch` | Overview | `sdd-archive/SKILL.md`, Overview | Se conserva, fundido con el de feature |
| `sdd-end-patch` | 0. Validación | Tronco, validación | Se conserva, común con la de feature |
| `sdd-end-patch` | 1. `patch.md` finalizado | Tronco, registro del evento (`Patch only:`) | Se conserva; gana el `grep` del literal del `MODIFIED` |
| `sdd-end-patch` | 2. Commit de cierre | Tronco, historia | Se conserva, común con el squash de feature y la guarda de los shas |
| `sdd-end-patch` | 3. Changelog | Tronco, índices | Se conserva (`Fixed`, `Changed`, `Removed`) |
| `sdd-end-patch` | 4. `roadmap.md` | Tronco, índices (`Patch only:`) | Se conserva; la fila «Patch:» de Próximo se marca |
| `sdd-end-patch` | 5. estimation-log | Tronco, índices | Se conserva |
| `sdd-end-patch` | 6. Rama | Tronco, merge; `references/merge-recipe.md` | Kit distinto: sin `finishing-a-development-branch` |
| `sdd-end-patch` | 7. Ticket para el kit | Tronco, ticket | Se conserva |
| `sdd-end-patch` | 8. Mensaje final | Tronco, mensaje final | Se conserva; gana «qué sigue» |
| `sdd-end-patch` | Red flag: fusionar sin decisión ni bloque `merge`, o a `main` | Red flags | Se conserva; `main` solo en un hotfix con `--order` |
| `sdd-end-patch` | Red flag: fusionar sin línea de validación | Red flags | Se conserva, común con la feature |
| `sdd-end-patch` | Red flag: la tabla de patches sin la fila | Red flags (`Patch only:`) | Se conserva |
| `sdd-end-patch` | Red flag: `patch.md` sin commit hash o sin tiempo | Red flags (`Patch only:`) | Se conserva |
| `sdd-end-patch` | Racionalización «Trivial y urgente: fusiono» | Racionalizaciones | Se conserva |
| `sdd-end-patch` | Racionalización «El bloque `merge` me autoriza» | Racionalizaciones | Se conserva |
| `sdd-end-patch` | Racionalización «El roadmap ya se actualizará» | Racionalizaciones | Se conserva, fundida con «No has tocado `roadmap.md`» |
| `sdd-end-patch` | Racionalización «Ya está todo en el patch.md» | Racionalizaciones | Se conserva |
| `finishing` 7.0.0 | Overview, «Core principle» | Tronco, merge | Kit distinto: sin menú; la política `merge` o la decisión del dev-lead |
| `finishing` 7.0.0 | Announce at start | — | Kit distinto: el aviso de cambio de paso de `control-profiles` |
| `finishing` 7.0.0 | Step 1: Verify Tests | Tronco, base integrada y suite | Se conserva, sobre la base integrada y una vez |
| `finishing` 7.0.0 | Step 2: Detect Environment | Tronco, merge (`env:clean`, worktree enlazado o checkout principal) | Se conserva |
| `finishing` 7.0.0 | Step 3: Determine Base Branch | Tronco, merge | Kit distinto: `merge.into`, o la rama estable en un hotfix |
| `finishing` 7.0.0 | Step 4: Present Options | — | Kit distinto: sin menú (política `merge` de `sdd-kit.json`) |
| `finishing` 7.0.0 | Option 1: Merge Locally | `references/merge-recipe.md` | Kit distinto: lo hace `sdd merge` con cerrojo, verificación y push |
| `finishing` 7.0.0 | Option 2: Push and Create PR | `references/merge-recipe.md`, «sin bloque `merge`» | Kit distinto: solo si el dev-lead lo pide |
| `finishing` 7.0.0 | Option 3: Keep As-Is | Tronco, mensaje final («No terminado») | Kit distinto |
| `finishing` 7.0.0 | Discard on request | Red flags | Se conserva: solo con la palabra del dev-lead |
| `finishing` 7.0.0 | Step 6: Cleanup Workspace | Tronco, mensaje final (la línea de terminado ofrece borrar el worktree) | Kit distinto: `merge.removeWorktree`; solo el worktree enlazado propio |
| `finishing` 7.0.0 | Quick Reference | — | Kit distinto: sin menú |
| `finishing` 7.0.0 | «Tests passed earlier this session» | Racionalizaciones | Se conserva: la suite corre sobre la base integrada |
| `finishing` 7.0.0 | «They obviously want it merged» | Racionalizaciones | Kit distinto: lo decide la política `merge` o el dev-lead |
| `finishing` 7.0.0 | «I'll offer to discard it» | Racionalizaciones | Se conserva |
| `finishing` 7.0.0 | «'Yeah, get rid of it' counts as confirmation» | Racionalizaciones | Se conserva |
| `finishing` 7.0.0 | «The PR is up, so the worktree is clutter» | Racionalizaciones | Se conserva |
| `finishing` 7.0.0 | «This other worktree looks stale» | Racionalizaciones | Se conserva |
| `finishing` 7.0.0 | «Removal refused — `--force`» | Racionalizaciones | Se conserva |
| `finishing` 7.0.0 | «The merged-result failure is probably flaky» | Racionalizaciones | Se conserva, con `base: en rojo` y la deuda |
| `finishing` 7.0.0 | «The base branch is obviously main» | Racionalizaciones | Kit distinto: `merge.into`; `main` solo en un hotfix |
| `finishing` 7.0.0 | «Force-push will fix it» | Racionalizaciones | Se conserva: `sdd merge` reintenta, nunca fuerza |

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-16 | aprobada: «Apruebo (Recomendada)» |
