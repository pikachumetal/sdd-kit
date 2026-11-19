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

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título; por ejemplo (ilustrativo, no es el texto exacto): «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`, que leerá la fila de `ROADMAP.md`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~1 línea en 1 fichero
- Único (sonnet): si el THEN de «El aviso nombra la fila abierta» (id y título) lo mide la fila C1-A de la batería, cuya rúbrica solo exige /pendiente/, y si el paso 1 nuevo cubre el Intent (señal: capacidad nueva)
- Mínimo razonable: este mismo — deja sin cubrir el complemento de dominio, que aquí no aplica: no hay roles ni estados
```

- Política de modelos: revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high · otros despachos en paralelo: sujetos de la batería `c1`, 2 en la tanda RED y 2 en la GREEN · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` pasa a «1. Di qué se cierra y qué fila de `ROADMAP.md` queda abierta, con su id y su título.» — texto mío; la skill lee la fila de la tabla «Now» de `ROADMAP.md` (columnas Id y Tarea); el título es el texto en negrita de la celda Tarea.
3. El ejemplo «queda pendiente la 0011 — Anular reservas de otros» es solo un ejemplo: el THEN mide el contenido (id y título), no la frase.
4. La rúbrica de `c1` (fila `C1-A`) hoy solo comprueba `/pendiente/`: la corrijo en el RED con dos comprobaciones, `text: /0011/` y `text: /Anular reservas de otros/`, de modo que falle un aviso sin id o sin título. La polaridad de la columna «Falla si» no la he medido (`sin medir`): antes del primer sujeto la compruebo con una salida de ejemplo correcta y otra sin id ni título, y si la polaridad es la contraria, invierto las expresiones.
5. El fixture de `c1` es una copia congelada del roadmap, `tests/batteries/aviso-cierre/roadmap-c1.md`, con una sola fila abierta (0011 ⏳) y la 0005 cerrada (✅), y el prompt de `c1` dice que se cierra la 0005. No uso el `ROADMAP.md` vivo: tiene tres ⏳ (0010, 0011, 0008) y cambia cuando se cierra una fila, lo que rompería la prueba sin tocar la skill. El paso 1 lee `ROADMAP.md`; en la prueba se le da la copia.
6. Solo cubro el caso de una fila abierta. Cero filas o varias quedan fuera y sin escenario (con varias, el `ROADMAP.md` vivo no dice cuál nombrar: no tengo criterio y no lo invento): es una decisión de alcance tuya, dime si entran y con qué criterio.
7. Validación `agente` y Approach de una sola opción: los he elegido yo. El gate de cierre de la constitución (`node --test` entero en verde) se corre en `sdd-archive`; esta spec no toca código.
8. La previsión de coste no lleva minutos: `scripts/plan.mjs` solo da sujetos y dólares, y la constitución (regla 5) pide también minutos. Va como `sin medir`; dime una cifra o la dejo así.
9. `aviso-cierre` nace solo con el requisito nuevo: el comportamiento previo («di qué se cierra») y la fila `c2` no se capturan en la capacidad. Es ampliable si lo quieres.
10. Repaso de coherencia: `git grep` de «Di qué se cierra» y de «0031» solo encuentra el paso 1 y nada más; `sdd capability merge` sobre una copia: `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`, exit 0; `plan.mjs`: 2 sujetos · 1.40 $ por tanda.

### Hallazgos de la review

- **Aceptado** — Crítico: la rúbrica de `C1-A` solo exige /pendiente/ y no mide el THEN → decisión 4; entra en Scope.
- **Aceptado** — Crítico: el GIVEN no tenía fixture → decisión 5 (el `ROADMAP.md` del repo).
- **Aceptado** — Importante: el paso 1 no decía de dónde sale la fila → decisión 2 y Scope.
- **Aceptado** — Importante: sin escenarios de 0 o varias filas → decisión 6, declaradas fuera.
- **Aceptado** — Importante: falta de minutos en la previsión → decisión 8, `sin medir`.
- **Aceptado** — Importante: validación y Approach sin listar, y gate de la regla 2 → decisión 7.
- **Rechazado** — Importante: «la 0031 sin fila de roadmap es contradictorio» → el `git grep` es literal y confirma que no hay fila; el origen es la petición del dev-lead, y la spec no depende de una fila.
- **Aceptado** — Menor: literal y paso 1 desalineados → decisión 3 (THEN por contenido).
- **Rechazado** — Menor: capturar el comportamiento previo y `c2` → decisión 9, ampliable; sale del alcance pedido.
- **Rechazado** — Menor: ejemplo no inventado y término «Anular» → el ejemplo es la fila real del `ROADMAP.md` del proyecto (que es de uso propio, sin clientes), y coincide con la terminología de `PRODUCT.md` (Anulación: la hace el responsable de sala).

Segunda ronda (un revisor sonnet, por el Crítico aceptado de la primera; sin tercera):

- **Aceptado** — Crítico: el fixture vivo tiene tres ⏳ y no hay criterio para elegir la 0011 → decisiones 5 y 6: copia congelada con una sola fila abierta; varias filas, fuera y a tu decisión.
- **Aceptado** — Importante: la rúbrica nueva no estaba escrita → decisión 4 (expresiones literales; polaridad medida antes del RED).
- **Aceptado** — Importante: el fixture vivo acopla la batería a `ROADMAP.md` → decisión 5 y Scope.
- **Aceptado** — Menor: cómo se extrae el título → decisión 2 (texto en negrita de la celda Tarea).
- **Aceptado** — Menor: el ejemplo de la 🦆 parece literal → marcado como ilustrativo.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta, leída de `ROADMAP.md`.
- Entra: la fila `C1-A` de la rúbrica de `c1` en `tests/batteries/aviso-cierre/battery.md` exige id y título (`/0011/` y `/Anular reservas de otros/`).
- Entra: el fixture `tests/batteries/aviso-cierre/roadmap-c1.md`, copia congelada con una sola fila abierta, y el prompt de `c1`, que dice que se cierra la 0005.
- No entra: el roadmap (solo se lee) y los casos de cero o varias filas abiertas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila de `ROADMAP.md` queda abierta, con su id y su título.» |
| `text: /pendiente/` | `tests/batteries/aviso-cierre/battery.md` fila `C1-A` | Scope: exige `/0011/` y `/Anular reservas de otros/` |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2, con `roadmap-c1.md` como fixture.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre de la 0005 y un roadmap cuya única fila abierta es la 0011 «Anular reservas de otros»
- WHEN se avisa
- THEN el aviso dice el id 0011 y el título «Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | Minutos | $ |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | sin medir | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | sin medir | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | sin medir | 2,80 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
