# Constitution — statusline

## Principios

1. Retrocompatibilidad por defecto: no romper el contrato stdin/stdout que usa Claude Code para invocar el script.
2. Respetar el patrón existente aunque no sea ideal (p. ej. seguir sin `package.json` hasta que haya decisión explícita).
3. Cero refactor oportunista: cada task se ciñe a su alcance.
4. Migraciones masivas solo con justificación escrita.
5. *(observado, a confirmar)* Funciones puras en `lib/`, sin dependencias externas.
6. *(observado, a confirmar)* Toda función de formateo nueva lleva test en `node:test`.

## Convenciones

- **Idioma**: comentarios de código en castellano, identificadores en inglés, commits con tipo en inglés y descripción en castellano (visto en `feat: statusline con modelo, rama y coste`).
- **Ramas**: solo `master` — sin convención observable todavía (pendiente).
- **Commits**: Conventional Commits.

## Reglas de producto

- **Dónde viven los datos**: no aplica — sin persistencia, todo llega por stdin en cada invocación.
- **Idioma de los nombres**: identificadores de código y nombres de fichero en inglés.
- **Límites**: pendiente (sin topes definidos, p. ej. truncado de una rama con nombre largo).
- **Avisos**: pendiente (`gitBranch` traga cualquier error en silencio, catch vacío; no hay decisión de si debe avisar).
- **Regla ante conflicto**: no aplica (una sola fuente de datos por campo).
