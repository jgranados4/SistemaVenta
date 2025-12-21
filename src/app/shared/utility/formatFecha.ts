export function formatFechaUniversal(input: unknown): string {
  if (!input) return '';

  // CASO 1: Es un objeto Date (Viene del Formulario/DatePicker)
  if (input instanceof Date) {
    return _formatDateToString(input);
  }

  // CASO 2: Es un string (Viene del API o del Formulario como texto)
  if (typeof input === 'string') {
    // Si ya tiene formato latino DD/MM/YYYY, lo devolvemos igual
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
      return input;
    }

    // Si es un string ISO o similar, intentamos parsearlo
    const parsedDate = new Date(input);
    if (!isNaN(parsedDate.getTime())) {
      return _formatDateToString(parsedDate);
    }
  }

  return '';
}

/** Función interna para evitar repetir la lógica de construcción del string */
function _formatDateToString(date: Date): string {
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}
