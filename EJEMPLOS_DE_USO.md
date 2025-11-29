# Ejemplos de Uso de los Nuevos Servicios

## 1. USAR INVENTARIO SERVICE

### Registrar entrada de repuestos

```typescript
import { InventarioService } from '../../../core/services/inventario.service';

export class AlgunComponente {
  constructor(private inventario: InventarioService) {}

  async registrarCompra() {
    const movimiento = await this.inventario.registrarMovimiento({
      repuestoId: 'REP-001',
      tipo: 'entrada',
      cantidad: 10,
      cantidadAnterior: 5,
      cantidadPosterior: 15,
      descripcion: 'Compra a proveedor XYZ',
      usuario: 'usuario@empresa.com',
      motivo: 'compra'
    });
    console.log('Movimiento registrado:', movimiento);
  }
}
```

### Obtener alertas de bajo stock

```typescript
async mostrarAlertas() {
  const alertas = await this.inventario.obtenerAlertasStock();
  alertas.forEach((alerta: any) => {
    console.log(`${alerta.nombre}: Stock ${alerta.stock}, Mínimo: ${alerta.stockMinimo}, Urgencia: ${alerta.urgencia}`);
  });
}
```

### Generar reporte de rotación

```typescript
async analizarRotacion() {
  const reporte = await this.inventario.generarReporteRotacion('REP-001', 30);
  console.log(`Salidas en últimos 30 días: ${reporte.totalSalidas}`);
  console.log(`Rotación: ${reporte.rotacion}`);
}
```

---

## 2. USAR ORDERS SERVICE CON DESCUENTO DE STOCK

### Agregar repuestos a una orden

```typescript
import { OrdersService } from '../../../core/services/orders.service';
// import { OrdenItem } from '../../../core/models/orden-item.model';

export class AgregarRepuestoComponent {
  constructor(private ordersService: OrdersService) {}

  async agregarRepuestoAOrden() {
    const item: any = {
      repuestoId: 'REP-001',
      descripcion: 'Aceite Sintético 5W40',
      cantidad: 5,
      precioUnitario: 45000,
      subtotal: 225000
    };

    try {
      // Esto valida stock y descuenta automáticamente
      await this.ordersService.addItemConDescuentoStock(
        'ORDEN-123',
        item,
        'usuario@empresa.com'
      );
      console.log('Repuesto agregado y stock descontado');
    } catch (error) {
      console.error('Error:', error); // Ej: "Stock insuficiente"
    }
  }
}
```

---

## 3. USAR FACTURA SERVICE

### Generar factura desde orden

```typescript
// import { FacturaService } from '../../../core/services/factura.service';

export class FacturacionComponent {
  // constructor(private facturaService: FacturaService) {}

  async generarFactura() {
    const ordenId = 'ORDEN-123';
    const items: any[] = [
      {
        repuestoId: 'REP-001',
        descripcion: 'Aceite',
        cantidad: 5,
        precioUnitario: 45000,
        subtotal: 225000
      }
    ];

    try {
      // const facturaId = await this.facturaService.generarFactura(
      //   ordenId,
      //   items,
      //   'usuario@empresa.com'
      // );
      console.log('Factura generada');
      // Factura automáticamente:
      // - Calcula subtotal, impuestos (19%), total
      // - Asigna número secuencial (FAC-00001-2025)
      // - Se guarda en base de datos
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async registrarPago() {
    try {
      // await this.facturaService.registrarPago(
      //   'FACTURA-ID',
      //   'tarjeta',
      //   'usuario@empresa.com'
      // );
      console.log('Pago registrado como pagada');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async descargarPDF() {
    // const factura = await this.facturaService.obtenerFacturaById('FACTURA-ID');
    const cliente = { nombre: 'Juan Pérez', documento: '1234567890' };
    const orden = { numero: 'ORD-001' };

    // if (factura) {
    //   await this.facturaService.descargarFacturaPDF(factura, cliente, orden);
    // }
  }
}
```

---

## 4. USAR REPORTES SERVICE

### Dashboard principal

