import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { MovimientoInventario } from '../models/movimiento-inventario.model';
import { Repuesto } from '../models/repuesto.model';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private db: DatabaseService) {}

  /**
   * Registrar movimiento de inventario y actualizar stock del repuesto
   */
  async registrarMovimiento(movimiento: Omit<MovimientoInventario, 'id' | 'fecha'>): Promise<string> {
    const repuesto = await this.db.getRepuestoById(movimiento.repuestoId);
    if (!repuesto) throw new Error('Repuesto no encontrado');

    const cantidadAnterior = repuesto.stock;
    let cantidadPosterior = cantidadAnterior;

    // calcular stock posterior según tipo de movimiento
    if (movimiento.tipo === 'entrada') {
      cantidadPosterior = cantidadAnterior + movimiento.cantidad;
    } else if (movimiento.tipo === 'salida') {
      if (cantidadAnterior < movimiento.cantidad) {
        throw new Error(`Stock insuficiente. Disponible: ${cantidadAnterior}`);
      }
      cantidadPosterior = cantidadAnterior - movimiento.cantidad;
    } else if (movimiento.tipo === 'ajuste') {
      cantidadPosterior = movimiento.cantidad;
    }

    // guardar movimiento con datos completos
    const movimientoCompleto: MovimientoInventario = {
      ...movimiento,
      fecha: new Date(),
      cantidadAnterior,
      cantidadPosterior
    };

    const movimientoId = await this.db.insertMovimiento(movimientoCompleto);

    // actualizar stock en repuesto
    await this.db.updateRepuesto(movimiento.repuestoId, {
      stock: cantidadPosterior
    });

    return movimientoId;
  }

  /**
   * Obtener movimientos por repuesto
   */
  async obtenerMovimientosPorRepuesto(repuestoId: string): Promise<MovimientoInventario[]> {
    return await this.db.getMovimientosxRepuesto(repuestoId);
  }

  /**
   * Descontar stock al agregar item en orden
   */
  async descontarStockPorOrden(repuestoId: string, cantidad: number, ordenId: string, usuario?: string): Promise<void> {
    const repuesto = await this.db.getRepuestoById(repuestoId);
    if (!repuesto) throw new Error('Repuesto no encontrado');

    await this.registrarMovimiento({
      repuestoId,
      tipo: 'salida',
      cantidad,
      descripcion: `Uso en orden ${ordenId}`,
      usuario,
      ordenId,
      motivo: 'uso_orden',
      cantidadAnterior: repuesto.stock,
      cantidadPosterior: repuesto.stock - cantidad
    });
  }

  /**
   * Obtener repuestos con bajo stock
   */
  async obtenerRepuestosBajoStock(): Promise<Repuesto[]> {
    return await this.db.getRepuestosBajoStock();
  }

  /**
   * Obtener valor total del inventario
   */
  async obtenerValorTotalInventario(): Promise<number> {
    const repuestos = await this.db.getRepuestos();
    return repuestos.reduce((total, r) => total + (r.precio * r.stock), 0);
  }

  /**
   * Generar reporte de rotación de inventario
   */
  async generarReporteRotacion(repuestoId: string, diasAtras: number = 30): Promise<{
    repuestoId: string;
    movimientos: MovimientoInventario[];
    totalEntradas: number;
    totalSalidas: number;
    rotacion: number;
  }> {
    const movimientos = await this.obtenerMovimientosPorRepuesto(repuestoId);
    const fecha30DiasAtras = new Date();
    fecha30DiasAtras.setDate(fecha30DiasAtras.getDate() - diasAtras);

    const movimientosRecientes = movimientos.filter(
      m => new Date(m.fecha) >= fecha30DiasAtras
    );

    const totalEntradas = movimientosRecientes
      .filter(m => m.tipo === 'entrada')
      .reduce((t, m) => t + m.cantidad, 0);

    const totalSalidas = movimientosRecientes
      .filter(m => m.tipo === 'salida')
      .reduce((t, m) => t + m.cantidad, 0);

    const rotacion = totalSalidas > 0 ? (totalSalidas / totalEntradas) : 0;

    return {
      repuestoId,
      movimientos: movimientosRecientes,
      totalEntradas,
      totalSalidas,
      rotacion
    };
  }

  /**
   * Alertas automáticas de bajo stock
   */
  async obtenerAlertasStock(): Promise<Array<{
    repuestoId: string;
    nombre: string;
    stock: string;
    stockMinimo: number;
    falta: number;
    urgencia: 'alta' | 'media' | 'baja';
  }>> {
    const repuestos = await this.db.getRepuestosBajoStock();
    
    const alertas = repuestos
      .filter((r: any) => r.activo)
      .map((r: any) => {
        const falta = r.stockMinimo - r.stock;
        const urgencia: 'alta' | 'media' | 'baja' = falta > r.stockMinimo * 0.5 ? 'alta' : falta > 0 ? 'media' : 'baja';
        
        return {
          repuestoId: r.id as string,
          nombre: r.nombre as string,
          stock: r.stock.toString() as string,
          stockMinimo: r.stockMinimo as number,
          falta,
          urgencia
        };
      })
      .sort((a, b) => b.falta - a.falta);

    return alertas;
  }
}
