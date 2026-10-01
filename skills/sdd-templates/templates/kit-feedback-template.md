---
kit_version: <de .docs/sdd/sdd-kit.json>
superpowers_version: <versión instalada>
lane: <feature|patch>
id: <yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>   # igual que el nombre del fichero
task: <id>                                    # id de la feature o del patch, según el modo del proyecto
mode: <full|lite>          # vacío en patch
date: <YYYY-MM-DD>
---

# Ticket para el kit — <feature|patch> <id>: <resumen de una línea>

> Lo lee un agente que mantiene el kit, no una persona: describe el comportamiento del kit,
> nunca el dominio del proyecto — sin nombres de cliente, proyecto, producto ni personas, sin
> código ni reglas de negocio. Si un hallazgo no se entiende sin un dato del dominio, sustitúyelo
> por un descriptor genérico («una regla de cálculo de precios», «el interlocutor del cliente»);
> el hallazgo nunca se omite por privacidad. Borra los bloques de ayuda (`>`) al redactar.
>
> **Ticket mínimo** — si el cierre fue limpio (ningún hallazgo por encima de un menor y el coste
> en reloj dentro del techo de la estimación), el ticket es la cabecera y estas tres líneas, y
> nada más que la sección «Menores» si los hubo:
>
> - Contexto: <feature lite, Sonnet 5.5, sin subagentes>
> - Coste: <1,5 h frente a 2 h estimadas; tokens no medidos>
> - Nada que reportar | <lo hecho por iniciativa propia, una línea>
>
> Con cualquier hallazgo, el ticket completo de abajo.

## Contexto

- Carril y modo: <feature full | feature lite | patch>
- Skills del kit usadas: <lista>
- Proyecto: <tipo, stack, tamaño, nº de personas — genérico, sin nombre>
- Modelo del hilo: <modelo>
- Modelos de los subagentes: <modelo(s) o "no aplica">
- Coste en reloj: <tiempo frente a la estimación, o "no medido">
- Coste en tokens: <tokens, o "no medido">

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

> Uno por subsección, ordenados por coste observado. Un error tuyo que una regla del kit pudo
> evitar es un hallazgo, también si la regla existía y no la aplicaste; uno que ninguna regla del
> kit cubriría, o un fallo del harness o del shell, no va al ticket.

### 1. <título>

- **Qué pasó**: <evidencia de la sesión; si cita un fallo de ejecución, el comando exacto, el shell y la línea de error: «`./scripts/check-docs.sh` en PowerShell → `The term './scripts/check-docs.sh' is not recognized`»>
- **Dónde en el kit**: <ruta del kit y paso — `skills/<skill>/SKILL.md` paso N, una plantilla, una referencia; nunca un fichero del proyecto; si no se localiza, dilo>
- **Por qué el kit no lo evitó**: <…; si la regla existía y no la aplicaste, dilo>
- **Coste**: <cifra; una causa, solo con la spec, el walkthrough o el commit que la respalda (ruta o sha), o marcada «sin respaldo»>
- **Propuesta**: <…>
- **Verificada**: <sí — reproducido con `<comando>` en <shell> | sí — contrastado con `skills/<skill>/SKILL.md:<línea>` | sin verificar>
- **Criterio de aceptación**: <escenario GIVEN/WHEN/THEN, o el RED que hoy falla y pasaría con la propuesta>

## Lo que hice por iniciativa propia

> Lo que se hizo sin que ninguna skill lo pidiera, y si funcionó. Es candidato a regla nueva del kit.

- <…>

## Funcionó, no tocar

- <…>

## Menores

> Fricciones de menos de ~10 min que no se repitieron en la sesión, una línea cada una, sin
> criterio de aceptación. Si no hay, borra la sección.

- <qué pasó> — <ruta del kit, o «no localizado»>
