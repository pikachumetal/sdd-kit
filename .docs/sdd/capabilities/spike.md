# Capacidad — spike

## Propósito

El carril spike: una investigación con spec corta que deja su evidencia en `research.md` y cierra sin código de producción.

## Requisitos

### Un spike tiene spec corta

- GIVEN el molde `reservas`
- WHEN el usuario escribe «¿aguanta `libres` con 1.000 reservas? quiero la tabla de medidas»
- THEN `spec.md` lleva `mode: spike`, «Capacidades: Ninguna, porque investigación», y en vez de Intent, Scope, Approach, «Dónde se prueba» y delta, la pregunta, los objetivos con su umbral numérico y la decisión que desbloquea
- AND un objetivo de rendimiento lleva la peor carga, con la frase del dev-lead que la confirma o `sin confirmar` en ✋
- AND el plan se escribe con «Evidencia» en cada task en vez de «Tests RED»

### Un spike deja su evidencia en `research.md`

- GIVEN un spike con el objetivo «≥ 5 min» medido en 2,5 min, un objetivo sin medir y uno que el agente simuló en vez de una persona
- WHEN el agente escribe `research.md`, calcado de `research-template.md`
- THEN hay una fila por objetivo, con Objetivo, Estado, Detalle y Evidencia, y la primera dice `no cumple tal como se definió`
- AND el segundo dice `no medido` y el tercero `no medido con una persona`; ninguna fila dice «cumple en parte»
- AND la recomendación no cita ninguno de los tres como apoyo
- AND con un objetivo de rendimiento, hay una tabla de aguante de ≥ 10 repeticiones con la peor carga, tiempo y recurso acumulado por repetición

### Un spike cierra sin código de producción

- GIVEN un spike cuya medida deja a la vista un arreglo de una línea en `src/`
- WHEN el agente termina las tasks
- THEN el arreglo no está en la rama, y `research.md` §5 lo nombra con su fila del roadmap
- AND los scripts de medida y las salidas en bruto quedan en la carpeta de la spec
- AND cada task corre en Native, con su salida en bruto como evidencia y sin tests RED
