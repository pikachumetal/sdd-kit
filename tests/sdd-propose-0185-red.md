# RED — los diez arreglos de `sdd-propose` y de las plantillas de spec y plan (feature 0185)

Baseline con el kit de la rama en `c04fc5c7` (develop antes de la 0185), sujetos Sonnet con `SUPERPOWERS_DIR` (superpowers 7.0.0, sin el `CLAUDE.md` del dev-lead), batería de `sdd-propose` sobre el molde `reservas`. Lo que dejó cada sujeto, en [`red/out/`](../.docs/sdd/specs/20261017-220801-feature-0185-propose-fixes/red/out/). Total: 4 sujetos, 1,29 $.

## Conducta

| Sujeto | Petición | Turnos | $ | Cita | Veredicto |
| --- | --- | --- | --- | --- | --- |
| `pl1-1`, `pl1-2` | `pl1`: «patch, la solución está decidida: un comando `reservas <sala>`…; sin reservas responde `sin reservas <sala>`; y `libres` sin franja responde `indica una franja`» | 22 y 20 | 0,46 y 0,39 | «RED confirmado (los 3 tests nuevos fallan). Implemento el cambio mínimo.» | ❌ 0/2: los dos abren un patch de tres comportamientos nuevos (`patch-new.md`) y llegan al cierre; es la feature sin spec que el dev-lead vio entrar como patch («estamos yendo mucho a patch para hacer lites», entrevista de la 0168) |
| `pb-1`, `pb-2` | `pb`: el comando `informes` de cuatro vistas, 5 tasks | 9 y 10 | 0,25 y 0,20 | `pb-1`: «`src/app.js` no guarda la disponibilidad de cada sala»; `pb-2`: «Solo cuentan las reservas `active`… las de la lista `rooms`… los que ya usa `day`» | ❌ 0/2: la primera sección abre con suposiciones en nombres de código, no con lo que ve quien usa `informes` (segundo y tercer caso de la fila «Una decisión técnica se preguntó en términos de API») |

## Estructural (verificado leyendo el texto)

| Frente | Evidencia |
| --- | --- |
| Margen de palabras | La plantilla de la spec no tiene sitio para lo medido frente al tope (`spec-template.md`, sin sección); siete casos de campo en la fila de deuda; `sdd-propose` medía 6.324 de 6.325 al arrancar esta feature |
| Lo que se retira o cambia de forma | `sdd-propose/SKILL.md:62` busca solo desde cada `MODIFIED` del delta; tres casos (0165, 0150, 0188) |
| Punteros «lo define la NNNN» | Mismo paso, sin búsqueda de ids de fila; `t1` del patch 0174 limpio 2/2 en molde pequeño: entra en el mismo hueco, `t1` queda de control |
| Delta probado antes del gate | `spec-template.md:99` decía «lo que no esté aquí desaparece» contra `cli/src/capabilities/merge.ts:117`, que rechaza perder una línea; el paso 4 no ejecutaba `capability merge` |
| Política de modelos en `delegate` | Sin hueco en `spec-template.md`; sin regla en `sdd-parallel-agents` («The project's cap»); la única equivalente es la de `review-spec.md:23`, para la review de la spec; cinco casos de campo |
| «Aprobaciones» | `spec-template.md:131` (columna «Rol») y `:13` (`role: dev-lead`), que no lee ninguna skill ni test |
| Self-review por cláusula | `plan-template.md:195` (`<requisito de la spec> → Task <n>`) y `plan-writing.md:23` («each requirement and THEN») |
| Regla retirada → tests | §4 de `plan-template.md` sin línea para las filas de la tabla del Art. I |
| «Verificación» con resumen | `plan-template.md:148` pide salir con código distinto de 0, no la línea de resumen ni sin color |
