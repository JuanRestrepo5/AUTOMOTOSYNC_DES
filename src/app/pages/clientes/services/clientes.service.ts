import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../core/services/database.service';
import { SyncService } from '../../../core/services/sync.service';
import { Cliente } from '../../../core/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  constructor(
    private db: DatabaseService,
    private sync: SyncService
  ) {}

  async createCliente(cliente: Cliente): Promise<string> {
    const data = {
      ...cliente,
      fechaCreacion: new Date(),
      activo: true
    };

    const id = await this.db.insertCliente(data);
    
    // Encolar para sincronización
    await this.sync.queueChange('clientes', 'create', id, data);
    
    return id;
  }

  async getClientes(): Promise<Cliente[]> {
    return await this.db.getClientes();
  }

  async getClienteById(id: string): Promise<Cliente> {
    return await this.db.getClienteById(id);
  }

  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<void> {
    await this.db.updateCliente(id, cliente);
    await this.sync.queueChange('clientes', 'update', id, cliente);
  }

  async deleteCliente(id: string): Promise<void> {
    await this.db.deleteCliente(id);
    await this.sync.queueChange('clientes', 'update', id, { activo: false });
  }

  async searchClientes(query: string): Promise<Cliente[]> {
    return await this.db.searchClientes(query);
  }

  async getVehiculosCliente(clienteId: string): Promise<any[]> {
    return await this.db.getVehiculosByCliente(clienteId);
  }
}