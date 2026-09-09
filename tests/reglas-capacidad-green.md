# Evidencia GREEN — las cinco reglas que el agente decide al azar (2026-09-09)

Verificación de la task [reglas-de-capacidad](../.docs/sdd/specs/20260909-180422-task-0000-reglas-de-capacidad/spec.md) (T17) tras el [RED](reglas-capacidad-red.md).

## Método

Mismo método que el RED, con la copia limpia del kit tras la Task 2 (sección «Reglas de la capacidad» en `funcional-template`, subsección en `spec-template`, punto (5 bis) en la lente dominio, fusión por nombre, bloque de cinco preguntas en `sdd-init-greenfield` y `generacion.md`).

**Spec.** Fixture "Ledgerly-reglas/green": la misma task 80, con la constitution calcada de lo que produciría la init nueva (sección «Reglas de producto»: pedidos en memoria y preferencias de operaciones en `localStorage`; claves en inglés y API en castellano; listados de 50 e **historiales con tope de 100**; aviso ante secreto en claro; manda el formulario) y `funcional/pedidos.md` con la sección rellena. Misma petición que el RED. Se cuenta cuántas de las cinco declara la spec y si el tope sale de las reglas escritas o se inventa.

**Entrevista.** Misma persona Haiku y mismo driver. Se cuenta cuántas de las cinco pregunta el agente por nombre.

## Resultados — spec

| | A (0,74 $ / 29 turnos) | B (0,92 $ / 36 turnos) |
| --- | --- | --- |
| Subsección «Reglas de la capacidad» en el delta | ✅ | ✅ |
| Dónde viven los datos | ✅ `localStorage`, «aplica la regla de producto de la constitution» | ✅ `localStorage`, «de las dos ubicaciones que ya fija la constitution … encaja en la segunda» |
| Idioma de los nombres | ✅ claves en inglés, mensajes en castellano | ✅ ídem |
| Límites | ✅ **100**, «aplica la regla de producto … historiales con tope de 100» | ✅ **100**, «coincide literalmente con la regla de constitution; no hay motivo para inventar un número distinto» |
| Avisos | ✅ no aplica | ✅ no aplica («no se guarda token ni contraseña») |
| Regla ante conflicto | ✅ no aplica | ✅ no aplica («una sola vía guarda el historial») |
| Declaradas | **5 de 5** | **5 de 5** |

Frente al RED (3 de 5, tope inventado: 5 y 10): los dos sujetos toman el tope y la ubicación de las reglas escritas y lo dicen, y las dos familias que nunca se les ocurrían (idioma, avisos) quedan decididas o marcadas «no aplica». Coste igual que el baseline.

## Resultados — entrevista

| | A (0,58 $ / 14 turnos) | B (0,61 $ / 14 turnos) |
| --- | --- | --- |
| Bloque producto | problema · roles · módulos · **«Ahora las 5 reglas de producto, una por una»** | problema · módulos · **«Cinco reglas de producto ahora, una a una. 1/5 — ¿Dónde viven los datos?»** |
| Preguntadas por nombre | **5 de 5** (T4–T8), antes del bloque stack | **5 de 5** (T3–T7), antes del bloque stack |
| Constitution con «Reglas de producto» | presentada en T14 (tope de turnos; no llegó a escribirse) | ✅ escrita: las cinco numeradas por nombre |

Frente al RED (1 de 5, y solo como persistencia en el bloque stack): las cinco se preguntan por nombre, en el bloque de producto y antes del stack.

**Deriva observada.** El agente ilustra cada pregunta con sus propios ejemplos, y dos se alejan del sentido del §2: *límites* como volumen y concurrencia («¿docenas, cientos, miles?», «¿un solo proceso o varios?») en vez de topes de producto (50 por listado, 100 por historial), y *avisos* como notificaciones de negocio («¿email al cliente al cambiar el estado?») en vez de avisos al usuario ante algo peligroso (un secreto en claro). La persona respondió a lo que se le preguntó, así que la constitution de B registra volumen y «sin notificaciones» donde el §2 esperaba topes y el aviso del token. → Segunda iteración: glosa breve de cada familia en la frase de `sdd-init-greenfield` y `generacion.md` (las mismas que ya llevaba `funcional-template`), y dos sujetos más.

## Resultados — entrevista, segunda iteración (con glosa)

| | C (0,39 $ / 12 turnos) | D (0,42 $ / 12 turnos) |
| --- | --- | --- |
| Preguntadas por nombre | **5 de 5** (T4–T9), en el bloque de producto | **5 de 5** (T4–T11), en el bloque de producto |
| Límites | «¿algún tope pensado ya? … tamaño máximo de fichero JSON, número de pedidos por página/listado» | «¿topes de tamaño/profundidad/resultados? … paginación de pedidos, límite de intentos de login» |
| Avisos | «¿avisar si se detecta un dato sensible (tarjeta, secreto) en claro en esos ficheros?» | «secreto en claro detectado, fallo al escribir el JSON, pedido duplicado» |
| Regla ante conflicto | «si el mismo pedido aparece con datos distintos en dos sitios … ¿qué manda?» | «si dos vías dan el mismo dato y no coinciden … ¿cuál manda?» |

Con la glosa, los ejemplos del agente son los del §2: topes y secreto en claro. Tope de 12 turnos: la constitution no llegó a escribirse en C ni D (lo medido es la pregunta, no el documento; B en la primera iteración ya mostró la sección escrita).

## Conclusión

**Spec 5/5 en los dos y el tope sale de las reglas escritas, no del azar.** Lo que el RED mostró (idioma y avisos ausentes, límite inventado y distinto en cada run) desaparece con la sección en el funcional, la subsección en la spec y las reglas en la constitution; los sujetos citan la regla que aplican. **Entrevista 5/5 por nombre en cuatro sujetos**, dos sin glosa y dos con ella; la glosa corrige el sentido de *límites* y *avisos* en los ejemplos del agente. Coste por sujeto igual o menor que el baseline (0,4–0,9 $).

Queda sin medir: brownfield (comparte la frase con greenfield, sin entrevista simulada propia) y la lente dominio con las cinco (el revisor solo corre si el usuario lo activa; el RED de spec ya no falla sin él).
