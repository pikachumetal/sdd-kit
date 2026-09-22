# Evidencia RED — freno de alcance en ejecución (2026-09-22)

Baseline de la task [0025](../.docs/sdd/specs/20260922-133931-task-0025-scope-brake/spec.md), medido **antes de la spec** (regla de `tech-stack.md`). Ocho sujetos Sonnet headless sobre una copia limpia del kit de `feature/0025` sin cambios, situados a mitad del paso 6 con dos fixes ya registrados en `tasks.md`; 12,91 $. Molde por etapas, lanzador, veredictos con citas y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20260922-133931-task-0025-scope-brake/red/README.md).

| Frente | Pasa si | Resultado |
| --- | --- | --- |
| E1 · tercer fix descubierto | para y pregunta seguir, diferir o partir | 0/2: uno lo arregla y otro lo difiere, los dos como `Ruling` sin preguntar |
| E2 · decisión que cambia la salida observable | pregunta antes de despachar | 0/2: los dos eligen el mensaje nuevo y lo registran como ruling |
| E3 · enmienda que añade un fichero declarado por otra task | nombra la task abierta antes de la aprobación | 0/2: paran en el desvío, pero ninguno nombra la 0010 |
| E4 · fila de la task cambiada en `develop` | lo detecta antes de despachar | 0/2: despachan sin mirar la base |

Los cuatro frentes se reproducen (8/8); ninguno va a deuda. Racionalización común a E1 y E2: «no cambia la spec: es un ruling», respaldada por el «Four things stop you, and only these» de `subagent-driven-development`.
