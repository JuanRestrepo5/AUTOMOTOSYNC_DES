// src/app/core/services/orders.service.ts
import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { InventarioService } from './inventario.service';
import { Orden, EstadoOrden } from '../models/orden.model';
import { OrdenItem } from '../models/orden-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private db: DatabaseService,
    private inventarioService: InventarioService
  ) {}

  // -----------------------------
  // CRUD / Operaciones básicas
  // -----------------------------
  async createOrder(data: Partial<Orden>): Promise<string> {
    const now = new Date();
    const orden: Orden = {
      id: undefined,
      numero: data.numero || undefined,
      clienteId: data.clienteId || '',
      vehiculoId: data.vehiculoId || '',
      descripcion: data.descripcion || '',
      estado: (data.estado as EstadoOrden) || 'pendiente',
      fechaCreacion: now,
      fechaServicio: data.fechaServicio,
      fechaFinalizacion: data.fechaFinalizacion,
      mecanicoAsignado: data.mecanicoAsignado,
      observaciones: data.observaciones,
      activo: data.activo ?? true,
      items: data.items || [],
      manoObra: data.manoObra || 0,
      impuestos: data.impuestos || 0,
      total: data.total || 0
    };

    // insertar en storage (DatabaseService.insertOrden retorna el id)
    return await this.db.insertOrden(orden);
  }

  async getOrders(): Promise<Orden[]> {
    return await this.db.getOrdenes();
  }

  async getOrderById(id: string): Promise<Orden | undefined> {
    return await this.db.getOrdenById(id);
  }

  async updateOrder(id: string, changes: Partial<Orden>): Promise<void> {
    await this.db.updateOrden(id, changes);
  }

  async updateOrderStatus(id: string, estado: EstadoOrden): Promise<void> {
    await this.db.updateOrdenEstado(id, estado);
  }

  async deleteOrder(id: string): Promise<void> {
    // Soft delete: marcar como inactivo
    await this.db.updateOrden(id, { activo: false });
  }

  // -----------------------------
  // Items: agregar / eliminar
  // -----------------------------
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // calcula subtotales y total de la orden (modifica y devuelve la orden)
  calculateTotals(orden: Orden): Orden {
    orden.items = orden.items || [];

    let subtotalRepuestos = 0;
    orden.items = orden.items.map(i => {
      i.subtotal = Number(((i.precioUnitario || 0) * (i.cantidad || 0)).toFixed(2));
      subtotalRepuestos += i.subtotal;
      return i;
    });

    const manoObra = orden.manoObra || 0;
    const impuestos = orden.impuestos || 0;
    orden.total = Number((subtotalRepuestos + manoObra + impuestos).toFixed(2));

    return orden;
  }

  // agregar item (calcula subtotal y actualiza la orden en DB)
  async addItem(orderId: string, item: OrdenItem): Promise<void> {
    const orden = await this.getOrderById(orderId);
    if (!orden) throw new Error('Orden no encontrada');

    // completar item
    const newItem: OrdenItem = {
      ...item,
      id: item.id || this.generateId(),
      subtotal: Number(((item.precioUnitario || 0) * (item.cantidad || 0)).toFixed(2))
    };

    orden.items = orden.items || [];
    orden.items.push(newItem);

    // recalcular totales antes de actualizar
    this.calculateTotals(orden);

    // actualizar orden en DB
    await this.updateOrder(orderId, { items: orden.items, total: orden.total, manoObra: orden.manoObra, impuestos: orden.impuestos });
  }

  /**
   * Agregar item con descuento de stock automático
   */
  async addItemConDescuentoStock(orderId: string, item: OrdenItem, usuario?: string): Promise<void> {
    const orden = await this.getOrderById(orderId);
    if (!orden) throw new Error('Orden no encontrada');

    // validar stock disponible
    const repuesto = await this.db.getRepuestoById(item.repuestoId);
    if (!repuesto) throw new Error('Repuesto no encontrado');
    if (repuesto.stock < item.cantidad) {
      throw new Error(`Stock insuficiente. Disponible: ${repuesto.stock}, Solicitado: ${item.cantidad}`);
    }

    // agregar item
    await this.addItem(orderId, item);

    // descontar stock
    await this.inventarioService.descontarStockPorOrden(
      item.repuestoId,
      item.cantidad,
      orderId,
      usuario
    );
  }

  async removeItem(orderId: string, itemId: string): Promise<void> {
    const orden = await this.getOrderById(orderId);
    if (!orden || !orden.items) return;

    orden.items = orden.items.filter(x => x.id !== itemId);

    // recalcular totales
    this.calculateTotals(orden);

    // actualizar DB
    await this.updateOrder(orderId, { items: orden.items, total: orden.total, manoObra: orden.manoObra, impuestos: orden.impuestos });
  }
    // -----------------------------
  // Totales individuales
  // -----------------------------
  async getTotalItems(orderId: string): Promise<number> {
    const orden = await this.getOrderById(orderId);
    if (!orden || !orden.items) return 0;

    return orden.items.reduce((total, item) => total + (item.cantidad || 0), 0);
  }

  async getTotalRepuestos(orderId: string): Promise<number> {
    const orden = await this.getOrderById(orderId);
    if (!orden || !orden.items) return 0;

    return orden.items.reduce((total, item) => total + (item.subtotal || 0), 0);
  }

  async getTotalGeneral(orderId: string): Promise<number> {
    const orden = await this.getOrderById(orderId);
    if (!orden) return 0;

    const totalRepuestos = orden.items?.reduce((t, i) => t + (i.subtotal || 0), 0) || 0;
    const manoObra = orden.manoObra || 0;
    const impuestos = orden.impuestos || 0;

    return totalRepuestos + manoObra + impuestos;
  }

}
