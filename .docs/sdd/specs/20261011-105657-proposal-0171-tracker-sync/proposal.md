---
id: 20261011-105657-proposal-0171-tracker-sync
proposal: 0171
title: Sincronizar el roadmap con el gestor de tareas (Azure DevOps, GitHub, Jira)
source: meeting
created: 2026-10-11
---

# Propuesta — Sincronizar el roadmap con el gestor de tareas

## Por qué

En los equipos que usan el kit, las tareas viven también en un gestor (Azure DevOps en el equipo, Jira en un proyecto externo, GitHub en otros casos), y allí se imputan las horas. Hoy el roadmap y el gestor no se hablan: lo que nace en el kit no llega al gestor, y lo que crea el PO en el gestor solo entra si alguien lo trae con `sdd-roadmap`. Se quiere que todo lo que se hace exista donde se imputa, sin pedir a los proyectos un flujo de trabajo que no tienen.

**Aparcada por el dev-lead hasta la v3 (2026-10-11)**: «dejémoslo para cuando tengamos la v3 o cuando se me encienda la luz, porque ahora no lo veo nada claro». Nada de abajo está decidido.

## Reglas de negocio

Ninguna decidida. Pregunta abierta en la que se paró la conversación: **¿dónde vive la existencia y el id de cada tarea?**

- **A, el gestor manda la existencia**: toda tarea existe en el gestor con su id; la que crea el PO baja al roadmap, y la que nace en el kit se crea en el gestor con el OK del dev y usa ese id. El roadmap guarda lo que el gestor no tiene: orden de la ola, carril, partición en features y propuesta. Ejemplo: la US 4512 «Formatear las celdas vinculadas del Excel», creada por el PO, baja como fila 4512 partida en tres features; «el botón azul va rojo», que encuentra el dev, se crea como Bug 4530 y entra como fila «Patch:» 4530. Coste: el kit escribe en el gestor (credenciales y API por gestor). Era la recomendada.
- **B, cada lado crea y se enlaza después**: id del kit (0014) e id del gestor (4512), enlazados por la columna «Externo» que prevé la 0150. Coste: dos ids, y lo que nace en el kit puede quedarse sin item donde se imputan horas.
- **C, el roadmap manda y el gestor es un espejo**: choca con los proyectos en que el PO da de alta las tareas.

Preguntas que quedaron detrás de esa: qué nivel del gestor es una fila del roadmap (la «super-feature»: una user story que son 3-4 features), qué parte del roadmap se sincroniza («las olas»), y dónde caen las horas.

## Capacidades que toca

- `planning` y `roadmap` — entrada y forma de las filas que vienen del gestor o van a él.
- `feature-ids` — `ids.mode: tracker` y el id que se crea en el gestor.

## Reparto

Pendiente: sin reglas decididas no hay reparto.

## Acta

Conversación del dev-lead con el agente, 2026-10-10 y 2026-10-11, durante la feature 0161. Frases literales del dev-lead:

1. «lo de matt que se conecta a github esta guay por que asi tenemos los dis alli, en nuestro caso usamos AzureDevOps y en un proyetco que estoy de externo usamos Jira»
2. «El roadmap esta muy bien pero nosotros imputamos horas en el AzureDevOps asi que si necesito TODO, quizas no a nivel de feature, le voy a llamar super-feature, a veces un patch es un path el boton esta en azul y va rojo (es una estupidez, como ejemplo) y se tiene que guardar...»
3. «nos vendria bien sincronizar el roadmap con azuredevops o github (jira ya veremos) evidentemento no seria todo el roadmap... seria las olas o asi, y tendria que funcionar que el azure manda o el roadmap manda que las tareas las manda el product owner al azure y las bajamos de alli o las subes tu hacia el azure...»
4. «y el tamaño de tarea/feature seria... por ejemplo en azure devops tenemos bug/user story... una tarea por ejemplo en GCO es "Formatear las celdas vinculadas del excel" y eso vienen a ser 3 o 4 features»
5. «no tenemos ningun workflow... alguno sproyetcos el po o el jefe de proyetcos da de alta las tareas, otros el dev va creando las tareas, aveces son los dos, algunas tareas las pone el po otras el dev despues d ehablar con el cliento o el po, va haciendo tarabajo ...»
6. Contexto de la misma conversación: «en principio todo va al roadmap antes no? que sino no sabemos que estamos haciendo no?»; y que el kit tiene que funcionar también para quien sabe QUÉ quiere y no CÓMO («Lo importante es que funcione en los dos casos»).

Referencias que salieron: `to-issues` y `prd-to-issues` de Matt Pocock (los issues de GitHub como backlog con sus ids); `/kiro-discovery` y `/kiro-spec-batch` de cc-sdd (el roadmap por oleadas).

## Enmiendas
