---
id: 20261012-090000-feature-0031-close-notice-row
feature: 0031
title: El aviso de cierre nombra la fila que queda abierta
mode: full
profile: delegate
status: draft
created: 2026-10-12
author: agente con el dev-lead
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre nombra la fila que queda abierta

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Enfoque: una frase en el paso 1, frente a añadir un paso 2 propio (ver Approach).
4. Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva · tamaño: ~5 líneas en 1 fichero (`SKILL.md`), sin contrato público ni `MODIFIED`. Mínimo razonable: el mismo; deja sin cubrir nada que el tamaño pida.
5. Política de modelos: sujetos y revisor en Sonnet; esta spec no toca reglas de negocio ni roles.
6. Pasada de coherencia: `capability merge` sobre una copia de `.docs/sdd` → «aviso-cierre.md: añadido «El aviso nombra la fila abierta»». `git grep` de «Di qué se cierra», `aviso-cierre` y `0031` fuera de `specs/`: sin más apariciones que la skill, la batería y `tech-stack.md` (que no cambian). Previsión: `plan.mjs` da 1.40 $ por tanda de c1 con n = 2, como la tabla.
7. ⚠ Hueco sin decidir: el roadmap tiene hoy tres filas abiertas (0010, 0011 y la 1), no una; la spec dice «la fila abierta» y su THEN da la 0011 sin decir por qué esa. Hay que fijar la regla: ¿la fila abierta es la que depende de lo que se cierra, la primera de «Próximo», o se nombran todas? Recomiendo nombrar la primera de «Próximo» que no sea la que se cierra; ahí el THEN daría la 0010, no la 0011, y habría que cambiarlo. No lo he decidido yo: es tuyo.
8. ⚠ La rúbrica ya commiteada (`C1-A`: `text: /pendiente/`) pasa con cualquier «pendiente», sin comprobar el id ni el título que el THEN exige. Recomiendo endurecerla a `/0011/` (o al id que fije el punto 7) en la Task 1; tocar `battery.md` es un cambio fuera de «Entra» y se declara aquí.
9. `Validación: agente` está en la spec sin frase literal tuya que lo respalde: si no la das al aprobar, rige `dev-lead`.

### Hallazgos de la review

Un revisor (sonnet), 10 hallazgos.

- **Aceptado** — Crítico: el THEN fija «la 0011» sin regla de selección y hay tres filas abiertas → es el punto 7; no lo reescribo yo: depende de tu respuesta. Con ella reescribo GIVEN/THEN y lanzo la segunda ronda de review (hay un Crítico aceptado).
- **Aceptado** — Crítico: la rúbrica `/pendiente/` no detecta nada → punto 8; `battery.md` entra en el Scope (abajo) y la rúbrica nueva se fija cuando decidas la regla; el RED corre ya con ella.
- **Aceptado** — Importante: `battery.md` era alcance oculto → añadido a «Entra» y a la tabla de cambios de forma.
- **Aceptado** — Importante: faltan escenarios sin fila abierta y con varias → se escriben con la regla del punto 7.
- **Aceptado** — Importante: la previsión de coste debe recalcularse con la rúbrica nueva y llevar minutos (constitución 5) → se rehace con `plan.mjs` tras tu decisión.
- **Aceptado** — Importante: `Validación: agente` sin frase → queda como punto 9; sin tu frase, `dev-lead`.
- **Rechazado** — Importante: declarar «di qué se cierra» como ADDED → es comportamiento ya existente que esta feature no cambia; la capacidad nace con lo que añade y se completa cuando otra feature lo toque.
- **Rechazado** — Menor: subir a dos revisores → la segunda ronda tras tu decisión ya da la segunda lectura.
- **Aceptado** — Menor: reformular el éxito en términos de la regla, y declarar la fuente (`roadmap.md`, solo lectura) → con la regla del punto 7.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- Entra (propuesto, ✋ 8): la fila `C1-A` de `tests/batteries/aviso-cierre/battery.md` exige el id y el título, no solo «pendiente».
- No entra: el roadmap (se lee, no se edita).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |
| `C1-A`: `text: /pendiente/` | `tests/batteries/aviso-cierre/battery.md` | Scope: pasa a exigir el id y el título (valor al fijar ✋ 7) |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre con la fila 0011 abierta en el roadmap
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 4 sujetos | 2,80 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
