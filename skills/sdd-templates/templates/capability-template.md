# Capacidad — <nombre>

> **Reglas anti-proliferación** (no se rompen sin pasar por esta lista):
> 1. Una capacidad es un sustantivo del dominio, nunca un ticket ni una task.
> 2. La crea la spec que la declara en "Decisiones que he tomado yo — valida estas"; nunca
>    la crea `sdd-end-task` por su cuenta.
> 3. `sdd-end-task` fusiona el delta: `ADDED` añade un requisito nuevo, `MODIFIED` sustituye el
>    requisito que tiene ese mismo título, `REMOVED` lo quita.
> 4. Brownfield no vuelca: la carpeta `capabilities/` no se rellena de golpe al inicializar, crece
>    task a task, con la primera que toque cada capacidad.
> 5. Un requisito vive en una sola capacidad; si otra capacidad lo necesita, lo enlaza — no lo
>    duplica.
>
> Sin índice: el listado de ficheros de `capabilities/` es el índice.

## Requisitos

### <Título estable del requisito>

> El título es la clave que `MODIFIED — <título> (antes: …)` cita al fusionar un delta futuro;
> no lo cambies al fusionar salvo que la spec lo renombre explícitamente.

- GIVEN <precondición>
- WHEN <acción>
- THEN <resultado observable>

## Reglas de la capacidad *(opcional; presente obliga a decidir)*

> Cinco entradas fijas, por nombre; «no aplica» es respuesta válida. El nombre es la clave:
> `sdd-end-task` sustituye o añade cada entrada por su nombre cuando una spec la cambia. Sin
> ellas, el agente decide cada una al azar y distinto en cada ejecución.

- **Dónde viven los datos**: <fichero, tabla, memoria, almacenamiento del cliente… | no aplica>
- **Idioma de los nombres**: <API, claves, mensajes | no aplica>
- **Límites**: <topes, profundidades, tamaños | no aplica>
- **Avisos**: <qué se avisa al usuario y cuándo | no aplica>
- **Regla ante conflicto**: <qué manda cuando dos vías dan el mismo dato | no aplica>

## Historial *(opcional)*

> Una línea por fusión de `sdd-end-task`, más reciente arriba. Útil para auditar cómo llegó la
> capacidad a su estado actual sin bucear en las specs históricas.

- <YYYY-MM-DD> — task <id> — ADDED/MODIFIED/REMOVED <título>
