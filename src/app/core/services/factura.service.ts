// src/app/core/services/factura.service.ts
import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Factura, EstadoFactura, MetodoPago } from '../models/factura.model';
import { OrdenItem } from '../models/orden-item.model';
import { OrdersService } from './orders.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(
    private db: DatabaseService,
    private ordersService: OrdersService
  ) {}

  /**
   * Generar factura desde una orden
   */
  async generarFactura(ordenId: string, items: OrdenItem[], usuario?: string): Promise<string> {
    const orden = await this.ordersService.getOrderById(ordenId);
    if (!orden) throw new Error('Orden no encontrada');

    // calcular subtotal
    const subtotal = items.reduce((t, i) => t + (i.subtotal || 0), 0);
    
    // calcular impuestos (asumiendo 19% para IVA en Colombia)
    const impuestos = Number((subtotal * 0.19).toFixed(2));
    
    const total = Number((subtotal + impuestos).toFixed(2));
    const numeroFactura = await this.generarNumeroFactura();

    const factura: Factura = {
      id: undefined,
      numeroFactura,
      ordenId,
      clienteId: orden.clienteId,
      fecha: new Date(),
      items,
      subtotal: Number(subtotal.toFixed(2)),
      impuestos,
      total,
      estado: 'emitida',
      usuarioCreacion: usuario,
      activo: true
    };

    // guardar en BD
    return await this.db.insertFactura(factura);
  }

  /**
   * Generar número secuencial para factura
   */
  private async generarNumeroFactura(): Promise<string> {
    const facturas = await this.obtenerFacturas();
    const numero = (facturas.length + 1).toString().padStart(5, '0');
    const ano = new Date().getFullYear();
    return `FAC-${numero}-${ano}`;
  }

  /**
   * Obtener todas las facturas
   */
  async obtenerFacturas(): Promise<Factura[]> {
    return await this.db.getFacturas();
  }

  /**
   * Obtener factura por ID
   */
  async obtenerFacturaById(id: string): Promise<Factura | undefined> {
    return await this.db.getFacturaById(id);
  }

  /**
   * Obtener facturas por orden
   */
  async obtenerFacturasPorOrden(ordenId: string): Promise<Factura[]> {
    const facturas = await this.obtenerFacturas();
    return facturas.filter(f => f.ordenId === ordenId);
  }

  /**
   * Cambiar estado de la factura
   */
  async cambiarEstado(id: string, estado: EstadoFactura, usuario?: string): Promise<void> {
    await this.db.updateFactura(id, {
      estado,
      usuarioModificacion: usuario,
      fechaModificacion: new Date()
    });
  }

  /**
   * Registrar pago de factura
   */
  async registrarPago(id: string, metodoPago: MetodoPago, usuario?: string): Promise<void> {
    await this.cambiarEstado(id, 'pagada', usuario);
    await this.db.updateFactura(id, {
      metodoPago,
      usuarioModificacion: usuario,
      fechaModificacion: new Date()
    });
  }

  /**
   * Calcular totales de una factura
   */
  calcularTotales(items: OrdenItem[]): {
    subtotal: number;
    impuestos: number;
    total: number;
  } {
    const subtotal = items.reduce((t, i) => t + (i.subtotal || 0), 0);
    const impuestos = Number((subtotal * 0.19).toFixed(2));
    const total = Number((subtotal + impuestos).toFixed(2));

    return {
      subtotal: Number(subtotal.toFixed(2)),
      impuestos,
      total
    };
  }

  /**
   * Generar factura en formato HTML para PDF
   */
  generarHTMLFactura(factura: Factura, cliente: any, orden: any): string {
    const fecha = new Date(factura.fecha).toLocaleDateString('es-CO');
    
    let itemsHTML = '';
    factura.items.forEach(item => {
      itemsHTML += `
        <tr>
          <td>${item.descripcion || 'Repuesto'}</td>
          <td style="text-align: center;">${item.cantidad}</td>
          <td style="text-align: right;">$${(item.precioUnitario || 0).toLocaleString('es-CO')}</td>
          <td style="text-align: right;">$${(item.subtotal || 0).toLocaleString('es-CO')}</td>
        </tr>
      `;
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${factura.numeroFactura}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .empresa-nombre { font-size: 24px; font-weight: bold; }
          .factura-numero { font-size: 16px; margin-top: 10px; }
          .cliente-info { margin-bottom: 20px; }
          .cliente-info p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background-color: #f0f0f0; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .total-row { font-weight: bold; }
          .totales { margin-left: auto; width: 300px; }
          .totales-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
          .totales-row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; border-bottom: none; margin-top: 10px; }
          .firma { margin-top: 50px; text-align: center; }
          .firma-linea { border-top: 1px solid #333; width: 250px; margin: 0 auto; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="empresa-nombre">AUTOMOTOSYNC</div>
          <div class="factura-numero">Factura ${factura.numeroFactura}</div>
          <div class="factura-numero">Fecha: ${fecha}</div>
        </div>

        <div class="cliente-info">
          <p><strong>Cliente:</strong> ${cliente?.nombre || 'N/A'}</p>
          <p><strong>Documento:</strong> ${cliente?.documento || 'N/A'}</p>
          <p><strong>Teléfono:</strong> ${cliente?.telefono || 'N/A'}</p>
          <p><strong>Dirección:</strong> ${cliente?.direccion || 'N/A'}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th style="text-align: center;">Cantidad</th>
              <th style="text-align: right;">Precio Unitario</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div style="float: right; width: 300px;">
          <div class="totales-row">
            <span>Subtotal:</span>
            <span>$${factura.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div class="totales-row">
            <span>Impuestos (19%):</span>
            <span>$${factura.impuestos.toLocaleString('es-CO')}</span>
          </div>
          <div class="totales-row total">
            <span>TOTAL:</span>
            <span>$${factura.total.toLocaleString('es-CO')}</span>
          </div>
        </div>

        <div style="clear: both; margin-top: 60px;">
          <p><strong>Estado:</strong> ${factura.estado.toUpperCase()}</p>
          ${factura.metodoPago ? `<p><strong>Método de Pago:</strong> ${factura.metodoPago}</p>` : ''}
          ${factura.observaciones ? `<p><strong>Observaciones:</strong> ${factura.observaciones}</p>` : ''}
        </div>

        <div class="firma">
          <p>Gracias por su compra</p>
          <div class="firma-linea"></div>
          <p style="margin-top: 10px; font-size: 12px;">Firma Autorizado</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Descargar factura como PDF (simulado - necesita librería external)
   */
  async descargarFacturaPDF(factura: Factura, cliente: any, orden: any): Promise<void> {
    const html = this.generarHTMLFactura(factura, cliente, orden);
    
    // En una aplicación real, usarías una librería como pdfmake o similar
    // Por ahora, retornamos el HTML que puede ser procesado por una librería de PDF
    console.log('HTML para PDF generado:', html);
    
    // Aquí iría la lógica de conversión a PDF con pdfmake o similar
    // ejemplo (requiere: npm install pdfmake):
    /*
    import * as pdfMake from 'pdfmake/build/pdfmake';
    import * as pdfFonts from 'pdfmake/build/vfs_fonts';
    
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const pdf = pdfMake.createPdf({ content: html });
    pdf.download(`Factura_${factura.numeroFactura}.pdf`);
    */
  }
}
