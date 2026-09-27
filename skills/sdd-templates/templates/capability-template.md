# Capacidad — <nombre>

> **Reglas anti-proliferación** (no se rompen sin pasar por esta lista):
> 1. Una capacidad es un sustantivo del dominio, nunca un ticket ni una feature. Su slug (el nombre del fichero) va en inglés kebab-case aunque el contenido vaya en castellano (`invoicing.md`, no `facturacion.md`), y lo aprueba el dev-lead.
> 2. La crea la spec que la declara en "Decisiones que he tomado yo — valida estas"; nunca
>    la crean `sdd-end-feature` ni `sdd-end-patch` por su cuenta.
> 3. `sdd-end-feature` fusiona el delta de la spec, y `sdd-end-patch` el del `patch.md`: `ADDED` añade un requisito nuevo, `MODIFIED` sustituye entero el
>    requisito que tiene ese mismo título, `REMOVED` lo quita. La capacidad no guarda historial: quién cambió
>    qué lo dicen git y el bloque «Capacidades» de cada spec o `patch.md`.
> 4. Las init no vuelcan: la carpeta `capabilities/` no se crea al inicializar y crece feature a feature,
>    con la primera que toque cada capacidad. Única excepción: el volcado inicial de `sdd-init-greenfield`
>    (paso 6), a petición del usuario y con la partición aprobada antes. Brownfield no vuelca nunca.
> 5. Un requisito vive en una sola capacidad; si otra capacidad lo necesita, lo enlaza — no lo
>    duplica.
>
> Índice: lo genera `Get-CapabilityIndex.ps1` al vuelo; no hay `index.md`.

## Propósito

> Una o dos frases, 300 caracteres como máximo: qué cubre la capacidad, para que el índice la distinga de las demás.
> Sin procedencia (quién o qué feature la creó): eso lo dicen git y el bloque «Capacidades» de cada spec.

<una o dos frases: qué cubre la capacidad>

## Requisitos

### <Título estable del requisito>

> El título es la clave que `MODIFIED — <título>` cita al fusionar un delta futuro;
> no lo cambies al fusionar salvo que la spec lo renombre explícitamente.

- GIVEN <precondición>
- WHEN <acción>
- THEN <resultado observable>

## Reglas de la capacidad *(opcional; presente obliga a decidir)*

> Cinco entradas fijas, por nombre; «no aplica» es respuesta válida. El nombre es la clave:
> `sdd-end-feature` sustituye o añade cada entrada por su nombre cuando una spec la cambia. Sin
> ellas, el agente decide cada una al azar y distinto en cada ejecución.

- **Dónde viven los datos**: <fichero, tabla, memoria, almacenamiento del cliente… | no aplica>
- **Idioma de los nombres**: <API, claves, mensajes | no aplica>
- **Límites**: <topes, profundidades, tamaños | no aplica>
- **Avisos**: <qué se avisa al usuario y cuándo | no aplica>
- **Regla ante conflicto**: <qué manda cuando dos vías dan el mismo dato | no aplica>
