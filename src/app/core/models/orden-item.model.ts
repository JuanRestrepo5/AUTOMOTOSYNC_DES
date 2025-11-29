// src/app/core/models/orden-item.model.ts
export interface OrdenItem {
  id?: string;
  repuestoId: string;
  descripcion?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number; // precioUnitario * cantidad
}
