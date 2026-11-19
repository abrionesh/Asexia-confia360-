#!/bin/bash
# Script para restaurar rápidamente a la Versión 1 anterior a Navegación 360 Universal
cp archive_versions/v1_previo_navegacion360/dataModel360.v1.ts src/services/dataModel360.ts
cp archive_versions/v1_previo_navegacion360/RosettaGraphExplorer.v1.tsx src/components/cockpit/RosettaGraphExplorer.tsx
cp archive_versions/v1_previo_navegacion360/ImpactDashboard.v1.tsx src/components/cockpit/ImpactDashboard.tsx
cp archive_versions/v1_previo_navegacion360/AppContext.v1.tsx src/context/AppContext.tsx
cp archive_versions/v1_previo_navegacion360/App.v1.tsx src/App.tsx
echo "Restauración a Versión 1 completada con éxito."
