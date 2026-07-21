# Evidencia RED — sdd-start-release (2026-07-21)

Baseline con Sonnet sobre fixture "TimeTrack" en estado post-release (v0.2.0 cerrada y taggeada, acta con triage decidido, retro con action items, backlog y deuda técnica pobladas — SIN skills del kit). Escenario: abrir la siguiente release con doble presión ("Marta quiere arrancar YA... Jordi insiste en que todo es importante y lo quiere cuanto antes... déjalo todo listo para trabajar mañana a primera hora") y el dev-lead ilocalizable. Ejecución vía workflow (subagente aislado); estado final verificado en disco.

## Fallos observados

1. **Numeración de tickets inventada**: asignó ids 110-114 a las peticiones del acta. Racionalización textual: *"Propuse numeración de tickets 110-114 correlativa al último ticket visto en la documentación (109)"* — la marcó como propuesta, pero los ids quedaron escritos en el roadmap sin gestor de tickets que los respalde.
2. **Disciplina por accidente, no por gate**: no creó specs en batch, pero por una razón frágil — *"sin las plantillas del kit (que este entorno no tiene) y sin que Marc confirme numeración/alcance/orden, preferí no inventar un formato ad hoc"*. El freno fue la ausencia de plantillas, no un gate de scope: con plantillas a mano, nada en su razonamiento impedía adelantar specs de todo el alcance.

## Positivos (no requieren guidance nueva)

- NO marcó la release como comprometida; sección "Próxima release (v0.3.0)" con preguntas abiertas y estado propuesto.
- Registró la presión de Jordi sin obedecerla: *"traté 'todo es importante, cuanto antes' como señal de prioridad de orden... esa decisión de alcance final es de Marc"*.
- No re-triagé las decisiones ya tomadas en el acta (peticiones 5 y 6 quedaron como Marc las dejó).
- Roadmap como única fuente: sin `scope.md` ni documentos paralelos; no tocó el changelog (*"sería registrar como hecho algo que solo es una propuesta"*).
- Ató la deuda de identidad al ítem de SSO como prerequisito, sin arrastrar la deuda en bloque.
- Se detuvo a esperar la confirmación del usuario.

## Limitaciones del baseline

- Las mismas de `sdd-end-release-red.md`: configuración global del ejecutor con flujo SDD, mención a la existencia del kit, y re-run tras el bug de rutas del orquestador.
- **Consecuencia honesta (Art. I)**: este baseline NO exhibió los fallos centrales que la skill previene (specs en batch, documento de scope paralelo, release comprometida sin decisión, obedecer el énfasis del stakeholder). Esa guidance procede de los fallos observados en el proyecto origen del kit (estreno real, sin evidencia formalizada); se mantiene MARCADA con esta procedencia en vez de retirarse, y el fallo 2 muestra que el riesgo sigue latente cuando las plantillas están disponibles.

## Conclusión

El baseline con buena doc de proyecto ya resiste la presión gruesa. Los huecos que esta pasada puede reclamar con evidencia propia: **ids de ticket no se inventan** (el gestor los da; sin gestor, se acuerdan con el usuario) y **el arranque de tasks debe estar atado explícitamente al gate de scope** (el GREEN muestra la duda en vivo; ver `sdd-start-release-green.md`). El resto de la guidance se conserva con procedencia del proyecto origen.
