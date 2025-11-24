export interface Login {
  correo: string;
  clave: string;
  remember?: boolean;
}
export type ULogin = Omit<Login, 'remember'>;
