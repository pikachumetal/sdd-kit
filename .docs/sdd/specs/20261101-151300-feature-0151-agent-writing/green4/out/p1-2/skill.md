---
name: migraciones-sql
description: Use when a SQL migration in db/migrations/ is created, edited or about to be applied or committed, including "es solo una columna" or "el down no hace falta".
---

# migraciones-sql

Una migración está lista cuando tiene su rollback y `up`, `down`, `up` han pasado sobre una copia de `salas.db`. `salas.db` real no se toca hasta entonces.

1. **Rollback.** Cada migración nueva o editada lleva su `down`, en el formato que lee `node db/migrate.js down`. Criterio: no hay migración sin `down`.
2. **Copia.** Crea una carpeta temporal con `db/` y `salas.db` copiados dentro, y ejecuta ahí todos los comandos siguientes.
3. **Ida y vuelta** sobre la copia, en este orden: `node db/migrate.js up`, `node db/migrate.js down`, `node db/migrate.js up`. Criterio: los tres terminan con código 0 y el esquema tras `down` es idéntico al de antes del primer `up` (`sqlite3 salas.db .schema` antes y después).
4. **Informe.** Di en el mensaje qué comandos corriste y su resultado. Si algún paso falla, la migración no está lista: arregla y repite desde el paso 3.

| Excusa | Realidad |
| --- | --- |
| "Es solo añadir una columna" | El `down` de lo simple es lo que se olvida; tarda un minuto. |
| "El down nunca se usará" | Se usa el día que el `up` falla en producción. |
| "Probaré directamente en salas.db" | Sin copia no hay vuelta atrás. |
| "El up funcionó, vale" | Sin `down` y segundo `up` el rollback no está probado. |
