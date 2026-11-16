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

Review de spec propuesta: un revisor (más una segunda ronda por un Crítico aceptado) — señales: capacidad nueva · tamaño: ~15 líneas en 3 ficheros
- Dominio+técnica (sonnet): si la rúbrica `C1-A` prueba el formato «queda pendiente la 0011 — …» y no solo la palabra «pendiente», y qué hace el paso 1 con más de una fila abierta (señal: capacidad nueva)
- Mínimo razonable: sin revisión de spec — deja sin mirar que la rúbrica de hoy pasa sin el comportamiento

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. La rúbrica `C1-A` de hoy (`text: /pendiente/`) pasa con la palabra «pendiente» sin que el aviso nombre ninguna fila, así que no prueba el escenario. Propongo endurecerla en la tanda RED, antes de tocar la skill: `text: /queda pendiente la 0011 [—–-] Anular reservas de otros/`, que ancla el formato de la decisión 4 y el id y el título, y tolera raya o guion. Es un cambio de la batería, no de la skill, y va en su propio commit de test.
4. Formato del aviso: «queda pendiente la <id> — <título>», con el título tal como está en el roadmap.
5. Alcance del caso: el aviso nombra **una única fila abierta**. Con varias abiertas a la vez (el `ROADMAP.md` de hoy tiene tres en Now: 0010, 0011, 0008) la skill no está especificada y queda fuera, igual que «ninguna abierta» y «fila sin título»: lo dejo como deuda para su propia fila, no lo decido aquí.
6. «Abierta» = una fila del `ROADMAP.md` con estado ⏳, en cualquier sección. La skill la lee del `ROADMAP.md` del proyecto (id de la columna Id, título en negrita de la columna Tarea); no cambia el formato del roadmap. La fila que se cierra no cuenta como «queda abierta», esté ⏳ o ✅: el aviso sale en el paso 1, antes de actualizar el roadmap. El fixture del sujeto es un roadmap con la 0005 (la que se cierra) ⏳ y la 0011 como única otra fila abierta; las demás ✅. Esto acopla la skill al formato del `ROADMAP.md` (columnas Id y Tarea, símbolo ⏳) y ninguna prueba avisa si ese formato cambia: lo acepto y lo dejo anotado.
7. La capacidad `aviso-cierre` nace parcial, con un solo requisito (lo que ya hacía el aviso, «di qué se cierra», no se recoge ahora). Lo acepto: recogerlo sería una spec distinta y una tanda más de sujetos. No es un `MODIFIED`: el paso 2 y «qué se cierra» no cambian.
8. Política de modelos: un revisor de spec en Sonnet, por el tamaño del cambio (~15 líneas); implementación en Native con esta sesión; sujetos de la batería en Sonnet, como fija `operations.md` §Testing.
9. Validación por agente, sin controles, sin REFACTOR y n = 2: la batería ya fija n = 2 para `c1`, la frase es la forma mínima y solo cambia una skill. **Minutos `sin medir`**: `plan.mjs` no los da y no tengo base para estimarlos; es una excepción a la regla 5 de la constitución que necesita tu «sí» explícito, y los mido en el RED.
10. Pasada de coherencia: `git grep` de «Di qué se cierra» fuera de las carpetas de evidencia solo da el paso 1 de la skill (ya en la tabla de abajo) y `git grep "0031"` no da nada; `SCENARIOS="c1" N=2 node scripts/plan.mjs …` da `suma: 2 sujetos · coste previsto: 1.40 $`, como la previsión; `sdd capability merge` sobre una copia de `.docs/sdd` da «aviso-cierre.md: añadido «El aviso nombra la fila abierta»», sin rechazos.

### Hallazgos de la review

Primera ronda:
- **Aceptado** — Crítico: «la fila abierta» en singular frente a tres abiertas en el roadmap → decisión 5 acota el caso a una única fila abierta y decisión 6 declara el fixture.
- **Aceptado** — Crítico: la rúbrica `/0011.*…/` pasa sin el formato → decisión 3 ancla «queda pendiente la 0011 [—–-] …».
- **Aceptado** — de dónde sale la fila y qué es «abierta» → decisión 6.
- **Aceptado en parte** — sin escenario para «ninguna abierta» o «sin título» → declarados fuera del Scope (decisión 5), sin escenario nuevo.
- **Aceptado** — faltaban minutos en la previsión → columna añadida, `sin medir` (decisión 9).
- **Aceptado en parte** — capacidad parcial → decisión 7, aceptada a propósito.
- **Rechazado** — controles con la rúbrica a mano → el RED ya corre con la skill de hoy y la rúbrica endurecida; n = 2 lo fija la batería (decisión 9).
- **Aceptado** — política de modelos sin fuente → cita `operations.md` §Testing y motivo por tamaño (decisión 8).
- **Aceptado** — Approach sin alternativa → alternativa B descartada.
- **Rechazado** — usar un id y título inventados en el fixture → el aviso lee el `ROADMAP.md` del proyecto, donde 0011 y su título ya existen: no es un dato real de cliente.

Segunda ronda (sin tercera):
- **Aceptado** — Crítico: dos rúbricas distintas → una sola regex en la decisión 3 y en «Dónde se prueba».
- **Aceptado** — la fila que se cierra sigue ⏳ en el paso 1 → decisión 6 y GIVEN.
- **Aceptado en parte** — «ninguna» y «varias abiertas» sin ADDED → siguen fuera del Scope (decisión 5); propongo dos filas de roadmap para ellos tras aprobar.
- **Aceptado en parte** — minutos → decisión 9 pide tu «sí» a la excepción.
- **Aceptado** — decisiones del cuerpo fuera del ✋ (validación por agente, controles, n = 2) → decisión 9.
- **Rechazado** — «di qué se cierra» como ADDED → es comportamiento previo que no cambia (decisión 7).
- **Aceptado** — acoplamiento al formato del roadmap → decisión 6.
- **Aceptado** — `git grep "0031"` mal descrito → decisión 10 corregida.
- **Aceptado** — raya larga frágil → rúbrica tolera raya o guion (decisión 3).
- **Aceptado** — Intent en primera persona y motivo del revisor → corregidos.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y yo no supe que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- Entra también: la rúbrica `C1-A` de `tests/batteries/aviso-cierre/battery.md` se endurece (decisión 3).
- No entra: el formato ni el contenido del roadmap (la skill solo lo lee, decisión 6); varias filas abiertas, ninguna abierta y fila sin título (decisión 5); el paso 2 de la skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- B. Un paso 3 aparte («Nombra la fila abierta») — descartado: el aviso se da en el paso 1 y un paso 3 iría después del gate, cuando ya no avisa.
- Elegido: A.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A` endurecida a `text: /queda pendiente la 0011 [—–-] Anular reservas de otros/` (decisión 3), n = 2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN el cierre de la 0005 y un roadmap en el que, además de la 0005, la 0011 «Anular reservas de otros» es la única fila abierta
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | Minutos | $ |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | sin medir | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | sin medir | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED corre con la skill de hoy y con la rúbrica ya endurecida (n = 2 como fija la batería) | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | sin medir | 2,80 |

Los minutos no se pueden medir antes del primer sujeto: `plan.mjs` no los da. Se miden en el RED y se anotan en el plan.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
