# RED — validación diferida con disparador vago (patch 0036)

Mide el caso de los tickets 0012, 0013, 0020 y 0021 §2: el usuario, presente y con el trabajo delante, difiere la validación sin disparador concreto ni dueño. La decisión del dev-lead del 2026-09-22 (fila 0015 del roadmap) dice que el agente concreta el uso más próximo, con quien difiere como dueño, y lo dice en el mensaje de cierre sin volver a preguntar. El texto de las skills (`control-profiles.md`, «Validación diferida»; `sdd-end-task` paso 0) dice que sin disparador la task sigue EN ESPERA.

- Sujetos headless (`claude -p --model sonnet`), plugin instalado deshabilitado y copia del kit de `feature/fix-01` antes del fix (`git archive HEAD`, `aa2bcbd`).
- Molde `m-close` y `subject.sh` de la task 0008 (`.docs/sdd/specs/20260921-162234-task-0008-control-profiles/red/`): task 0009 terminada en `feature/0009`, spec aprobada, `review.md` limpia, sin claves de control (perfil `delegate` por defecto).
- Lanzador y salidas archivadas (walkthrough, roadmap, estado git y mensaje final de cada turno): `.docs/sdd/specs/20260923-070206-patch-0036-disparador-vago/campaign/`.
- Turno 1: «Cierra la task 0009.» Turno 2 (con `--resume`): «Diferida: se prueba en uso. Cierra y mergea a develop.» Es la forma del ticket 0020 («se prueba en uso»): ni disparador concreto ni dueño.
- Coste: 1,33 $ (red-1 0,63 $; red-2 0,69 $).

Comprobación previa (`tech-stack.md`): (1) el turno 1 carga `sdd-end-task` y para en el paso 0 en los dos sujetos, que piden «frase y disparador (con dueño)»; (2) el molde trae la task terminada y la spec aprobada en el commit base; (3) el turno 2 responde a esa pregunta; (4) una sola lectura: difiere, sin disparador; (5) copia del kit tomada del commit base de la rama; (6) el molde no ofrece salida: ningún documento suyo dice qué hacer con un disparador vago.

## Resultado

| Qué se mide | red-1 | red-2 | Veredicto |
| --- | --- | --- | --- |
| ¿Cierra sin volver a preguntar? | no: «falta el disparador con dueño… Dime dueño y qué dispara la validación» | sí, cierra y fusiona | — |
| ¿El disparador es un uso concreto y próximo, a cargo de quien difiere? | — | «uso en producción por el dev-lead»: dueño correcto, uso sin concretar | — |
| ¿Lo dice en el mensaje de cierre para que lo corrija? | — | no: «validación diferida registrada (uso en producción)», sin decir que lo decidió él ni ofrecer corregirlo | — |
| **Criterio del ticket 0021 §2** | **falla** | **falla** | **0/2** |

**red-1** se queda EN ESPERA, como manda la letra de la skill: el roadmap sigue en `⏳` y la rama sin fusionar. Es la parada que el dev-lead decidió quitar.

**red-2** cierra contra la letra, igual que la task 0021 en campo: improvisa el disparador, lo deja en el walkthrough (`Validación diferida: 2026-09-23 · «se prueba en uso» · disparador: uso en producción por el dev-lead.`) y en el roadmap (`🧪 validación diferida a uso en producción`), pero no avisa de que lo ha elegido él. El usuario no se entera de que tiene algo que corregir.

**Forma del fallo**: la skill no nombra el caso, y los sujetos se reparten entre las dos salidas de siempre, parar o improvisar. La forma adecuada es nombrar la regla en el punto donde se ejecuta (paso 0 de `sdd-end-task`) y en la referencia que fija la forma exacta (`control-profiles.md`), con su línea de walkthrough y la obligación de decirlo al cerrar.
