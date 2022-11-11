import ParameterTable from "./ParameterTable";
import { store, useStore } from "../../../../app/stores/store";
import { IParameterList } from "../../../../app/models/parameter";

export const ParameterModal = (selectedRowKeys: IParameterList[]) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar parámetros",
      body: (
        <ParameterTable
          getResult={(data) => {
            resolve(true);
          }}
          selectedParameters={selectedRowKeys}
        />
      ),
      onClose: () => {
        resolve(false);
      },
    });
  });
};
