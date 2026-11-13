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

🦆 Al cerrar una feature, el aviso dirá qué filas del roadmap siguen abiertas, con su número y su título: al cerrar la 0005 con la 0010, la 0011 y la 0008 abiertas, dirá «queda pendiente la 0010 — Motivo al cancelar», y lo mismo para la 0011 y la 0008. Hoy solo dice qué se cierra, y quien cierra no se entera de lo que queda. Cambia el paso 1 de la skill `aviso-cierre`, que pasa a leer `ROADMAP.md` (solo lectura), y la rúbrica de `c1`.

Validación: agente — solo cambia el texto de una skill y su rúbrica, y los mide la batería.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~10 líneas en 2 ficheros (`skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/battery.md`), sin contrato público ni `MODIFIED`
- Único (sonnet): si los THEN se sostienen contra el `ROADMAP.md` de hoy (tres filas abiertas: 0010, 0011, 0008) y si la rúbrica de `c1` pasa sin que el aviso nombre la fila (señal: capacidad nueva)
- Mínimo razonable: ninguna review — deja sin cubrir que una rúbrica acepte un aviso que dice «pendiente» sin nombrar la fila, el hueco que solo se ve cuando el GREEN pasa sin el comportamiento

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra cada fila abierta del roadmap con su id y su título, una por línea, con la forma «queda pendiente la 0011 — Anular reservas de otros» (el id y el título de cada fila).
3. **Con varias filas abiertas, el aviso las nombra todas** (decisión mía, no dicha por ti; «solo la primera» daría la 0010, no la 0011 del caso que motiva esto). Tiene su escenario 2. Si prefieres otra regla, cámbiala aquí antes de aprobar.
4. «Abierta» es toda fila de `Now` en `ROADMAP.md` con estado ⏳, 🔄, ⏸️ o 🧪 (los estados del roadmap salvo ✅), menos la que se cierra. `Next` y `Later` no cuentan. Van en el orden de la tabla `Now`, que la rúbrica no mide.
5. Sin ninguna fila abierta, o sin `ROADMAP.md`, la spec no dice qué hace el aviso: queda fuera, sin escenario ni prueba, y la capacidad no lo declara. Hoy el aviso se queda como está.
6. La rúbrica de `c1` hoy se dispara con la palabra «pendiente»: no pide la fila. Pasa a fallar si el aviso **no** nombra la 0011 con su título (id y título, no solo la palabra). `c2` es nuevo y tiene una fila de rúbrica por cada fila esperada (`C2-A1` la 0010, `C2-A2` la 0011, `C2-A3` la 0008), cada una con «queda pendiente la 00NN — título»: falla si falta alguna de las tres. La sintaxis exacta de la columna «Falla si» la fija la Task del RED, que muestra que la skill de hoy falla y la nueva pasa.
7. Los escenarios necesitan su fixture: un `ROADMAP.md` mínimo para `c1`, con solo la 0011 abierta, y otro para `c2`, con la 0010, la 0011 y la 0008 abiertas. En los dos, la 0005 es la fila que se cierra y no cuenta. Los fixtures van en la batería.
8. `Validación: agente`: lo que cambia es el texto de una skill, que mide la batería. Un humano sí lee el aviso; si prefieres verlo tú, pasa a `dev-lead`.
9. Previsión de coste: sube de 2 a 4 sujetos por tanda (`c1` y `c2`) y la suma a 5,60 $ (ver «Previsión de coste»). **Minutos: sin medir**: ni `plan.mjs` ni `operations.md` los dan; la constitución (5) los pide y el dev-lead puede darlos.
10. La 0031 no tiene fila en `ROADMAP.md`: el id sale de la rama `feature/0031-close-notice-row`, y al cerrar no habrá fila que marcar ✅. ¿Añado la fila? Recomiendo que sí, como parte del cierre.
11. La capacidad nace solo con lo que esta feature añade: «el aviso dice qué se cierra» queda sin requisito propio, y se registra como deuda al cerrar.
12. Repaso de coherencia: `git grep` de «Di qué se cierra» y de `0031` fuera de las carpetas de evidencia: un solo sitio (el paso 1) y ninguna fila del roadmap con la 0031. Delta sobre una copia de `.docs/sdd`: 7 líneas, sin rechazos. Previsión medida con `plan.mjs`: `suma: 4 sujetos · coste previsto: 2.80 $`.
7. `Validación: agente`: lo que cambia es el texto de una skill, que mide la batería. Un humano sí lee el aviso; si prefieres verlo tú, pasa a `dev-lead`.
8. Previsión de coste: sube de 2 a 4 sujetos por tanda (`c1` y `c2`) y la suma a 5,60 $ (ver «Previsión de coste»).
9. Repaso de coherencia: `git grep` de «Di qué se cierra» y de `0031` fuera de las carpetas de evidencia: un solo sitio (el paso 1) y ninguna fila del roadmap con la 0031. Delta sobre una copia de `.docs/sdd`: `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`. Previsión medida con `plan.mjs`: `suma: 4 sujetos · coste previsto: 2.80 $`.
- Política de modelos: un revisor de la spec en sonnet, más una segunda ronda en sonnet · ejes de la revisión final según el plan (Spec opus+high, Código sonnet+high) · sujetos de la batería, por tandas (`c1` y `c2`, n = 2) · en paralelo hasta `control.maxParallelAgents`
- Enfoque: una frase en el paso 1, frente a un paso nuevo (ver Approach).

### Hallazgos de la review

Primera ronda:

