import { HttpErrorResponse } from "@angular/common/http";

/**
 * 🛠️ Formatea errores HTTP en mensajes legibles para el usuario
 * 
 * @description
 * Utilidad para transformar errores HTTP y de negocio en mensajes
 * amigables. Maneja solo errores de NEGOCIO (400, 404, 422).
 * Los errores críticos (401, 403, 500+) son manejados por el interceptor.
 * 
 * @example
 * ```typescript
 * const mensaje = formatError(error);
 * this.#patchState({ error: mensaje });
 * ```
 */
export function formatError(error: unknown): string {
  // 🌐 Errores HTTP
  if (error instanceof HttpErrorResponse) {
    return formatHttpError(error);
  }
  
  // 🔴 Errores de JavaScript/TypeScript
  if (error instanceof Error) {
    return error.message;
  }
  
  // ⚠️ Errores desconocidos
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Error desconocido';
}

/**
 * 📊 Formatea errores HTTP específicos
 */
function formatHttpError(error: HttpErrorResponse): string {
  const { status, error: errorBody } = error;
  
  // 🔍 Mapa de errores comunes de negocio
  const businessErrors: Record<number, string> = {
    400: errorBody?.msg || 'Solicitud inválida. Verifica los datos enviados.',
    404: errorBody?.msg || 'Recurso no encontrado.',
    422: errorBody?.msg || 'Los datos no pudieron ser procesados.',
  };
  
  // ✅ Retornar mensaje específico o genérico
  return businessErrors[status] || error.message || 'Error en la operación';
}
/**
 * 🔍 Extrae el mensaje de error más relevante de una respuesta
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    // Intentar obtener mensaje del cuerpo de la respuesta
    const body = error.error;
    
    if (body?.msg) return body.msg;
    if (body?.message) return body.message;
    if (body?.error) return body.error;
    
    // Si el body es un string
    if (typeof body === 'string') return body;
  }
  
  return formatError(error);
}