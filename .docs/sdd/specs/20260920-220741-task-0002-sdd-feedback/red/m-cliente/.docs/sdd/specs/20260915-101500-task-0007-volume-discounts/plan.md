---
id: 20260915-101500-task-0007-volume-discounts
task: "0007"
---

# Plan — Descuentos por volumen

## Restricciones globales

- El cálculo de precio vive en `src/Pricing/`; ningún cálculo de descuento se hace en el
  controlador de pedidos.
- `ITariffResolver` es la única puerta de entrada a la tarifa de un mayorista: ningún task
  implementador consulta la tabla de tarifas directamente.
- Todo importe de descuento pasa por el mismo redondeo bancario antes de mostrarse.

## Tasks

### T1 — Modelo de escalado por volumen

- **Modelo**: sonnet
- **Ejecución**: subagente implementador
- **Tests RED**: `VolumeDiscountCalculatorTests.CalculaPrecioDeEscalon_CuandoSuperaElUmbral`
  falla porque `VolumeDiscountCalculator` no existe todavía.

### T2 — `ITariffResolver` y `TariffService`

- **Modelo**: sonnet
- **Ejecución**: subagente implementador
- **Tests RED**: `TariffServiceTests.ResuelveTarifaVigente_ParaMayoristaConTarifaEspecial`
  falla porque `TariffService` no implementa `ITariffResolver`.

### T3 — Rappel de cierre de periodo y redondeo bancario

- **Modelo**: sonnet
- **Ejecución**: subagente implementador
- **Tests RED**: `VolumeDiscountCalculatorTests.RedondeaImporteFinal_ConCriterioBancario` falla
  porque el redondeo sigue truncando.

## Estimación y esfuerzo

Estimado: 3h 30m de reloj, 3 subagentes implementadores en paralelo (uno por task), en torno a
150-200k tokens cada uno por la cantidad de contexto de dominio de tarifas que hay que
cargarles.
