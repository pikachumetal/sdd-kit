---
id: 20261116-113901-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra («cierro la 0010, motivo al cancelar»). Con este cambio, ese mismo paso añade qué queda pendiente: las filas de `ROADMAP.md` sin ✅ en Now y Next («pendiente: 0011 Anular reservas de otros, 0008 Avisos por correo antes de la reserva»). Cambia una frase del paso 1 de `skills/aviso-cierre/SKILL.md`; como es edición de una skill, se prueba antes y después con sujetos (RED → GREEN).

Validación: agente — es una skill sin pantalla: lo que se observa es lo que dice el sujeto al cerrar, y los sujetos de la batería lo miden.

## Capacidades

- Ninguna, porque herramientas (una skill del propio repo; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (siete puntos, sonnet) — señales: ninguna de la tabla (sin capacidad, sin contrato público, sin `MODIFIED`, sin datos) · tamaño: ~3 líneas en 1 fichero
- Técnica (sonnet): que el literal del paso 1 y los THEN de «Dónde se prueba» digan lo mismo, y que c1 y c2 de la batería lo exhiban (señal: tamaño mínimo)
- Mínimo razonable: sin review — deja sin mirar si la definición de «pendiente» (decisión 1) casa con el uso real del roadmap

1. **«Pendiente» = filas de `ROADMAP.md` en Now y Next cuyo Estado no es ✅, sin contar la que se cierra** — el dev-lead dijo «también qué queda pendiente» sin precisar de qué. Es lo único del repo que lleva ese estado. Later queda fuera: son ideas, no trabajo comprometido. **Pendiente de confirmar.**
2. **Formato del aviso**: `pendiente: <id> <título>` por fila, en la misma respuesta que «Se cierra: …»; sin filas sin ✅, `pendiente: nada`. — el repo no fija formato; es el más corto que se verifica con un `grep`.
3. **Literal del paso 1**: «Di qué se cierra y qué queda pendiente: las filas de `ROADMAP.md` en Now y Next sin ✅, por id y título (`pendiente: nada` si no hay).» El paso 2 (gate) no cambia.
4. **Fichero con tope de palabras**: no aplica, no hay test de topes en el repo.
5. **Carpeta de la spec**: `.docs/sdd/changes/` (regla del kit); las carpetas anteriores del proyecto viven en `specs/` y se dejan como están.
6. **Enfoque**: A, frente a B y C (ver Approach).
- Política de modelos: revisor de la spec, ninguno si apruebas con el mínimo; sujetos en sonnet, por tandas, c1 y c2 con n=2 · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents`.
- Coherencia: `git grep -niE "qué se cierra|pendiente"` fuera de las carpetas de evidencia da un solo hit de producción (`skills/aviso-cierre/SKILL.md:8`). Delta sobre copia: no aplica (sin capacidades). Datos reales contra THEN: con el `ROADMAP.md` actual, Now trae 0010, 0011 y 0008 en ⏳ y 0007 en ✅ → el aviso lista tres filas; Next está vacío.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «la entrevista ya está hecha; decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Al cerrar una feature, quien lee el aviso sabe qué se cierra pero no qué falta; tiene que abrir `ROADMAP.md`. Éxito: el sujeto de `aviso-cierre` nombra, en el paso 1, las filas pendientes del roadmap, sin inventar ninguna ni omitir una. Fracaso aunque «funcione»: que cuente como pendiente lo que ya está ✅ o lo de Later, o que ensucie el aviso con otro contenido.

## Scope

- Entra: la frase del paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 3).
- Entra: RED y GREEN con sujetos sobre `tests/batteries/aviso-cierre/battery.md` (c1, c2).
- No entra: el paso 2 (gate), el roadmap, `operations.md`, la descripción del frontmatter, cualquier otra skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope, decisión 3 |

- Filas que implementa: ninguna (0016 no tiene fila en `ROADMAP.md`) → nada: comprobado con `git grep -n "0016"` (solo la rama).

## Approach

- A — ampliar la frase del paso 1: una línea, sin pasos nuevos; el cambio mínimo que cumple lo decidido.
- B — paso nuevo «Di qué queda pendiente» entre el 1 y el 2: más visible, pero renumera y el dev-lead dijo que va en el paso 1.
- C — que el aviso lea `ROADMAP.md` con un script: sin dependencias ni scripts para esto en el repo; sobredimensionado.
- Elegido: A — lo dijo el dev-lead («el paso 1 … dice también qué queda pendiente») y es lo único que no cambia la estructura de la skill.

## Dónde se prueba

- Aviso con pendientes: sujeto sonnet de la batería (c1), cierra una feature con el `ROADMAP.md` del repo y se comprueba su respuesta.
- Aviso sin pendientes: sujeto de la batería (c2), con un roadmap sin filas sin ✅.

## Términos y ADR

- Términos resueltos: pendiente — fila de Now o Next sin ✅.
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no hay capacidades.

## Previsión de coste

Constitución art. 5: se declara antes del primer sujeto; si la prueba la supera, una tanda de REFACTOR incluida, se para y decide el dev-lead.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 |
| Controles | ninguno: la batería no define escenarios de control | 0 |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1.40 |
| Suma | 14 sujetos | 9.80 |

Nota: `patch-0006-aviso` midió ~0,31 $ por sujeto real frente a los 0,70 $ de la previsión; se mantiene el precio de `operations.md`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
