import IndicationTable from "./IndicationTable";
import { store, useStore } from "../../../../app/stores/store";
import { IIndicationList } from "../../../../app/models/indication";

export const IndicationModal = (selectedRowKeys: IIndicationList[]) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar Indicaciones",
      body: (
        <IndicationTable
          getResult={(data) => {
            resolve(true);
          }}
          selectedIndication={selectedRowKeys}
        />
      ),
      onClose: () => {
        resolve(false);
      },
    });
  });
};
