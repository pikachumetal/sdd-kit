# RED — Review Focus del plan (feature 0113)

Kit de `develop` en `26e4ff85` (plantilla sin `## Review Focus`), superpowers 6.4.2 desde `superpowers-marketplace`. Sujetos headless con `tests/headless/run.sh` y el [subject.sh](../.docs/sdd/specs/20260929-170930-feature-0113-plan-review-focus/red/subject.sh) de la feature; salidas en [`red/out/`](../.docs/sdd/specs/20260929-170930-feature-0113-plan-review-focus/red/out/). Diez sujetos, 7,23 $ (Sonnet 2,98 $, Opus 4,25 $).

## Escenarios

- **p** — molde de la task 0006 con la spec de la 0012 aprobada (filtro de reservas por `status`, sin decir qué pasa con `status=Foo`), perfil `delegate`: «escribe el `plan.md` y para ahí».
- **e** — el mismo molde con [plan-e.md](../.docs/sdd/specs/20260929-170930-feature-0113-plan-review-focus/red/plan-e.md): su Review Focus nombra `Rejects_unknown_status_with_400` en la Task 1, que no está en «Tests RED»; «escribe los tests RED de la Task 1 y para».
- **r** — molde salas de la 0057 (Native, Tasks 1 y 2 commiteadas) con dos líneas de Review Focus en el plan; el revisor final se deniega con `deny-agent.mjs` de la 0085 y su encargo queda en `agent-prompts.txt`.

## Resultados

| Medida | Sonnet (1, 2) | Opus 5.5 (3, 4) |
| --- | --- | --- |
| p: el plan tiene `## Review Focus` entre «Restricciones globales» y «Phase -1» | 2/2 | **1/2** — p-3 lo escribe como «### 1.10 Foco de revisión» dentro de las decisiones técnicas |
| p: «Decisiones que he tomado yo» resume el Review Focus | **0/2** | **0/2** |
| p: cada línea nombra su task y su test | **1/2** — p-1 escribe solo «Task 1» | 2/2 (p-3 en su §1.10) |
| p: los tests de las líneas están en la task dueña | 2/2 | 2/2 |
| e: el hilo escribe el test de la línea que no está en «Tests RED» | 2/2 | sin medir |
| r: el encargo del revisor final lleva el Review Focus literal | 2/2 | **1/2** — r-4 escribe «El plan tiene una sección «Review Focus». Comprueba cada uno de sus puntos…» sin copiar las líneas |

## De dónde sale la conducta

- La sección de p-1, p-2 y p-4 sale de la plantilla de cabecera de `writing-plans` 6.4.2, que se carga siempre. p-3 siguió la estructura de `plan-template.md`, que no tiene hueco, y la metió como una decisión técnica más, traducida. Con ese nombre, `executing-plans` («the plan's Review Focus section verbatim if it has one») no la encuentra: es el fallo de los tickets de campo (0073 §4, 0099 §5, 0109 §1, 0027 del template §3), todos con el hilo en Opus.
- El test de e sale de la línea del Review Focus del molde, que ya nombra el test: es la forma que fija esta feature en la plantilla, no una fuente incidental.
- La copia de r-1, r-2 y r-3 sale de `executing-plans`; r-4 lo resumió en una remisión al plan, y el kit no dice nada en «Revisor final».

## Qué entra en la guía (Approach de la spec: solo lo que falla)

- **Entra**: la sección `## Review Focus` en `plan-template.md`, con su nombre, su sitio y la forma de línea con el test; la línea que la resume en «Decisiones»; su fila en el self-review §4; la sección `## Review Focus` del encargo del revisor final en `encargo-revision.md`.
- **No entra** (baseline limpio): el paso 6 de `sdd-start-feature` y la frase del implementador de `encargo-revision.md` (e 2/2), y la ayuda de «Tests RED» de la plantilla (los tests ya están en la task dueña, 4/4). El GREEN repite e como control, con Opus.
