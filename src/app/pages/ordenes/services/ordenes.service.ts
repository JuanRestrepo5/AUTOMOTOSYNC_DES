import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../core/services/database.service';
import { SyncService } from '../../../core/services/sync.service';
import { Orden, EstadoOrden } from '../../../core/models/orden.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  constructor(
    private db: DatabaseService,
    private sync: SyncService
  ) {}

  async createOrden(orden: Orden): Promise<string> {
    const data = {
      ...orden,
      estado: 'pendiente' as EstadoOrden,
      fechaCreacion: new Date(),
      activo: true
    };

    const id = await this.db.insertOrden(data);
    await this.sync.queueChange('ordenes', 'create', id, data);
    
    return id;
  }

  async getOrdenes(): Promise<Orden[]> {
    return await this.db.getOrdenes();
  }

  async getOrdenById(id: string): Promise<Orden> {
    return await this.db.getOrdenById(id);
  }

  async updateOrden(id: string, orden: Partial<Orden>): Promise<void> {
    await this.db.updateOrden(id, orden);
    await this.sync.queueChange('ordenes', 'update', id, orden);
  }

  async updateEstado(id: string, estado: EstadoOrden): Promise<void> {
    await this.db.updateOrdenEstado(id, estado);
    await this.sync.queueChange('ordenes', 'update', id, { estado });
  }

  async getOrdenesByEstado(estado: EstadoOrden): Promise<Orden[]> {
    const ordenes = await this.getOrdenes();
    return ordenes.filter(o => o.estado === estado);
  }

  async getOrdenesByVehiculo(vehiculoId: string): Promise<Orden[]> {
    return await this.db.getOrdenesByVehiculo(vehiculoId);
  }

  getEstadoBadgeClass(estado: EstadoOrden): string {
    const badges = {
      'pendiente': 'badge-pending',
      'en_proceso': 'badge-process',
      'finalizado': 'badge-completed'
    };
    return badges[estado] || '';
  }

  getEstadoLabel(estado: EstadoOrden): string {
    const labels = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'finalizado': 'Finalizado'
    };
    return labels[estado] || estado;
  }
}