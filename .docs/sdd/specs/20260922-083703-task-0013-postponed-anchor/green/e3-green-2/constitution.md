# Constitution — notas

## Principios

1. Los tests están en verde antes de cada commit.
2. Nunca se pierde una nota: cualquier escritura en el fichero JSON preserva las notas existentes aunque la operación falle a mitad de camino.

## Convenciones

- **Idioma**: interfaz, mensajes y documentación en castellano. Código (variables, funciones, clases) en inglés; comentarios en castellano. Commits: tipo/scope en inglés, título y cuerpo en castellano.
- **Ramas**: git-flow — `main` (estable), `develop` (integración), `feature/<id>` (desde `develop`).
- **Commits**: tipo/scope en inglés (`feat`, `fix`, ...); título y cuerpo en castellano.

## Reglas de producto

- **Dónde viven los datos**: fichero JSON en el home del usuario.
- **Idioma de los nombres**: nombres de comandos y mensajes en castellano.
- **Límites**: una nota ocupa como máximo 1000 caracteres; una búsqueda devuelve como máximo 50 resultados.
- **Avisos**: pendiente — no se ha decidido qué se avisa al usuario ni cuándo.
- **Regla ante conflicto**: no aplica.
