// src/app/core/services/firebase-sync.service.ts
import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  CollectionReference,
  query,
  where
} from '@angular/fire/firestore';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseSyncService {
  
  constructor(
    private firestore: Firestore,
    private db: DatabaseService
  ) {}

  /**
   * Sincronizar todos los datos desde Firebase a local
   */
  async syncAllFromFirebase(): Promise<void> {
    console.log('🔄 Iniciando sincronización desde Firebase...');
    
    try {
      await Promise.all([
        this.syncClientes(),
        this.syncVehiculos(),
        this.syncOrdenes(),
        this.syncRepuestos()
      ]);
      
      console.log('✅ Sincronización completada');
    } catch (error) {
      console.error('❌ Error en sincronización:', error);
      throw error;
    }
  }

  /**
   * Sincronizar clientes desde Firebase
   */
  async syncClientes(): Promise<void> {
    try {
      const clientesRef = collection(this.firestore, 'clientes');
      const snapshot = await getDocs(clientesRef);
      
      console.log(`📥 Sincronizando ${snapshot.size} clientes...`);
      
      // Limpiar índice local
      await this.db['_storage']?.set('clientes_index', []);
      
      const clientes: any[] = [];
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const cliente = {
          id: docSnap.id,
          ...data,
          fechaCreacion: data['fechaCreacion']?.toDate?.() || new Date()
        };
        
        // Guardar en storage local
        await this.db['_storage']?.set(`cliente_${docSnap.id}`, cliente);
        clientes.push(cliente);
      }
      
      // Actualizar índice
      await this.db['_storage']?.set('clientes_index', clientes);
      console.log(`✅ ${clientes.length} clientes sincronizados`);
      
    } catch (error) {
      console.error('Error sincronizando clientes:', error);
    }
  }

  /**
   * Sincronizar vehículos desde Firebase
   */
  async syncVehiculos(): Promise<void> {
    try {
      const vehiculosRef = collection(this.firestore, 'vehiculos');
      const snapshot = await getDocs(vehiculosRef);
      
      console.log(`📥 Sincronizando ${snapshot.size} vehículos...`);
      
      await this.db['_storage']?.set('vehiculos_index', []);
      
      const vehiculos: any[] = [];
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const vehiculo = {
          id: docSnap.id,
          ...data,
          fechaCreacion: data['fechaCreacion']?.toDate?.() || new Date()
        };
        
        await this.db['_storage']?.set(`vehiculo_${docSnap.id}`, vehiculo);
        vehiculos.push(vehiculo);
      }
      
      await this.db['_storage']?.set('vehiculos_index', vehiculos);
      console.log(`✅ ${vehiculos.length} vehículos sincronizados`);
      
    } catch (error) {
      console.error('Error sincronizando vehículos:', error);
    }
  }

  /**
   * Sincronizar órdenes desde Firebase
   */
  async syncOrdenes(): Promise<void> {
    try {
      const ordenesRef = collection(this.firestore, 'ordenes');
      const snapshot = await getDocs(ordenesRef);
      
      console.log(`📥 Sincronizando ${snapshot.size} órdenes...`);
      
      await this.db['_storage']?.set('ordenes_index', []);
      
      const ordenes: any[] = [];
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const orden = {
          id: docSnap.id,
          ...data,
          fechaCreacion: data['fechaCreacion']?.toDate?.() || new Date(),
          fechaServicio: data['fechaServicio']?.toDate?.() || null,
          fechaFinalizacion: data['fechaFinalizacion']?.toDate?.() || null
        };
        
        await this.db['_storage']?.set(`orden_${docSnap.id}`, orden);
        ordenes.push(orden);
      }
      
      await this.db['_storage']?.set('ordenes_index', ordenes);
      console.log(`✅ ${ordenes.length} órdenes sincronizadas`);
      
    } catch (error) {
      console.error('Error sincronizando órdenes:', error);
    }
  }

  /**
   * Sincronizar repuestos desde Firebase
   */
  async syncRepuestos(): Promise<void> {
    try {
      const repuestosRef = collection(this.firestore, 'repuestos');
      const snapshot = await getDocs(repuestosRef);
      
      console.log(`📥 Sincronizando ${snapshot.size} repuestos...`);
      
      await this.db['_storage']?.set('repuestos_index', []);
      
      const repuestos: any[] = [];
      
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const repuesto = {
          id: docSnap.id,
          ...data,
          fechaCreacion: data['fechaCreacion']?.toDate?.() || new Date()
        };
        
        await this.db['_storage']?.set(`repuesto_${docSnap.id}`, repuesto);
        repuestos.push(repuesto);
      }
      
      await this.db['_storage']?.set('repuestos_index', repuestos);
      console.log(`✅ ${repuestos.length} repuestos sincronizados`);
      
    } catch (error) {
      console.error('Error sincronizando repuestos:', error);
    }
  }

  /**
   * Sincronizar una colección específica
   */
  async syncCollection(collectionName: string): Promise<void> {
    switch (collectionName) {
      case 'clientes':
        await this.syncClientes();
        break;
      case 'vehiculos':
        await this.syncVehiculos();
        break;
      case 'ordenes':
        await this.syncOrdenes();
        break;
      case 'repuestos':
        await this.syncRepuestos();
        break;
      default:
        console.warn(`Colección ${collectionName} no soportada`);
    }
  }
}