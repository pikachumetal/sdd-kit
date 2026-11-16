---
id: 20261102-151512-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice qué queda pendiente
mode: full
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra. Con esto, además dirá qué filas del roadmap siguen abiertas: al cerrar la 0005 con la 0010 y la 0011 en `Próximo`, el aviso dirá «se cierra la 0005; quedan pendientes la 0010 y la 0011». Es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`, y solo se escribe si la prueba con sujetos muestra antes que el aviso de hoy lo omite.

Validación: dev-lead — el aviso lo lee una persona; lee uno real del GREEN y confirma que dice lo pendiente.

## Capacidades

- Ninguna, porque herramientas (la skill `aviso-cierre` es del flujo de desarrollo; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — 0 señales (sin capacidad, sin contrato, sin `MODIFIED`, sin datos) · tamaño: una línea de una skill y su prueba.

1. «Pendiente» = filas de `## Próximo` del roadmap cuyo estado es ⏳ y que no son la que se cierra. Backlog (`B1`) y deuda técnica no cuentan — el ticket habla de «una fila abierta», y esas no tienen estado.
2. Si no queda ninguna, el aviso lo dice: «no queda nada pendiente». Un aviso que calla no distingue «nada» de «no miré».
3. Cada fila pendiente se nombra con su id (`0010`, `1`) y su título corto, sin más detalle.
4. El cambio es una edición de una línea del paso 1; el paso 2 (gate) y la descripción de la skill no cambian.
5. La batería `aviso-cierre` (c1, c2; 2 sujetos cada una) solo declara id, paso, n y modelo; el plan fija qué roadmap ve cada sujeto (con `0010` y `0011` abiertas en c1, ninguna abierta en c2). No añade sujetos.
6. El coste usa los ~0,70 $/sujeto de `tech-stack.md` (conservador: el patch 0006 midió ~0,31 $).
7. No hay fila de roadmap para la 0028: el ticket de campo es el origen y la rama ya lleva la id. No la añado.
8. Perfil `delegate` (del proyecto); sin plan-gate, el plan se escribe tras aprobar la spec.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente, por el ticket de campo `.docs/sdd/field-reports/20260914-aviso.md` §1; el RED aún no se ha medido — (indicación del dev-lead en la petición de esta spec)

## Intent

Hoy el aviso de cierre dice qué se cierra y nada más. Al cerrar la 0005, la persona no supo que quedaba una fila abierta, y el coste fue una parada del dev-lead (ticket §1). Éxito: el aviso nombra lo que queda abierto en el roadmap, o dice que no queda nada. Fracaso aunque «funcione»: un aviso que nombre cosas ya cerradas, o que tape lo que se cierra con una lista larga.

## Scope

- Entra, si el RED lo exhibe: el paso 1 de `skills/aviso-cierre/SKILL.md` añade qué queda pendiente (decisiones 1–4).
- Entra: RED y GREEN con la batería `aviso-cierre`, y la previsión de coste.
- No entra: cambiar el paso 2 (gate), la descripción o el nombre de la skill, ni el roadmap.
- No entra: si el RED muestra que los sujetos ya nombran lo pendiente con el texto de hoy, no se edita la skill: se para y se informa.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1 «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` (única aparición: búsqueda en el repo) | Scope (condicionado al RED) |

- Filas que implementa: 0028 → ningún fichero la nombra | nada: comprobado con `grep -rn 0028` (solo la rama).

## Approach

Una sola edición, en el paso 1 de la skill, guiada por lo que el RED muestre que los sujetos omiten. El texto exacto lo fija el GREEN; no se escribe antes de medir.

## Dónde se prueba

- Aviso con pendientes: sujetos de c1 (roadmap con `0010` y `0011` en `Próximo`), como la prueba del patch 0006.
- Aviso sin pendientes: sujetos de c2.
- El gate `node --test && node scripts/lint.mjs` no cubre la skill; se corre al cerrar igualmente.

## Términos y ADR

- Términos resueltos: pendiente — fila de `## Próximo` en ⏳ distinta de la que se cierra.
- ADR candidatas: ninguna.

## Delta de comportamiento

Sin delta: no hay `capabilities/`.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (`aviso-cierre`: c1×2, c2×2) × 0,70 $ | 2,80 |
| GREEN | 4 (`aviso-cierre`) × 0,70 $ | 2,80 |
| Una tanda de REFACTOR | 4 (`aviso-cierre`) × 0,70 $ | 2,80 |
| Controles | 0 — la batería ya trae el caso sin pendientes (c2) | 0,00 |
| Medición tras la revisión final | 0 — no se prevé; si la revisión edita la skill, se para y decide el dev-lead | 0,00 |
| Suma | | 8,40 |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
