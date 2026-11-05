---
id: 20261105-125409-feature-0315-copies-reader-and-guards
title: Tasks — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — kit:copies no deja pasar un bloque que se come el original, y los lectores de skills/ y los own con texto de terceros dan rojo (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0315-copies-reader-and-guards`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | kit:copies: el cierre en `fin`, la racha y `kit:dist-compare` | done | 7b5698e8 | enmienda del 2026-11-05: la racha vale para add y sustituye; caso real de sdd-worktrees en rojo |
| 2 | Los lectores de `skills/` y `skills.test.ts` sobre `dist/skills/` | done | f8ae0774 | experimento de la inclusión: antes pasaba, ahora rojo con el enlace |
| 3 | kit:upstream: un `own` con una línea literal de una fuente da rojo | done | 2a948b9a | 0 líneas literales en los 22 own; kit:upstream igual que develop |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura opus+high, con arreglos, sobre 2a948b9a
Pasada de fix: juntada en el cierre, 15 hallazgos (1 RED→GREEN, 4 tests de guarda nuevos, el resto refactor y docs; 4 rulings), suite 2229/2229
Re-revisión: 2a948b9a..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, 19/19 resueltos y 1 Important nuevo (abbreviate duplicada), arreglado en el cierre (sin revisar)

## Rulings

- Task 1: Ruling: el Review Focus «fin dentro de una valla posterior» es el mismo caso que «la marca siguiente no es fin»: va en ese test — si es incorrecto: un caso sin test propio
- Task 1: Ruling: enmienda aprobada («ok», 2026-11-05): la racha vale para add y sustituye — va en el commit de la Task 1
- Task 1: Ruling: el fixture sdd-annotated-v7.0.0.md de la 0302 tenía un sustituye sin fin a mitad de lista que se comía 9 líneas del original (línea 148): se cierra con fin antes de «ledger at the old flat path»; el experimento lento sigue con sus 2 conflictos — si es incorrecto: el fixture deja de ser el de la 0302 byte a byte
- Task 1: Ruling: una marca con un rojo de su cita (A+C, cita que no cuadra) no recibe además el de la racha: un rojo por marca, y manda el de la cita — si es incorrecto: una racha queda tapada hasta arreglar la cita
- Task 2: Ruling: la copia RED de skills-readers.test.ts difiere en el cuerpo de skillsReaders (6+/1-), que vive en el propio test por el plan; los asserts y los nombres no cambian — si es incorrecto: nada, el contrato es el mismo
- Task 3: Ruling: kit:upstream ya sale en rojo en develop con 6 líneas «cambian sus rutas» (fuentes subidas: 0296, 0306, 0313, 0314, 0297); la rama da las mismas 6 y ninguna de línea literal — «lo mismo que hoy» del Intent; el «pasan» del prompt de arranque no se cumple ni en develop — si es incorrecto: ninguno, la herramienta no cambia esas líneas
- Final: Ruling: el bloque «De código» del plan llevaba el mensaje de antes de la enmienda («el bloque add lleva»); se corrige a «el bloque lleva», el de la spec enmendada, y así viaja a los ejes — si es incorrecto: ninguno, la spec manda
- Final: Ruling: el Review Focus 1 del plan decía que un fin dentro de una valla posterior sin otra marca antes no alarga el bloque; la spec dice que el bloque acaba en fin si es la marca siguiente, y manda la spec: el test fija el caso en que la marca siguiente es la que abre el bloque de la valla — si es incorrecto: un bloque del texto que cruza una valla hasta un fin interior sale con otro rojo, no en verde
- Final: Ruling: una ruta que no está ni en la base ni en el árbol sale «igual», y sin rutas o con --base sin valor la orden no avisa (Código m-3, Spec m-6, Arquitectura m-7 y m-8): la spec fija que un fichero que no está en la base cuenta como vacío, y un aviso nuevo sería un THEN que no tiene; va a residuales — si es incorrecto: una ruta mal escrita da un «igual» falso
- Final: Ruling: la rama de fallo de git grep queda sin test (Código m-2): provocarla pide un clon roto; la versión ausente, su causa probable, ya no llega a git grep — si es incorrecto: un mensaje mal formado sin test
- Final: Ruling: skills-readers no ve una lectura por una variable que no se llama repoRoot (Código m-9): la línea que define skillsRoot con join(repoRoot, 'skills') sí casa, y basta una lectura por fichero, porque el arreglo es de fichero entero — si es incorrecto: un lector con otro nombre de raíz pasa
- Final: Ruling: en un empate, paragraphDiff saca antes el «-», y compare-dist.mjs sacaba antes el «+» (Spec m-2): mismo diff, otro orden, como git diff — si es incorrecto: nada, cambia solo el orden de dos líneas