- **Aceptado** — Crítico: la rúbrica `C1-A` pasa sin la 0011 → decisión 6 y Scope: pasa a exigir id y título.
- **Aceptado** — Crítico: el caso real tiene tres filas abiertas y la spec solo cubría una → decisión 3 y escenario 2.
- **Aceptado** — Importante: sin ninguna fila abierta no había regla → decisión 5 y «No entra».
- **Aceptado** — Importante: faltaban las reglas de la capacidad → sección «Reglas de la capacidad — `aviso-cierre`».
- **Aceptado** — Importante: la skill lee `ROADMAP.md` y «No entra: el roadmap» se leía como que no lo consulta → Scope aclara que lo lee y no lo modifica.
- **Aceptado en parte** — Importante: la capacidad nace sin el requisito base «el aviso dice qué se cierra» → decisión 11: queda como deuda al cerrar, no como requisito de esta feature.
- **Rechazado** — Importante: coste sin evidencia → la tabla ya cita la salida de `plan.mjs` y los controles a 0 llevan su porqué; ahora la decisión 9 repite la cifra.
- **Aceptado** — Menor: mezcla de decisiones y pendientes → la lista ya no tiene pendientes: lo que era «sin decidir» es la decisión 3.
- **Rechazado** — Menor: el ejemplo «Anular reservas de otros» vs «Anulación» del glosario → es el título literal de la fila 0011 del roadmap del proyecto, no un cliente real.
- **Aceptado** — Menor: el aviso va en castellano → regla «Idioma de los nombres».

Segunda ronda (sonnet, una sola; sin tercera):

- **Aceptado** — Crítico: la columna «Falla si» se leía al revés → decisión 6: la condición de fallo se escribe como «el aviso no nombra la fila» y el RED lo demuestra con la skill de hoy.
- **Aceptado** — Crítico: `C2-A` sin condición → decisión 6: una fila de rúbrica por cada fila esperada.
- **Aceptado** — Crítico: el escenario 1 contra el roadmap real de tres filas → decisión 7: fixtures mínimos para `c1` y `c2`.
- **Aceptado** — Importante: la frase del paso 1 no llevaba las reglas → «Lo que se retira o cambia de forma» lleva el texto literal.
- **Rechazado** — Importante: escenarios 3 y 4 (sin abiertas, sin `ROADMAP.md`, estados raros) → no son comportamiento que esta feature fije; decisión 5 los saca de la spec y de la capacidad (regla ante conflicto: no aplica). «Abierta» queda como lista cerrada en la decisión 4.
- **Aceptado en parte** — Importante: base de la capacidad → decisión 11.
- **Aceptado en parte** — Importante: minutos de la previsión → decisión 9: `sin medir`.
- **Aceptado** — Menor: Scope y capacidad se contradecían en el caso sin filas → decisión 5.
- **Aceptado** — Menor: el orden de las líneas → decisión 4: el de la tabla, sin medir.
- **Aceptado** — Menor: la 0031 sin fila → decisión 10, como pregunta.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la 0010, la 0011 y la 0008 seguían abiertas. Éxito: el aviso nombra las tres con su título, y no pasa por bueno un aviso que solo dice «pendiente».

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra cada fila abierta de `ROADMAP.md`, que lee sin modificar.
- Entra: la rúbrica `C1-A` exige id y título, y `C2-A` mide varias filas abiertas, en `tests/batteries/aviso-cierre/battery.md`.
- No entra: modificar el roadmap, y el aviso cuando no queda ninguna fila abierta o no hay `ROADMAP.md` (la spec no lo define; sigue como hoy).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra. Después, lee `ROADMAP.md` sin modificarlo y, por cada fila de `Now` con estado ⏳, 🔄, ⏸️ o 🧪 que no sea la que se cierra, escribe en su propia línea y en el orden de la tabla «queda pendiente la 0011 — Anular reservas de otros», con el id y el título de esa fila.» |
| La rúbrica `C1-A` de hoy (`text: /pendiente/`) | `tests/batteries/aviso-cierre/battery.md`, fila `C1-A` | Scope y decisión 6: falla si el aviso no nombra la 0011 con su título |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — cuesta una frase más en la skill; el aviso ya sale del primer paso.
- Un paso nuevo entre el 1 y el 2 — cuesta renumerar el «Corre el gate» y separar un aviso que ya es uno solo.
- Elegido: una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.

## Dónde se prueba

- Escenario 1 (una fila abierta): `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A` con la rúbrica reforzada y su fixture de roadmap, n = 2.
- Escenario 2 (tres filas abiertas): `c2`, filas nuevas `C2-A1`, `C2-A2` y `C2-A3` y su fixture, n = 2; el RED corre con la skill de hoy y debe fallar en las dos.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre de la 0005 con la fila 0011 «Anular reservas de otros» como única abierta en el roadmap
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

#### ADDED — El aviso nombra todas las filas abiertas

- GIVEN un cierre de la 0005 con las filas 0010 «Motivo al cancelar», 0011 «Anular reservas de otros» y 0008 «Avisos por correo antes de la reserva» abiertas en `Now`
- WHEN se avisa
- THEN el aviso dice, una por línea, «queda pendiente la 0010 — Motivo al cancelar», «queda pendiente la 0011 — Anular reservas de otros» y «queda pendiente la 0008 — Avisos por correo antes de la reserva»

#### Reglas de la capacidad — aviso-cierre

- **Dónde viven los datos**: las filas salen de la tabla `Now` de `ROADMAP.md`; «abierta» es toda fila con ⏳, 🔄, ⏸️ o 🧪, salvo la que se cierra.
- **Idioma de los nombres**: castellano, con la forma «queda pendiente la 0011 — Anular reservas de otros» y el título tal cual está en el roadmap.
- **Límites**: no aplica: se nombran todas las abiertas.
- **Avisos**: una línea por fila abierta, con el literal de arriba.
- **Regla ante conflicto**: no aplica.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 8 sujetos · minutos: sin medir | 5,60 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
