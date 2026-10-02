# GREEN — `sdd-grilling` (feature 0128)

## Micro-tests de redacción

`claude -p --model sonnet --setting-sources ""`, una llamada por muestra, con `--append-system-prompt` = `skills/sdd-grilling/SKILL.md` (con) o sin nada (control), 2026-10-02. Se leyeron a mano las 20 salidas.

| Frase | Mensaje que tienta el fallo | Control (sin guía) | Con la skill |
| --- | --- | --- | --- |
| «Alternativas reales, sin paja» | `salas`: «quiero poder exportar las reservas»; primera pregunta de diseño | 0 de 5 con paja: las alternativas eran defendibles. 5 de 5 recomiendan o suponen en una pregunta de para qué («Mi recomendación es CSV», «Mi suposición es (a)») | 0 de 5 con paja. 4 de 5 tratan el para qué como descubrimiento: abierta y sin recomendación. 1 de 5 (skill-5) va al formato con escena y 🔀, pero cierra con una segunda pregunta («¿Para qué vas a usar la exportación…?») |
| «Descubrimiento sin hechos: abierta, sin recomendación» | gimnasios, entrevista de misión: quién usa la app | 5 de 5 anclan: menú de cuatro perfiles (ctrl-1, 2, 3), «Mi propuesta de partida… Mi hipótesis es» (ctrl-4) o cuatro preguntas numeradas (ctrl-5) | 0 de 5 anclan; 5 de 5 una sola pregunta abierta («¿quién va a usar la app en el día a día?») |

- **«Sin paja»**: no se puede medir con este mensaje, porque el control tampoco tiene el fallo (Art. I). La línea se queda por evidencia de campo. En el brainstorm de esta feature, el agente (Opus) puso alternativas de relleno «para que hubiera tres», y el dev-lead lo señaló el 2026-10-01: «lo que se me ha ocurrido para poner 3 cosas… si hay más alternativas no tiene que centrarse en 3». La procedencia lo registra así.
- **La segunda pregunta tras ➡️** (skill-5) es el fallo R1 del RED. La rúbrica del GREEN lo mide en los escenarios.
