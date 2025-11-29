// src/app/core/services/reportes.service.ts
import { Injectable, Injector } from '@angular/core';
import { DatabaseService } from './database.service';
import { OrdersService } from './orders.service';
import { InventarioService } from './inventario.service';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private facturaService: any;

  constructor(
    private db: DatabaseService,
    private ordersService: OrdersService,
    private inventarioService: InventarioService,
    private injector: Injector
  ) {
    // Lazy load FacturaService para evitar dependencias circulares
    setTimeout(() => {
      const FacturaServiceClass = require('./factura.service').FacturaService;
      this.facturaService = this.injector.get(FacturaServiceClass);
    }, 0);
  }

  /**
   * Obtener estadísticas generales del dashboard
   */
  async obtenerEstadisticasGenerales() {
    const ordenes = await this.ordersService.getOrders();
    const facturas = await this.facturaService.obtenerFacturas();
    const repuestos = await this.db.getRepuestos();

    const ordenesActivas = ordenes.filter(o => o.activo && o.estado !== 'finalizado');
    const ordenesPendientes = ordenes.filter(o => o.estado === 'pendiente');
    const ordenesEnProceso = ordenes.filter(o => o.estado === 'en_proceso');
    const ordenesFinalizadas = ordenes.filter(o => o.estado === 'finalizado');

    const ingresoTotal = facturas
      .filter((f: any) => f.estado === 'pagada')
      .reduce((t: number, f: any) => t + f.total, 0);

    const repuestoBajoStock = repuestos.filter(
      r => r.stock <= r.stockMinimo && r.activo
    );

    return {
      totalOrdenes: ordenes.length,
      ordenesActivas: ordenesActivas.length,
      ordenesPendientes: ordenesPendientes.length,
      ordenesEnProceso: ordenesEnProceso.length,
      ordenesFinalizadas: ordenesFinalizadas.length,
      ingresoTotal,
      totalFacturas: facturas.length,
      facturasPagadas: facturas.filter((f: any) => f.estado === 'pagada').length,
      totalRepuestos: repuestos.length,
      repuestoBajoStock: repuestoBajoStock.length,
      timestamp: new Date()
    };
  }

  /**
   * Obtener datos para gráfica de órdenes por mes
   */
  async obtenerOrdenesxMes(anoActual: number) {
    const ordenes = await this.ordersService.getOrders();
    const meses = Array(12).fill(0);
    const ordenesxMes = Array(12).fill(0);

    ordenes.forEach((o: any) => {
      const fecha = new Date(o.fechaCreacion);
      if (fecha.getFullYear() === anoActual) {
        ordenesxMes[fecha.getMonth()]++;
      }
    });

    const mesesNombres = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    return {
      labels: mesesNombres,
      data: ordenesxMes
    };
  }

  /**
   * Obtener datos para gráfica de ingresos por mes
   */
  async obtenerIngresosxMes(anoActual: number) {
    const facturas = await this.facturaService.obtenerFacturas();
    const ingresosxMes = Array(12).fill(0);

    facturas.forEach((f: any) => {
      const fecha = new Date(f.fecha);
      if (fecha.getFullYear() === anoActual && f.estado === 'pagada') {
        ingresosxMes[fecha.getMonth()] += f.total;
      }
    });

    const mesesNombres = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    return {
      labels: mesesNombres,
      data: ingresosxMes.map(v => Number(v.toFixed(2)))
    };
  }

  /**
   * Obtener distribución de órdenes por estado
   */
  async obtenerOrdenesxEstado() {
    const ordenes = await this.ordersService.getOrders();
    const activas = ordenes.filter(o => o.estado === 'pendiente').length;
    const enProceso = ordenes.filter(o => o.estado === 'en_proceso').length;
    const finalizadas = ordenes.filter(o => o.estado === 'finalizado').length;

    return {
      labels: ['Pendiente', 'En Proceso', 'Finalizado'],
      data: [activas, enProceso, finalizadas],
      colors: ['#FFC107', '#2196F3', '#4CAF50']
    };
  }

  /**
   * Obtener repuestos más vendidos
   */
  async obtenerRepuestosMasVendidos(limite: number = 10) {
    const facturas = await this.facturaService.obtenerFacturas();
    const repuestosVendidos: { [key: string]: number } = {};

    facturas.forEach((f: any) => {
      f.items.forEach((item: any) => {
        if (!repuestosVendidos[item.repuestoId]) {
          repuestosVendidos[item.repuestoId] = 0;
        }
        repuestosVendidos[item.repuestoId] += item.cantidad;
      });
    });

    return Object.entries(repuestosVendidos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limite)
      .map(([repuestoId, cantidad]) => ({
        repuestoId,
        cantidad
      }));
  }

  /**
   * Obtener clientes con más órdenes
   */
  async obtenerClientesFrecuentes(limite: number = 10) {
    const ordenes = await this.ordersService.getOrders();
    const clientesOrden: { [key: string]: number } = {};

    ordenes.forEach((o: any) => {
      if (!clientesOrden[o.clienteId]) {
        clientesOrden[o.clienteId] = 0;
      }
      clientesOrden[o.clienteId]++;
    });

    return Object.entries(clientesOrden)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limite)
      .map(([clienteId, ordenes]) => ({
        clienteId,
        totalOrdenes: ordenes
      }));
  }

  /**
   * Generar reporte de estado de inventario
   */
  async generarReporteInventario() {
    const repuestos = await this.db.getRepuestos();
    const bajoStock = repuestos.filter(r => r.stock <= r.stockMinimo && r.activo);
    const sinStock = repuestos.filter(r => r.stock === 0 && r.activo);

    return {
      totalRepuestos: repuestos.length,
      repuestosActivos: repuestos.filter(r => r.activo).length,
      repuestosSinStock: sinStock.length,
      repuestosBajoStock: bajoStock.length,
      valorTotalInventario: repuestos.reduce((t, r) => t + (r.precio * r.stock), 0),
      detalleRepuestosBajoStock: bajoStock.map(r => ({
        id: r.id,
        nombre: r.nombre,
        stock: r.stock,
        stockMinimo: r.stockMinimo,
        falta: r.stockMinimo - r.stock
      }))
    };
  }

  /**
   * Exportar datos a formato CSV (texto)
   */
  async exportarOrdenesCSV(): Promise<string> {
    const ordenes = await this.ordersService.getOrders();
    
    const headers = ['ID', 'Número', 'Cliente', 'Vehículo', 'Estado', 'Fecha Creación', 'Total', 'Activo'];
    const rows = ordenes.map(o => [
      o.id || '',
      o.numero || '',
      o.clienteId || '',
      o.vehiculoId || '',
      o.estado,
      new Date(o.fechaCreacion).toLocaleDateString(),
      o.total || 0,
      o.activo ? 'Sí' : 'No'
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }

  /**
   * Exportar facturas a CSV
   */
  async exportarFacturasCSV(): Promise<string> {
    const facturas = await this.facturaService.obtenerFacturas();
    
    const headers = ['ID Factura', 'Número', 'Orden ID', 'Fecha', 'Subtotal', 'Impuestos', 'Total', 'Estado', 'Método Pago'];
    const rows = facturas.map((f: any) => [
      f.id || '',
      f.numeroFactura || '',
      f.ordenId,
      new Date(f.fecha).toLocaleDateString(),
      f.subtotal.toFixed(2),
      f.impuestos.toFixed(2),
      f.total.toFixed(2),
      f.estado,
      f.metodoPago || 'No especificado'
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach((row: any) => {
      csv += row.map((cell: any) => `"${cell}"`).join(',') + '\n';
    });

    return csv;
  }
}
