import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatabaseService } from './database.service';
import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private syncInterval: any;
  private isOnline = true;

  constructor(
    private db: DatabaseService,
    private firestore: AngularFirestore
  ) {
    this.initNetworkListener();
    this.initAutoSync();
  }

  private async initNetworkListener() {
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
      if (this.isOnline) {
        console.log('🌐 Conexión restaurada - Sincronizando...');
        this.syncAll();
      } else {
        console.log('📴 Sin conexión - Modo offline');
      }
    });
  }

  private initAutoSync() {
    // Sincronizar cada 5 minutos si hay conexión
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncAll();
      }
    }, 5 * 60 * 1000);
  }

  async syncAll(): Promise<void> {
    if (!this.isOnline) {
      console.log('📴 Sin conexión - Sincronización cancelada');
      return;
    }

    try {
      console.log('🔄 Iniciando sincronización...');
      
      // Obtener cambios pendientes
      const pendingChanges = await this.db.getPendingChanges();
      
      // Subir cada cambio
      for (const change of pendingChanges) {
        await this.uploadChange(change);
        await this.db.markChangeSynced(change.id);
      }
      
      console.log('✅ Sincronización completada');
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
    }
  }

  private async uploadChange(change: any): Promise<void> {
    const { collection, action, docId, data } = change;

    try {
      switch (action) {
        case 'create':
          await this.firestore.collection(collection).doc(docId).set(data);
          break;
        case 'update':
          await this.firestore.collection(collection).doc(docId).update(data);
          break;
        case 'delete':
          await this.firestore.collection(collection).doc(docId).delete();
          break;
      }
    } catch (error) {
      console.error(`Error subiendo ${action} en ${collection}:`, error);
      throw error;
    }
  }

  async queueChange(collection: string, action: string, docId: string, data: any): Promise<void> {
    await this.db.insertSyncQueue({
      collection,
      action,
      docId,
      data,
      timestamp: new Date(),
      synced: false
    });
  }

  getConnectionStatus(): boolean {
    return this.isOnline;
  }
}