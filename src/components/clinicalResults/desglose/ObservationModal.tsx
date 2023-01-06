import { IOptions } from "../../../app/models/shared";
import { store } from "../../../app/stores/store";
import Observations from "./Observations";

export const ObservationModal = (id: string, tipo: string, selectedRowKeys: IOptions[], modalValues: any) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar observación",
      body: (
        <Observations
          getResult={(data, value) => {
            resolve({data, value});
            closeModal();
          } } id={id} tipo={tipo} selectedKeyObservation={selectedRowKeys} modalValues={modalValues} />
      ),
      onClose: () => {
        resolve("");
      },
    });
  });
};
