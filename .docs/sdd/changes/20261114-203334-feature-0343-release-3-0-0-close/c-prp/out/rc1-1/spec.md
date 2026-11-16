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
3. La batería `tests/batteries/aviso-cierre/battery.md` gana la fila de rúbrica de `c1` (hoy la batería no tiene ninguna): sin ella el RED no puede fallar.
4. **Pendiente — varias filas abiertas.** La spec describe una sola fila abierta, pero el `ROADMAP.md` de hoy tiene tres en Now (0010, 0011, 0008). Los THEN cubren solo el caso de una fila abierta; con varias, el paso no dice qué nombrar. Recomiendo nombrarlas todas (id y título), pero no lo he escrito en la spec: dime si va en esta feature o en otra.
5. Política de modelos: revisores de la spec: uno, Sonnet (Scope < 50 líneas, sin contrato público ni `MODIFIED`; ver bloque de la review) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: los 2 sujetos de cada tanda (RED y GREEN, `c1`, n = 2) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
6. La capacidad nace con este ADDED: no hay `capabilities/` ni comportamiento previo registrado de `aviso-cierre`. Estado de partida: el paso 1 dice «Di qué se cierra.» y nada más.
7. Fixture de `c1`: un `ROADMAP.md` de fixture que copia la fila 0011 «Anular reservas de otros» del repo como única fila abierta (el del repo tiene tres). `c1` prueba solo ese caso de una fila. Va en la batería junto a la rúbrica.
8. n = 2 se mantiene: la rúbrica comprueba id y título, no una palabra suelta, así que un acierto por azar es improbable; si el RED pasa, la tanda se para y decide el dev-lead (constitución 5).
9. Fuera de Scope: el caso de cero filas abiertas, junto al de varias (✋ 4).

### Verificación hecha

- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «aviso-cierre.md: añadido «El aviso nombra la fila abierta»».

### Hallazgos de la review

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~3 líneas en 2 ficheros
- Dominio+técnica (sonnet): rúbrica y fixture de `c1`, cobertura de filas abiertas (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor — sin él quedaría sin mirar si la rúbrica prueba el THEN

1. **Aceptado** (Crítico) — la rúbrica `/pendiente/` pasa sin nombrar la fila → ahora es `/0011 — Anular reservas de otros/` (Dónde se prueba).
2. **Aceptado** (Crítico) — varias filas abiertas sin dueño → el THEN y el Scope se limitan a una fila y lo de varias queda como ✋ 4 para que lo decidas tú al aprobar.
3. **Aceptado** (Importante) — cero filas abiertas → fuera de Scope (✋ 9).
4. **Aceptado** (Importante) — fixture sin declarar → ✋ 7 y Scope.
5. **Aceptado** (Importante) — el RED debe fallar con la skill de hoy → añadido a Dónde se prueba.
6. **Aceptado** (Importante) — estado de partida de la capacidad → ✋ 6.
7. **Aceptado** (Menor) — el resultado del merge no es una decisión → pasa a «Verificación hecha».
8. **Aceptado** (Menor) — n = 2 sin justificar → ✋ 8.
9. **Rechazado** (Menor) — el título de la fila 0011 sale del roadmap del proyecto y no contradice PRODUCT.md; sigue siendo el fixture.
10. **Aceptado** (Menor) — el aprobador se rellena al aprobar; ✋ 4 queda para ti antes de aprobar.

Segunda ronda (un revisor Sonnet, sin tercera):

1. **Aceptado** (Crítico) — el GIVEN no llevaba el título → ahora lo incluye.
2. **Rechazado** (Crítico) — pedir un `c2` con otro id: el título lo lee el sujeto del fixture, no está en la skill, así que un literal copiado de la spec no puede pasar la rúbrica; `c1` declara que cubre solo una fila (✋ 7).
3. **Aceptado** (Crítico) — con tres filas abiertas la feature no sirve en el repo real y la spec no puede aprobarse con ✋ 4 abierto → no lo decido yo: es tu pregunta al aprobar, con mi recomendación.
4. **Aceptado** (Importante) — «la fila» en singular es parte de ✋ 4.
5. **Aceptado** (Importante) — el título es el de la fila real, copiado al fixture; ✋ 7 reescrito. El glosario «Anulación» no se toca: es el título de una fila ajena.
6. **Aceptado** (Importante) — minutos: `plan.mjs` solo da sujetos y dólares → `sin medir` (ver Previsión).
7. **Rechazado** (Importante) — el RED con la skill de hoy hace de control de la rúbrica, y 4 sujetos = 2 RED + 2 GREEN con REFACTOR en 0 (ya justificado en la tabla).
8. **Rechazado** (Importante) — el paso 2 no cambia y no hay comportamiento previo que registrar (✋ 6).
9. **Rechazado** (Menor) — `Validación: agente` es la validación del cierre; el aprobador de la spec se rellena en el gate.
10. **Rechazado** (Menor) — la 0031 nace sin fila de roadmap, como declara la spec («Filas que implementa: nada»).

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta; la fila de rúbrica y el fixture de `ROADMAP.md` de `c1` en `tests/batteries/aviso-cierre/battery.md`.
- No entra: el roadmap; qué nombrar con varias filas abiertas o con ninguna (✋ 4 y 9).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con la fila de rúbrica `` `text: /0011 — Anular reservas de otros/` ``: falla si el aviso del sujeto no nombra la fila con su id y su título. El RED debe fallar con la skill de hoy, y por esa razón.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre en el que `ROADMAP.md` tiene una única fila abierta: la 0011 «Anular reservas de otros»
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

Minutos: `sin medir` por `plan.mjs`, que solo da sujetos y dólares.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
