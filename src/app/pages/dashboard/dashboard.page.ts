import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel,
  IonBadge, IonProgressBar, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  constructOutline, carOutline, cashOutline, warningOutline,
  cloudDoneOutline, cloudOfflineOutline, peopleOutline,
  documentTextOutline, cubeOutline, statsChartOutline
} from 'ionicons/icons';

import { ClientesService } from '../clientes/services/clientes.service';
import { VehiculosService } from '../vehiculos/services/vehiculos.service';
import { OrdenesService } from '../ordenes/services/ordenes.service';
import { InventarioService } from '../inventario/services/inventario.service';
import { SyncService } from '../../core/services/sync.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonRefresher, IonRefresherContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonButton, IonIcon, IonList, IonItem, IonLabel,
    IonBadge, IonProgressBar, IonSpinner
  ]
})
export class DashboardPage implements OnInit {
  stats = {
    totalServicios: 0,
    serviciosMes: 0,
    vehiculosAtendidos: 0,
    vehiculosEnProceso: 0,
    ingresosMes: 0,
    metaIngresos: 4000000
  };

  alertasStock: any[] = [];
  ordenesPendientes: any[] = [];
  isOnline = false;
  loading = true;

  constructor(
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService,
    private ordenesService: OrdenesService,
    private inventarioService: InventarioService,
    private syncService: SyncService,
    private router: Router
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      'construct-outline': constructOutline,
      'car-outline': carOutline,
      'cash-outline': cashOutline,
      'warning-outline': warningOutline,
      'cloud-done-outline': cloudDoneOutline,
      'cloud-offline-outline': cloudOfflineOutline,
      'people-outline': peopleOutline,
      'document-text-outline': documentTextOutline,
      'cube-outline': cubeOutline,
      'stats-chart-outline': statsChartOutline
    });
  }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async ionViewWillEnter() {
    await this.loadDashboardData();
    this.isOnline = this.syncService.getConnectionStatus();
  }

  async loadDashboardData() {
    this.loading = true;
    try {
      await Promise.all([
        this.loadStats(),
        this.loadAlertasStock(),
        this.loadOrdenesPendientes()
      ]);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadStats() {
    try {
      const ordenes = await this.ordenesService.getOrdenes();
      const vehiculos = await this.vehiculosService.getVehiculos();
      
      this.stats.totalServicios = ordenes.length;
      
      const now = new Date();
      const primerDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
      this.stats.serviciosMes = ordenes.filter(o => 
        new Date(o.fechaCreacion) >= primerDiaMes
      ).length;
      
      const vehiculosUnicos = new Set(ordenes.map(o => o.vehiculoId));
      this.stats.vehiculosAtendidos = vehiculosUnicos.size;
      
      this.stats.vehiculosEnProceso = ordenes.filter(o => 
        o.estado === 'en_proceso'
      ).length;
      
      this.stats.ingresosMes = this.stats.serviciosMes * 50000;
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }

  async loadAlertasStock() {
    try {
      this.alertasStock = await this.inventarioService.getRepuestosBajoStock();
    } catch (error) {
      console.error('Error cargando alertas de stock:', error);
    }
  }

  async loadOrdenesPendientes() {
    try {
      const pendientes = await this.ordenesService.getOrdenesByEstado('pendiente');
      this.ordenesPendientes = pendientes.slice(0, 5);
    } catch (error) {
      console.error('Error cargando órdenes pendientes:', error);
    }
  }

  async doRefresh(event: any) {
    await this.loadDashboardData();
    event.target.complete();
  }

  async sincronizar() {
    try {
      await this.syncService.syncAll();
      this.isOnline = this.syncService.getConnectionStatus();
    } catch (error) {
      console.error('Error sincronizando:', error);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getProgressoMeta(): number {
    return (this.stats.ingresosMes / this.stats.metaIngresos) * 100;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }
}