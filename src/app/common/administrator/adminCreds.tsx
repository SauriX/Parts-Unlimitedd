import { useState } from "react";
import { store, useStore } from "../../stores/store";
import AdminCredsComponent from "./AdminCredsComponent";

export const verifyAdminCreds = () => {
  const { openModal, closeModal } = store.modalStore;

  return new Promise((resolve) => {
    openModal({
      title: "Accesos administrativos",
      body: (
        <AdminCredsComponent
          getResult={(isAdmin) => {
            resolve(isAdmin);
            closeModal();
          }}
        />
      ),
      onClose: () => {
        resolve(false);
      },
    });
  });
};
