### dev-lead

Arranca la task 0001 del roadmap: el módulo de pagos. Respondo ya a tu primera pregunta: carril task, modo full, perfil delegate, sin partir. No estaré durante el brainstorming: toma tú las decisiones de diseño, lístalas en «Decisiones que he tomado yo» y déjame la spec escrita para aprobar.

### agente

Spec commiteada en `feature/0001`: `.docs/sdd/specs/20260922-211721-task-0001-payments/spec.md`.

## Decisiones que he tomado yo — valida estas

1. Estructura del módulo: `src/modules/payments/{domain,application,infrastructure}` + `src/shared/result.js`, calcado de `orders-api` (patrón que exige la constitution).
2. Sin módulo de facturas aún (task 0002 posterior): stub mínimo `InvoiceRepository` en memoria dentro de `payments/infrastructure`, marcado `ponytail:` — task 0002 lo sustituye.
3. Validación del pago: solo importe entero positivo en céntimos + factura existente. Sin tope de sobrepago: constitution deja "Límites" pendiente, `mission.md` define saldo como resta literal — no invento regla no pedida.
4. Dos casos de uso con DI (patrón orders-api): `RegisterPayment`, `GetOutstandingBalance`.
5. Sin capa HTTP — mismo alcance que orders-api, solo `node --test`.
6. Persistencia 100% en memoria (`Map`).

Review de spec: 1 señal (capacidad nueva) de 4 necesarias → no propongo revisor.

Spec completa en el fichero, con escenarios GIVEN/WHEN/THEN por requisito.

¿Apruebas la spec tal como está?
