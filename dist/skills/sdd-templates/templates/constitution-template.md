# Constitution — <proyecto>

> Principios no negociables del proyecto. La constitution manda sobre cualquier spec. En greenfield sale del bloque de principios de la entrevista; en brownfield, de las convenciones observadas, marcadas como propuesta hasta que el dev-lead las apruebe. Borra los bloques de ayuda (`>`) al redactar.

## Principios

> El preámbulo: de tres a cinco principios que orientan todo lo demás, uno por línea, sin explicación larga.

1. <principio>

## Artículos

> Lo innegociable (datos, migraciones, commits, seguridad, tests), un artículo por regla: la regla en una o dos frases y su porqué en una sola. La historia de la regla (cuándo y por qué se fue formando, qué se descartó) no va aquí: va a una ADR de `.docs/sdd/decisions/`, que el artículo enlaza.

### Art. I — <nombre de la regla>

<la regla>

*Por qué*: <una frase>. [ADR NNNN](../decisions/NNNN-<slug>.md)

## Convenciones

- **Idioma**: <idioma del texto humano (interfaz, docs, commits) y de los nombres de fichero>
- **Ramas**: <convención de ramas; p. ej. `main` estable, `develop` de integración, `feature/<id>` desde `develop`>
- **Commits**: <formato de los mensajes>
- **Proyecto de referencia**: <ruta o repositorio cuyos patrones replica este proyecto, p. ej. `../orders-api` | no aplica>

## Reglas de producto

> Las cinco, por nombre. Cada entrada: respondida · pendiente · no aplica. Una pendiente no se inventa: sin ella, cada feature la decidiría al azar. Si difiere por capacidad, se detalla por capacidad dentro de la entrada.

- **Dónde viven los datos**: <fichero, tabla, memoria, almacenamiento del cliente… | pendiente | no aplica>
- **Idioma de los nombres**: <API, claves, mensajes… | pendiente | no aplica>
- **Límites**: <topes: tamaños, profundidades, número de resultados… | pendiente | no aplica>
- **Avisos**: <qué se avisa al usuario y cuándo | pendiente | no aplica>
- **Regla ante conflicto**: <qué manda cuando dos vías dan el mismo dato | pendiente | no aplica>
