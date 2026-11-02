---
id: 20261102-150944-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra. Con el cambio, dirá además qué sigue abierto: al cerrar la 0005 diría «Se cierra: 0005. Queda pendiente: 0010 Motivo al cancelar, 0011 Anular reservas de otros». Así quien lo lee sabe que la tarea no ha terminado y no hace falta una parada del dev-lead para preguntarlo. Es el paso 1 de la skill `aviso-cierre`, que se prueba con sujetos antes y después de tocarla.

Validación: dev-lead — el aviso lo lee una persona y lo que le basta para saber qué queda abierto es un juicio suyo, no una medida; el agente no se concede el atajo.

## Capacidades

- Ninguna, porque herramientas (es el texto de una skill del kit, sin comportamiento observable del producto `salas`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna de las ocho (sin capacidad, contrato, MODIFIED/REMOVED, datos, dependencia ni permisos; área leída entera en esta sesión) · tamaño: ~3 líneas en 1 fichero (más la batería)
- Mínimo razonable: ninguna — no deja sin cubrir nada que una lectura de la propia spec no cubra; la coherencia la he pasado yo.

1. **Qué cuenta como «pendiente»**: las filas del roadmap que siguen abiertas (⏳) en «Próximo», distintas de la que se cierra, con su id y su título. Nadie lo definió: el ticket dice «una fila abierta», y es lo que se mira en el roadmap de este proyecto (`0010`, `0011` y `1`). Backlog y Deuda técnica quedan fuera.
2. **Forma del aviso**: una línea más tras la de qué se cierra, `Queda pendiente: <id> <título>, <id> <título>`; sin filas abiertas, `No queda nada pendiente.` Literal mío, nadie dijo el texto.
3. **Sin tope de filas**: se listan todas las abiertas; el roadmap de salas tiene tres.
4. **Validación: `dev-lead`**, no `agente` (arriba) — sin frase del dev-lead que nombre `agente`.
5. **Sin review de spec ni delta**: el cambio es una edición de skill sin comportamiento de producto; no hay `capabilities/` que fusionar (el proyecto no tiene la carpeta), así que no hay copia temporal que probar.
6. **Sin tabla de topes de palabras**: el proyecto no tiene un test que limite en palabras la skill.
7. **El orden es el del roadmap**, sin priorizar.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos: Sonnet (`tech-stack.md`), por tandas de 2 (c1, c2) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»
- El RED no se ha medido aún; la spec no asume su resultado — «el RED aún no se ha medido»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo qué se cierra. Al cerrar la 0005, la persona no supo que quedaba una fila abierta del roadmap, y el coste fue una parada del dev-lead (ticket de campo `20260914-aviso.md` §1). Éxito: el aviso nombra qué se cierra **y** qué queda pendiente, de modo que quien lo lee no tiene que preguntarlo. Fracaso aunque «funcione»: un aviso que lista pendientes que ya están cerrados, o que calla una fila abierta.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` pide decir qué queda pendiente además de qué se cierra (decisiones 1 a 3).
- Entra: las baterías `c1` y `c2` (`tests/batteries/aviso-cierre/battery.md`) se prueban en RED y GREEN con sujetos, según la constitución art. 5.
- Entra, si el RED lo exhibe: otros fallos del aviso que los sujetos muestren (sin medir todavía; si aparecen, se decide con el dev-lead antes de tocarlos).
- No entra: el paso 2 (el gate), el `description` de la skill, el roadmap, y cualquier cambio en `src/`.
- No entra: que el aviso proponga qué hacer con lo pendiente.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1: «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope: se amplía con la línea de pendientes |
| Nombre y coste de la skill | `.docs/sdd/tech-stack.md:6`, `tests/batteries/aviso-cierre/battery.md:1`, `.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md:3` | No cambia: citan la skill por nombre, no el paso 1; el coste va en la previsión |

- Filas que implementa: 0028 → no tiene fila en `.docs/sdd/roadmap.md` (el id viene de la rama; origen: ticket de campo `20260914-aviso.md` §1) | comprobado con `grep -rn 0028` en el repo: solo la rama y esta spec lo nombran.

## Approach

Una edición del paso 1 de la skill: además de decir qué se cierra, dice qué queda pendiente según la decisión 1, con la forma de la decisión 2. El método es el de la constitución: RED (los sujetos de `c1` y `c2` con la skill vigente), edición, GREEN (los mismos con la skill nueva) y, si hace falta, una tanda de REFACTOR.

## Dónde se prueba

- Aviso al cerrar con filas abiertas: con sujetos Sonnet, como en el patch 0006 (`aviso-cierre`, baterías `c1` y `c2`); lo observable es el texto que dicen al cerrar.
- Aviso al cerrar sin nada abierto: igual, en la misma batería.

## Términos y ADR

- Términos resueltos: pendiente — fila abierta (⏳) de «Próximo» distinta de la que se cierra
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: no toca `capabilities/` (decisión 5).

## Previsión de coste

Precio por sujeto: ~0,70 $ (`tech-stack.md`, «Un sujeto de `aviso-cierre` cuesta ~0,70 $»); el patch 0006 midió ~0,31 $, pero la previsión usa el precio declarado. Batería: `c1` (2) + `c2` (2) = 4 sujetos por tanda.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (c1 ×2, c2 ×2) × 0,70 $ | 2,80 |
| GREEN | 4 (c1 ×2, c2 ×2) × 0,70 $ | 2,80 |
| Una tanda de REFACTOR | 4 (c1 ×2, c2 ×2) × 0,70 $ | 2,80 |
| Controles | 0 — la batería ya trae `c1` y `c2`, sin control aparte | 0,00 |
| Medición tras la revisión final | 0 — solo se mide si la revisión final edita la skill; entonces se para y se decide con el dev-lead | 0,00 |
| Suma | | 8,40 |

Si la prueba supera la suma, REFACTOR incluido, se para y decide el dev-lead (constitución art. 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
