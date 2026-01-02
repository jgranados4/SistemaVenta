export function limpiarPrecio(valor: unknown): number {
  if (valor === undefined || valor === null) return 0;
  if (typeof valor === 'number') return valor;

  let valStr = String(valor).trim();

  // 1. PASO CRÍTICO: Eliminar Símbolos de Moneda ($) y espacios
  // Mantiene solo números, puntos, comas y guion negativo.
  valStr = valStr.replace(/[^0-9.,-]/g, '');

  if (valStr === '') return 0;

  // 2. Detección de formato Latino/Europeo (1.000,00) vs US (1,000.00)
  // Estrategia: Si hay coma, asumimos que es decimal si está al final o si hay puntos antes.
  const tieneComa = valStr.includes(',');
  const tienePunto = valStr.includes('.');

  if (tieneComa) {
    // Caso Latino: 1.500,50 -> Coma es decimal
    // Caso Mixto raro: 1,500.00 -> Coma es miles (US)

    // Si tiene puntos Y comas, la última ocurrencia dicta el decimal.
    // Asumiremos formato estándar latino si hay coma:
    // Eliminar puntos (miles) y cambiar coma a punto.
    if (tienePunto) {
      valStr = valStr.replace(/\./g, ''); // Quitar miles (1.500 -> 1500)
    }
    valStr = valStr.replace(',', '.'); // Coma a punto (00,50 -> 00.50)
  }

  const num = parseFloat(valStr);
  return isNaN(num) ? 0 : num;
}

export function formatearPrecioParaApi(valor: number): string {
  return valor.toFixed(2).replace('.', ',');
}
