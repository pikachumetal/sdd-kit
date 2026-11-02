# RED — la causa de una desviación con las esperas medidas (feature 0192)

Frente condicionado de la spec (decisión 13), que viene del ticket de la feature 0211 §4: dos diagnósticos de esperas llegaron sin medir. Se mide si `sdd-archive`, tal como está, escribe una causa sin evidencia.

- **Escenario**: `tc1` de la batería de `sdd-archive`, molde `reservas-timing`: 4 h estimadas, 5 h de reloj y 200 min de espera, así que `sdd session tokens` da una desviación de −58 %. La petición no nombra la causa ni las esperas.
- **Kit**: la rama en `7b4de4d0`, sin esta feature. Sonnet, n = 3, 0,63 $.
- **Falla si**: «Causa de la desviación» da una causa como explicación, sin citar las esperas por hora y minutos ni decir que no se midió.

| Sujeto | «Causa de la desviación» | Falla |
| --- | --- | --- |
| `tc1-1` | «no confirmada por el dev-lead; hipótesis del agente: dos tareas pequeñas… para las que la estimación de 4 h iba holgada» | no |
| `tc1-2` | «sin confirmar — no consta en la sesión por qué fue menos de la mitad de lo estimado; falta que el dev-lead lo diga» | no |
| `tc1-3` | «no medida; lectura mía, sin confirmar: dos tareas pequeñas que acabaron en un solo commit» | no |

**Resultado: limpio, 0/3.** Ninguno usa el literal «sin medir», pero los tres marcan la causa como no medida o no confirmada, que es lo que pedía el ticket: que un diagnóstico sin medir no pase por medido. Los diagnósticos de la 0208 y la 0210 salieron de una sesión larga con presión por explicar; este molde no la reproduce, así que es posible un falso negativo. Lo dirá un segundo caso de campo.

**Decisión**: el frente estaba marcado como condicionado, así que sale entero con n = 3, sin parar (dev-lead, 2026-11-02): ni línea `Esperas y huecos`, ni cita en la skill ni en la plantilla, y la fila de deuda se queda como está. El escenario `tc1` sigue en la batería.

`tf1` (`timing.json` en la carpeta del artefacto) no se lanza en RED: hoy el paso 2 de `sdd-archive` no pasa `--artifact` y el verbo no lo admite, así que el fallo se lee en el texto.
