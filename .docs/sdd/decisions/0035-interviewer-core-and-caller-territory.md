---
status: accepted
date: 2026-11-14
rutas:
  - skills/sdd-grilling/**
  - skills/sdd-explore/SKILL.md
  - skills/sdd-init/SKILL.md
  - skills/sdd-propose/references/spec-writing.md
---

# El entrevistador dice cómo se pregunta; cada skill que pregunta, qué cubre su entrevista y cuándo para

## Contexto y problema

El núcleo de `sdd-grilling` mezclaba cómo se pregunta con qué cubre cada entrevista: el porqué primero era de la spec y de pensar una dirección, y «desde `sdd-explore`, confirma con una pregunta» era de un solo llamante. Cada llamante cargaba reglas que no eran suyas y el núcleo crecía con cada uno.

## Opciones consideradas

- Todo el territorio copiado a sus llamantes de una vez, sin medir.
- El núcleo sin territorio y el territorio de cada llamante en su paso, medido con la batería del entrevistador.
- El territorio en el núcleo, en una sección por llamante.

## Decisión

El núcleo dice solo cómo se pregunta y para donde diga el llamante, o con cada decisión del usuario contestada o pendiente; `sdd-explore` (paso 2), `sdd-init` (paso 3) y `spec-writing.md` de `sdd-propose` dicen qué cubre su entrevista y cuándo para. La batería del entrevistador lo midió (feature 0342): bajar una frase a su llamante funciona si va literal; parafraseada, pierde su contraejemplo y la batería lo nota.

### Consecuencias

- Un llamante nuevo que entrevista escribe su territorio en su paso, no en el núcleo.
- Una regla de territorio que baja a un llamante va literal, con su contraejemplo.
- Cuesta repetir una frase si dos llamantes la necesitan igual: entonces vuelve al núcleo.

### Confirmación

`kit:own` sin reglas repetidas entre skills, y la batería del entrevistador (`tests/batteries/interviewer/`) con cada fila de fondo igual o mejor que el núcleo de antes al tocar el núcleo o un llamante.
