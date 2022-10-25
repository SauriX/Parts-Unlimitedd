import IndicationTable from "./IndicationTable";
import { store, useStore } from "../../../../app/stores/store";

export const IndicationModal = (selectedRowKeys: React.Key[]) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar parámetros",
      body: (
        <IndicationTable
          getResult={(data) => {
            resolve(true);
            closeModal();
          }}
          selectedReagent={selectedRowKeys}
        />
      ),
      onClose: () => {
        resolve(false);
      },
    });
  });
};
