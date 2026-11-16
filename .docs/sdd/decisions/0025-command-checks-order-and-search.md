---
status: accepted
date: 2026-11-09
rutas:
  - skills/**/SKILL.md
  - skills/**/references/**
---

# Un olvido de orden o de búsqueda se comprueba con su orden

## Contexto y problema

La [ADR 0003](0003-form-follows-failure.md) elige la forma de la guía según el fallo, y la [ADR 0014](0014-form-for-omissions.md) le añadió el elemento omitido. Las dos dan formas de texto: prohibición, receta, hueco en la plantilla, predicado. Ninguna dice qué hacer cuando lo olvidado es un paso que una orden puede comprobar, y el porqué del Art. II decía «una forma distinta de texto».

Dos features reescribieron en prosa una regla así hasta que una orden la comprobó:

- Feature 0186 ([ticket](../field-reports/20261031-234202-feature-0186-implement-deviations-and-brakes.md) §2): la regla de orden «`tasks.md` antes del primer `task start`», escrita en el paso, en el grafo y como red flag, dio `n1` 0/4; con la CLI rechazando el `task start`, 2/2. Costó 5,20 $ de REFACTOR y una parada.
- Feature 0281 ([ticket](../field-reports/20261102-174302-feature-0281-coherence-pass-scope.md) §1, `tests/coherence-pass-0281-green.md`): la regla de búsqueda de los pasos numerados de una skill retirada dio `co6` 1/2 con «its numbered steps» y 1/2 con «even bare («paso 7»)»; con la orden y su `grep` literal, 2/2, y 4/4 con la medición final. Costó una tanda de REFACTOR, 1,62 $.

En los dos casos el fallo del RED era el mismo que el del GREEN fallido: reescribir la frase no lo movió.

## Opciones consideradas

- Mover la regla a los pasos de las skills donde se escribe la ronda de REFACTOR: la propuesta del triaje; esas skills ya mandan leer el Art. II antes de la ronda, y el Art. II no traía el caso.
- Una viñeta nueva en el Art. II: seis viñetas, y la constitution está en su tope de palabras.
- Sustituir la viñeta del elemento omitido por una que cubra los dos olvidos: la pieza del output y el paso de orden o de búsqueda.

## Decisión

Un olvido de orden o de búsqueda con una orden delante (un verbo de la CLI, un `grep`) se comprueba con esa orden antes de reescribir el texto. Va en la viñeta del elemento omitido, que pasa a nombrar los dos olvidos con su forma, y el porqué del Art. II deja de decir que toda forma es texto: «cada fallo pide su forma». El resto de la ADR 0003 sigue igual: disciplina → prohibición, racionalizaciones y red flags; forma → receta o contrato del output; condicional → predicado observable; una excepción lleva su contraejemplo y un escenario donde es la salida fácil, como enseñó la task 0060 con «es una base común».

### Consecuencias

- Sustituye a la ADR 0003, que pasa a `superseded by 0025`; la ADR 0014 sigue vigente.
- Mantiene las consecuencias de la 0003: las tablas de las skills de disciplina crecen y las acotan los topes de la ADR 0002, y escribir una excepción cuesta un escenario más en la prueba.
- El Art. II sigue con cinco viñetas y la constitution en 2.250 palabras: la viñeta crece y el porqué se acorta.
- Es el Principio 4 aplicado al REFACTOR: lo que una orden comprueba no se vuelve a pedir con texto.

### Confirmación

La revisión final de la feature que edita la skill, como en la 0003: en el diff, la ronda de REFACTOR de una regla de orden o de búsqueda con una orden delante usa esa orden, no otra redacción.
