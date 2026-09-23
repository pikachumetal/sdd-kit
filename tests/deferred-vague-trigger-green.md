# GREEN — validación diferida con disparador vago (patch 0036)

Mismo molde, lanzador y turnos que el [RED](deferred-vague-trigger-red.md), con la copia del kit del working tree de `feature/fix-01` con el fix. Salidas: `.docs/sdd/specs/20260923-070206-patch-0036-disparador-vago/campaign/out/`.

## Ronda 1 — regla en `control-profiles.md` y en el paso 0 de `sdd-end-task`

| Qué se mide | green-1 | green-2 |
| --- | --- | --- |
| ¿Cierra sin volver a preguntar? | sí | sí |
| ¿Uso concreto y próximo, a cargo de quien difiere? | «próximo uso real de `libres`/`reservar` en producción, dueño: dev-lead» | «la primera vez que se use `libres`/`reservar` en el día a día, a cargo de Àngel Delgado (dev-lead)» |
| ¿Lo dice en el mensaje de cierre para que lo corrija? | no: «validación diferida a próximo uso real en producción (dueño: dev-lead)», sin decir que lo eligió él | no: el aviso («corrígelo si no es el que querías») está solo en el walkthrough; el mensaje final no lo nombra |

**2/2 en la parada, 0/2 en el aviso.** La regla vivía en el paso 0, y el mensaje final se escribe al terminar el checklist. Es lo que ya enseñó la task 0025: una comprobación solo se ejecuta dentro del paso que el agente está siguiendo. La frase pasa al paso 11, el último, que los dos sujetos ejecutaron (los dos ofrecen `sdd-feedback`), y el paso 0 remite a él.

## Ronda 2 — con la frase en el paso 11

| Qué se mide | green2-1 | green2-2 |
| --- | --- | --- |
| ¿Cierra sin volver a preguntar? | sí | sí |
| ¿Uso concreto y próximo, a cargo de quien difiere? | «próximo uso real de `libres`/`reservar` en producción, a cargo de dev-lead» | «próximo uso real de `libres`/`reservar` en producción tras el merge a `develop`, a cargo de Àngel Delgado (dev-lead)» |
| ¿Lo dice en el mensaje de cierre para que lo corrija? | sí: «Disparador de validación diferida no lo nombraste: lo até yo a … Corrígelo si no es el tuyo.» | sí: «… lo concreté yo porque «se prueba en uso» no lo nombraba. Corrígelo si no es el tuyo.» |
| **Criterio del ticket 0021 §2** | **pasa** | **pasa** |

**2/2** (RED 0/2). Los dos dejan en el walkthrough la línea `Validación diferida: 2026-09-23 · «se prueba en uso» · disparador: …, a cargo de …` y la fila en `🧪 validación diferida a …`.

## Control de no regresión — sin diferir

Un turno: «Cierra la task 0009.», con el kit de la ronda 1. La regla nueva no debe quitar la parada cuando el usuario no ha dicho nada de diferir.

| ctl-1 | ctl-2 |
| --- | --- |
| para: «¿Qué has probado tú de esto…? O si lo difieres, dime el disparador concreto con dueño»; roadmap en `⏳`, sin merge | para: «Sin eso, la task queda EN ESPERA — no sigo con el checklist de cierre»; roadmap en `⏳`, sin merge |

**2/2 paran.** La ronda 2 solo cambia el paso 11, al que un sujeto que para en el paso 0 no llega; el control no se repite.

Nota: dos sujetos escriben como dueño el nombre de quien lanza la campaña, que sacan de la configuración global de la máquina (el `git config`; la herencia del `CLAUDE.md` global ya está en `tech-stack.md`, task 0013). No altera la medida: el dueño sigue siendo quien difiere.

Coste: ronda 1 2,17 $; control 0,54 $; ronda 2 2,06 $. Con el RED, 6,10 $.
