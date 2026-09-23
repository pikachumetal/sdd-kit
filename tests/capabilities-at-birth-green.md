# GREEN — capacidades al nacer (task 0033)

Mismos frentes que [`capabilities-at-birth-red.md`](capabilities-at-birth-red.md), con el kit de la rama (Tasks 1–3, hasta `e174219`).

**Método**: seis escenarios de un turno, 2 sujetos Sonnet headless cada uno, lanzados con [`green/driver.py`](../.docs/sdd/specs/20260923-105726-task-0033-capabilities-at-birth/green/driver.py). Detalle completo, salidas y descartados en [`green/README.md`](../.docs/sdd/specs/20260923-105726-task-0033-capabilities-at-birth/green/README.md).

## Veredicto por THEN

| Escenario | THEN | Resultado | Evidencia |
| --- | --- | --- | --- |
| G1 volcado pedido, sin partición previa | propone la partición (slugs ingleses, sustantivo de dominio) y para sin escribir nada en `capabilities/` | **2/2** | `g1a2`, `g1b2` |
| G2 volcado con partición ya acordada | escribe las capacidades con `- <fecha> — init — ADDED volcado inicial desde el código` y las presenta antes de seguir | **2/2** | `g2a2`, `g2b2`: línea de historial literal en las 4×2 capacidades |
| G3 brownfield pide volcado (control) | se niega, capacidades crecen task a task | **2/2** | `g3a`, `g3b` |
| G4 greenfield sin petición de volcado | no crea `capabilities/`, no lo ofrece | **2/2** | `g4a2`, `g4b2`: «no hay volcado inicial salvo que lo pidas» |
| G5 greenfield con funcional aportado | `sources/<fichero>` idéntico al original, enlazado desde mission, citado en el roadmap; sin `capabilities/`, `specs/` ni `.gitkeep` | **2/2** | `g5b2`, `g5e`: `diff` sin salida contra `molds/gym/funcional-cliente.md` |
| G6 brownfield completo, sin petición | sin `capabilities/`, `specs/` ni `.gitkeep` al cerrar | **2/2** | `g6a3`, `g6b3` |

## Recuperación de sesión

El primer lote (10 de 12 sujetos) se lanzó en segundo plano en una sesión que murió antes de que los procesos `claude -p` cerraran: streams `.jsonl` sin evento `result`, coste 0 y `git log` vacío en el `state.txt`. Solo los dos sujetos más rápidos (`g3a`, `g3b`) llegaron a terminar. Se relanzaron uno por uno en la sesión siguiente, con dos arreglos al arnés (no al texto de las skills): `driver.py` gana `PowerShell(*)` en `--allowedTools`, porque un sujeto que sigue el hábito de la máquina de usar PowerShell para git se quedaba bloqueado sin poder terminar; `requests/g6.txt` gana la instrucción de tomar la opción recomendada en las preguntas de control, porque sin ella el sujeto se paraba en la primera pregunta sin llegar al punto que mide el escenario.

Un bloqueo de permiso de lectura sobre `molds/gym/*.md`, ajeno a ambos arreglos, apareció en 3 de 5 intentos de G5 (`g5a2`, `g5c`, `g5d`); relanzando el mismo sujeto sin cambios pasó limpio 2 de esas 3 veces más (`g5b2`, `g5e`). Ruido del entorno: no hay guidance de skill ni cambio de driver que lo explique, y los dos sujetos que sí terminan cumplen el escenario entero. Va a la deuda del roadmap junto con el resto de bloqueos de `-p` ya documentados en la 0019.

## Coste

GREEN: 6,20 $ en los 12 sujetos válidos (0,34 $ del primer lote, `g3a`/`g3b`, más 5,86 $ del relanzamiento). Los sujetos descartados del relanzamiento (`g5a2`, `g5c`, `g5d`, `g6a2`, `g6b2`) suman 1,52 $ más; el resto del primer lote (10 sujetos que se cortaron con la sesión) no llegó a costar nada. Con el RED previo (3,73 $), la task lleva 11,45 $ de un techo de 20 $.