```typescript
// import { ReportesService } from '../../../core/services/reportes.service';

export class ReportesComponent {
  // constructor(private reportesService: ReportesService) {}

  async cargarDashboard() {
    // const stats = await this.reportesService.obtenerEstadisticasGenerales();
    // console.log('Órdenes activas:', stats.ordenesActivas);
    // console.log('Ingresos totales:', stats.ingresoTotal);
    // console.log('Repuestos bajo stock:', stats.repuestoBajoStock);
  }
}
```

### Gráficas

```typescript
async cargarGraficas() {
  const anoActual = 2025;
  
  // Órdenes por mes
  // const ordenesMes = await this.reportesService.obtenerOrdenesxMes(anoActual);
  // ordenesMes = { labels: ['Ene', 'Feb', ...], data: [5, 3, 8, ...] }
  
  // Ingresos por mes
  // const ingresosMes = await this.reportesService.obtenerIngresosxMes(anoActual);
  // ingresosMes = { labels: ['Ene', 'Feb', ...], data: [150000, 200000, ...] }
  
  // Distribución por estado
  // const estados = await this.reportesService.obtenerOrdenesxEstado();
  // estados = { 
  //   labels: ['Pendiente', 'En Proceso', 'Finalizado'],
  //   data: [5, 3, 10],
  //   colors: ['#FFC107', '#2196F3', '#4CAF50']
  // }
}
```

---

## 5. FLUJO COMPLETO: DE ORDEN A FACTURA

```typescript
export class FlujoCompletoComponent {
  // constructor(
  //   private ordersService: OrdersService,
  //   private inventarioService: InventarioService,
  //   private facturaService: FacturaService
  // ) {}

  async procesarOrdenCompleta() {
    try {
      // 1️⃣ Crear orden
      // const ordenId = await this.ordersService.createOrder({
      //   clienteId: 'CLI-001',
      //   vehiculoId: 'VEH-001',
      //   descripcion: 'Revisión completa del vehículo',
      //   estado: 'pendiente'
      // });
      console.log('1. Orden creada');

      // 2️⃣ Agregar repuestos con descuento automático de stock
      // await this.ordersService.addItemConDescuentoStock(...);
      console.log('2. Repuesto agregado y stock descontado');

      // 3️⃣ Generar factura
      // const facturaId = await this.facturaService.generarFactura(...);
      console.log('3. Factura generada');

      // 4️⃣ Registrar pago
      // await this.facturaService.registrarPago(...);
      console.log('4. Pago registrado');

    } catch (error) {
      console.error('Error en el flujo:', error);
    }
  }
}
```

---

## 6. CASOS DE ERROR Y MANEJO

### Error: Stock insuficiente

```typescript
try {
  // await ordersService.addItemConDescuentoStock(
  //   'ORDEN-123',
  //   { repuestoId: 'REP-001', cantidad: 1000, precioUnitario: 100 },
  //   'usuario'
  // );
} catch (error: any) {
  if (error.message.includes('Stock insuficiente')) {
    console.log('Alerta: No hay suficiente stock disponible');
  }
}
```

### Alertas de bajo stock

```typescript
async function verificarAlertas() {
  // const alertas = await inventarioService.obtenerAlertasStock();
  // alertas.forEach((alerta: any) => {
  //   if (alerta.urgencia === 'alta') {
  //     console.warn(`⚠️ URGENTE: ${alerta.nombre} - Falta: ${alerta.falta}`);
  //   } else if (alerta.urgencia === 'media') {
  //     console.log(`⏳ Próximo a agotar: ${alerta.nombre}`);
  //   }
  // });
}
```

---

## Integración en Componentes

Estos servicios ya están creados en:
- `src/app/core/services/inventario.service.ts`
- `src/app/core/services/orders.service.ts`
- `src/app/core/services/factura.service.ts`
- `src/app/core/services/reportes.service.ts`
- `src/app/core/services/database.service.ts`

Para usarlos en un componente, simplemente inyecta el servicio:

```typescript
import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../../core/services/reportes.service';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html'
})
export class MyComponent implements OnInit {
  stats: any;

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.stats = await this.reportesService.obtenerEstadisticasGenerales();
  }
}
```
