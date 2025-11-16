export interface Vehiculo {
  id?: string;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: 'motocicleta' | 'automovil' | 'camioneta' | 'camion';
  clienteId: string;
  fechaCreacion: Date;
  activo: boolean;
}