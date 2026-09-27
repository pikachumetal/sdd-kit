# Mission

## Por qué existe

`statusline` pinta, de un vistazo, el modelo activo, la rama git y el coste
acumulado de la sesión en la barra de estado de Claude Code. Sin esto, esos
tres datos hay que ir a buscarlos por separado; con esto, están siempre a la
vista mientras se trabaja.

## Usuarios y roles

- Uso personal: el autor y hasta dos compañeros.
- Sin roles diferenciados — todos usan la misma herramienta de la misma forma,
  sin permisos ni vistas distintas.

## Alcance actual (MVP)

Tres campos: modelo, rama git, coste de sesión. Ver `roadmap.md` para lo que
viene después de validar el MVP.

## Dominio y glosario

- **Statusline**: línea de estado que Claude Code invoca pasándole por stdin
  un JSON con el contexto de la sesión (`input.model`, `input.workspace`,
  `input.cost`) y que espera de vuelta una cadena de texto por stdout.
- **Sesión**: la invocación de Claude Code en curso; su coste y su directorio
  de trabajo (`workspace.current_dir`) llegan en cada llamada, no se
  almacenan entre llamadas.
