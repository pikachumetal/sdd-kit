# Arquitectura — reservas

Monorepo moon con dos proyectos: `frontend/` (SPA Angular) y `backend/` (API REST). El frontend habla con el backend por `/api`, con proxy en desarrollo. El backend sigue vertical slices: una carpeta por feature con endpoint, handler y tests.
