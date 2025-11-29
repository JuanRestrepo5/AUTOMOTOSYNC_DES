#!/bin/bash
# Script de validación del proyecto AUTOMOTOSYNC

echo "🔍 VALIDACIÓN RÁPIDA - AUTOMOTOSYNC"
echo "===================================="
echo ""

# Verificar archivos críticos
echo "📁 Verificando archivos creados..."
echo ""

archivos=(
  "src/app/core/services/factura.service.ts"
  "src/app/core/services/reportes.service.ts"
  "src/app/core/models/factura.model.ts"
  "src/app/core/models/movimiento-inventario.model.ts"
  "src/app/pages/ordenes/orden-repuestos/orden-repuestos.component.ts"
  "src/app/pages/ordenes/orden-factura/orden-factura.component.ts"
  "src/app/pages/reportes/reportes.page.ts"
)

for archivo in "${archivos[@]}"; do
  if [ -f "$archivo" ]; then
    echo "✅ $archivo"
  else
    echo "❌ $archivo"
  fi
done

echo ""
echo "📊 Estadísticas del Código:"
echo "============================"

# Contar líneas de código
echo ""
echo "Servicios:"
wc -l src/app/core/services/factura.service.ts 2>/dev/null || echo "- factura.service.ts: ?"
wc -l src/app/core/services/reportes.service.ts 2>/dev/null || echo "- reportes.service.ts: ?"

echo ""
echo "Componentes:"
wc -l src/app/pages/ordenes/orden-repuestos/orden-repuestos.component.ts 2>/dev/null || echo "- orden-repuestos: ?"
wc -l src/app/pages/reportes/reportes.page.ts 2>/dev/null || echo "- reportes.page: ?"

echo ""
echo "✅ VALIDACIÓN COMPLETADA"
