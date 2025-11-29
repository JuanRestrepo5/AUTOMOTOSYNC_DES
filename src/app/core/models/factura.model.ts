// src/app/core/models/factura.model.ts
import { OrdenItem } from './orden-item.model';

export type EstadoFactura = 'borrador' | 'emitida' | 'pagada' | 'cancelada';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'cheque';

export interface Factura {
  id?: string;
  numeroFactura: string; // Ej: FAC-001-2024
  ordenId: string; // referencia a la orden
  clienteId: string;
  fecha: Date;
  fechaVencimiento?: Date;
  
  // items de la factura (repuestos/servicios)
  items: OrdenItem[];
  
  // cálculos
  subtotal: number; // suma de repuestos
  descuento?: number;
  impuestos: number; // IVA, etc
  total: number; // subtotal + impuestos - descuento
  
  // detalles
  estado: EstadoFactura;
  metodoPago?: MetodoPago;
  observaciones?: string;
  
  // auditoría
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  fechaModificacion?: Date;
  
  activo: boolean;
}
