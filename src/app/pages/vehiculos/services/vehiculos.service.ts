import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../core/services/database.service';
import { SyncService } from '../../../core/services/sync.service';
import { Vehiculo } from '../../../core/models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  constructor(
    private db: DatabaseService,
    private sync: SyncService
  ) {}

  async createVehiculo(vehiculo: Vehiculo): Promise<string> {
    const data = {
      ...vehiculo,
      fechaCreacion: new Date(),
      activo: true
    };

    const id = await this.db.insertVehiculo(data);
    await this.sync.queueChange('vehiculos', 'create', id, data);
    
    return id;
  }

  async getVehiculos(): Promise<Vehiculo[]> {
    return await this.db.getVehiculos();
  }

  async getVehiculoById(id: string): Promise<Vehiculo> {
    return await this.db.getVehiculoById(id);
  }

  async updateVehiculo(id: string, vehiculo: Partial<Vehiculo>): Promise<void> {
    await this.db.updateVehiculo(id, vehiculo);
    await this.sync.queueChange('vehiculos', 'update', id, vehiculo);
  }

  async deleteVehiculo(id: string): Promise<void> {
    await this.db.deleteVehiculo(id);
    await this.sync.queueChange('vehiculos', 'update', id, { activo: false });
  }

  async getHistorialServicios(vehiculoId: string): Promise<any[]> {
    return await this.db.getOrdenesByVehiculo(vehiculoId);
  }
}