export interface ITaxList {
  id: string;
  rfc: string;
  razonSocial: string;
  direccion: string;
  correo: string;
}
export interface ITaxData {
  id?: string;
  expedienteId?: string;
  rfc: string;
  razonSocial: string;
  cp: string;
  estado: string;
  municipio: string;
  correo: string;
  calle: string;
  colonia?: number;
  colonian?: string;
}
