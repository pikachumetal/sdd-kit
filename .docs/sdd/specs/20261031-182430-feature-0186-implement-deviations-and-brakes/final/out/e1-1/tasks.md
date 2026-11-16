---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-01
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f545f52 | verificación lenta anunciada: resultado no visto |
| 2 | Listado de canceladas | done | e5985a5 | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [ ] Task 1 — verificación lenta: resultado no visto
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

Revisión final: autorrevisión del autor, sin herramienta de subagentes (Spec y Código, sin revisores frescos) · Arquitectura no (sin señales), sobre e5985a5

## Rulings

Task 1: Ruling: trabajo en el checkout en la rama feature/0010-cancel-reason sin worktree nuevo — el código sin commitear de la task ya está aquí y el usuario pidió seguir — si es incorrecto: mover la rama a un worktree, sin pérdida.
Task 1: Ruling: el test recibido no cubría el AND «sin --motivo» y había quitado «cancelar sin reserva lo dice»; añado el primero y restauro el segundo con --motivo otro — sin ellos la task no cumple un AND de la spec y se pierde cobertura — si es incorrecto: dos tests de más. RED no observado sobre el código ya escrito: comprobado por mutación en una copia.
Task 1: Ruling: la verificación lenta no figura en el plan; la anunció el usuario — si es incorrecto: nada que esperar.
Task 1: Ruling: pasados los 10 minutos no hay resultado ni proceso visible de la verificación lenta anunciada; cierro con la Verificación del plan y sigo con la Task 2 sin dar la lenta por pasada — el plan no la declara y parar no la haría visible — si falla: abre una ronda de fix de la Task 1.
Final: Ruling: Eje Arquitectura no — el plan no trae la línea y el diff no cruza ninguna señal — si es incorrecto: una revisión de arquitectura pendiente.
Final: Ruling: `canceladas` en otro proceso sale vacío porque las reservas viven en memoria — quien lanza `cancelar` y luego `canceladas` desde la terminal no ve la cancelación; el guardado es la 0014 y el Scope de la 0010 no lo incluye, y `Dónde se prueba` lo fija por `run` — si es incorrecto: la capacidad no sirve desde la terminal hasta la 0014.
Final: minor (deferred): `canceladas` sin canceladas responde una línea vacía; la spec no fija un texto.
Final: minor (deferred): el test de `canceladas` depende de que antes corra el de cancelar con motivo, por el estado compartido del módulo.
