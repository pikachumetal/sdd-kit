# RED — el test de títulos no llega a una suite real, ni la init ni la migración lo ofrecen (feature 0282)

Con el texto de la 0278, sobre copias de una suite real sin «Flujos core». Tres sujetos Sonnet, 0,71 $. Lanzador: [`red/subject.mjs`](../.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/red/subject.mjs). Las salidas llevan títulos de producto de clientes y no se versionan.

| Escenario | Qué dejó | Resultado |
| --- | --- | --- |
| `a1`: una task amplía un E2E de document-manager | La aserción y nada más; «no hay lista de títulos que ampliar» | ✅ reproduce: sin test de títulos, y solo dice que hay que declarar la lista |
| `m1`: paso 2 de `migrations/v3.0.0.md` con E2E | Tabla con los seis campos y diez candidatos a flujo core | ✅ reproduce: no ofrece el test |
| `i1`: `sdd-init` con E2E, hasta `## Testing` | Propuesta de `## Testing` y seis preguntas | ✅ reproduce: no ofrece el test |
