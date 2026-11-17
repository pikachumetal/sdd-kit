---
id: 20260925-180228-feature-0074-using-sdd
feature: 0074
title: Walkthrough — Skill using-sdd, la puerta de entrada al kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Skill using-sdd, la puerta de entrada al kit

## 1. Cambios realizados

- **Skill nueva `skills/using-sdd/SKILL.md`** (437 palabras): precedencia sobre `brainstorming`, tabla de 8 puertas con los nombres definitivos, regla de duda (una sola pregunta, con la recomendación primero) y tres racionalizaciones sacadas de las frases del RED. «Algo grande» remite al criterio de partir de `sdd-start-feature`, sin umbral propio. Commits `1f89f99` y `cbd70f0`, este último con la regla «planificar sin hacerlo todavía», que la revisión final encontró perdida.
- **Hook**: `hooks/session-start` inyecta la skill entera, y `hooks/router.md` se retira (`1f89f99`).
- **`description` de `sdd-config` y `sdd-roadmap`**: solo cambia el frontmatter. Entran las preferencias («me paras mucho», «quiero menos preguntas») y los items del gestor que te han asignado (`99a6648`).
- **Lanzador headless**: `SUPERPOWERS_DIR` aísla al sujeto de la configuración del usuario (`--setting-sources ""`) y carga superpowers por `--plugin-dir`. `build_claude_args` monta los argumentos en un array que se deja en `<etiqueta>.args` (`c587d93` y `cbd70f0`).
- **Tests**: `tests/UsingSdd.Tests.ps1` (nuevo); `Hook`, `FeatureRename`, `PlanEntry` y `HeadlessLauncher`, adaptados.
- **Evidencia**: [`tests/using-sdd-red.md`](../../../../tests/using-sdd-red.md) y [`tests/using-sdd-green.md`](../../../../tests/using-sdd-green.md). Salidas en `red/out/`, `green/out/` y `refactor/out/`.
- **Docs**: README (catálogo y «Enrutado automático»), `CLAUDE.md` (14 skills), `architecture.md`, `tech-stack.md` (aislamiento de sujetos, batería por release, hook) y fila de deuda de Codex en el roadmap (`88c9a4e`).
- Dos merges de `develop`: `a92cf57` (patch 0078) y `9ce031d` (patch 0080 y deuda del ticket 0078), sin conflictos.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,5h — aproximado con las marcas de los commits: de la apertura (20:26) a los fixes de la revisión final (20:50), más ~5 min de los controles r1, r2 y r4 (23:42), lanzados tras la respuesta del dev-lead. Spec y plan, RED incluido: ~0,5h (de ~19:55 a 20:26).
- Desviación: −1,0h (−67 %)
- Causa de la desviación: la estimación contaba la campaña GREEN como el grueso del tiempo, pero los 28 sujetos corren en paralelo en ~7 min. Además, en Native no hay revisor por task, y la documentación se escribió mientras corría el GREEN.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature; el dev-lead aprobó la spec sin la parada para bajar de modelo)
- Tokens del hilo: 28.814.385 — claude-opus-5-5 28.814.385
- Tokens de subagentes: 1.969.810 en 1 despacho — Revisión final rama 0074 claude-opus-5-5 1.969.810 / 4 min
- Coste de la sesión: 16,77 $ (hilo 15,35 $ + subagentes 1,42 $)
- Coste de sujetos: 8,07 $ en 55 sujetos — RED Sonnet 2,88 $ (18); GREEN Sonnet 4,00 $ (28); controles tras la revisión final, Sonnet, 1,13 $ (7); sondas de aislamiento Haiku ~0,06 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Antes de la Task 1 se integró `develop`: el patch 0078 cambió el cuerpo de `skills/sdd-roadmap/SKILL.md`, que la Task 2 toca en su `description`.
- Tras la revisión final: una frase nueva en la batería (`r5`) y 7 sujetos de control. El techo pasó de 50 a 53 sujetos por decisión del dev-lead.

### Decisiones tomadas sin el dev-lead

