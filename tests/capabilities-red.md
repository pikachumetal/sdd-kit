# RED — ciclo de vida de capacidades (task 0003)

Baseline: el kit de `develop` sin cambios (v1.1.0 + tasks 0001, 0002 y 0011), servido desde una copia limpia con `--plugin-dir`. Sujetos headless `claude -p --model sonnet`, dos por escenario, cada uno sobre una copia fresca del molde con `git init`. Diez sujetos, 7,48 $ en total.

Moldes, lanzador y lo que produjo cada sujeto (diff contra la base e informe final): [`red/`](../.docs/sdd/specs/20260921-081125-task-0003-cap-lifecycle/red/). Proyecto ficticio: «Aulario», reserva de aulas de una academia.

## Escenarios

| Id | Molde | Petición | Qué mide |
| --- | --- | --- | --- |
| E1 | `m1` | «Arranca la task 0004 del roadmap… escribe la spec y para en el gate» | Nacimiento: capacidad cajón con el nombre del producto (`aulario`) y precedente escrito «no se crea capacidad nueva, como en 0001 y 0002»; task con dominio propio (avisos por email: plantillas, cola, cuota, registro) |
| E2 | `m2` | «He probado la task 0005… Funciona. Cierra la task» | Fusión al cierre: `MODIFIED` aditivo que cita solo una cláusula y dice «se conserva todo lo anterior», entrada de reglas con una frase añadida, `legacy.md` que describe el comportamiento tocado, valor construido (12 h) distinto del delta (24 h), plan que pide «documentar los tiempos en tech-stack» |
| E3 | `m3` | «El patch 0007 está aplicado… Cierra el patch» | Carril patch: el fix cambia un requisito de `bookings` por decisión del usuario en una frase |
| E4 | `m5` | «Arranca la task 0006… escribe la spec» | Escritura de un `MODIFIED`: la task añade un aviso a un requisito existente con dos `AND` |
| E5 | `m6` | «Los profesores no pueden reservar en sábado… Arréglalo» | Frontera patch/task: el arreglo exige cambiar lo que dice la capacidad |

Volcado inicial de capacidades: sin escenario. El RED es el caso real de campo del ticket del statusline (N=1): con el kit prohibiéndolo, el agente lo hizo a petición del usuario e improvisó la línea de historial. Sale del alcance por el recorte (abajo).

## Resultados

| Fallo buscado | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| Fusiona un dominio propio en la capacidad cajón | E1 | capacidad nueva | capacidad nueva | **No falla** |
| No declara la decisión de capacidad | E1 | declarada (decisión 10) | declarada (decisión 6) | **No falla** |
| Calla la capacidad nueva para bajar el nivel de review | E1 | la cuenta como señal | la cuenta como señal | **No falla** |
| **Slug de la capacidad nueva en inglés** | E1 | `avisos` | `avisos` | **Falla 2/2** |
| No fusiona el delta al cerrar | E2 | fusiona | fusiona | **No falla** |
| El `MODIFIED` aditivo recorta los `AND` vigentes | E2 | los conserva | los conserva | **No falla** |
| La entrada de reglas pierde su texto anterior | E2 | la conserva entera | la conserva entera | **No falla** |
| Fusiona el valor del delta y no el construido | E2 | 12 h | 12 h | **No falla** |
| Deja en `legacy.md` lo que ya fusionó | E2 | lo retira | lo retira | **No falla** |
| **Copia valores de comportamiento a `tech-stack.md`** | E2 | «caducidad a los 30 minutos; recordatorio 12 horas antes» | «Caducidad de una reserva `pending`: 30 minutos… Antelación del recordatorio: 12 horas» | **Falla 2/2** |
| El patch no toca la capacidad | E3 | `MODIFIED` + historial `patch 0007` | `MODIFIED` + historial `patch 0007` | **No falla** |
| `patch.md` no registra el delta | E3 | no lo registra | no lo registra | Forma, no conducta: la fusión se hizo |
| Escribe un `MODIFIED` parcial | E4 | lo modela como `ADDED` | lo modela como `ADDED` | **No falla** (sin `MODIFIED` que medir) |
| Trata como patch un cambio de requisito | E5 | task («abrir el sábado cambia un requisito, así que va como task») | task | **No falla** |

## Racionalizaciones textuales de los dos fallos

- **Slug** (E1): «Capacidad nueva `avisos`. Plantillas, cola, cuota y registro son un solo sustantivo del dominio.» Los dos aplicaron bien la regla de `capability-template.md` («un sustantivo del dominio») y ninguno la del idioma, que solo vive en `migrations/v1.1.0.md`. La constitution del molde fija «API y claves en inglés; mensajes en castellano», y el sujeto no la trasladó al nombre de fichero.
- **Tech-stack** (E2): los dos ejecutaron la Task 3 del plan del molde («documentar en `tech-stack.md` … los tiempos») y copiaron los valores que acababan de fusionar en `bookings.md`. Nada en el kit dice que el comportamiento observable vive solo en `capabilities/`; el sujeto 2 lo remató con «constantes en código, no configurables por entorno», que es a la vez lo técnico (dónde está la constante) y el comportamiento (el valor).

## Positivos que no necesitan guidance

- La nota de excepción al principio de `legacy.md` basta: los dos la leyeron y la cumplieron. Un `references/` o un paso nuevo no aportan nada.
- Ante un `MODIFIED` aditivo que el kit manda aplicar «sustituyendo», los dos fusionaron añadiendo: el mismo desvío sensato que el agente de campo del ticket de la task 0008. La contradicción entre la letra de la plantilla y la conducta existe, pero el fallo es de la plantilla, no del agente, y ningún sujeto la escribió al redactar (E4).
- La decisión de capacidad y la frontera patch/task ya salen de `sdd-start-task` paso 4 y de `sdd-start-patch` («sin interpretación de requisitos»).

## Recorte (Art. I), aprobado por el dev-lead el 2026-09-21

Entra solo la guidance de los dos fallos:

1. **El slug de una capacidad nueva es un sustantivo en inglés kebab-case**, escrito donde se crea: `spec-template.md`, `capability-template.md` y `sdd-start-task` paso 4.
2. **El comportamiento observable vive solo en `capabilities/`; los anclajes enlazan, no copian**: `spec-template.md`, `plan-template.md` y el paso de aprendizajes de `sdd-end-task`, con su red flag.

Sale todo lo demás de la spec aprobada: línea fija de capacidad, test de pertenencia, cambio de la rúbrica y punto 8 de la lente dominio, paso de fusión propio en task y patch, `MODIFIED` de bloque entero y `(retira: …)`, alarma de fusión, frontera patch/task, sitio único (skill o referencia), volcado inicial y el validador `Test-Capabilities.ps1` (implementado en `79bec32` y revertido en `ca51ef4`: los errores que vigila no aparecieron, y el único fallo de nombre, `avisos`, es kebab-case ASCII válido).

**Límite de la muestra**: dos sujetos por escenario, en sesiones limpias. Los fallos de campo salieron en sesiones largas con subagentes y más contexto acumulado. Si vuelven a aparecer en campo, el ticket de `sdd-feedback` es la vía para reabrirlos con esta evidencia como baseline.
