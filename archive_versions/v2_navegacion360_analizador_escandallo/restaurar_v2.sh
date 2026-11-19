#!/bin/bash
# Script de restauración a Versión 2: Navegación 360 Universal + Analizador en Tiempo Real de Precios y Escandallos
cp archive_versions/v2_navegacion360_analizador_escandallo/dataModel360.ts src/services/dataModel360.ts
cp archive_versions/v2_navegacion360_analizador_escandallo/UniversalDrawer360.tsx src/components/navigation360/UniversalDrawer360.tsx
cp archive_versions/v2_navegacion360_analizador_escandallo/ArticlePriceMarginAnalysis360.tsx src/components/navigation360/ArticlePriceMarginAnalysis360.tsx
cp archive_versions/v2_navegacion360_analizador_escandallo/RosettaGraphExplorer.tsx src/components/cockpit/RosettaGraphExplorer.tsx
cp archive_versions/v2_navegacion360_analizador_escandallo/AppContext.tsx src/context/AppContext.tsx
echo "Versión 2 restaurada con éxito."
