# Misión — billing-api

## Por qué existe

Emitir facturas a partir de los pedidos cerrados y seguir su cobro. Hoy se hace en una hoja de cálculo compartida y se pierden cobros parciales.

## Usuarios

- Administración: emite facturas y registra cobros.
- Dirección: consulta lo pendiente de cobro.

## Dominio

- **Factura**: importe que se reclama a un cliente por uno o varios pedidos.
- **Pago**: cobro, total o parcial, contra una factura.
- **Saldo pendiente**: importe de la factura menos la suma de sus pagos.
