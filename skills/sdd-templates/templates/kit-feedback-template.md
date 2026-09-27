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

## Contexto

- Carril y modo: <feature full | feature lite | patch>
- Skills del kit usadas: <lista>
- Proyecto: <tipo, stack, tamaño, nº de personas — genérico, sin nombre>
- Modelo del hilo: <modelo>
- Modelos de los subagentes: <modelo(s) o "no aplica">
- Coste en reloj: <tiempo, o "no medido">
- Coste en tokens: <tokens, o "no medido">

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

> Uno por subsección, ordenados por coste observado. Si no hay ninguno, se escribe literalmente
> «Sin hallazgos» y la sección se queda así: es un resultado válido, no se buscan fricciones para
> rellenar.

### 1. <título>

- **Qué pasó**: <evidencia de la sesión>
- **Dónde en el kit**: <ruta del kit y paso — `skills/<skill>/SKILL.md` paso N, una plantilla, una referencia; nunca un fichero del proyecto; si no se localiza, dilo>
- **Por qué el kit no lo evitó**: <…>
- **Coste**: <…>
- **Propuesta**: <…>
- **Criterio de aceptación**: <escenario GIVEN/WHEN/THEN, o el RED que hoy falla y pasaría con la propuesta>

## Lo que hice por iniciativa propia

> Lo que se hizo sin que ninguna skill lo pidiera, y si funcionó. Es candidato a regla nueva del kit.

- <…>

## Funcionó, no tocar

- <…>

## Errores míos, no huecos del kit

> Fallos del ejecutor que ninguna regla escrita habría evitado. No llevan propuesta.

- <…>
