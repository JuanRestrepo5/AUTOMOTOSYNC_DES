## 🚀 INSTRUCCIONES DE FINALIZACIÓN

### ✅ Paso 1: Instalar dependencias (si es necesario)
```bash
npm install
```

### ✅ Paso 2: Integrar componentes en módulos

#### 2.1 Agregar ReportesPage a rutas (src/app/app-routing.module.ts)
```typescript
import { ReportesPage } from './pages/reportes/reportes.page';

export const routes: Routes = [
  {
    path: 'reportes',
    component: ReportesPage,
    canActivate: [AuthGuard]
  },
  // ... otras rutas
];
```

#### 2.2 Agregar componentes a OrdenFormPage (src/app/pages/ordenes/orden-form/orden-form.page.ts)
```typescript
import { OrdenRepuestosComponent } from '../orden-repuestos/orden-repuestos.component';
import { OrdenFacturaComponent } from '../orden-factura/orden-factura.component';

@Component({
  // ...
  imports: [
    // ... imports existentes
    OrdenRepuestosComponent,
    OrdenFacturaComponent
  ]
})
export class OrdenFormPage {
  // ...
}
```

#### 2.3 Agregar componentes al template (src/app/pages/ordenes/orden-form/orden-form.page.html)
```html
<!-- Dentro del formulario, después del campo de descripción -->
<app-orden-repuestos 
  *ngIf="!isEditMode || (orden$ | async) as orden"
  [ordenId]="ordenId || ''"
  [items]="(orden?.items || [])"
  [manoObra]="(orden?.manoObra || 0)"
  [impuestos]="(orden?.impuestos || 0)">
</app-orden-repuestos>

<!-- Para ver el resumen y generar factura (solo en modo edición) -->
<app-orden-factura 
  *ngIf="isEditMode && (orden$ | async) as orden"
  [ordenId]="ordenId || ''"
  [orden]="orden">
</app-orden-factura>
```

### ✅ Paso 3: Agregar enlace a Reportes en navegación

En el menú lateral o barra de navegación, agregar:
```html
<ion-menu-toggle>
  <ion-item [routerLink]="'/reportes'" routerLinkActive="active">
    <ion-icon name="analytics" slot="start"></ion-icon>
    <ion-label>Reportes</ion-label>
  </ion-item>
</ion-menu-toggle>
```

### ✅ Paso 4: Verificar imports de servicios

Los servicios ya están configurados con `providedIn: 'root'`, así que se inyectarán automáticamente donde se usen:
- ✅ FacturaService
- ✅ ReportesService
- ✅ InventarioService (actualizado)

### ✅ Paso 5: Ejecutar la aplicación

```bash
# Para desarrollo
ionic serve

# Para build de producción
npm run build

# Para Android
ionic cap sync android
ionic cap open android

# Para iOS
ionic cap sync ios
ionic cap open ios
```

### 🔧 Paso 6: Opcionales - Librerías recomendadas

Para mejorar los reportes con gráficas reales:

```bash
npm install chart.js ng2-charts
```

Luego actualizar `reportes.page.ts`:
```typescript
import { NgChartsModule } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  imports: [
    // ...
    NgChartsModule
  ]
})
```

Para exportar a PDF:
```bash
npm install pdfmake
npm install --save-dev @types/pdfmake
```

Luego en `factura.service.ts`:
```typescript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
```

### 📋 Checklist de Validación

- [ ] Los componentes se compilan sin errores
- [ ] Las rutas están registradas
- [ ] Los servicios se inyectan correctamente
- [ ] La página de Reportes aparece en la navegación
- [ ] Los componentes de Repuestos y Factura aparecen en las órdenes
- [ ] Se pueden agregar repuestos y validar stock
- [ ] Se pueden generar facturas
- [ ] Se pueden exportar reportes en CSV
- [ ] La sincronización sigue funcionando correctamente

### 🐛 Troubleshooting

#### Problema: "Cannot find module './factura.service'"
**Solución**: Ejecutar `npm install` nuevamente y limpiar caché del IDE (Ctrl+Shift+P -> TypeScript: Restart TS Server)

#### Problema: Los componentes no se cargan
**Solución**: Verificar que están importados en los módulos padre con `imports: [...]`

#### Problema: No aparecen datos en reportes
**Solución**: Verificar que hay órdenes, facturas y movimientos en la base de datos local

### 📞 Soporte

Si tienes dudas sobre la implementación:
1. Revisar los comentarios en el código
2. Verificar los tipos en los modelos
3. Consultar la documentación de Ionic y Angular
