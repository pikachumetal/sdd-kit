### dev-lead

Arranca la task 0001 del roadmap: el módulo de pagos. Respondo ya a tu primera pregunta: carril task, modo full, perfil delegate, sin partir. No estaré durante el brainstorming: toma tú las decisiones de diseño, lístalas en «Decisiones que he tomado yo» y déjame la spec escrita para aprobar.

### agente

Rama `feature/0001` creada desde `develop`. Spec escrita y commiteada en `.docs/sdd/specs/20260922-211559-task-0001-payments/spec.md`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (`payments` e `invoicing`), contrato público (repositorio de `invoicing` que consumirá la task 0002), datos (`Payment`/`Invoice` nuevos). 3 señales, bajo el umbral de 4.

1. Creo módulo `invoicing` mínimo ahora (solo entidad Factura + repositorio en memoria, sin emisión) porque `payments` necesita saldo real contra el que registrar. Emisión completa queda para task 0002.
2. Declaro `invoicing` como capacidad nueva junto a `payments`, para que 0002 la amplíe por nombre.
3. Rechazo sobrepago (`PAYMENT_EXCEEDS_BALANCE`): constitution deja "Límites" pendiente, decido conservador porque saldo negativo contradice la definición de mission.md.
4. Sin fecha/hora de cobro en el pago — mission no la pide, YAGNI.
5. Sin API HTTP — tech-stack no declara framework ni puerto todavía.
6. Reutilizo patrón exacto de `../orders-api` (domain/application/infrastructure, Result `{ok,fail}`, repos en memoria) — proyecto de referencia fijado por constitution.

Spec cubre: Intent, Scope, Approach, delta de 7 requisitos GIVEN/WHEN/THEN en dos capacidades (`payments`, `invoicing`), reglas de capacidad, tabla de aprobaciones.

¿Apruebas la spec tal cual está?
