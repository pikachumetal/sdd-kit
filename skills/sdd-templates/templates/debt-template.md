# Deuda técnica — <proyecto>

> Documento de estado de la deuda técnica: dice dónde está cada ítem hoy, no su historia. Lo escribe `sdd-roadmap`, al triar, y los cierres (`sdd-end-feature`, `sdd-end-patch`), que quitan de «Lista» lo que saldan; lo leen `sdd-roadmap`, los cierres y `sdd roadmap check`. Borra los bloques de ayuda (`>`) al redactar. Solo ingeniería: las peticiones de producto van a Later de `ROADMAP.md`.
>
> **Las cuatro secciones y sus cabeceras van literales**, en este orden. Una celda vacía se escribe `—`. Un `|` dentro de una celda se escribe `\|`.
>
> **Fecha**: `AAAA-MM-DD`, la de la entrada del ítem en el estado en que está; se conserva, no se renueva al editar.
>
> **La cota**: un ítem de «En espera» caduca y una fila de «Descartadas» sale tras dos releases `X.Y.0` del changelog (`## [X.Y.0] - AAAA-MM-DD`); un patch no cuenta, ni `[Unreleased]`.
>
> **«Lista»**: nada entra sin «Evidencia» ni «Destino». «Destino» dice qué se hará (el id de una fila de Now o Next, o `sin fila`); el cierre que lo salda quita la fila.

## Por triar

> Lo recién llegado, sin decidir. Ejemplo: `| <qué falta o está mal> | <de dónde sale> | AAAA-MM-DD |`

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

> Lo que espera un segundo caso o un dato. Ejemplo: `| <ítem> | <origen> | <alto \| medio \| bajo> | <qué falta> | AAAA-MM-DD |`

| Ítem | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- |

## Lista

> Lo que ya se puede hacer. Ejemplo: `| <ítem> | <origen> | <alto \| medio \| bajo> | <ruta o comando que lo prueba> | <id de una fila de Now o Next \| sin fila> |`

| Ítem | Origen | Impacto | Evidencia | Destino |
| --- | --- | --- | --- | --- |

## Descartadas

> Lo que se decidió no hacer, con el motivo. Ejemplo: `| <ítem> | <origen> | <motivo> | AAAA-MM-DD |`

| Ítem | Origen | Motivo | Fecha |
| --- | --- | --- | --- |