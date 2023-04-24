export interface ITag {
  id?: number;
  nombre?: string;
  etiquetaId: number;
  claveEtiqueta: string;
  nombreEtiqueta: string;
  color: string;
  claveInicial: string;
  observaciones?: string;
}

export interface ITagStudy {
  etiquetaId: number;
  estudioId: number;
  nombreEstudio: string;
  claveEstudio: string;
  orden: number;
  asignado: boolean;
  cantidad: number;
}
