# Capacidad — <nombre>

> **Reglas anti-proliferación**:
> 1. Una capacidad es un sustantivo del dominio, nunca un ticket ni una feature. Su slug (el nombre del fichero) va en inglés kebab-case aunque el contenido vaya en castellano (`invoicing.md`, no `facturacion.md`), y lo aprueba el dev-lead.
> 2. La crea la spec que la declara en "Decisiones que he tomado yo — valida estas"; nunca
>    la crea `sdd-archive` por su cuenta.
> 3. `sdd-archive` fusiona el delta de la spec o el del `patch.md`: `ADDED` añade un requisito nuevo, `MODIFIED` sustituye entero el
>    requisito que tiene ese mismo título, `REMOVED` lo quita; si era el último, la spec la declara en `- Retiradas:` y la fusión borra el fichero. La capacidad no guarda historial.
> 4. Las init no vuelcan: `capabilities/` crece feature a feature. Solo `sdd-init` (paso 8) vuelca,
>    a petición del usuario.
> 5. Un requisito vive en una sola capacidad; si otra capacidad lo necesita, lo enlaza — no lo
>    duplica.
> 6. Un documento heredado o un puntero que no es una capacidad lleva, tras el título,
>    `> **No es una capacidad.** <por qué>`: el validador y el índice lo dejan fuera.

## Propósito

> Una o dos frases, 300 caracteres como máximo: qué cubre la capacidad, para que el índice la distinga de las demás.
> Sin procedencia (quién o qué feature la creó): eso lo dicen git y el bloque «Capacidades» de cada spec.

<una o dos frases: qué cubre la capacidad>

## Requisitos

### <Título estable del requisito>

> El título es la clave que `MODIFIED — <título>` cita al fusionar un delta futuro;
> no lo cambies al fusionar salvo que la spec lo renombre explícitamente.
> Un comportamiento por requisito, con los ejemplos y los bordes en escenarios. Por encima de 500
> caracteres `sdd capability check` avisa; bajo `MODIFIED`, el bloque existente no se parte ni se recorta para cumplir.

- GIVEN <precondición>
- WHEN <acción>
- THEN <resultado observable>

## Reglas de la capacidad *(opcional; presente obliga a decidir)*

> Cinco entradas fijas, por nombre; «no aplica» es respuesta válida. `sdd-archive` sustituye o
> añade cada entrada por su nombre cuando una spec la cambia.

- **Dónde viven los datos**: <fichero, tabla, memoria, almacenamiento del cliente… | no aplica>
- **Idioma de los nombres**: <API, claves, mensajes | no aplica>
- **Límites**: <topes, profundidades, tamaños | no aplica>
- **Avisos**: <qué se avisa al usuario y cuándo | no aplica>
- **Regla ante conflicto**: <qué manda cuando dos vías dan el mismo dato | no aplica>
