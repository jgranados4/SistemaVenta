import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

const STATUS = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
  CONFIRM: 'confirm',
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];

const DEFAULT_TEXTS = {
  accept: 'Aceptar',
  cancel: 'No',
  confirm: 'Sí',
};

const DEFAULT_OPTIONS: Record<Status, SweetAlertOptions> = {
  info: {
    icon: 'info',
    confirmButtonColor: '#3085d6',
    confirmButtonText: DEFAULT_TEXTS.accept,
  },
  error: {
    icon: 'error',
    confirmButtonColor: '#d33',
    confirmButtonText: DEFAULT_TEXTS.accept,
  },
  success: {
    icon: 'success',
    confirmButtonColor: '#28a745',
    confirmButtonText: DEFAULT_TEXTS.accept,
  },
  warning: {
    icon: 'warning',
    confirmButtonColor: '#ffc107',
    confirmButtonText: DEFAULT_TEXTS.accept,
  },
  confirm: {
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: DEFAULT_TEXTS.confirm,
    cancelButtonText: DEFAULT_TEXTS.cancel,
  },
};

/**
 * Muestra una alerta con estilos y configuración predefinida.
 *
 * @param title Título de la alerta
 * @param text Texto descriptivo
 * @param type Tipo de alerta ('info' | 'error' | 'success' | 'warning' | 'confirm')
 * @param customOptions Opcional: configuración personalizada
 * @param redirectUrl Opcional: redirige al confirmar o cerrar
 * @returns Promesa de resultado de la alerta
 */
export const showAlert = (
  title: string,
  text: string,
  type: Status,
  customOptions: Partial<SweetAlertOptions> = {},
  redirectUrl?: string
): Promise<SweetAlertResult> => {
  const defaultConfig = DEFAULT_OPTIONS[type];

  if (!defaultConfig) {
    throw new Error(`Tipo de alerta desconocido: ${type}`);
  }

  const finalOptions: SweetAlertOptions = {
    title,
    text,
    ...defaultConfig,
    ...customOptions,
  } as SweetAlertOptions;

  return Swal.fire(finalOptions).then((result) => {
    if (redirectUrl && (result.isConfirmed || result.isDismissed)) {
      window.location.href = redirectUrl;
    }
    return result;
  });
};
