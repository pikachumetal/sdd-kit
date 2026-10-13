# Walkthrough — feature 0012: exportar a Excel

## 1. Qué se hizo

La exportación de las reservas a Excel, con una hoja por sala y una fila por reserva (`salas exportar-excel`).

## 2. Verificación

| Medida | Resultado | Límite |
| --- | --- | --- |
| 1.000 reservas | 4 s | 10 s |
| 5.000 reservas | 9 s | 10 s |

Medido con `node bench/excel.js <reservas>` sobre la base de pruebas, el 2026-10-02.
