# Misión — notas

## Por qué existe

CLI personal para tomar notas rápidas desde la terminal sin salir de ella, y volver a encontrarlas después. Nace porque abrir una app de notas para apuntar algo de dos líneas es fricción; el terminal ya está abierto.

## Usuarios y roles

- **Usuaria/usuario único**: única persona que usa la herramienta. Añade notas, las busca y las etiqueta. No hay roles distintos ni multiusuario.

## Qué es y qué no es

- **Es**: CLI de un solo usuario para añadir, buscar y etiquetar notas de texto corto desde la terminal.
- **No es**: no es una app multiusuario, no sincroniza entre máquinas, no edita ni borra notas (fuera del alcance inicial), no es un gestor de tareas ni un editor de texto largo.

## Dominio (lenguaje del proyecto)

- **Nota**: entrada de texto de hasta 1000 caracteres, con fecha de creación y cero o más etiquetas.
- **Etiqueta**: palabra corta asociada a una nota para clasificarla y poder filtrarla al buscar.
- **Búsqueda**: consulta por texto y/o etiqueta que devuelve como máximo 50 notas.
- **Almacén**: fichero JSON en el home del usuario donde viven todas las notas.
