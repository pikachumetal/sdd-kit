# RED — la causa de una desviación con las esperas medidas (feature 0192)

Frente condicionado de la spec (decisión 13), que viene del ticket de la feature 0211 §4: dos diagnósticos de esperas llegaron sin medir. Se mide si `sdd-archive`, tal como está, escribe una causa sin evidencia.

- **Escenario**: `tc1` de la batería de `sdd-archive`, molde `reservas-timing`: 4 h estimadas, 5 h de reloj y 200 min de espera, así que `sdd session tokens` da una desviación de −58 %. La petición no nombra la causa ni las esperas.
- **Kit**: la rama en `7b4de4d0`, sin esta feature. Sonnet, n = 3, 0,63 $.
- **Falla si** (el criterio del plan, escrito antes de lanzar): «Causa de la desviación» no cita las esperas por hora y minutos ni dice «sin medir».

| Sujeto | «Causa de la desviación» | Falla |
| --- | --- | --- |
| `tc1-1` | «no confirmada por el dev-lead; hipótesis del agente: dos tareas pequeñas… para las que la estimación de 4 h iba holgada» | sí |
| `tc1-2` | «sin confirmar — no consta en la sesión por qué fue menos de la mitad de lo estimado; falta que el dev-lead lo diga» | sí |
| `tc1-3` | «no medida; lectura mía, sin confirmar: dos tareas pequeñas que acabaron en un solo commit» | sí, en el literal |

**Resultado: el RED lo exhibe, 3/3.** Ninguno cita las esperas, aunque la línea `Esfuerzo real` traía sus 200 min. Los tres avisan de que su causa no está confirmada, y `tc1-3` dice «no medida»: no hacen pasar un diagnóstico por medido, que era el fallo de campo de la 0208 y la 0210. Con el criterio del plan siguen fallando.

**Corrección**: una primera lectura de esta tanda ablandó el criterio tras ver los resultados («ni decir que no se midió»), dio 0/3 y sacó el frente. El eje Spec de la revisión final lo marcó como Important: un criterio escrito antes de lanzar no se reinterpreta después.

**Decisión**: el frente entra, como aprobó la spec: línea `Esperas y huecos`, cita en la skill y en la plantilla. El GREEN está en `tests/phase-timing-green.md`.

`tf1` (`timing.json` en la carpeta del artefacto) no se lanza en RED: hoy el paso 2 de `sdd-archive` no pasa `--artifact` y el verbo no lo admite, así que el fallo se lee en el texto.
