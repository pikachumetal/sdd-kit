---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261101-163142-feature-0151-agent-writing
task: 0151
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0151: sdd-agent-writing, con un ruling apoyado en un arnés que nombraba la skill

## Contexto

- Carril y modo: feature full, perfil delegate, Native
- Skills del kit usadas: sdd-propose, sdd-implement, sdd-worktrees, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-feedback
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 y Sonnet 5.5, ejes y re-revisión
- Coste en reloj: 0,89 h frente a 2,5 h estimadas
- Coste en tokens: 22,4 M; 13,02 $ de sesión y 10,88 $ de sujetos

## Hallazgos

### 1. Un `subject.mjs` que antepone el nombre de la skill invalida en silencio un escenario de puerta

- Qué pasó: añadí el control `e1` a una batería cuyo `subject.mjs` anteponía «Invoca la skill…» a todo salvo `p1`. Salió «entra por la skill» dos veces, cambié la `description` y escribí un ruling. Lo cazó el eje Spec.
- Fuente: `green3/out/e1-1.state.txt` y `green4/out/e1-1.state.txt`, primera línea.
- Coste: dos tandas, una `description` equivocada en un commit y una pasada de fix.
- Aceptación: GIVEN una fila con «Esperado» distinto de la skill que nombra `subject.mjs` WHEN se lanza THEN `battery.mjs` lo rechaza por contradicción.
- Propuesta: sin verificar. Comprobación en `battery.mjs run`, no una regla en prosa. Queda un aprendizaje en `tech-stack.md`.

### 2. El techo de sujetos de la previsión no para en ningún sitio

- Qué pasó: la spec previó 45 sujetos y 18,66 $; llegué a 63 y 10,88 $ sin parar. Leí el plan, «Techo acumulado: 18,66 $», como único límite, y el Art. I dice sujetos, minutos y dólares. `SUBJECT_CAP` lo fijé yo tres veces a mano, subiéndolo.
- Coste: una parada del dev-lead avisada tarde.
- Aceptación: GIVEN una spec con previsión de N sujetos WHEN el acumulado supera N THEN el lanzador para y nombra la previsión.
- Propuesta: sin verificar. `SUBJECT_CAP` y `COST_CAP` salen de la tabla de la spec.

### 3. Montar un fork con un script deja fuera piezas sin que nadie lo decida

- Qué pasó: el script cortaba secciones por encabezado. El eje Spec encontró piezas de la fuente sin fila ni motivo, y mi primera tabla de procedencia dio motivos que la ADR 0013 no admite. Hizo falta subir el tope de 8.470 a 8.760 palabras (parada del dev-lead).
- Aceptación: GIVEN un fork WHEN se escribe la procedencia THEN cada encabezado de la fuente tiene su fila.
- Propuesta: sin verificar. Un test o script que liste los encabezados de la fuente sin fila.

### 4. La estimación de un fork por palabras sale muy alta

- Qué pasó: 2,5 h estimadas, 0,89 h reales (−64 %).
- Aceptación: GIVEN un fork montado con script WHEN se estima THEN cuenta la campaña y la revisión, no la escritura.
- Propuesta: sin verificar.

## Menores

- `sdd merge --sync` chocó en el roadmap porque `sdd roadmap publish` deja en `develop` el mismo cambio que la rama, y yo lo edité después. Conflicto de filas idénticas más la 0278.
- El tope acumulado de `SUBJECT_CAP` parece por tanda: el primer intento de una tanda nueva dio «techo de 8 sujetos alcanzado» con 10 ya gastados.
- La guarda de `KIT_DIR` falló en 10 intentos seguidos, sin parar al primero, con coste 0 $.

## Lo que funcionó

- Proponer el reparto de la fila: tres piezas con campañas separadas.
- La revisión en dos ejes más la re-revisión cazó el hallazgo 1, el 3 y un `NOTICE` copiado de otra skill con un pasaje ajeno.
