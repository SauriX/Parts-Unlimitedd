import StudyTable from "./StudyTable";
import { store, useStore } from "../../../../app/stores/store";
import { IEstudiosList } from "../../../../app/models/trackingOrder";


export const StudyModal = (selectedRowKeys: IEstudiosList[],solicitud:string) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar parámetros",
      body: (
        <StudyTable
          getResult={(data) => {
            resolve(true);
          }}
          selectedStudys={selectedRowKeys}
        />
      ),
      onClose: () => {
        resolve(false);
      },
    });
  });
};
