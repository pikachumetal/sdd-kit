# RED — feature 0150: roadmap Now / Next / Later y debt.md con triaje

Kit del commit de apertura (`bc53694a`, `git archive` al scratchpad, sin `.docs/` ni `tests/`: ver «Cambios en la campaña»), Sonnet, superpowers 7.0.0 en `SUPERPOWERS_DIR`. Baterías `tests/batteries/sdd-roadmap/` (m3, m4, m5) y `tests/batteries/using-sdd/` (r7). Salidas en `.docs/sdd/specs/20261013-112220-feature-0150-roadmap-triage-release-feedback/red/out/`. 10 sujetos válidos y 2 apartados, 2,36 $ en total con fb1 (`tests/sdd-feedback-0150-red.md`).

La puerta de `battery.sh` sale verde en todos: el triaje, el prompt y el «apunta» entran por `sdd-roadmap` sin la regla nueva. La conducta se lee con la rúbrica de la batería.

## Resultado por escenario

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| m3-1 | M3 | falla | la 1.4.2 «no existe: el `CHANGELOG.md` acaba en la 1.4.1», y el CSV queda en espera; pero la fila de las 8 h no se toca, y la planta va a «Actuar, patch» con «Evidencia: el informe de QA y la línea del código», sin el comando |
| m3-2 | M3 | falla | «`CHANGELOG.md` termina en 1.4.1: no existe la 1.4.2», pero propone el CSV en «**Lista**, … destino investigación antes del patch» sin reproducirlo; la de las 8 h «sigue esperando»; la planta, sin «Evidencia» con el comando |
| m4-1 | M4 | limpio | el carril, los requisitos (`.docs/sdd/changes/…/proposal.md`, §Reglas de negocio y §Enmiendas), «las 8:00» y «Nada que saldar» salen del brief; no escribe |
| m4-2 | M4 | limpio | lo mismo, y no escribe ni reserva |
| m5-1 | M5 | falla | fila 0014 en Next con título, one-liner y brief con las cinco etiquetas (por imitación de la fila 0013), `⏳`, pero tamaño `—`: «tamaño sin estimar» |
| m5-2 | M5 | falla | lo mismo: tamaño `—` |
| r7-1 | puerta | limpio | `>>> Skill: sdd-kit:sdd-roadmap` |
| r7-2 | puerta | limpio | `>>> Skill: sdd-kit:sdd-roadmap` |

## Lectura por regla

- **El triaje contrasta cada versión o cifra con su fuente** — 2/2 limpios: los dos leen `CHANGELOG.md` y dicen que la 1.4.2 no existe. Sin fallo, la regla no se escribe (Art. I); pendiente de la decisión del dev-lead (decisión 21 de la spec).
- **Nada pasa a «Lista» sin reproducirse o sin un 2.º caso** — 1/2 falla (m3-2 propone el CSV en «Lista» sin reproducirlo). La regla entra.
- **«Lista» lleva en «Evidencia» el comando que lo reproduce** — 2/2 fallan: los dos reproducen con `node src/app.js libres --planta 2`, pero la evidencia que proponen es el informe y la línea de código. La regla entra.
- **Una fila de «En espera» que caduca se propone en «Descartadas» con `caducada`** — 2/2 fallan: m3-1 no la menciona y m3-2 la deja esperando. La regla entra.
- **Propón y espera** — 2/2 limpios, con la regla vigente del paso 3.
- **El prompt sale del brief** — 2/2 limpios: el brief está en la fila y el sujeto lo usa. Sin fallo, la regla no se escribe (Art. I); pendiente de la decisión del dev-lead.
- **Con `ROADMAP.md`, la fila nueva lleva tamaño** — 2/2 fallan (`—`). La regla entra. El resto de la forma (Next, brief con las cinco etiquetas, `⏳`) sale por imitación de las filas del molde: lo cubre el check, que la exige.
- **Triar entra por `sdd-roadmap`** — 2/2 limpios. `using-sdd` no cambia (decisión 14 de la spec).

## Cambios en la campaña

- **La primera tanda de m3 estaba contaminada.** `git archive` del commit de apertura metió `.docs/` y `tests/` en la copia del kit, y m3-1 y m3-2 leyeron las secciones de triaje de la spec de esta feature desde ella (`grep -n -i "triar\|debt\|deuda" .docs/sdd/specs/20261013-112220-feature-0150-…/spec.md`). Sus salidas están en `red-contaminated/out/` y su coste cuenta en el techo. La copia del kit pasó a no llevar `.docs/` ni `tests/`, y m3 se relanzó. m4, m5 y r7 no leyeron `.docs/` del kit: se quedan.
