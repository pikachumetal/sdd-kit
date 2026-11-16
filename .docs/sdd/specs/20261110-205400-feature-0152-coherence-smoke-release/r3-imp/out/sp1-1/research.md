---
id: 20261015-100000-feature-0030-free-rooms-kiosk
title: Research — ¿puede `libres` ir en el quiosco de la entrada?
spec: ./spec.md
status: draft
created: 2026-11-12
timeboxed: 2h
---

# Research — `libres` en el quiosco de la entrada

## 1. Pregunta a resolver

¿Puede `libres` ir en el quiosco de la entrada?

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — `libres` responde sin error ≥ 5 min seguidos | no cumple tal como se definió | 0 errores, pero solo 2 min 30 s de los 5 min exigidos: se cortó por el timebox de la máquina compartida. Sin errores no prueba el umbral. | `evidence/o1.txt` |
| O2 — con 1.000 reservas, ≤ 50 MB de memoria | no cumple tal como se definió | RSS del proceso 63,8 MB con 1.000 reservas, por encima de 50 MB. Pero un `node` vacío ya tiene 62,6 MB: `libres` suma ~1,2 MB y el heap usado es 5 MB. El umbral, medido como RSS, es inalcanzable con Node; hay que redefinirlo (heap, o RSS sin el runtime). | `evidence/o2.txt` |
| O3 — una persona que no conoce la herramienta encuentra una sala libre en < 30 s, sin ayuda | no medido con una persona | El agente lo simuló con un navegador automatizado: 12 s. No cuenta como medida con una persona. | `evidence/o3.txt` |
| O4 — con 1.000 reservas, `libres` responde en < 50 ms | cumple | 0,0137 ms por llamada con 1.000 reservas (3 ms con 100 en la primera medida, que no era la peor carga). Medido en proceso, sobre la función, no a través del quiosco. | `evidence/o4-aguante-1000.txt` (`evidence/o4.txt`: la medida con 100) |

## 3. Aguante

Carga: 1.000 reservas activas (confirmada por el dev-lead: «esa es la peor, sí»).

| Repetición | Tiempo | Recurso acumulado |
| --- | --- | --- |
| 1 | 0,0140 ms | 4,88 MB heap |
| 2 | 0,0137 ms | 4,79 MB |
| 3 | 0,0130 ms | 5,31 MB |
| 4 | 0,0133 ms | 4,87 MB |
| 5 | 0,0132 ms | 5,40 MB |
| 6 | 0,0135 ms | 4,96 MB |
| 7 | 0,0134 ms | 5,49 MB |
| 8 | 0,0136 ms | 5,06 MB |
| 9 | 0,0094 ms | 5,56 MB |
| 10 | 0,0037 ms | 4,95 MB |

El tiempo cumple en las 10 repeticiones. El heap oscila entre 4,8 y 5,6 MB sin crecer de forma sostenida.

## 4. Recomendación

- **Elegida**: no comprar el quiosco este trimestre con esta evidencia; la decisión queda abierta. · **Por qué**: solo O4 cumple. O1 y O2 no cumplen tal como se definieron y O3 no se midió con una persona. Un resultado no concluyente no es un «sí».
- **Descartadas**: (a) comprar ya, porque dos objetivos no cumplen y uno no está medido; (b) dar O2 por cumplido por el heap, porque cambiaría el umbral que aprobó el dev-lead sin su visto bueno.

Para decidir faltan: repetir O1 con 5 min completos, una prueba de O3 con una persona real, y que el dev-lead diga cómo se mide O2 (heap o RSS sin runtime).

## 5. Lo que sale

- nada
