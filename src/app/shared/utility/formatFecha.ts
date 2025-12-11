export function formatearFecha(fechaInput:unknown): string {
  if (!fechaInput) return '';

  const fecha = crearFecha(fechaInput);
  if (!esFechaValida(fecha)) return '';

  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}
export function esFechaValida(fechaInput: unknown): boolean {
  if (!fechaInput) return false;

  const fecha = crearFecha(fechaInput);
  return !isNaN(fecha.getTime());
}

// Función interna privada
function crearFecha(fechaInput: unknown): Date {
  if (fechaInput instanceof Date) return fechaInput;
  if (typeof fechaInput === 'string' || typeof fechaInput === 'number') {
    return new Date(fechaInput);
  }
  return new Date();
}