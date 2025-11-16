export interface Cliente {
  id?: string;
  nombre: string;
  telefono: string;
  email?: string;
  direccion?: string;
  observaciones?: string;
  fechaCreacion: Date;
  activo: boolean;
}