# Capacidad — reports

## Propósito

los informes de la app de salas

## Requisitos

### El informe de canceladas agrupa por sala y da el total

- GIVEN Norte lun cancelada con «sala ocupada» y Sur mar con «otro»
- WHEN `informe`
- THEN responde «Norte: lun (sala ocupada)», «Sur: mar (otro)» y «total: 2», en ese orden