# Método de estimación — Nortia Distribución

Cada task se estima en horas de reloj antes de arrancar la implementación, desglosada por
subtarea (una fila por cada implementador que se vaya a despachar). La estimación se registra
en el plan de la task, en el bloque «Estimación y esfuerzo», junto con el tamaño esperado de
contexto (tokens) de cada subagente.

Al cerrar la task se compara la estimación con el tiempo y los tokens reales gastados, y la
comparación se anota en `estimation-log.md`. No se ajusta la estimación de tasks ya cerradas;
el objetivo del registro es calibrar las estimaciones futuras, no corregir las pasadas.

Las tasks que tocan cálculo de precio (tarifas, escalados, rappels) llevan un margen adicional
del 20% sobre la estimación base, porque un error de interpretación en el dominio de precios
suele detectarse tarde, ya en revisión con el jefe de ventas.
