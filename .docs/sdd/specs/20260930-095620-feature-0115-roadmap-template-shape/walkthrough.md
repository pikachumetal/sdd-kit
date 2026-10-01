---
id: 20260930-095620-feature-0115-roadmap-template-shape
feature: 0115
title: Walkthrough — El roadmap en la forma de la plantilla
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-30
---

# Walkthrough — El roadmap en la forma de la plantilla

## 1. Cambios realizados

- **Validador** (`fdcabcc1`, `1892036e`): `skills/sdd-templates/scripts/Test-Roadmap.ps1` comprueba las secciones de la plantilla, su orden, la prosa, las cabeceras, los estados, las filas saldadas y los patches no posteriores a la última release, las features ya publicadas y el título de cada release cerrada. 36 tests en `tests/Test-Roadmap.Tests.ps1`; `tests/RoadmapStructure.Tests.ps1` lo ejecuta contra el roadmap del repo en el pre-commit.
- **Plantilla** (`fdcabcc1`, `700f394a`, `1892036e`): `roadmap-template.md` dice qué va y qué no va en cada sección, cuándo sale una fila saldada y un patch, y qué nombra el resumen de una release. Fila del script en el índice de `sdd-templates/SKILL.md`.
- **Migración** (`700f394a`, `5e316c70`): `migrations/v2.3.0.md`, con el paso «Roadmap en la forma de la plantilla»: predicado con el validador, sha del roadmap anterior, tabla de destinos con gate y verificación. Evidencia en `tests/roadmap-shape-red.md` y `tests/roadmap-shape-green.md`.
- **Principio** (`c3543159`, `1892036e`): Art. XI «Documentos acotados» en `constitution.md` y tabla «Documentos de `.docs/sdd/`» en `architecture.md`; índice y regla 5 de `CLAUDE.md`.
- **Este roadmap** (`12290391`, `25753878`): migrado con la tabla de `migration-gate.md`. De 46.309 palabras a 32.779, con `develop` integrado. `roadmap-before.md` guarda el roadmap de partida entero. Las decisiones tomadas fueron a `constitution.md`, `architecture.md`, `mission.md`, `tech-stack.md` y al resumen de la v2.0.0; las referencias de vigilancia, a `tech-stack.md`.
- **Partición**: el mantenimiento en los cierres (`sdd-end-release`, `sdd-roadmap`, el validador en los cierres) pasó a la fila 0123.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 3h — reloj del hilo, aproximado con las marcas de los commits (apertura a las 11:08 UTC, cierre hacia las 14:15 UTC); incluye las esperas de dos paradas del dev-lead y de los sujetos y revisores en segundo plano
- Desviación: +0,5h (+20%)
- Causa de la desviación: no obligatoria; la suma viene de la pasada de fix, de dos enmiendas y de integrar `develop`, que se movió durante la feature
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 63.387.430 — claude-opus-5-5 63.387.430 (incluye la spec y el plan: la rama ya existía al arrancar la sesión)
- Tokens de subagentes: 3.973.352 en 5 despachos — Re-revisión 0115 tramo claude-opus-5-5 499.221 / 2 min; Review spec 0115 técnica claude-sonnet-5-5 125.794 / 1 min; Re-revisión 0115 merge claude-opus-5-5 899.864 / 3 min; Review spec 0115 dominio claude-sonnet-5-5 134.766 / 1 min; Revisión final 0115 claude-opus-5-5 2.313.707 / 6 min
- Coste de la sesión: 33,28 $ (hilo 28,74 $ + subagentes 4,54 $)
- Coste de sujetos: 2,67 $ en 10 sujetos Sonnet — RED 0,61 $; GREEN 1,23 $; ajuste 0,54 $; control 0,29 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 19 (2 en parte)

## 3. Desviaciones del plan

- **Dos enmiendas de la spec**, aprobadas por el dev-lead: un patch publicado sale de «Patches» en el corte, y el título de una release cerrada lleva versión y fecha. La primera salió del GREEN (cuatro tratamientos de la tabla en cuatro sujetos); la segunda, de la revisión final.
- **Un sujeto más de los previstos** (10 en vez de 9), aprobado por el dev-lead, para el control de la frase que la revisión final pidió en la receta.
- **Integración de `develop` antes de la validación**, por decisión del dev-lead: `develop` avanzó cinco commits que tocaban el roadmap en su forma antigua. El merge de sincronización (`25753878`) va antes del cierre, y por él el hito de cierre no se junta en un commit: su rango contiene un merge.
- **La base no se comprobó antes de la Task 4.** Se miró antes de la Task 1 y no se volvió a mirar; el choque se vio al preparar el cierre.

