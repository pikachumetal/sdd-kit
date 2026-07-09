---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
title: Data model — <título de la spec>
spec: ./spec.md
plan: ./plan.md
status: draft
created: <YYYY-MM-DD>
---

# Data model — <título>

> Documento opcional: crear cuando la spec introduce o modifica entidades/documentos con
> suficiente complejidad para no caber en `plan.md` §1.2. Fuente de verdad: este fichero;
> el código lo implementa. Borra los bloques de ayuda (`>`) al redactar.

## 1. Entidades

### 1.1 <EntityName>

**Almacén**: <tabla / colección / contexto — según `architecture.md`>

| Campo | Tipo | Tipo en BD | Required | Notas |
| --- | --- | --- | --- | --- |
| `Id` | | | sí | PK — convención del proyecto |

**Relaciones**: <N:1, 1:N…>

**Índices**: <compuestos, únicos — y CÓMO se crean en este proyecto (migración, a mano…)>

## 2. Migraciones

> Mecanismo y nomenclatura del proyecto: ver `tech-stack.md` y la skill de nivel 2
> correspondiente (`sql-migration` o equivalente). En brownfield: retrocompatibilidad por
> defecto; los datos existentes no se migran en masa sin justificación escrita.

## 3. Traducciones *(si aplica)*

Idiomas del proyecto y mecanismo (ver skill de nivel 2 si existe).

## 4. Patrón de persistencia

> Seguir el patrón del proyecto documentado en `architecture.md` (CQRS sin repositories,
> Domain → Repository → UnitOfWork, etc.) — no introducir un patrón nuevo desde un data model.
