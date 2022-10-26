import ParameterTable from "./ParameterTable";
import { store, useStore } from "../../../../app/stores/store";

export const ParameterModal = (selectedRowKeys: React.Key[]) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar parámetros",
      body: (
        <ParameterTable
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
