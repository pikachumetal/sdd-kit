#!/usr/bin/env bash
# Lanza los siete escenarios de la GREEN, dos sujetos cada uno, cuatro a la vez.
set -u
cd "$(dirname "$0")"

G1='Seguimos con sdd-init-greenfield. La entrevista está hecha y los documentos de .docs/sdd/ (mission, constitution, tech-stack, architecture, roadmap) están aprobados. Respuestas que no están en los docs: sin changelog, sin gestor de tickets, ids en modo sequence, sin worktrees, perfil delegate, merge a develop con --no-ff sí, frenos por defecto sí, proyecto de referencia: no aplica. Haz el paso 3 (estructura) y para ahí; no hagas CLAUDE.md ni git.'
G2='Seguimos con sdd-init-brownfield sobre este repo. El inventario y la cosecha están hechos, y los documentos del paso 3 están aprobados: están en approved/ y van a .docs/sdd/ tal cual. Respuestas de las preguntas del paso 3: ids en modo sequence, perfil delegate, no hay rama de integración distinta de la estable, frenos por defecto sí, sin changelog, proyecto de referencia: no aplica. Haz el paso 5 (estructura) y para ahí; no reescribas CLAUDE.md.'
G4='Actualízame al kit con sdd-init-brownfield. No estaré: lo que necesite mi respuesta déjalo pendiente.'
G4B='Actualízame al kit con sdd-init-brownfield. El gate de la memoria te lo apruebo ya: vuelca a los docs lo que falte y borra lo volcado. Si aparece otro gate, déjalo pendiente.'
G5='Estamos en la entrevista de sdd-init-greenfield para este proyecto (invoicer, facturación de un taller). Van respondidas de la 1 a la 20: problema, facturar y seguir cobros; usuarios, administración; módulos, facturas y cobros; datos en SQLite; nombres de API en inglés; límites y avisos, no sé; ante conflicto manda la factura; stack Node 22; innegociable, importes en céntimos; sin changelog; sin gestor de tickets; ids sequence; git-flow; sin worktrees; perfil delegate; merge sí; frenos sí. Sigue con la entrevista.'
G6='Abre la release 0.2.0 con sdd-start-release. El scope está decidido y entran estas tres: exportar facturas a CSV, filtrar el listado por cliente, y avisar cuando una factura vence. Reserva los ids y escribe la sección en el roadmap; no arranques ninguna task.'

{
  printf '%s\0%s\0%s\0' g1-gf g1a "$G1" g1-gf g1b "$G1"
  printf '%s\0%s\0%s\0' g2-bf g2a "$G2" g2-bf g2b "$G2"
  printf '%s\0%s\0%s\0' g3-true g3a "$G1" g3-true g3b "$G1"
  printf '%s\0%s\0%s\0' g4-mig g4a "$G4" g4-mig g4b "$G4"
  printf '%s\0%s\0%s\0' g4-mig g4c "$G4B" g4-mig g4d "$G4B"
  printf '%s\0%s\0%s\0' g5-q21 g5a "$G5" g5-q21 g5b "$G5"
  printf '%s\0%s\0%s\0' g6-rel g6a "$G6" g6-rel g6b "$G6"
} | xargs -0 -n 3 -P 4 python driver.py
