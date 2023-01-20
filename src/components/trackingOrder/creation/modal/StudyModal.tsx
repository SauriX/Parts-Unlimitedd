import StudyTable from "./StudyTable";
import { store, useStore } from "../../../../app/stores/store";
import { IEstudiosList, IRequestStudyOrder } from "../../../../app/models/trackingOrder";


export const StudyModal = (selectedRowKeys: IRequestStudyOrder[],solicitud:string) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Estudios de la solicitud",
      body: (
        <StudyTable
          getResult={(data) => {
            resolve(true);
          }}
          selectedStudys={selectedRowKeys}
          solicitud={solicitud}
        />
      ),
      onClose: () => {
        resolve(false);
      },
      width:"60%"
    });
  });
};
