import Swal, { SweetAlertOptions } from 'sweetalert2';

const STATUS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
  CONFIRM: 'confirm',
} as const;
type Status = (typeof STATUS)[keyof typeof STATUS];

/**
 * Muestra una alerta con estilos y configuración predefinida, personalizable por tipo.
 *
 * @param type Tipo de alerta ('info' | 'error' | 'success' | 'warning' | 'confirm')
 * @param title Título de la alerta
 * @param text Texto descriptivo de la alerta
 * @param customOptions Opcional: configuración personalizada que sobrescribe los valores predeterminados
 * @returns Una promesa de SweetAlertResult (útil para manejar acciones luego de confirmar/cancelar)
 */
export const showAlert = (
  title: string,
  text: string,
  type: Status,
  customOptions: Partial<SweetAlertOptions> = {}
) => {
  const defaultOptions: Record<Status, SweetAlertOptions> = {
    info: {
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    },
    error: {
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    },
    success: {
      icon: 'success',
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Aceptar',
    },
    warning: {
      icon: 'warning',
      confirmButtonColor: '#ffc107',
      confirmButtonText: 'Aceptar',
    },
    confirm: {
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    },
  };
  const finalOptions: SweetAlertOptions = {
    title,
    text,
    ...defaultOptions[type],
    ...customOptions,
  } as SweetAlertOptions;

  return Swal.fire(finalOptions);
};
