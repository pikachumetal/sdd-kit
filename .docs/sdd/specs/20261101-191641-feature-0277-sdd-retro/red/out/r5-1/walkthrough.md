# Walkthrough — feature 0081

## 1. Cambios realizados

Recordatorio por correo de cada reserva.

## 5. Aprendizajes

- Un `console.log` de depuración se coló en `src/` en la Task 1 y otra vez en la Task 2; solo lo cazó la revisión final (una pasada de fix cada vez), porque `node --test` antes de cada commit no lo miraba. Destino: `test/sin-depuracion.test.js`, que falla si `src/` tiene un `console.log`/`console.debug` fuera de la salida de la CLI. No es una skill: un test lo frena en cada commit, una skill dependería de que el agente la leyera.
