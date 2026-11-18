# Tasks — feature 0356

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Escenarios y RED | hecha | 2b02320 |
| 2 — Guía y GREEN | hecha | 01f5c76 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 01f5c76
Pasada de fix: juntada en el cierre, 6 Important y 8 Minor corregidos (texto y rúbrica, sin test que los reproduzca: re-medida de iq1–iq5 y batería interviewer); 3 Minor adjudicados
Re-revisión: 01f5c76..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, 15 de 15 resueltos; 2 Important nuevos (N1 arreglado, N2 adjudicado) y 2 Minor arreglados en el commit siguiente, sin revisar

## Rulings

- Task 1: Ruling: `IQ1` se escribe como `` `tools: /Write.*spec\.md/` `` presente — el plan dice «aparece en una llamada `Write`» y `verdict` aplica el regex a la llamada entera — si falla, la fila no distingue un Read de un Write y da rojo falso.
- Baseline: Ruling: gate `moon run kit:test-headless cli:typecheck cli:test` (sin --affected) → kit:test-headless 774/775, cli:typecheck y cli:test sin correr tras el rojo; el rojo es molds.test.ts «el molde salas3-current de sdd-upgrade (r1)», que develop arregla en ed7131e87 — sigo; el merge de sincronización del cierre lo trae — si no lo trae, el gate de cierre sale rojo y se ve allí.
- Task 1: Ruling: IQ2 reescrita a «da por decidido el umbral»; preguntar antes el porqué no falla — la fila exigía la pregunta del umbral en el primer turno y contradecía «El porqué va primero» — si falla, IQ2 deja pasar un sujeto que pregunte otra cosa y decida el umbral más tarde.
- Task 1: Ruling: la petición de un escenario admite <br> como salto de línea (subject.mjs, una línea) — una celda de tabla no admite saltos y un prompt de arranque los lleva — si falla, iq5 llega en una línea y mide otro prompt.
- Task 2: Ruling: a5 (control) pregunta la planta de cada sala en vez de escribir la spec — el molde no tiene plantas y es un dato que solo da el dev-lead: es la regla nueva, no una regresión — si falla, la regla hace preguntar datos que el agente podría inventar con razón, y A5 deja de medir su segunda mitad.
- Final: Ruling: despacho los ejes Spec y Código en paralelo sin preguntar — la spec no lleva «Política de modelos» (se aprobó en pair), pero la decisión 2 del plan aprobado nombra los dos ejes con su modelo y es la confirmación que pide el CLAUDE.md del dev-lead — si falla, gasto ~3 $ sin una confirmación explícita de paralelizar.
- Final: Ruling: Código M3 («Abierto» no está aún en la plantilla) — lo trae la 0357, acordado con su sesión — si la 0357 no se fusiona, la regla nombra una sección que ningún prompt lleva y no hace nada
- Final: Ruling: Código M4 (user frente a dev-lead; sin puntero a unattended) — el montón se llama como pidió la spec y unattended ya lo cubre control-profiles.md:67 — si falla, un lector duda de si el usuario y el dev-lead son la misma persona
- Final: Ruling: Código M5 (iq4 con n = 1) — se sube a n = 2 en la re-medida, pendiente de aprobación — si falla, el «pendiente» se apoya en un solo sujeto
- Final: Ruling: palabras 13.926 de 13.927 tras recortar «as any other» de «Starting right away» — el tope no sube — si falla, la frase pierde el matiz de que el gate es el de siempre
- Final: Ruling: Spec I3 cerrado — enmienda del THEN aprobada por el dev-lead (opción 1, 2026-11-19), en la pasada de fix.
- Final: Ruling: N2 (IQ3 «segunda pregunta» e IQ6 «pregunta antes de la spec») — los pidió el revisor del desvío (hallazgo 5) para que las filas casen con sus AND; los veredictos RED y GREEN de iq3 e iq4 se juzgaron con las filas viejas y la re-medida los juzga con las nuevas — si falla, RED y GREEN de esas dos filas no se comparan con la misma vara
- Final: Ruling: la re-medida (iq1–iq5 e interviewer) mide el texto de la pasada de fix, no el de N1 — N1 devuelve la frase literal de la fuente (as territory, not a script), que estaba en la base y pasaba sus baterías, y solo quita presión de preguntar en iq2; repetir costaría ~2 $ fuera de la previsión — si falla, iq2 pregunta los anti-goals con el texto final y nadie lo ha medido
- Final: Ruling: fp-1 rojo en K — el sujeto para en la clasificación por la premisa falsa y no llega al paso 4, donde vive spec-writing.md; con n = 5 y un rojo, la fila no separa textos (0342) — si falla, el cambio haría que propose pregunte antes de cargar grilling, y fp lo vería en más sujetos
