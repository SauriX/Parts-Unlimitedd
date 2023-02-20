import { IRequestStudy } from "../../app/models/request";
import { useStore } from "../../app/stores/store";
import { status } from "../../app/util/catalogs";

export const updateStatus = async (
  esCancelacion: boolean = false,
  currentStudy: IRequestStudy,
  updateStatusStudy: (id: number, status: number) => Promise<true | undefined>,
  cancelation: (status: number) => Promise<boolean | undefined>,
  removeSelectedStudy: (study: { id: number; tipo: string }) => void,
  setCheckedPrint: (value: boolean) => void
) => {
  let nuevoEstado = 0;
  if (currentStudy.estatusId === status.requestStudy.solicitado) {
    return await updateStatusStudy(
      currentStudy.id!,
      status.requestStudy.capturado
    );
  }
  if (currentStudy.estatusId === status.requestStudy.capturado) {
    nuevoEstado = esCancelacion
      ? status.requestStudy.solicitado
      : status.requestStudy.validado;
    return await updateStatusStudy(currentStudy.id!, nuevoEstado);
  }
  if (currentStudy.estatusId === status.requestStudy.validado) {
    nuevoEstado = esCancelacion
      ? status.requestStudy.capturado
      : status.requestStudy.liberado;
    return await updateStatusStudy(currentStudy.id!, nuevoEstado);
  }
  if (currentStudy.estatusId === status.requestStudy.liberado) {
    nuevoEstado = esCancelacion
      ? status.requestStudy.validado
      : status.requestStudy.enviado;
    return await updateStatusStudy(currentStudy.id!, nuevoEstado);
  }
  if (esCancelacion) {
    removeSelectedStudy({
      id: currentStudy.id!,
      tipo: "LABORATORY",
    });
    await cancelation(nuevoEstado);
    setCheckedPrint(false);
  }

  return nuevoEstado;
};

export const referenceValues = (
    tipoValor: string,
    valorInicial?: string,
    valorFinal?: string,
    primeraColumna?: string,
    segundaColumna?: string,
    terceraColumna?: string,
    cuartaColumna?: string,
    quintaColumna?: string
  ) => {
    if (
      tipoValor == "1" ||
      tipoValor == "2" ||
      tipoValor == "3" ||
      tipoValor == "4"
    ) {
      return valorInicial + " - " + valorFinal;
    } else if (tipoValor == "7" || tipoValor == "8" || tipoValor == "10") {
      return valorInicial + "";
    } else if (tipoValor == "11") {
      return primeraColumna + " - " + segundaColumna + "\n";
    } else if (tipoValor == "12") {
      return `${primeraColumna} \t ${segundaColumna} \t ${terceraColumna}`;
    } else if (tipoValor == "13") {
      return `${primeraColumna} \t ${segundaColumna} \t ${terceraColumna} \t ${cuartaColumna}`;
    } else if (tipoValor == "14") {
      return `${primeraColumna} \t ${segundaColumna} \t ${terceraColumna} \t ${cuartaColumna} \t ${quintaColumna}`;
    }
  };

// export const cancelation = async (
//   estado: number,
//   updateStatusStudy: (id: number, status: number) => Promise<void>,
//   cancelResults: (id: number) => Promise<boolean>,
//   currentStudy: IRequestStudy
// ) => {
//   await updateStatusStudy(currentStudy.id!, estado);
//   if (estado === status.requestStudy.solicitado) {
//     return cancelResults(currentStudy.id!);
//   }
// };
