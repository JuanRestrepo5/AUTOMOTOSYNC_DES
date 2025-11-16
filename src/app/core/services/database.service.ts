import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // ============ CLIENTES ============
  async insertCliente(cliente: any): Promise<string> {
    const id = this.generateId();
    await this._storage?.set(`cliente_${id}`, { ...cliente, id });
    
    // Agregar a índice
    const clientes = await this.getClientes();
    clientes.push({ ...cliente, id });
    await this._storage?.set('clientes_index', clientes);
    
    return id;
  }

  async getClientes(): Promise<any[]> {
    const clientes = await this._storage?.get('clientes_index');
    return clientes?.filter((c: any) => c.activo) || [];
  }

  async getClienteById(id: string): Promise<any> {
    return await this._storage?.get(`cliente_${id}`);
  }

  async updateCliente(id: string, data: any): Promise<void> {
    const cliente = await this.getClienteById(id);
    await this._storage?.set(`cliente_${id}`, { ...cliente, ...data });
    
    // Actualizar índice
    const clientes = await this.getClientes();
    const index = clientes.findIndex(c => c.id === id);
    if (index >= 0) {
      clientes[index] = { ...clientes[index], ...data };
      await this._storage?.set('clientes_index', clientes);
    }
  }

  async deleteCliente(id: string): Promise<void> {
    await this.updateCliente(id, { activo: false });
  }

  async searchClientes(query: string): Promise<any[]> {
    const clientes = await this.getClientes();
    const q = query.toLowerCase();
    return clientes.filter(c => 
      c.nombre.toLowerCase().includes(q) || 
      c.telefono.includes(q)
    );
  }

  // ============ VEHÍCULOS ============
  async insertVehiculo(vehiculo: any): Promise<string> {
    const id = this.generateId();
    await this._storage?.set(`vehiculo_${id}`, { ...vehiculo, id });
    
    const vehiculos = await this.getVehiculos();
    vehiculos.push({ ...vehiculo, id });
    await this._storage?.set('vehiculos_index', vehiculos);
    
    return id;
  }

  async getVehiculos(): Promise<any[]> {
    const vehiculos = await this._storage?.get('vehiculos_index');
    return vehiculos?.filter((v: any) => v.activo) || [];
  }

  async getVehiculoById(id: string): Promise<any> {
    return await this._storage?.get(`vehiculo_${id}`);
  }

  async getVehiculosByCliente(clienteId: string): Promise<any[]> {
    const vehiculos = await this.getVehiculos();
    return vehiculos.filter(v => v.clienteId === clienteId);
  }

  async updateVehiculo(id: string, data: any): Promise<void> {
    const vehiculo = await this.getVehiculoById(id);
    await this._storage?.set(`vehiculo_${id}`, { ...vehiculo, ...data });
    
    const vehiculos = await this.getVehiculos();
    const index = vehiculos.findIndex(v => v.id === id);
    if (index >= 0) {
      vehiculos[index] = { ...vehiculos[index], ...data };
      await this._storage?.set('vehiculos_index', vehiculos);
    }
  }

  async deleteVehiculo(id: string): Promise<void> {
    await this.updateVehiculo(id, { activo: false });
  }

  // ============ ÓRDENES ============
  async insertOrden(orden: any): Promise<string> {
    const id = this.generateId();
    const numero = await this.generarNumeroOrden();
    
    await this._storage?.set(`orden_${id}`, { ...orden, id, numero });
    
    const ordenes = await this.getOrdenes();
    ordenes.push({ ...orden, id, numero });
    await this._storage?.set('ordenes_index', ordenes);
    
    return id;
  }

  async getOrdenes(): Promise<any[]> {
    const ordenes = await this._storage?.get('ordenes_index');
    return ordenes?.filter((o: any) => o.activo) || [];
  }

  async getOrdenById(id: string): Promise<any> {
    return await this._storage?.get(`orden_${id}`);
  }

  async getOrdenesByVehiculo(vehiculoId: string): Promise<any[]> {
    const ordenes = await this.getOrdenes();
    return ordenes.filter(o => o.vehiculoId === vehiculoId)
                  .sort((a, b) => b.fechaCreacion - a.fechaCreacion);
  }

  async updateOrden(id: string, data: any): Promise<void> {
    const orden = await this.getOrdenById(id);
    await this._storage?.set(`orden_${id}`, { ...orden, ...data });
    
    const ordenes = await this.getOrdenes();
    const index = ordenes.findIndex(o => o.id === id);
    if (index >= 0) {
      ordenes[index] = { ...ordenes[index], ...data };
      await this._storage?.set('ordenes_index', ordenes);
    }
  }

  async updateOrdenEstado(id: string, estado: string): Promise<void> {
    const updateData: any = { estado };
    if (estado === 'finalizado') {
      updateData.fechaFinalizacion = new Date();
    }
    await this.updateOrden(id, updateData);
  }

  private async generarNumeroOrden(): Promise<string> {
    const ordenes = await this.getOrdenes();
    const numero = ordenes.length + 1;
    return `ORD-${numero.toString().padStart(3, '0')}`;
  }

  // ============ REPUESTOS ============
  async insertRepuesto(repuesto: any): Promise<string> {
    const id = this.generateId();
    await this._storage?.set(`repuesto_${id}`, { ...repuesto, id });
    
    const repuestos = await this.getRepuestos();
    repuestos.push({ ...repuesto, id });
    await this._storage?.set('repuestos_index', repuestos);
    
    return id;
  }

  async getRepuestos(): Promise<any[]> {
    const repuestos = await this._storage?.get('repuestos_index');
    return repuestos?.filter((r: any) => r.activo) || [];
  }

  async getRepuestoById(id: string): Promise<any> {
    return await this._storage?.get(`repuesto_${id}`);
  }

  async getRepuestosBajoStock(): Promise<any[]> {
    const repuestos = await this.getRepuestos();
    return repuestos.filter(r => r.stock < r.stockMinimo);
  }

  async updateRepuesto(id: string, data: any): Promise<void> {
    const repuesto = await this.getRepuestoById(id);
    await this._storage?.set(`repuesto_${id}`, { ...repuesto, ...data });
    
    const repuestos = await this.getRepuestos();
    const index = repuestos.findIndex(r => r.id === id);
    if (index >= 0) {
      repuestos[index] = { ...repuestos[index], ...data };
      await this._storage?.set('repuestos_index', repuestos);
    }
  }

  async deleteRepuesto(id: string): Promise<void> {
    await this.updateRepuesto(id, { activo: false });
  }

  // ============ SYNC QUEUE ============
  async insertSyncQueue(item: any): Promise<void> {
    const id = this.generateId();
    const queue = await this.getPendingChanges();
    queue.push({ ...item, id });
    await this._storage?.set('sync_queue', queue);
  }

  async getPendingChanges(): Promise<any[]> {
    const queue = await this._storage?.get('sync_queue');
    return queue?.filter((item: any) => !item.synced) || [];
  }

  async markChangeSynced(id: string): Promise<void> {
    const queue = await this._storage?.get('sync_queue') || [];
    const index = queue.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      queue[index].synced = true;
      await this._storage?.set('sync_queue', queue);
    }
  }

  // ============ UTILIDADES ============
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}