import React from "react";
import TagTracking from "./TagTracking";
import { store } from "../../../../app/stores/store";
import { ITagTrackingOrder } from "../../../../app/models/routeTracking";

export const TagTrackingModal = (selectedTags: ITagTrackingOrder[]) => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      body: (
        <TagTracking
          getResult={(data) => {
            resolve(data);
            closeModal();
          }}
          selectedTags={selectedTags}
        />
      ),
      onClose: () => {
        resolve(undefined);
      },
    });
  });
};
