# GREEN — `sdd-grilling` (feature 0128)

## Micro-tests de redacción

`claude -p --model sonnet --setting-sources ""`, una llamada por muestra, con `--append-system-prompt` = `skills/sdd-grilling/SKILL.md` (con) o sin nada (control), 2026-10-02. Se leyeron a mano las 20 salidas.

| Frase | Mensaje que tienta el fallo | Control (sin guía) | Con la skill |
| --- | --- | --- | --- |
| «Alternativas reales, sin paja» | `salas`: «quiero poder exportar las reservas»; primera pregunta de diseño | 0 de 5 con paja: las alternativas eran defendibles. 5 de 5 recomiendan o suponen en una pregunta de para qué («Mi recomendación es CSV», «Mi suposición es (a)») | 0 de 5 con paja. 4 de 5 tratan el para qué como descubrimiento: abierta y sin recomendación. 1 de 5 (skill-5) va al formato con escena y 🔀, pero cierra con una segunda pregunta («¿Para qué vas a usar la exportación…?») |
| «Descubrimiento sin hechos: abierta, sin recomendación» | gimnasios, entrevista de misión: quién usa la app | 5 de 5 anclan: menú de cuatro perfiles (ctrl-1, 2, 3), «Mi propuesta de partida… Mi hipótesis es» (ctrl-4) o cuatro preguntas numeradas (ctrl-5) | 0 de 5 anclan; 5 de 5 una sola pregunta abierta («¿quién va a usar la app en el día a día?») |

- **«Sin paja»**: no se puede medir con este mensaje, porque el control tampoco tiene el fallo (Art. I). La línea se queda por evidencia de campo. En el brainstorm de esta feature, el agente (Opus) puso alternativas de relleno «para que hubiera tres», y el dev-lead lo señaló el 2026-10-01: «lo que se me ha ocurrido para poner 3 cosas… si hay más alternativas no tiene que centrarse en 3». La procedencia lo registra así.
- **La segunda pregunta tras ➡️** (skill-5) es el fallo R1 del RED. La rúbrica del GREEN lo mide en los escenarios.

## GREEN de la batería

Kit en `6cc7dc7c` (con `sdd-grilling` y las seis llamantes), superpowers 6.4.2 aislado, Sonnet, 2026-10-02. Salidas en `.docs/sdd/specs/20261002-141929-feature-0128-sdd-grilling/green/out/`.

- **Sujetos**: 19. **Coste**: 4,44 $.
- **Puerta**: 18 de 19. u1 («Pensemos bien cómo debería funcionar la lista de espera») entra por `sdd-start-feature`, no por `sdd-consult`. Su control (C4: la puerta no es `sdd-grilling`) pasa; lo que estaba mal elegido era el «Esperado» de la batería.
- **`sdd-grilling` cargada**: 15 de 19.
  - No carga en g4 (2), porque `sdd-roadmap` pregunta fuera de su paso de entrevista, y una petición de dos filas no es «algo grande».
  - No carga en g6 (2), porque el rechazo cae en la pregunta de carril, antes del diseño.
  - k1 y u1 no la necesitan.

## REFACTOR

Kit en el commit `fix(sdd-grilling): cerrar huecos del GREEN`. 6 sujetos (g9 ×2, g6 ×2, g1, g2) y 2,57 $. Contras añadidos:

- R11: probarlo en otra versión que la del proyecto no cuenta, y «no verificado» solo vale sin MCP ni web.
- R1: una pregunta tras ➡️ es una segunda decisión.
- R12: los anuncios de skill, en el idioma del usuario.
- R3: una alternativa de «no creo que la quieras» es relleno.

g6 pasa a rechazar la primera decisión de diseño (tercer turno).

## Resultado por fila: RED → GREEN (+ REFACTOR)

