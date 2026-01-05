/**
 * Modelo de Roles y Permisos
 * Define los roles de usuario y sus permisos en la aplicación
 */

export enum UserRole {
  ADMINISTRADOR = 'administrador',
  MECANICO = 'mecanico',
  GERENTE = 'gerente',
  RECEPCIONISTA = 'recepcionista'
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
  description: string;
}

export enum Permission {
  // Clientes
  VIEW_CLIENTES = 'view_clientes',
  CREATE_CLIENTE = 'create_cliente',
  EDIT_CLIENTE = 'edit_cliente',
  DELETE_CLIENTE = 'delete_cliente',

  // Vehículos
  VIEW_VEHICULOS = 'view_vehiculos',
  CREATE_VEHICULO = 'create_vehiculo',
  EDIT_VEHICULO = 'edit_vehiculo',
  DELETE_VEHICULO = 'delete_vehiculo',

  // Órdenes
  VIEW_ORDENES = 'view_ordenes',
  CREATE_ORDEN = 'create_orden',
  EDIT_ORDEN = 'edit_orden',
  DELETE_ORDEN = 'delete_orden',
  COMPLETE_ORDEN = 'complete_orden',

  // Repuestos e Inventario
  VIEW_INVENTARIO = 'view_inventario',
  CREATE_REPUESTO = 'create_repuesto',
  EDIT_REPUESTO = 'edit_repuesto',
  DELETE_REPUESTO = 'delete_repuesto',
  MANAGE_STOCK = 'manage_stock',

  // Facturas
  VIEW_FACTURAS = 'view_facturas',
  CREATE_FACTURA = 'create_factura',
  EDIT_FACTURA = 'edit_factura',
  DELETE_FACTURA = 'delete_factura',
  PRINT_FACTURA = 'print_factura',

  // Reportes
  VIEW_REPORTES = 'view_reportes',
  EXPORT_REPORTES = 'export_reportes',

  // Configuración
  MANAGE_CONFIG = 'manage_config',
  MANAGE_USERS = 'manage_users',
  VIEW_AUDIT_LOG = 'view_audit_log'
}

/**
 * Matriz de permisos por rol
 */
export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: UserRole.ADMINISTRADOR,
    description: 'Acceso completo al sistema',
    permissions: Object.values(Permission)
  },
  {
    role: UserRole.GERENTE,
    description: 'Gestión completa sin acceso a configuración',
    permissions: [
      Permission.VIEW_CLIENTES,
      Permission.CREATE_CLIENTE,
      Permission.EDIT_CLIENTE,
      Permission.DELETE_CLIENTE,
      Permission.VIEW_VEHICULOS,
      Permission.CREATE_VEHICULO,
      Permission.EDIT_VEHICULO,
      Permission.DELETE_VEHICULO,
      Permission.VIEW_ORDENES,
      Permission.CREATE_ORDEN,
      Permission.EDIT_ORDEN,
      Permission.DELETE_ORDEN,
      Permission.COMPLETE_ORDEN,
      Permission.VIEW_INVENTARIO,
      Permission.CREATE_REPUESTO,
      Permission.EDIT_REPUESTO,
      Permission.DELETE_REPUESTO,
      Permission.MANAGE_STOCK,
      Permission.VIEW_FACTURAS,
      Permission.CREATE_FACTURA,
      Permission.EDIT_FACTURA,
      Permission.DELETE_FACTURA,
      Permission.PRINT_FACTURA,
      Permission.VIEW_REPORTES,
      Permission.EXPORT_REPORTES
    ]
  },
  {
    role: UserRole.MECANICO,
    description: 'Acceso a órdenes y reportes de trabajo',
    permissions: [
      Permission.VIEW_CLIENTES,
      Permission.VIEW_VEHICULOS,
      Permission.VIEW_ORDENES,
      Permission.EDIT_ORDEN,
      Permission.COMPLETE_ORDEN,
      Permission.VIEW_INVENTARIO,
      Permission.CREATE_REPUESTO,
      Permission.EDIT_REPUESTO,
      Permission.MANAGE_STOCK,
      Permission.VIEW_FACTURAS,
      Permission.PRINT_FACTURA,
      Permission.VIEW_REPORTES
    ]
  },
  {
    role: UserRole.RECEPCIONISTA,
    description: 'Gestión de clientes y órdenes básica',
    permissions: [
      Permission.VIEW_CLIENTES,
      Permission.CREATE_CLIENTE,
      Permission.EDIT_CLIENTE,
      Permission.VIEW_VEHICULOS,
      Permission.CREATE_VEHICULO,
      Permission.VIEW_ORDENES,
      Permission.CREATE_ORDEN,
      Permission.VIEW_INVENTARIO,
      Permission.VIEW_FACTURAS,
      Permission.PRINT_FACTURA
    ]
  }
];

/**
 * Obtener permisos de un rol
 */
export function getPermissionsByRole(role: UserRole): Permission[] {
  const roleConfig = ROLE_PERMISSIONS.find(rp => rp.role === role);
  return roleConfig ? roleConfig.permissions : [];
}

/**
 * Verificar si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = getPermissionsByRole(role);
  return permissions.includes(permission);
}
