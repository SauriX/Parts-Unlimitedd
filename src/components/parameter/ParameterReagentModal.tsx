import { IReagentList } from "../../app/models/reagent";
import { store } from "../../app/stores/store";
import ParameterReagent from "./detail/ParameterReagent";

export const ParameterReagentModal = (selectedRowKeys: IReagentList[]) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar reactivos",
      body: (
        <ParameterReagent
          getResult={(data) => {
            resolve(true);
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
