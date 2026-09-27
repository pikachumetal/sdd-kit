# Constitution — notas

## Principios

1. Nunca se pierde una nota: toda escritura en el almacén es atómica (fichero temporal + rename), nunca una escritura parcial a pelo sobre el JSON.
2. Tests en verde antes de cada commit. Ningún commit se hace con `node --test` en rojo.
3. Los tests son la puerta de entrada: TDD, primero el test que falla.

## Convenciones

- **Idioma**: nombres de comandos y mensajes al usuario en castellano. Identificadores de código (variables, funciones, ficheros) en inglés, siguiendo el resto de instrucciones del entorno.
- **Ramas**: git-flow con `main` (estable), `develop` (integración) y `feature/<id>` desde `develop`. Sin worktrees.
- **Commits**: `tipo: descripción` en castellano (p. ej. `feat: añadir comando de etiquetado`), sin gestor de tickets — el id es el de la numeración propia (`sequence`) del proyecto.

## Reglas de producto

- **Dónde viven los datos**: fichero JSON único en el home del usuario (p. ej. `~/.notas.json`).
- **Idioma de los nombres**: comandos y mensajes de la CLI en castellano.
- **Límites**: una nota ocupa como máximo 1000 caracteres; una búsqueda devuelve como máximo 50 resultados.
- **Avisos**: decidido en la init (el usuario no tenía respuesta) — la CLI avisa por consola cuando (a) una nota se rechaza por superar los 1000 caracteres, y (b) una búsqueda no encuentra resultados o los trunca a 50. No hay más avisos por ahora; se amplía si aparece un caso real.
- **Regla ante conflicto**: no aplica — una única fuente de datos (el fichero JSON), sin réplicas ni sincronización que puedan discrepar.
