# Constitution — statusline

## Principios

1. **Retrocompatibilidad por defecto** — el JSON de entrada lo controla Claude Code, no este proyecto; un cambio de formato de entrada se soporta con campos opcionales (`?.`), nunca rompiendo la lectura de sesiones antiguas.
2. **Respetar el patrón existente aunque no sea ideal** — no se reescribe `lib/git.js` o `lib/format.js` a otro estilo porque sí; una task cambia lo que su alcance pide.
3. **Cero refactor oportunista** — un cambio de comportamiento no arrastra limpiezas no pedidas en el mismo commit.
4. **Migraciones masivas solo con justificación escrita** — cualquier cambio que toque los tres ficheros a la vez necesita spec propia, no un "ya que estoy".
5. **Fallos en integraciones externas degradan, nunca rompen** (observado en `gitBranch`: un `execSync` fallido devuelve `''`, no lanza) — una statusline que revienta el proceso de Claude Code es peor que una statusline incompleta.
6. **Sin dependencias externas** (observado: cero entradas en `package.json`/`node_modules` fuera de `node:*`) — cualquier nueva dependencia es una decisión que se justifica en la spec de la task, no se añade por comodidad.

## Convenciones

- **Idioma**: comentarios y README en castellano; identificadores de código (funciones, variables) en inglés.
- **Ramas**: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: tipo Conventional Commits en inglés (`feat:`), asunto en castellano (ejemplo observado: `feat: statusline con modelo, rama y coste`).

## Reglas de producto

- **Dónde viven los datos**: no aplica — no hay almacenamiento propio; el único dato es el JSON de sesión que Claude Code entrega por stdin en cada invocación, no se persiste nada.
- **Idioma de los nombres**: identificadores de código en inglés; texto humano (comentarios, README, commits) en castellano.
- **Límites**: pendiente — no hay topes de tamaño observados (p. ej. una rama git con nombre muy largo no se trunca).
- **Avisos**: propuesta — ningún aviso visible al usuario; un fallo (git no disponible, campo de entrada ausente) degrada a segmento vacío en silencio, sin mensaje de error en la statusline.
- **Regla ante conflicto**: no aplica — cada segmento sale de una única fuente (modelo del input, rama de `git`, coste del input); no hay dos vías que den el mismo dato.