- Integrar `develop` (patch 0078) en la rama y seguir sin parar, aunque tocaba `skills/sdd-roadmap/SKILL.md`, fichero de la Task 2 — el dev-lead había previsto esa superposición («De las skills de entrada, toca solo la description del frontmatter, nunca el cuerpo») y la Task 2 solo toca la `description` — coste si está mal: un conflicto en esa línea al fusionar.
- Aislar a los sujetos con `SUPERPOWERS_DIR` (`--setting-sources ""`) — el `CLAUDE.md` de usuario del dev-lead ya enruta al kit, y medir con él habría dado por buena una puerta que un dev sin él no tiene — coste si está mal: la campaña mide un entorno sin la configuración de usuario de nadie.
- Sin primera pregunta de carril y modo: feature, modo full, perfil `delegate` del proyecto — el dev-lead delegó el método («decide tú y cuéntamelo al final») — coste si está mal: ninguno visible, porque la spec se aprobó.
- `r1` contó en el RED como equivalente y no como fallo, porque los dos sujetos proponían partir desde `sdd-start-feature` — en el GREEN entra por `sdd-roadmap`, que es lo que pide la spec.
- Minors diferidos de la revisión final (no se arreglaron):
  - `lib.sh`: DRY_RUN rompe su JSON falso con backslashes en `EXTRA_ALLOWED`.
  - `UsingSdd.Tests.ps1`: la búsqueda de fila se repite tres veces (extraer `Get-DoorRow`).
  - `UsingSdd.Tests.ps1`: los dígitos se comprueban solo en la fila de roadmap, no en todo el cuerpo.
  - `FeatureRename.Tests.ps1`: la variable `$router` tiene un nombre desfasado.
  - La `description` de `using-sdd` dice qué hace, además de cuándo usarla.
  - La fila «Sin `.docs/sdd/`» de `using-sdd` casi nunca se alcanza, porque el hook y la `description` limitan la skill a proyectos con `.docs/sdd/`.
  - README: «pide una pregunta» debería ser «hace una sola pregunta».
  - Una frase torpe en `using-sdd-green.md`.
  - La fila de la 0064 aún lista `hooks/router.md` entre sus ficheros.
  - El minor del array vacío con bash < 4.4 desapareció con `build_claude_args`.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 879 pasados, 0 fallidos, 9 omitidos (315 s), tras los fixes de la revisión final.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «probamos en diferido» · disparador: el piloto en un proyecto real del equipo tras el corte de la 2.0.0 (paso 6 del cierre de la release), a cargo del dev-lead

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Hook con `.docs/sdd/` | JSON válido; `additionalContext` empieza por `name: using-sdd` (437 palabras) |
| 2 | Hook sin `.docs/sdd/` | sin salida, código 0 |
| 3 | Batería GREEN, 14 frases × 2 sujetos | 28 de 28 en su puerta (RED: 10 de 14 frases) |
| 4 | «No me gusta que me pares tanto…» (s1) | `sdd-config` 2 de 2, sin escribir en memoria (RED: 0 de 2, «Lo he guardado en memoria») |
| 5 | «Me han asignado en Azure el 412 y el 415» (r3) | `sdd-roadmap` 2 de 2, y 1 de 1 tras la revisión final (RED: `sdd-start-feature` 2 de 2) |
| 6 | «Hay que mejorar las reservas…» (d1) | ninguna skill, una sola pregunta con la recomendación delante, sin rama ni carpeta, 2 de 2 |
| 7 | «Apunta en el roadmap…, no lo arranques todavía» (r5) | `sdd-roadmap` 1 de 1 |
| 8 | Controles tras la revisión final (r1, r2, r3, r4, f1, f3) | 6 de 6 en su puerta |
| 9 | `.args` de un sujeto real | lleva `--setting-sources ""` y `--plugin-dir` de superpowers |

### 4.3 Residuales / deuda generada

- Codex: `.codex-plugin/plugin.json` con `"hooks": {}` y el RED en Codex. La fila de deuda del auto-enrutado queda reescrita con eso.
- Los minors diferidos de §3.

## 5. Aprendizajes

- Un sujeto de enrutado hereda el `CLAUDE.md` de usuario del dev-lead, y `--setting-sources project,local` no lo quita; `""` sí → `tech-stack.md` («Un sujeto de enrutado no lleva el `CLAUDE.md` del dev-lead») y `SUPERPOWERS_DIR` en `tests/headless/lib.sh`.
- La batería de puertas se repite en cada release, con `red/subject.sh` de esta carpeta → `tech-stack.md` («Batería de puertas, en cada release»).
- Un test de «en seco» que solo mira una etiqueta no prueba que el argumento llegue al comando. El lanzador guarda sus argumentos en `<etiqueta>.args` y el test los lee → `tech-stack.md` («Un test del lanzador comprueba los argumentos que llegan a `claude`…») y `tests/HeadlessLauncher.Tests.ps1`.
- Al retirar un fichero de reglas (el router), la tabla «regla → dónde vive ahora» de la spec no basta si nadie la contrasta con el texto nuevo: una regla se perdió y la encontró la revisión final → `constitution.md` ya lo exige para skills retiradas (Art. I, task 0062); este caso lo confirma sin cambiar el texto.

## 6. Adendas

- _Ninguna_
