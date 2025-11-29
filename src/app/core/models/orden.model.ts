// src/app/core/models/orden.model.ts
import { OrdenItem } from './orden-item.model';

export type EstadoOrden = 'pendiente' | 'en_proceso' | 'finalizado';

export interface Orden {
  id?: string;
  numero?: string; // Ej: ORD-001
  clienteId: string;
  vehiculoId: string;
  descripcion?: string;
  estado: EstadoOrden;
  fechaCreacion: Date;
  fechaServicio?: Date;
  fechaFinalizacion?: Date;
  mecanicoAsignado?: string;
  observaciones?: string;
  activo: boolean;

  // <-- items de la orden (repuestos / servicios)
  items?: OrdenItem[];

  // valores calculados (opcional)
  manoObra?: number;
  impuestos?: number;
  total?: number;
}
