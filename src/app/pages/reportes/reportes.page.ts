// src/app/pages/reportes/reportes.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
  IonButton, IonIcon, IonSegment, IonSegmentButton,
  IonSpinner, IonText, IonBadge, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { download, refresh } from 'ionicons/icons';

import { ReportesService } from '../../core/services/reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonGrid, IonRow, IonCol, IonList, IonItem, IonLabel,
    IonButton, IonIcon, IonSegment, IonSegmentButton,
    IonSpinner, IonText, IonBadge
  ]
})
export class ReportesPage implements OnInit {
  segmentSeleccionado = 'dashboard';
  cargando = false;

  // Dashboard
  estadisticas: any;

  // Gráficas
  ordenesxMes: any;
  ingresosxMes: any;
  ordenesxEstado: any;

  // Datos adicionales
  repuestosMasVendidos: any[] = [];
  clientesFrecuentes: any[] = [];
  reporteInventario: any;

  constructor(
    private reportesService: ReportesService,
    private toastController: ToastController
  ) {
    addIcons({ download, refresh });
  }

  async ngOnInit() {
    await this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    this.cargando = true;
    try {
      this.estadisticas = await this.reportesService.obtenerEstadisticasGenerales();
      await this.cargarGraficas();
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      await this.mostrarError('Error al cargar estadísticas');
    } finally {
      this.cargando = false;
    }
  }

  async cargarGraficas() {
    try {
      const anoActual = new Date().getFullYear();
      
      this.ordenesxMes = await this.reportesService.obtenerOrdenesxMes(anoActual);
      this.ingresosxMes = await this.reportesService.obtenerIngresosxMes(anoActual);
      this.ordenesxEstado = await this.reportesService.obtenerOrdenesxEstado();
      
      this.repuestosMasVendidos = await this.reportesService.obtenerRepuestosMasVendidos(5);
      this.clientesFrecuentes = await this.reportesService.obtenerClientesFrecuentes(5);
      
      this.reporteInventario = await this.reportesService.generarReporteInventario();
    } catch (error) {
      console.error('Error cargando gráficas:', error);
    }
  }

  async segmentChanged(event: any) {
    this.segmentSeleccionado = event.detail.value;
    
    if (this.segmentSeleccionado === 'graficas' && !this.ordenesxMes) {
      await this.cargarGraficas();
    }
  }

  async exportarOrdenesCSV() {
    try {
      this.cargando = true;
      const csv = await this.reportesService.exportarOrdenesCSV();
      this.descargarCSV(csv, 'ordenes.csv');
      await this.mostrarExito('Órdenes exportadas');
    } catch (error) {
      await this.mostrarError('Error al exportar órdenes');
    } finally {
      this.cargando = false;
    }
  }

  async exportarFacturasCSV() {
    try {
      this.cargando = true;
      const csv = await this.reportesService.exportarFacturasCSV();
      this.descargarCSV(csv, 'facturas.csv');
      await this.mostrarExito('Facturas exportadas');
    } catch (error) {
      await this.mostrarError('Error al exportar facturas');
    } finally {
      this.cargando = false;
    }
  }

  private descargarCSV(csv: string, nombreArchivo: string) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.click();
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