### Decisiones tomadas sin el dev-lead

- El RED se lanzó sin vigía de silencio — `SUBJECT_TIMEOUT=900` ya corta a cada sujeto — coste si está mal: un sujeto colgado hasta 15 min.
- La regla de la feature publicada solo mira ids de 4 caracteres o más — un «3» de «Próximo» aparece en cualquier resumen — coste: un id de gestor corto ya publicado no se detecta.
- El commit de la Task 3 lleva `constitution.md` y `architecture.md` enteros, con tres frases de la Task 4 — no se puede partir un fichero en dos commits sin modo interactivo — coste: el rango de la Task 3 incluye esas frases.
- Las piezas de la 0015 entran en la deuda con el título aprobado en el gate y un enlace a `roadmap-before.md`, no con el fragmento literal — coste: quien arranque una pieza abre `roadmap-before.md`.
- La propuesta «documentos acotados» va al Backlog (B10) sin id — lo reserva `sdd-roadmap` al escribirla — coste: mover una fila.
- `SuperpowersCompat.Tests.ps1` lee las referencias de vigilancia de `tech-stack.md` — la sección se movió — coste: ninguno.
- El diff de `roadmap.md` quedó fuera del paquete del revisor final — 500 KB por la longitud de sus filas; se revisó en el árbol — coste: un error en una fila movida lo cubren el validador y `roadmap-before.md`.
- Los tests de `Test-Roadmap.Tests.ps1` van con `Slow`, contra la decisión 5 del plan — el conjunto rápido llegó a 28 s con un tope de 30 — coste: una regresión del validador la ve la suite completa, no el pre-commit.
- El falso positivo de la feature publicada se arregló primero solo en la plantilla; la frase de la receta esperó al dev-lead, que la aprobó con su sujeto de control.
- Dos commits de arreglos de prosa se revisaron en el hilo (`8f1b011e`, con dos frases en `tests/roadmap-shape-green.md`, y `26f2f385`) — la excepción del kit solo nombra `.docs/` — coste: una frase de evidencia sin segunda lectura.
- Tras integrar `develop`, la migración se reaplicó con un script que elige filas por id y por sección — comprobado fila a fila: 188 filas de `develop` quedan literales — coste: una fila mal clasificada, recuperable de `roadmap-before.md`.
- Menores diferidos de la revisión final: una tabla antes de `## Próximo` pasa sin fallo; un id de gestor de menos de 4 caracteres nunca se marca como publicado; `v2.3.0.md` no dice que con el roadmap sin commitear el paso queda pendiente; la receta no tiene fila para un estado no admitido; `StartsWith` compara con la cultura; un salto de línea partido en la ayuda del script y `Test-ProseChecked` con nombre de predicado; `sed -i` sin sufijo en el lanzador del GREEN.

## 4. Verificación

### 4.1 Builds

