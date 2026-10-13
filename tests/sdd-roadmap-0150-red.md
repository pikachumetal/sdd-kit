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
| m3b-1 | M3b | limpio | abre el walkthrough de la 0012: «El ticket dice que la 0012 midió 40 s en su walkthrough §2. No es lo que dice el walkthrough: … **4 s**»; propone «En espera» y no escribe |
| m3b-2 | M3b | falla (paso 3 vigente) | el contraste, limpio: «el walkthrough de la 0012 (§2) midió **4 s** con 1.000 reservas»; pero escribe la fila en `debt.md` sin esperar la decisión, en `delegate` |

## Lectura por regla

- **El triaje contrasta cada versión o cifra con su fuente** — 2/2 limpios en m3 (leen `CHANGELOG.md` y dicen que la 1.4.2 no existe) y 2/2 limpios en m3b, el caso de campo que pidió el dev-lead: el dato del ticket solo lo desmiente el walkthrough que cita, y los dos lo abren. Sin fallo, la regla sale con su THEN (Art. I; enmienda de la spec del 2026-10-13). m3 y m3b quedan de control. El fallo de campo de la «7.1.0» no se reproduce con un ticket corto: queda en «Esperar 2.º ticket».
- **Propón y espera (paso 3 vigente)** — m3b-2 escribe en `debt.md` sin esperar la decisión, en `delegate`. Es una regla vigente que no aguantó una vez; se mira en el GREEN.
- **Nada pasa a «Lista» sin reproducirse o sin un 2.º caso** — 1/2 falla (m3-2 propone el CSV en «Lista» sin reproducirlo). La regla entra.
- **«Lista» lleva en «Evidencia» el comando que lo reproduce** — 2/2 fallan: los dos reproducen con `node src/app.js libres --planta 2`, pero la evidencia que proponen es el informe y la línea de código. La regla entra.
- **Una fila de «En espera» que caduca se propone en «Descartadas» con `caducada`** — 2/2 fallan: m3-1 no la menciona y m3-2 la deja esperando. La regla entra.
- **Propón y espera** — 2/2 limpios, con la regla vigente del paso 3.
- **El prompt sale del brief** — 2/2 limpios: el brief está en la fila y el sujeto lo usa. Sin fallo, la regla no se escribe y `launch-prompt-template.md` no cambia (Art. I; enmienda de la spec del 2026-10-13, «Sale»). m4 queda de control.
- **Con `ROADMAP.md`, la fila nueva lleva tamaño** — 2/2 fallan (`—`). La regla entra. El resto de la forma (Next, brief con las cinco etiquetas, `⏳`) sale por imitación de las filas del molde: lo cubre el check, que la exige.
- **Triar entra por `sdd-roadmap`** — 2/2 limpios. `using-sdd` no cambia (decisión 14 de la spec).

## Cambios en la campaña

- **m3b se añadió tras el m3 limpio**, por decisión del dev-lead («Otra tanda con un caso de campo»): molde `salas-3-wt`, con un ticket de soporte que da «40 s con 1.000 reservas» citando el walkthrough de la 0012, que mide 4 s. 2 sujetos más, 0,39 $; la campaña RED suma 13 sujetos y 2,75 $.

- **La primera tanda de m3 estaba contaminada.** `git archive` del commit de apertura metió `.docs/` y `tests/` en la copia del kit, y m3-1 y m3-2 leyeron las secciones de triaje de la spec de esta feature desde ella (`grep -n -i "triar\|debt\|deuda" .docs/sdd/specs/20261013-112220-feature-0150-…/spec.md`). Sus salidas están en `red-contaminated/out/` y su coste cuenta en el techo. La copia del kit pasó a no llevar `.docs/` ni `tests/`, y m3 se relanzó. m4, m5 y r7 no leyeron `.docs/` del kit: se quedan.
