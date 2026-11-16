# Capacidad — project-retro

## Propósito

la mejora del entorno del proyecto: señales del cierre y repaso por causa de cada release.

## Requisitos

### El cierre de una feature busca señales y arregla con la salida más barata

- GIVEN el cierre de la feature 0081, en cuya sesión el dev-lead corrigió dos veces «los tests se lanzan con `npm run test:unit`», y `operations.md` dice `npm test`
- WHEN `sdd-archive` llega a `sdd-retro`
- THEN nombra la señal `corrección repetida`, corrige `operations.md` y escribe en §5 del walkthrough `Retro: corrección repetida → operations.md (comando de los tests unitarios)`
- AND no crea ninguna skill
- AND las señales son `corrección repetida`, `búsqueda a ciegas`, `documento o skill desmentido` y `error que cazaría un chequeo`
- AND de cada señal elige el primer peldaño que la resuelve, por este orden: un chequeo (test, lint o hook), `CLAUDE.md` u `operations.md`, la norma del revisor (el artículo de calidad de la constitution, si lo tiene) y una skill, esta con `sdd-agent-writing`
- AND un documento desmentido se corrige en ese mismo documento
- AND si la salida no cabe en su documento, aplica la salida del paso de aprendizajes de `sdd-archive`

### Sin señales, el cierre deja una línea

- GIVEN el cierre de la feature 0084, sin correcciones repetidas, búsquedas a ciegas, documentos desmentidos ni errores que un chequeo cazaría, en un proyecto sin `.claude/skills/`
- WHEN `sdd-archive` llega a `sdd-retro`
- THEN escribe en §5 del walkthrough `Retro: sin señales` y no cambia ningún otro fichero
- AND no crea `.claude/skills/`

### Una señal causada por el kit va al ticket

- GIVEN el cierre de la feature 0083, en cuya sesión un paso de `sdd-implement` del kit cargado dio un comando que ya no existe
- WHEN `sdd-archive` llega a `sdd-retro`
- THEN escribe `Retro: documento o skill desmentido → ticket del kit: <el comando que ya no existe>` y no edita la skill del kit
- AND la oferta del ticket de `sdd-feedback` nombra esa señal, y la línea queda aunque se rechace la oferta

### Cada corte deja un repaso de la deuda por causa

- GIVEN un `.docs/sdd/steering/debt.md` cuya «Lista» tiene «El anuncio sale 4 de 6» (`regla lejos de su paso`, 2 casos, «Destino» `sin fila`), «El prompt sale sin su forma» (`regla lejos de su paso`, 1 caso, `sin fila`) y «`--planta 2` lista otra planta» (`defecto del producto`, 1 caso, `0030`), y un `.docs/sdd/releases/v1.3.0/retro.md` que da «El anuncio sale 4 de 6» abierta desde `1.2.0`
- WHEN `sdd-end-release` corta la 1.4.0
- THEN `.docs/sdd/releases/v1.4.0/retro.md` existe, calcado de `retro-template.md`, con la salida de `sdd roadmap causes --path .docs/sdd --version 1.4.0` sin tocar
- AND «Propuestas» lleva una fila para `regla lejos de su paso`, con esas dos filas y un solo cambio concreto, y `prioriza o descarta` para «El anuncio sale 4 de 6», arrastrada desde la `1.2.0`
- AND el corte no escribe en `debt.md` ni en `ROADMAP.md` por el repaso, y su resumen nombra las propuestas
- AND en `unattended` no hace ninguna pregunta por el repaso y lo escribe igual
- AND el repaso corre tras caducar la deuda y sacar lo saldado, y `retro.md` entra en el commit del corte, antes del merge y el tag
- AND la fila de `--planta 2`, con destino y sin arrastre, no entra en «Propuestas»
- AND sin ninguna fila que cumpla la entrada, «Propuestas» dice `Sin propuestas`, sin inventar ninguna
- AND sin `debt.md`, o si el verbo dice `Sin deuda triada`, no hay repaso

## Reglas de la capacidad

- **Dónde viven los datos**: la línea del cierre, en §5 del walkthrough; el repaso, en `.docs/sdd/releases/vX.Y.Z/retro.md`.
- **Idioma de los nombres**: las señales, los títulos y los literales, en castellano; la capacidad y la skill, en inglés kebab-case.
- **Límites**: una línea `Retro:` por señal; una fila de «Propuestas» por causa, más una por fila arrastrada; `sdd-retro`, tope de 700 palabras (`cli/test/kit/word-budget.test.ts`).
- **Avisos**: `Retro: <señal> → <salida> (<fichero>)` · `Retro: <señal> → ticket del kit: <qué desmiente>` · `Retro: sin señales` · `Sin propuestas` · `prioriza o descarta`.
- **Regla ante conflicto**: entre rellenar y no inventar, manda `Retro: sin señales` y `Sin propuestas`. Decidir una propuesta es de `sdd-roadmap` y del dev-lead, no del corte.
