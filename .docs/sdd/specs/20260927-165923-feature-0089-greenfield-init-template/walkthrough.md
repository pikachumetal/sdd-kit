---
id: 20260927-165923-feature-0089-greenfield-init-template
feature: 0089
title: Walkthrough — Sincronizar sdd-init-greenfield con init-template de sdd-project-template
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Sincronizar sdd-init-greenfield con init-template

## 1. Cambios realizados

- **Reparto decidido en la spec** (sin guía nueva en el kit, porque el RED ya lo pasa): `sdd-init-greenfield` hace la entrevista y los documentos también sobre un template; `init-template` queda como puente en su repo; manda la lista de greenfield; la forma la fijan las plantillas de `sdd-templates`, que el template debe calcar.
- **Entrevista** (`116cc68`): `skills/sdd-init-greenfield/SKILL.md` gana la pregunta 4 (fuera de alcance → «Qué es y qué no es») y la 5 (términos del dominio → «Dominio»). Las demás se renumeran: reglas de producto 6–10, claves del kit 19, proyecto de referencia 20, con sus referencias internas. Tests Pester al día en `tests/MigrationInitParity.Tests.ps1` y `tests/NativeDefault.Tests.ps1`.
- **Evidencia**: `tests/init-over-template-red.md` (`116cc68`) y `tests/init-over-template-green.md` (`d706ea8`), con los lanzadores y las salidas en `red/` y `green/`.
- **Pasada de fix de la revisión final** (`396a67a`): `references/estructura.md` («pregunta 17» → 19) con su aserción, y la evidencia GREEN corregida.
- **Capacidad `onboarding`**: el delta se fusiona en este cierre (dos MODIFIED y un ADDED).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 0,75h
- Esfuerzo real: 0,65h. Es el reloj del hilo, aproximado con las marcas de los commits: apertura a las 17:15 UTC y registro de la pasada de fix a las 17:42, más ~12 min de cierre. La spec y el plan, con el RED previo, llevaron ~0,6 h aparte.
- Desviación: -0,1h (-13%)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 21.733.183 — claude-opus-5-5 21.733.183
- Tokens de subagentes: 1.884.475 en 1 despacho — Revisión final de rama 0089 claude-opus-5-5 1.884.475 / 3 min
- Coste de la sesión: 9,58 $ (hilo 8,39 $ + subagentes 1,19 $)
- Coste de sujetos: 9,79 $ en 6 sujetos Sonnet — RED 5,22 $ (4); GREEN 4,57 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- El RED necesitó 4 sujetos en vez de 2. En la primera tanda el commit del molde falló por rutas largas y los sujetos pararon en el permiso de `.claude/`. Lo que escribieron vale como medición.
- La campaña usa un `driver.py` multi-turno propio con `--resume`, no `tests/headless/lib.sh`, que lanza un solo turno.
- Dos enmiendas de la spec tras la revisión final, aprobadas por el dev-lead: `estructura.md` entra en el Scope, y el THEN de fuera de alcance y dominio mide lo escrito, no que el agente pregunte.

### Decisiones tomadas sin el dev-lead

- Task 1: el recuento de la invención en la spec decía 3 de 4 y son 4 de 4 (al menos una de las dos secciones) — corregido en `spec.md`, no cambia el alcance — coste si está mal: una cifra.
- Deferred minor: la cláusula de fuera de alcance y dominio cuelga del requisito de las cinco reglas de producto; un requisito propio se leería mejor.
- Deferred minor: comillas anidadas en la celda de g1-b de `tests/init-over-template-green.md`.
- Deferred minor, resuelto en este cierre: `onboarding.md` «pregunta 18» pasa a 20 al fusionar el delta.

## 4. Verificación

### 4.1 Builds

- Sin build (Markdown).
- Suite completa: `Invoke-Pester -Path tests` desde PowerShell → 968 ok, 0 fallos, 10 omitidos · 298 s. Desde Git Bash salen 3 fallos en `Measure-SessionTokens.Tests.ps1` («—» frente a «-», página de códigos `ibm437`). Vienen de antes de esta rama; desde PowerShell pasan 24/0.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «Diferir al corte 2.0.0» · disparador: smoke del corte de la 2.0.0, a cargo del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La entrevista incluye fuera de alcance y dominio (filas 4 y 5) | suite | `MigrationInitParity.Tests.ps1`, verde |
| Con «no sé», la mission no lista exclusiones ni términos que el dev-lead no dijo | ejecución real | GREEN 2/2 (en el RED fallaban los 4) |
| Las cinco reglas de producto y el modo de ids | suite | sin cambios de comportamiento; tests verdes |
| El proyecto de referencia es la pregunta 20 de greenfield | suite | verde |
| Sobre el template no pregunta stack, ramas ni worktrees | ejecución real | 6/6 sujetos |
| `tech-stack.md`, `architecture.md` y `environments.md` sin cambios | ejecución real | 6/6 |
| `sdd-kit.json` conserva `"version": "1.1.0"` y gana `ids` y las claves | ejecución real | 4/4 de los que llegaron |
| «desde la skill puente del template» | no probado | el puente aún no existe (repo del template) |

