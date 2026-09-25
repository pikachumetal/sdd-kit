# Architecture — <proyecto>

> Cómo está construido el proyecto: sus piezas, de qué depende cada una y dónde va lo nuevo. Describe la estructura REAL, no la deseada. Crece con los cierres de feature (`sdd-end-feature`, aprendizajes estructurales). Los valores de comportamiento viven en `capabilities/`: aquí se enlaza la capacidad, no se copia el valor. Una sección sin contenido todavía se deja con `_Pendiente._`, no se borra. Borra los bloques de ayuda (`>`) al redactar.

## Estructura

```text
<árbol de carpetas y ficheros principales, una línea de responsabilidad por pieza>
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `<ruta o módulo>` | <qué hace> | <otras piezas, servicios externos> |

## Flujo principal

> Cómo viaja una petición o un comando de punta a punta, en pocos pasos.

1. <paso>

## Dónde va lo nuevo

> Reglas de reparto que una feature sigue sin preguntar: «un comando nuevo que recibe X usa la pieza Y».

- <tipo de cambio> → <pieza o carpeta>

## Decisiones estructurales

- <fecha> — <decisión> — <por qué> — <feature o spec de origen>
