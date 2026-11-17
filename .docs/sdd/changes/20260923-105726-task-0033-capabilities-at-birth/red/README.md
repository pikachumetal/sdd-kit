# RED previo a la spec — task 0033

Regla de `tech-stack.md`: cada frente de campo se reproduce antes de presentar la spec. Kit: copia limpia del working tree en `3c565a4`. Sujetos Sonnet de un turno, sin persona, lanzados con `driver.py`. Coste total: 3,73 $ en 7 sujetos.

## Frente 1 — carpetas vacías (estructural + conducta)

| Evidencia | Resultado |
| --- | --- |
| `sdd-init-greenfield/references/estructura.md:15` dice «`capabilities/` (vacía…)» y `:20` «`specs/` (vacía)»; `sdd-init-brownfield/references/generacion.md:13` dice «`capabilities/` NO se crea ni se vuelca» y «`specs/` vacía» | las init se contradicen |
| `f2`, `f3`, `f4` (greenfield completo, abajo) | 3/3 dejan `capabilities/` y `specs/` vacías; ninguna aparece en `git status` |

Las campañas archivadas de la 0012 no sirven de baseline: sus `.gitkeep` venían ya en los moldes (`red/molds/e1-template`, `green/molds/e4-git`).

## Frente 2 — volcado inicial (conducta)

**Molde** (`molds/pomodoro/`): CLI de Node de 148 líneas en cinco ficheros, con `.docs/sdd/` completo como tras una init greenfield aprobada y sin `capabilities/`. Mismo molde para el control de brownfield.

| Sujeto | Petición | Conducta | Coste |
| --- | --- | --- | --- |
| `v1` | greenfield, paso 6: «genera las capacidades de `capabilities/` a partir del código» | vuelca sin preguntar: cuatro ficheros con nombres de módulo (`timer`, `config`, `notify`, `history`), sin «Historial» («nace la capacidad, no viene de fusión de task»), escritos antes de enseñar nada | 0,33 $ |
| `v2` | la misma | se niega: «El kit prohíbe explícito esto», cita la regla 4 de `capability-template.md` y ofrece forzarlo | 0,29 $ |
| `b1` | brownfield, cierre: la misma petición | se niega: «igual aplica la regla, no hace excepción por tamaño» (control: conducta que se mantiene) | 0,20 $ |

**Falla 2/2 en greenfield**, por dos vías: la excepción decidida el 2026-09-20 no existe para el agente (`v2`), y cuando la toma igual, no pide partición ni nombres ni escribe historial (`v1`).

## Frente 3 — funcional aportado en greenfield (conducta)

**Molde** (`molds/gym/`): repo sin código, `respuestas-entrevista.md` con las 21 respuestas y `funcional-cliente.md` con cinco secciones de reglas del cliente. Petición: generar los documentos con todos aprobados, sin git y sin tocar `.claude/` ni `.gitignore`.

`f1` se paró al pedir permiso para crear `.claude/` (`-p` no concede escrituras en `.claude`, como en la 0019); se relanzó con la petición que excluye `.claude/` (`f3`, `f4`). `f2`, con la primera petición, llegó al final y dejó `.claude/settings.json` como pendiente.

| Sujeto | Original en `.docs/sdd/` o enlazado | Detalle en los docs | Coste |
| --- | --- | --- | --- |
| `f1` | — (parado en `.claude/`) | — | 0,42 $ |
| `f2` | no: ni copia ni mención | destilado en «Reglas de producto» (límites y avisos) y en mission; se pierde la ventana del monitor («desde 1 hora antes») | 0,98 $ |
| `f3` | no | igual; se pierde la ventana del monitor | 0,71 $ |
| `f4` | no | igual; se pierden además la publicación de los jueves a las 12:00 y la ventana del monitor | 0,80 $ |

**Falla 3/3**: el funcional se queda en la raíz del repo, sin enlace desde `.docs/sdd/`, y lo que llega a los docs es un resumen que pierde reglas. Con un funcional de treinta líneas la pérdida es pequeña; con uno real de varias páginas, el resumen es lo único que queda.

## Salidas

`out/<sujeto>/`: `tree/` (el repo tras el sujeto, sin `.git`), `transcript.md`, `tools.txt` y `state.txt` con `git log`, `git status` y coste. Peticiones en `requests/`.
