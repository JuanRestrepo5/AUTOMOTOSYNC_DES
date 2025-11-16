import { Injectable } from '@angular/core';
import { DatabaseService } from '../../../core/services/database.service';
import { SyncService } from '../../../core/services/sync.service';
import { Repuesto } from '../../../core/models/repuesto.model';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  constructor(
    private db: DatabaseService,
    private sync: SyncService,
    private toastController: ToastController
  ) {}

  async createRepuesto(repuesto: Repuesto): Promise<string> {
    const data = {
      ...repuesto,
      fechaCreacion: new Date(),
      activo: true
    };

    const id = await this.db.insertRepuesto(data);
    await this.sync.queueChange('repuestos', 'create', id, data);
    
    // Verificar alerta
    await this.checkStockAlerta(data);
    
    return id;
  }

  async getRepuestos(): Promise<Repuesto[]> {
    return await this.db.getRepuestos();
  }

  async getRepuestoById(id: string): Promise<Repuesto> {
    return await this.db.getRepuestoById(id);
  }

  async updateRepuesto(id: string, repuesto: Partial<Repuesto>): Promise<void> {
    await this.db.updateRepuesto(id, repuesto);
    await this.sync.queueChange('repuestos', 'update', id, repuesto);
    
    // Verificar alerta después de actualizar
    const repuestoActualizado = await this.getRepuestoById(id);
    await this.checkStockAlerta(repuestoActualizado);
  }

  async deleteRepuesto(id: string): Promise<void> {
    await this.db.deleteRepuesto(id);
    await this.sync.queueChange('repuestos', 'update', id, { activo: false });
  }

  async getRepuestosBajoStock(): Promise<Repuesto[]> {
    return await this.db.getRepuestosBajoStock();
  }

  private async checkStockAlerta(repuesto: Repuesto): Promise<void> {
    if (repuesto.stock < repuesto.stockMinimo) {
      const toast = await this.toastController.create({
        message: `⚠️ Stock Bajo: ${repuesto.nombre} (${repuesto.stock} unidades)`,
        duration: 3000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
    }
  }

  isStockBajo(repuesto: Repuesto): boolean {
    return repuesto.stock < repuesto.stockMinimo;
  }
}