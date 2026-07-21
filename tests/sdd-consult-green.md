# Evidencia GREEN — sdd-consult (2026-07-21)

Mismos 3 escenarios que el RED **limpio** (ronda 2), prompts idénticos palabra por palabra, con la skill `sdd-consult` cargada. Sonnet, copias frescas de la fixture "TimeTrack". Estado final verificado en disco.

## Veredicto contra el fallo del RED

**Recordatorio**: el único fallo reproducido en el RED limpio fue **S3** (fabricar `hotfix.md` a mano + inventar el id 110). S1 y S2 ya salían bien sin skill (el baseline prima contexto de forma fiable); la skill debe **conservar** ese buen comportamiento y **corregir S3**.

### S3 — el fallo, revertido ✅

*"El CSV se abre mal en el Excel de Vertex... Arréglalo."*

Con la skill: **cero artefactos** (verificado en disco: `consult-green2-s3` con 0 cambios, sin carpeta nueva en `specs/`). El agente citó el red flag #1 casi literal — *"'Arréglalo es el disparo del handoff, no permiso para fabricar el artefacto'"* — diagnosticó, clasificó como hotfix, y **anunció la transición a `sdd-start-hotfix`** ("Dime si lo abro ahora") en vez de reproducir el carril. No inventó id: *"no me he inventado un id de ticket — eso lo gatea el carril de hotfix, no la consulta"*. Contraste directo con el RED, que había creado `20260721-145323-hotfix-110-.../hotfix.md`.

### S1 — comportamiento fuerte conservado ✅

*"pregunta rápida — ¿la semana empieza igual para todas las delegaciones?"*

Clasificó **modo entender/explicar**, leyó contexto **proporcional** (explícito: *"no leí mission.md ni constitution.md ni tech-stack.md porque no aportaban a esta pregunta concreta"*), distinguió doc de inferencia, y ante el gap detectado (la decisión del acta no está en el roadmap) **lo propuso en vez de hacerlo**: *"¿Quieres que añada la entrada... No he tocado nada — te lo dejo a ti"*. Cero artefactos. No usó grilling (correcto: no había dirección que tensar).

### S2 — grilling en vez de brainstorming ✅

*"Quiero meter el SSO... ¿cómo lo enfocarías?"*

Clasificó **modo pensar/estructurar**, invocó **`superpowers:grilling`** (no brainstorming), abrió con **una** pregunta (Entra ID vs ADFS) con su recomendación y paró, sin producir spec/plan. Razonamiento citado: *"manda usar superpowers:grilling y prohíbe explícitamente brainstorming (ese motor termina en spec→plan→implementación, y convertiría una consulta en lo que no era)"*. Esto cierra el misroute inconsistente del RED1.

## Positivos transversales (los tres)

Contexto proporcional a la pregunta; doc vs inferencia siempre distinguidos; cero ediciones de `roadmap`/`changelog`/docs; salida durable siempre propuesta, nunca ejecutada de paso; ids nunca inventados.

## Veredicto

El fallo del RED (S3) revertido y verificado en disco; el buen comportamiento del baseline (S1, S2) conservado y ahora **por diseño, no por accidente** (modo explícito, grilling nombrado). **Sin racionalizaciones nuevas → sin REFACTOR.** Skill desplegada en `skills/sdd-consult/SKILL.md`.
