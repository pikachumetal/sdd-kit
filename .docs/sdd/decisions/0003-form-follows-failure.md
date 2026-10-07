---
status: accepted
date: 2026-09-25
rutas:
  - skills/**/SKILL.md
  - skills/**/references/**
---

# La forma de la guía sigue al fallo

## Contexto y problema

El agente falla de formas distintas según el tipo de texto de la guía: saltaba una regla que conocía cuando había presión, cumplía la regla con la forma equivocada, o se aplicaba una excepción redactada como cláusula. En la task 0060, «si no puedes, di por qué» dejó pasar «es una base común» como motivo para partir por capas lo que debía ir en vertical, hasta que la guía escribió el motivo que no vale.

## Opciones consideradas

- Una sola forma de guía para todo (prosa normativa).
- Elegir la forma según el fallo observado en el RED.

## Decisión

Fallo de disciplina → prohibición, tabla de racionalizaciones y red flags. Fallo de forma → receta o contrato de cómo es el output. Comportamiento condicional → predicado observable, nunca cláusula de excepción. Una excepción de la guía lleva su contraejemplo (el motivo que no vale), y el GREEN incluye un escenario donde esa excepción es la salida fácil.

### Consecuencias

- Las skills de disciplina llevan tablas que crecen; los topes de palabras (ADR 0002) las acotan.
- Escribir una excepción cuesta un escenario más en la prueba.

### Confirmación

Revisión final de la feature que edita la skill.
