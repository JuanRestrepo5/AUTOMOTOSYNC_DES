export interface Repuesto {
  id?: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  fechaCreacion: Date;
  activo: boolean;
}