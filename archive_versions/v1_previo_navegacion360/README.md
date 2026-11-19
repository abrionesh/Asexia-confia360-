# Respaldo de Seguridad - Versión 1 (Previo a Navegación 360 Universal)

Esta carpeta contiene la copia fiel y exacta del código antes de incorporar la **Navegación 360º Universal** (Cajón transversal flotante, trilogía de producto Artículo-Receta-Plato de Carta, Albaranes de entrada y Hub de Reputación conectado).

## Archivos respaldados:
- `dataModel360.v1.ts`: Modelo de datos 360 con los 10 hubs iniciales.
- `RosettaGraphExplorer.v1.tsx`: Explorador de grafo 360 previo.
- `ImpactDashboard.v1.tsx`: Cuadro de impacto de ingredientes previo.
- `AppContext.v1.tsx`: Estado global de navegación previo.
- `App.v1.tsx`: Contenedor principal de la aplicación.

## Para restaurar esta versión rápidamente:
Ejecutar el script desde la raíz del proyecto:
```bash
./archive_versions/v1_previo_navegacion360/restaurar_v1.sh
```
O copiar manualmente los archivos reemplazando los correspondientes en `src/`.
