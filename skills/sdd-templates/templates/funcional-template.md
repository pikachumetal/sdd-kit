# Capacidad — <nombre>

> **Reglas anti-proliferación** (no se rompen sin pasar por esta lista):
> 1. Una capacidad es un sustantivo del dominio, nunca un ticket ni una task.
> 2. La crea la spec que la declara en "Decisiones que he tomado yo — valida estas"; nunca
>    la crea `sdd-end-task` por su cuenta.
> 3. `sdd-end-task` fusiona el delta: `ADDED` añade un requisito nuevo, `MODIFIED` sustituye el
>    requisito que tiene ese mismo título, `REMOVED` lo quita.
> 4. Brownfield no vuelca: la carpeta `funcional/` no se rellena de golpe al inicializar, crece
>    task a task, con la primera que toque cada capacidad.
> 5. Un requisito vive en una sola capacidad; si otra capacidad lo necesita, lo enlaza — no lo
>    duplica.
>
> Sin índice: el listado de ficheros de `funcional/` es el índice.

## Requisitos

### <Título estable del requisito>

> El título es la clave que `MODIFIED — <título> (antes: …)` cita al fusionar un delta futuro;
> no lo cambies al fusionar salvo que la spec lo renombre explícitamente.

- GIVEN <precondición>
- WHEN <acción>
- THEN <resultado observable>

## Historial *(opcional)*

> Una línea por fusión de `sdd-end-task`, más reciente arriba. Útil para auditar cómo llegó la
> capacidad a su estado actual sin bucear en las specs históricas.

- <YYYY-MM-DD> — task <id> — ADDED/MODIFIED/REMOVED <título>
