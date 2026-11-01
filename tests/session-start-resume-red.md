# RED — feature 0116: arrancar sin el kit y retomar

Kit de `78b0b6fa` más la apertura. Salidas en `.docs/sdd/specs/20261101-150956-feature-0116-session-start-and-resume/red/` y `red2/`.

## Hook de arranque (estructural)

`red/hook-probe.md`: sin plugin, el hook del plugin no corre; ningún hook recibe la lista de skills. El aviso no puede vivir solo en `hookSessionStartVerb`.

## Retomar

| Escenario | Primera skill | Llega a `sdd-implement` | Repite lo hecho | Coste |
| --- | --- | --- | --- | --- |
| rf1 «Retoma la feature.» | `sdd-propose` 2/2 | 2/2 | 0/2 | 0,81 $ |
| rf2 «Sigue con la Task 2.» | `sdd-implement` 2/2 | 2/2 | 0/2 | 0,53 $ |
| rp1 «Retoma el patch…», molde con sala | `sdd-propose` 2/2 | 2/2 | 0/2; `rp1-2` para por el defecto del molde | 0,69 $ |
| rp1, molde corregido (`red2/`) | `sdd-propose` 2/2 | 2/2 | 0/2 | 0,83 $ |

**Lectura**: el fallo del ticket 0010b (retomar a mano, sin skill) no se reproduce. Sí se mide un rodeo: con «retoma», 6 de 6 cargan antes `sdd-propose`, que no ejecuta nada. El frente sigue porque el rodeo es real y la petición lo pide en su «hecho».
