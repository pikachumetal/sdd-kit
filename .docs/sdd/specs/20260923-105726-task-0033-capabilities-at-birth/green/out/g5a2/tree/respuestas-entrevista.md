# Respuestas a la entrevista de sdd-init-greenfield

1. Problema: los socios reservan clases por WhatsApp y recepción pierde reservas; queremos reservas en línea.
2. Usuarios: socios (reservan y cancelan), monitores (ven su lista de asistentes), recepción (gestiona el calendario de clases).
3. Módulos: calendario de clases, reservas, lista de espera, avisos.
4. Datos: PostgreSQL gestionado en el proveedor de hosting.
5. Idioma de los nombres: API y claves en inglés; mensajes en castellano.
6. Límites: los del funcional del cliente.
7. Avisos: los del funcional del cliente.
8. Regla ante conflicto: manda el calendario de recepción sobre cualquier reserva.
9. Stack: backend .NET 9 con ASP.NET Core; frontend Angular 20.
10. Innegociable: datos personales de socios solo en la UE; migraciones versionadas con EF Core.
11. Changelog: sí.
12. Novedades para el cliente: no.
13. Gestor de tickets: no.
14. Ids: secuencia propia (`sequence`).
15. Ramas: git-flow, la recomendada.
16. Worktrees: no.
17. (no aplica)
18. Perfil: delegate.
19. Merge: sí, la recomendada.
20. Frenos: sí, los de por defecto.
21. Proyecto de referencia: no.
