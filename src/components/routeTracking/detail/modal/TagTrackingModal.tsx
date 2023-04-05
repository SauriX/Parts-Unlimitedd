import React from "react";
import TagTracking from "./TagTracking";
import { store } from "../../../../app/stores/store";
import { ITagTrackingOrder } from "../../../../app/models/routeTracking";
import { IRequest } from "../../../../app/models/request";

export const TagTrackingModal = (
  requestCode: string,
  selectedTags: ITagTrackingOrder[]
) => {
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
          requestCode={requestCode}
        />
      ),
      onClose: () => {
        resolve(undefined);
      },
      width: "50%",
    });
  });
};
