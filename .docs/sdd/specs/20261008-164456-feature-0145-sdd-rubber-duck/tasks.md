---
id: 20261008-164456-feature-0145-sdd-rubber-duck
title: Tasks — sdd-rubber-duck, explicar en llano en modo corto y modo largo
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — `sdd-rubber-duck` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0145-sdd-rubber-duck`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Molde `exportes`, batería y RED | done | 5a9f3f8b | RED: 6 sujetos, 0,71 $; ninguna fila se recorta |
| 2 | Skill `sdd-rubber-duck`, avisos y GREEN | done | 2feb97a1 | GREEN 7 + REFACTOR 2 sujetos |

Revisión final: sdd-kit:effort-high + opus, con fixes (0 Critical, 1 Important, 7 Minor), sobre 2feb97a1
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN

## Verificación por task

- [x] Task 1 — `bash -n` de `subject.sh`, `battery.mjs plan`, `node --test` del molde (1 rojo), Pester de rutas y privacidad
- [x] Task 2 — Pester de topes, skills, rutas y privacidad; batería GREEN en verde y rúbrica sin rojos

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: subject_init aborta en el RED porque la skill esperada no existe en el kit de la base — en el RED la guarda comprueba using-sdd; fuera, la esperada — coste si es erróneo: un RED que no detecta un kit vacío de skills nuevas
- Task 2: Ruling: architecture.md pasaba de 1900 a 1916 palabras con la línea nueva del árbol — acorto las líneas de sdd-grilling y sdd-rubber-duck a «(+ NOTICE: preguntar|explicar)» en vez de subir el tope, que es decisión del dev-lead — coste si es erróneo: el árbol ya no dice que esas dos skills van en inglés (lo dice el Art. III)
- Final: Ruling: Minor 3 y 4 de la revisión final (R4 de l1-2 sin F; «Resultado» que atribuía todo a la skill final) suben al Important 1 — son errores en la evidencia que lee quien edita la skill, la misma clase que la procedencia incompleta — coste si es erróneo: dos frases de evidencia corregidas de más
- Final: minor (deferred): el contrato del modo corto pone «decide cómo se escribe la hora» como ejemplo de lo que va tras el párrafo; con la 0146 la parada puede pedir la decisión dos veces
- Final: minor (deferred): «Dónde mirar» va literal en castellano; con un usuario en inglés puede copiarse tal cual
- Final: minor (deferred): ${ASK,} de subject.sh necesita bash 4 (macOS trae 3.2)
- Final: minor (deferred): la description se solapa con «¿cómo funciona…?» de sdd-consult; falta un c2 de enrutado, para la 0146
- Final: minor (deferred): tasks.md seguía en pending — se pone al día en el cierre
