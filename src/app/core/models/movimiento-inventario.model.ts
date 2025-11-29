// src/app/core/models/movimiento-inventario.model.ts
export interface MovimientoInventario {
  id?: string;
  repuestoId: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  cantidadAnterior: number;
  cantidadPosterior: number;
  fecha: Date;
  descripcion: string;
  usuario?: string;
  ordenId?: string; // referencia a la orden si es por uso en orden
  motivo?: 'compra' | 'devolucion' | 'uso_orden' | 'ajuste' | 'otro';
}
