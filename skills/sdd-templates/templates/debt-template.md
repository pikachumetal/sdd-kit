# Deuda técnica — <proyecto>

> Documento de estado de la deuda técnica: dice dónde está cada ítem hoy, no su historia. Lo escribe `sdd-roadmap`, al triar, y los cierres (`sdd-archive`), que quitan de «Lista» lo que saldan; lo leen `sdd-roadmap`, `sdd-debugging`, los cierres y `sdd roadmap check`. Borra los bloques de ayuda (`>`) al redactar. Solo ingeniería: las peticiones de producto van a Later de `ROADMAP.md`.
>
> **Las tres secciones y sus cabeceras van literales**, en este orden. Una celda vacía se escribe `—`. Un `|` dentro de una celda se escribe `\|`.
>
> **Fecha**: `AAAA-MM-DD`, la de la entrada del ítem en el estado en que está; se conserva, no se renueva al editar.
>
> **La cota**: un ítem de «En espera» caduca tras dos releases `X.Y.0` del changelog (`## [X.Y.0] - AAAA-MM-DD`); un patch no cuenta, ni `[Unreleased]`. Lo descartado o caducado sale del fichero, con su motivo en el cuerpo del commit.
>
> **«Lista»**: nada entra sin «Evidencia» ni «Destino». «Destino» dice qué se hará (el id de una fila de Now o Next, o `sin fila`); el cierre que lo salda quita la fila.
>
> **Causa**: una de estas, y la que vale es la raíz que desaparece con el remedio.
>
> - `entorno de la máquina`: el sistema o las rutas de esa máquina (una ruta larga, una carpeta borrada).
> - `carga o paralelismo`: solo falla con la máquina cargada o con otra suite a la vez.
> - `herramienta del kit`: un verbo, un script o un hook hace mal su trabajo.
> - `regla lejos de su paso`: la regla existe, pero no está donde se decide.
> - `decisión que no era del agente`: el agente decidió lo que era de otro.
> - `fusión de registros`: un merge pisa o duplica un registro.
> - `prueba o molde`: el test o el molde falla, no lo que prueba.
> - `defecto del producto`: un fallo de lo que usa el usuario.
> - `sin determinar`: aún no se sabe; solo en «En espera».
>
> **Casos**: cada enlace distinto de «Origen» es un caso; dos hallazgos de un mismo ticket llevan anclas distintas. Dos hallazgos son casos del mismo problema si los resolvería el mismo cambio concreto o el mismo remedio concreto; `ninguno` y un reintento (`relanza`) no son criterio.
>
> **Remedio temporal**: lo que resuelve el fallo mientras no está arreglado. Con dos o más casos es obligatorio, o `ninguno` si se buscó y no lo hay («no lo he buscado» no vale).
>
> **Arreglo**: el primero que sirva, por orden: `comprobación automática` (test, lint, hook), `conectar comprobación` (conectar la que ya existe), `mover regla` (al paso donde se decide) y, solo al final, `línea nueva`. `—` solo con `defecto del producto`. Una fila con prefijo `**[… saldada …]**` no exige causa ni arreglo.

## Por triar

> Lo recién llegado, sin decidir. Ejemplo: `| <qué falta o está mal> | <de dónde sale> | AAAA-MM-DD |`

| Ítem | Origen | Fecha |
| --- | --- | --- |

## En espera

> Lo que espera un segundo caso o un dato. Ejemplo: `| <ítem> | <causa> | <origen> | <alto \| medio \| bajo> | <qué falta> | AAAA-MM-DD |`

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

> Lo que ya se puede hacer. Ejemplo: `| <ítem> | <causa> | <origen> | <alto \| medio \| bajo> | <ruta o comando que lo prueba> | <remedio \| ninguno \| —> | <arreglo> | <id de una fila de Now o Next \| sin fila> |`

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
