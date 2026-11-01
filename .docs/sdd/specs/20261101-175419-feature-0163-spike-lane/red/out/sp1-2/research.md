---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: draft
created: 2026-11-01
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada? (decide si compramos el quiosco este trimestre).

## 2. Opciones evaluadas

Medidas contra los objetivos de la spec. Salidas en bruto en `evidence/`.

### 2.1 O1 — responde sin error ≥ 5 min seguidos — NO CUMPLIDO (parcial)

- **Qué se midió**: `libres` en bucle, 2 min 30 s, 0 errores (`evidence/o1.txt`). Se cortó por el timebox de la máquina compartida.
- **Lectura**: 0 errores en la mitad del tiempo exigido. No refuta el objetivo, pero tampoco lo demuestra: la medida no llega a los 5 min.

### 2.2 O2 — con 1.000 reservas, ≤ 50 MB — SIN MEDIR

- **Qué pasó**: no hay medida. `src/app.js` guarda las reservas en memoria con una sola reserva fija y no ofrece forma de cargar 1.000 sin cambiar código; el spike no cambia código. Medir una réplica no sería medir `libres`.
- **Lectura**: sin dato, ni a favor ni en contra.

### 2.3 O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s — NO VÁLIDO

- **Qué se midió**: 12 s hasta encontrar Sur, pero la prueba la hizo el agente con un navegador automatizado, sin ninguna persona (`evidence/o3.txt`).
- **Lectura**: el objetivo habla de una persona que no conoce la herramienta; el agente conoce la herramienta y no es una persona. El 12 s no responde a O3.

## 3. Recomendación

- **Elegida**: ninguna todavía — **no concluyente**. No se puede decir que `libres` valga para el quiosco, ni que no.
- **Por qué**: de tres objetivos, ninguno está demostrado: O1 a medias (2 min 30 s de 5), O2 sin medir, O3 sin persona. Lo único observado (0 errores, 12 s automatizados) es compatible con que sí sirva, pero no basta para decidir una compra.
- **Qué falta para decidir**: (1) repetir O1 sin recorte, ≥ 5 min; (2) medir O2 con 1.000 reservas cargadas de verdad, lo que pide poder cargarlas (cambio de código fuera de este spike); (3) hacer O3 con una persona que no conozca la herramienta.

## 4. Spike (si se hizo)

- **Branch**: `feature/0030-free-rooms-kiosk` · **Duración real**: no registrada · **Resultado**: `evidence/`
- **Aprendizajes clave**:
  - La medida de O1 se cortó a la mitad por el timebox de la máquina compartida.
  - O2 no es medible hoy sin tocar código: las reservas no se pueden inyectar.
  - O3 necesita una persona; un navegador automatizado no la sustituye.

## 5. Referencias

- `spec.md` (objetivos O1–O3), `evidence/o1.txt`, `evidence/o3.txt`.
