---
id: 20261015-160528-feature-0191-capability-check-artifact
title: Tasks — capability check por artefacto
spec: ./spec.md
plan: ./plan.md
created: 2026-10-15
---

# Tasks — `capability check` por artefacto: fallos ajenos aparte y punteros raíz → plantilla (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0191-capability-check-artifact`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Un puntero se valida en su destino | done | 9a465aba | |
| 2 | Con `--artifact`, los fallos ajenos aparte | done | 8da47ed1 | |

Revisión final: Spec opus+high, lista con arreglos (1 Important, 4 Minor) · Código sonnet+high, lista (6 Minor) · Arquitectura no (plan), sobre 8da47ed1
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, todos resueltos, sin roturas

## Rulings

- Ruling: baseline = pre-commit verde del commit de apertura 03875b99 (cli:test 875, cli:typecheck, kit:test-fast 1178), sin el gate completo con cli:test-slow — los cambios no tocan código lento — coste si falla: un rojo lento ajeno se ve en el gate de cierre.
- Ruling: base check en local; sin fetch (merge con --push lo hará) — coste: conflicto tardío en roadmap.
- Task 2: Ruling: 3 de 7 tests RED ya pasaban antes (fallo solo del artefacto, nombre en otra caja, JSON sin --artifact): quedan como guardas de regresión, no prueban el cambio por sí solos — coste si falla: ninguno, los 4 restantes fijan el reparto
- Task 2: Ruling: el JSON de «no existe el artefacto» sigue sin «foreign» — es un error de uso previo a validar, y añadirlo cambiaría un test existente sin pedirlo la spec — coste si falla: un consumidor de --json lee foreign undefined en ese caso
- Final: Ruling: los ejes Spec y Código salen uno tras otro, no en paralelo — CLAUDE.md global pide confirmar antes de paralelizar y el perfil delegate no para por método — coste: ~5 min más de reloj
- Final: minor (deferred): Review Focus 1 sin test del enlace absoluto (el código lo resuelve con resolve())
- Final: minor (deferred): resolvePointer con 4 parámetros, límite 3
- Final: minor (deferred): sin test de «fallo del artefacto + bloque de ajenos» juntos
- Final: minor (deferred): un puntero roto en el delta añade «del delta no está en capabilities/<slug>.md», ruido con exit ya en 1
- Final: minor (deferred): slug derivado dos veces (resolveFile y fileProblems); extraer slugOf
- Final: minor (deferred): bySlug se indexa por «<slug>.md», el nombre engaña
- Final: minor (deferred): el artefacto se lee dos veces y deltaCapabilityNames se calcula dos veces
- Final: minor (deferred): faltan tests de «no coincide con <ruta>» con puntero, de puntero ajeno con destino roto y de enlace con #ancla
- Final: minor (deferred): un destino marcado «No es una capacidad.» cuenta como válido y no como omitido
- Final: Ruling: enlaces con %20 o http(s):// en un puntero no se siguen — fallan con «el puntero no enlaza…» o «el destino no existe», mensaje claro — coste: un puntero así se reescribe con ruta relativa
- Final: Ruling: «ajeno» = capacidad sin subsección «### Capacidad:» en el delta; index y merge no siguen punteros; foreign solo con --artifact — son decisiones 1, 4 y 10 de la spec aprobada — coste: ninguno nuevo
- Final: minor (deferred): resolveFile calcula isNotCapability dos veces (re-revisión)