| Fila | RED | GREEN | Evidencia del GREEN |
| --- | --- | --- | --- |
| R1 Una decisión por turno | 4 de 16 fallan | 1 de 13 con la skill cargada (g9-2: «¿Qué herramienta…?» y después «Decisión: ¿para qué vas a usar la cobertura?»). El contra, en el REFACTOR; g1 limpio | g8 aplica el empate: «Es un empate que depende de un dato que solo tienes tú… ¿Trabajáis con un gestor de tickets?» |
| R2 Formato | sin forma común (17) | ❓ · 🅰️/🅱️ · ➡️ en g1, g3-2, g7, g8 y g9 | g1-1 usa «🅲» en vez de 1️⃣ 2️⃣ 3️⃣ (menor) |
| R3 Alternativas reales | dudoso, 2 | 1 (g1-1 🅲: «Es lo más barato, pero no creo que lo quieras») → REFACTOR g1: 0 | micro-test sin separación: el control tampoco pone paja |
| R4 La recomendada con razón | 2 de 9 | 0 | g7-1: «Recomiendo 🅰️, porque `develop` es la rama de integración… A cambio, el push sale sin que lo revises antes» |
| R5 Descubrimiento sin ancla | 4 de 4 | 0 de 2 (g2) | g2-2: «¿Qué problema resuelve la app…? Cuéntamelo con tus palabras», sin menú |
| R6 Escena concreta | 2 de 2 | 0 de 1 con alternativas (g3-2) | g3-2: «`cancelar lun 10:00-12:00` → `cancelada…; Norte pasa a tu nombre (estabas 1.º en espera)`». g3-1 pregunta el para qué en abierto, sin alternativas |
| R7 Rebatir una vez (control) | 0 de 2 | 0 de 2 | g4-2: «Mantienes que no existe, así que la he apuntado tal cual» |
| R8 «Decide tú» | 2 de 2 | 0 de 2 | g5-1: «Si propusiera «clínicas pequeñas con agenda en papel»… estaría inventando el proyecto. Por eso el problema y los usuarios quedan **pendientes**» |
| R9 Rechazo en texto | 1 de 2 | REFACTOR: 0 de 2 | g6-1: «Te lo explico sin menú de opciones» y cierra con una sola pregunta. g6-2 explica en prosa con 🅰️/🅱️/🅲 dentro del texto, sin bloque de formato, y no carga `sdd-grilling` (solo `brainstorming`) |
| R10 Cuándo para | 2 de 2 | 0 de 2 | g7-1 y g7-2 cierran con «Decidido por ti / Decidido por mí / Pendiente» |
| R11 Busca fuera | 2 de 2 | 2 de 2 en la batería (antes del contra: «Lo que sé de Node 22 no lo he verificado»). REFACTOR: no medible, porque g9 no cargó la skill (`sdd-consult` contestó directamente). Micro-test con el contra: **3 de 3 buscan con la skill, 0 de 3 sin ella** | skill-3: «Esto es lo que encontré en la [documentación de Node 22](https://nodejs.org/docs/latest-v22.x/api/test.html)» |
| R12 Idioma | 3 de 17 | 3 de 19 · REFACTOR 3 de 6 | siempre el primer mensaje, «Using sdd-kit:sdd-start-feature para…», antes de cargar `sdd-grilling`: sale de `using-superpowers`. A deuda |
| C1 Tabla de claves | 0 de 2 | 0 de 2 | — |
| C2 Sin spec | 0 de 2 | 0 de 2 | g4: solo `roadmap.md` |
| C3 Pregunta puntual | — | 0 de 1 (k1 contesta) | — |
| C4 Enrutado | — | 0 de 1 (u1 → `sdd-start-feature`) | — |

## Lo que queda abierto (va al roadmap como deuda)

- **El anuncio de `using-superpowers` sale en inglés** («Using sdd-kit:sdd-start-feature para…»), en 3 de 6 a 3 de 19 sujetos según la tanda, antes de que cargue ninguna skill del kit. Encaja con la 0121, que adelgaza `using-sdd` y decide el idioma.
- **La invocación no carga siempre**: `sdd-consult` contestó g9 sin entrevista 2 de 4 veces, y en el diseño de `sdd-start-feature` 1 de 6 pasó por `brainstorming` sin `sdd-grilling` (refactor g6-2).
- **`sdd-roadmap` hace varias preguntas a la vez fuera de su entrevista** (g4: RED 2 de 2, GREEN 1 de 2), en un paso que la congelación no deja tocar.

Coste total de la campaña: RED 3,74 $ + GREEN 4,44 $ + REFACTOR 2,57 $ + micro-tests ~1 $ ≈ **11,8 $**, 44 sujetos en la batería y 26 llamadas de micro-test (previsión: ~48 $ y techo de 60 $).
