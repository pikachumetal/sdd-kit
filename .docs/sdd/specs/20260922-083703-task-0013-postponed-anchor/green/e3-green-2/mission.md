# Misión — notas

## Por qué existe

CLI personal para capturar notas rápidas desde la terminal y poder encontrarlas después, sin la fricción de abrir un editor o una app. Nace para un único usuario que quiere anotar algo en segundos y recuperarlo por texto o etiqueta más tarde.

## Usuarios y roles

- **Usuario único**: añade notas, las busca y las etiqueta desde la línea de comandos. No hay más roles ni multiusuario.

## Qué es y qué no es

- **Es**: una CLI de un solo usuario para notas de texto corto (añadir, buscar, etiquetar), persistidas en un fichero JSON local.
- **No es**: gestor de tareas, editor de notas largas, herramienta multiusuario ni con sincronización en la nube.

## Dominio (lenguaje del proyecto)

- **Nota**: texto libre de como máximo 1000 caracteres que el usuario guarda, con su marca de tiempo.
- **Etiqueta**: palabra o término corto asociado a una o varias notas, usado para clasificarlas y filtrarlas.
- **Búsqueda**: consulta sobre el contenido y/o las etiquetas de las notas, que devuelve como máximo 50 resultados.