Revisión final: `sdd-kit:effort-high` + opus sobre `d706ea8`, con arreglos (2 Important, 5 Minor). Pasada de fix en `396a67a`: los 2 Important, uno RED→GREEN y el otro documental.

### 4.3 Residuales / deuda generada

- **Pareja en `sdd-project-template`**: puente en `init-template`, documentos marcados calcados de `sdd-templates` y versión de `sdd-kit.json`. Va en su repo y en su roadmap (decisión 6 de la spec). Prompt para lanzarla allí, entregado al dev-lead el 2026-09-27:

```
Rama feature/init-template-bridge, worktree init-template-bridge. Arranca con sdd-kit:sdd-start-feature en sdd-project-template.
Objetivo: que init-template trabaje junto a sdd-init-greenfield del sdd-kit 2.0.0 (feature 0089 del kit; evidencia en el kit: tests/init-over-template-red.md y tests/init-over-template-green.md).
Decisión 1, reparto: init-template queda como puente. Conserva su paso 0 (grep de "sdd-template: pending"), invoca sdd-kit:sdd-init-greenfield para la entrevista y los documentos, y conserva su cierre (comprobaciones, línea de changelog, borrarse y commit). Se retiran su tabla de 14 preguntas y sus pasos de documentos: manda la lista de greenfield, que ya incluye fuera de alcance (pregunta 4) y términos del dominio (pregunta 5).
Decisión 2, forma (Art. VIII del kit): los .docs/sdd/ marcados del template se calcan de las plantillas de sdd-templates del kit, con secciones y cabeceras de tabla literales. Mission: Por qué existe, Usuarios y roles, Qué es y qué no es, Dominio (lenguaje del proyecto). Roadmap: Próximo con | # | Ítem | Estado |, Backlog con | # | Ítem | Origen |, Deuda técnica con | Ítem | Impacto | Destino | (la deuda heredada de la plataforma pasa a filas de esa tabla), Patches con | Fecha | Id | Descripción | y Releases cerradas. Constitution: Reglas de producto como lista de las cinco. En el RED del kit, 3 de 4 sujetos conservaron las tablas actuales del template y 1 las reestructuró: sin alinearlas, la forma depende del agente.
Decisión 3, contrato: el único contrato con el kit es el texto literal <!-- sdd-template: pending --> en lo que queda por entrevistar; su posición y su número los decide el template. sdd-kit.json: greenfield conserva la versión que trae el template, así que súbela a la que valide la rama feature/0010b-verificacion-e2e.
Actualiza también la capacidad template-contract, architecture.md §4, README y .tools/scripts/sdd-docs.spec.mjs.
```

- Que el agente **pregunte** la 4 y la 5, y que no proponga su propia lista, no queda medido: el molde daba las respuestas de golpe. Se cerró con lo medido por decisión del dev-lead. Sin fila de deuda nueva, a petición suya («no generar más tickets»).

## 5. Aprendizajes

- En `claude -p`, `.claude/` no se puede escribir ni con `--permission-mode acceptEdits` ni con `Edit(.claude/**)` permitido. → `tech-stack.md`, sujetos headless.
- Un molde calcado de `sdd-project-template` necesita `git -c core.longpaths=true`, y `shutil.rmtree(..., ignore_errors=True)` no lo borra, sin avisar. → `tech-stack.md`, sujetos headless.
- `tests/headless/lib.sh` lanza un solo turno; una entrevista con respuestas fijas necesita un driver con `--resume`. → `tech-stack.md`, sujetos headless.
- Desde Git Bash, la suite completa da 3 fallos de codificación en `Measure-SessionTokens.Tests.ps1`: el gate se lanza desde PowerShell. → `tech-stack.md`, comando de tests.
- La init sobre un template completa solo lo marcado y conserva la versión de `sdd-kit.json`; la entrevista incluye fuera de alcance y dominio. → `capabilities/onboarding.md` (delta fusionado).

## 6. Adendas
