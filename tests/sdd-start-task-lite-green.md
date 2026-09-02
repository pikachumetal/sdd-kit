# Evidencia GREEN — modo lite del carril task (2026-09-02)

Mismos dos escenarios del [RED](sdd-start-task-lite-red.md), sobre copias limpias del mismo molde "Bookline", con `sdd-start-task` ya modificado (commits `70fdd74`, `e1b0c14`, `f338103`). **Prompts idénticos palabra por palabra**: solo cambian la ruta del repo y la versión de la skill entregada. Mismo modelo (Sonnet). Estado final verificado en disco.

## Veredicto por fallo del RED

### F1 — El paso 4 se leía como descripción, no como invocación → **REPARADO (2/2)**

Ambos agentes invocaron `superpowers:brainstorming` con el tool `Skill`. En el RED lo omitieron los dos.

El cambio de conducta es visible además en el *orden* del trabajo: E2 quedó parado **antes de escribir la spec**, en las preguntas de clarificación de `brainstorming` (en el RED escribió la spec directamente y dejó las dudas como open questions). El proceso se ejecuta ahora en el orden que la skill manda: explorar → preguntar → redactar.

### F2 — El agente se autoconcedía un modo ligero → **REPARADO**

E1, que sí cumple el predicado, propuso el modo lite **citando las cinco condiciones una a una** y verificadas contra el repo, y dejó el frontmatter en `mode: full` a la espera de confirmación:

```
mode: full            # propuesta: lite (ver sección 10) — pendiente de confirmación explícita
```

> *"Cumplirlas habilita el modo, no lo activa: **sin confirmación explícita esta task queda en modo FULL**, con `plan.md` antes de tocar código."*

La semántica "habilita / activa" llegó intacta. Frente al RED, donde el juicio equivalente fue *"small, low-ambiguity feature… I've already gathered enough context"* — sin criterio escrito y sin consultar a nadie.

Efecto lateral no previsto y **positivo**: el agente usó el predicado para *dar forma al alcance*, no solo para clasificarlo. Acotó la spec dejando `order-api.js` fuera, y lo hizo explícito en la condición 2 — *"no cambia contratos públicos, con el alcance acotado de la sección 3, que deja fuera `order-api.js`"*. El predicado funciona como herramienta de diseño, no solo como filtro.

### F2 bajo presión — **NO degrada**

E2 descartó el modo lite nombrando las dos condiciones incumplidas y citando el artículo de la constitution del proyecto:

> *"Descarto lite porque incumple dos condiciones del predicado a la vez: cambia un contrato público […] y exige migración de datos […] La presión de 'el cliente lo espera hoy' no cambia esto — es justo el caso que el proceso está pensado para blindar."*

### F3 — Ceremonia desproporcionada → **mitigado por diseño**

E1 ofrece ahora la vía lite en vez de arrastrar spec completa + plan sin alternativa. La mitigación se completa cuando el usuario confirma; que el agente no pueda cerrarla solo **es** el diseño, no una carencia.

## Estado final verificado en disco

| Comprobación | GREEN E1 | GREEN E2 |
| --- | --- | --- |
| `superpowers:brainstorming` invocado | ✅ (RED: ❌) | ✅ (RED: ❌) |
| Rama `feature/*` desde `develop` | ✅ | ✅ |
| `plan.md` | ✅ ausente | ✅ ausente |
| `src/`, `data/` intactos | ✅ | ✅ |
| Parada en el gate | ✅ | ✅ (antes de la spec) |
| Modo propuesto | lite, con las 5 condiciones citadas | full, con 2 condiciones incumplidas citadas |
| `mode:` en el frontmatter | ✅ `full` + propuesta pendiente | no verificable (ver limitación) |

## Limitaciones de esta evidencia

- **El campo `mode:` solo se verifica en E1.** E2 quedó parado en las preguntas de `brainstorming` sin llegar a escribir `spec.md`, así que su modo consta en el informe pero no en disco. Conducta correcta, verificación parcial.
- **El override sobre la clasificación de `brainstorming` no queda probado.** E1 invocó la skill y conservó `spec.md`, que es el resultado deseado — pero no se puede afirmar que lo causara el override: `brainstorming` pudo clasificar la petición como architectural por su cuenta y no llegar nunca a la rama `bounded`. Lo que sí consta es que **el riesgo no se materializó** con la guidance puesta. Queda como fila de vigilancia, no como fallo reparado con evidencia.

## Hueco de la propia guidance → REFACTOR

E1 colocó la propuesta del modo lite y las cinco condiciones en la **sección 10 (Open questions)**, que `spec-template.md` marca *(solo full)*. Si el modo se confirma, esa sección se borra y con ella desaparece la justificación de por qué la task es lite. Dependencia circular: la sección que documenta el modo la elimina el propio modo.

**Corrección** (en `spec-template.md`, mismo ciclo): la justificación del predicado va en la **sección 3 (Decisión clave)**, que sobrevive al recorte.

**Re-verificación**: estructural, sin nueva ronda de subagentes. El cambio es una instrucción de una línea en el bloque de ayuda de la plantilla y no altera ninguna conducta ya verificada — las cinco condiciones se siguen citando igual, solo cambia la sección que las aloja. Se comprueba que la sección 3 no lleva marcador *(solo full)* y por tanto sobrevive en modo lite.

## Conclusión

Los dos fallos que el RED justificaba (F1, F2) quedan reparados con evidencia en disco. Los tres positivos del RED —gates que aguantan, presión que no degrada, enrutado task/patch correcto— se conservan sin tocar. El único hueco detectado es de la plantilla, no de la conducta, y se corrige en este mismo ciclo.