- Sin build. Validador sobre el árbol: `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Roadmap.ps1 -Path .docs/sdd` → `Roadmap válido`.
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` → `Capacidades válidas: 14`.
- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`, desde la herramienta PowerShell → 1.129 pasados, 0 fallos, 10 saltados · 454 s, sobre el merge `25753878`. Una ejecución anterior, sobre `1892036e`, falló solo en `FastSuiteBudget` (ver 4.3).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-30 · «Diferir a la primera migración real» · disparador: la primera migración de un proyecto del equipo a la 2.3.0, a cargo del dev-lead

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El roadmap del repo es válido | ejecución real | `Roadmap válido`, código 0 |
| El roadmap anterior se rechaza | ejecución real | 101 líneas de fallo, código 1 |
| Sección fuera de la plantilla y release sin versión | ejecución real | `sección «Decisiones tomadas» fuera de la plantilla`; `«Release siguiente» no lleva versión…` |
| Prosa fuera de «Releases cerradas» | ejecución real | `línea 37: prosa en «Backlog»; fuera de «Releases cerradas» el roadmap solo lleva tablas` |
| Estado no admitido | ejecución real | `estado «pendiente» no admitido: …` |
| Fila saldada no posterior a la última release | ejecución real | `fila saldada el 2026-09-10, no posterior a la v2.2.0 (2026-09-29): sale en el corte` |
| Patch no posterior a la última release | ejecución real | `patch del 2026-09-29, no posterior a la v2.2.0 (2026-09-29): sale en el corte` |
| Sin `roadmap.md` | ejecución real | `Sin roadmap que validar`, código 0 |
| Orden, sección repetida, falta una sección, subsección fuera, línea de estado de la release | suite | verde |
| Cabecera de tabla, mensajes de estructura, barra escapada | suite | verde; el de la barra, comprobado con un mutante |
| Feature publicada, id de gestor, número corto | suite | verde |
| Título de una release cerrada | suite | verde, 3 casos |
| CRLF, plantilla sin ayuda, plantilla sin tocar, salida UTF-8 | suite | verde |
| Migración con el dev-lead ausente: roadmap sin tocar, tabla en el informe, sin commit ni marcador | ejecución real (2 sujetos) | 2/2 |
| Migración aprobada: validador en verde, sha en el commit, sin datos inventados | ejecución real (4 sujetos) | 4/4 |
| Validaciones pendientes en una línea de su release | ejecución real (4 sujetos) | 4/4 |
| Roadmap ya válido: el paso se salta | ejecución real (1 sujeto) | 1/1 |
| El resumen de una release no nombra lo no publicado | ejecución real (1 sujeto) | 1/1 |
| `**Escribe**:` declara `roadmap.md` y la paridad con las init sigue en verde | suite | verde |
| El dev-lead cambia un destino o rechaza la tabla | no probado | en el texto del paso, sin sujeto |
| Con `roadmap.md` sin commitear, el paso para | no probado | en el texto del paso, sin sujeto |
| La migración en un proyecto real del equipo | no probado | ninguno la ha aplicado; es el disparador de la validación |

### 4.3 Residuales / deuda generada

- Menores de la revisión final de la 0115 → fila de deuda.
- El conjunto rápido del pre-commit está a 26 s de un tope de 30, y `SubjectOutputPrivacy.Tests.ps1` tarda 10 s y crece con cada campaña que versiona salidas → fila de deuda.
- El paquete del revisor final no cabe cuando un fichero del diff tiene filas muy largas → fila de deuda.
- El worktree del primer revisor final desapareció a mitad de la revisión, sin que el hilo lo retirara → fila de deuda y ticket.
- Propuesta «documentos acotados» (B10), ampliación de la 0120 y la fila de una línea con el enunciado en `specs/` → en el roadmap.
- La 0123 tiene que entrar antes del próximo corte de release: hasta entonces ningún cierre saca las filas saldadas ni los patches, y el validador fallará en el pre-commit de este repo tras el corte.

## 5. Aprendizajes

- Un script que transforma un registro compartido (el roadmap) elige las filas por contenido, nunca por número de línea: la base se mueve mientras dura la feature y los números dejan de valer → `tech-stack.md`, «Fixtures y baselines».
- «Nada lee esta sección» se comprueba también en `tests/`: `SuperpowersCompat.Tests.ps1` leía «Referencias de vigilancia» del roadmap → `tech-stack.md`, misma entrada.
- Un test de un caso límite se comprueba con un mutante: el de la barra escapada pasaba igual sin el tratamiento del escape, porque la barra estaba en una celda que el script no usa → `tech-stack.md`, misma entrada.
- La base se comprueba antes de cada task que toca un fichero compartido, no solo antes de la primera: la regla ya está en el paso 6 de `sdd-start-feature`; el fallo fue del hilo → ticket de feedback, sin cambio de documento.
- Todo documento tiene tipo, dueño y cota → `constitution.md`, Art. XI, y `architecture.md` (hecho en la feature).

## 6. Adendas

- 2026-10-01 · Validación en campo: este repo pasa a `validation.mode: field` con la feature 0118 (decisión del dev-lead del 2026-09-29). La validación diferida de arriba se cierra con la verificación del agente que ya consta en la sección 4; el uso real llega por los tickets de `sdd-feedback`.

