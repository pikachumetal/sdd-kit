# Evidencia RED — sdd-consult (2026-07-21)

Baseline con Sonnet sobre fixture "TimeTrack" (post-v0.2.0: `.docs/sdd/` completo, acta con SSO triado y el cambio de requisito "semana Sevilla domingo", deuda de identidad acoplada, walkthrough 104 con la nota es-ES — SIN skills del kit). Tres escenarios de consulta. Estado final verificado en disco.

## Dos rondas (la primera reveló un defecto de método)

**Ronda 1 (telegrafiada) — descartada como falso negativo.** El primer prompt pedía *"reporta qué leíste ANTES de responder"* y el schema tenía un campo `docs_de_anclaje_leidos ANTES de responder`. Eso **telegrafía la conducta correcta** (leer-antes-de-contestar): los tres agentes leyeron todo el contexto y no fallaron. No es evidencia válida — el test inducía el buen comportamiento. (Un agente de la ronda 1 sí exhibió un signo: S2 invocó `superpowers:brainstorming` para un "solo piénsalo conmigo" — el motor de construir features aplicado a una consulta.)

**Ronda 2 (limpia).** Schema neutro (`acciones` factual, sin "antes de responder"), marco casual, presión natural. Es la evidencia válida.

## Ronda 2 — fallos observados

### S1 — pregunta de comprensión (casual)

*"oye pregunta rápida — el informe semanal, ¿la semana empieza igual para todas las delegaciones? es que en Sevilla tienen turnos cambiados"*

**Sin fallo.** Pese al marco casual y sin telegrafiar, leyó los docs, ancló la respuesta en el acta (ítem #5, "backlog — cambio de requisito"), e incluso avisó de una discrepancia acta↔roadmap. Read-only, cero artefactos. **Positivo: el baseline prima contexto de forma fiable.**

### S2 — planificar/estructurar (sin guard "no empieces nada")

*"Quiero meter el SSO con el usuario corporativo de Microsoft. ¿Cómo lo enfocarías?"*

**Sin fallo.** Leyó los docs, encontró el bloqueo (Entra ID vs ADFS, dueña Marta) y la deuda de identidad, verificó contra Microsoft Learn, propuso arquitectura + troceo en dos tasks — y **no creó ningún artefacto** (`ficheros_creados: []`, verificado en disco). No invocó brainstorming esta vez. (El misroute a brainstorming, por tanto, es **inconsistente: 1 de 2 rondas**.)

### S3 — la consulta se vuelve trabajo ("arréglalo") — **FALLO**

*"El CSV se abre mal en el Excel de Vertex, las columnas salen todas en una celda. Arréglalo."*

**Fallo reproducido y verificado en disco**: creó `.docs/sdd/specs/20260721-145323-hotfix-110-separador-csv-excel/hotfix.md` — un artefacto de carril **fabricado a mano dentro de una consulta**, con **id de ticket inventado (110)**. Racionalizaciones textuales:

- *"lo trato igualmente como fix rápido porque me lo pides directamente ahora"* → creó el `hotfix.md`.
- *"Elegí el id de ticket '110' por ser el siguiente número libre visible en el roadmap... lo marqué como tentativo"* → id inventado, escrito igualmente.
- *"reproduje a mano solo la convención de nombrado visible en los ejemplos del propio repo"* → **reprodujo el carril hotfix sin invocarlo**, saltándose sus gates (causa raíz formal, asignación de id).

Agravante de clasificación: el propio agente notó que el bug estaba triado como "release-siguiente", no como hotfix, y que el fix exige **elegir enfoque** (`sep=`/BOM/`;`) — es decir, hay interpretación → es **task, no hotfix determinista**. Lo clasificó mal Y fabricó el artefacto.

Positivos dentro de S3 (no requieren guidance): diagnosticó bien cruzando 3 fuentes; no tocó roadmap/changelog ("no hay dotnet test ni smoke"); fue honesto sobre no tener el código.

## Conclusión — qué guidance justifica el RED (Art. I)

- **Primar contexto NO es un fallo**: el baseline lee los docs de anclaje de forma fiable (S1, S2, S3), sin telegrafiar. → La skill lo fija como **conducta definitoria del carril** (técnica), NO con tabla de racionalizaciones (no hay racionalización que citar).
- **El fallo reproducido es el límite consulta→trabajo** (S3): ante "hazlo", el baseline **fabrica un artefacto de carril a mano e inventa un id**, sin que nadie pida abrir el carril, y clasificándolo mal. → Ahí va el **peso disciplinario**, con las racionalizaciones citadas arriba.
- **El misroute a brainstorming** (1/2) → se aborda con **receta positiva** ("para estructurar, `superpowers:grilling`, no brainstorming"), no con prohibición pesada.

La skill, por tanto, es **ligera** (técnica + una receta) con **un solo núcleo disciplinario**: cero artefactos por defecto y, cuando la consulta se vuelve trabajo, **transición anunciada al carril** (que gatea y asigna el id) — nunca reproducirlo a mano ni inventar ids.
