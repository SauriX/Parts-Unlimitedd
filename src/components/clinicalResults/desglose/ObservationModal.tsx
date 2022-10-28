import { store } from "../../../app/stores/store";
import Observations from "./Observations";

export const ObservationModal = () => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Agregar observación",
      body: (
        <Observations
          getResult={(data) => {
            resolve(data);
            closeModal();
          }}
        />
      ),
      onClose: () => {
        resolve(undefined);
      },
    });
  });
};
