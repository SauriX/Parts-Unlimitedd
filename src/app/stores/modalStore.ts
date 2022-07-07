import { makeAutoObservable } from "mobx";
import { ReactNode } from "react";

interface IModalInfo {
  visible?: boolean;
  title?: ReactNode;
  body?: ReactNode;
  width?: string | number;
  closable?: boolean;
  onClose?: () => void;
}

class ModalInfo implements IModalInfo {
  visible?: boolean = false;
  title?: ReactNode;
  body?: ReactNode;
  width?: string | number | undefined;
  closable?: boolean | undefined;
  onClose?: any | undefined;

  constructor(init?: IModalInfo) {
    Object.assign(this, init);
  }
}

export default class ModalStore {
  constructor() {
    makeAutoObservable(this);
  }

  modal: IModalInfo = new ModalInfo();

  setTitle = (title: string) => {
    this.modal.title = title;
  };

  openModal = (modal: IModalInfo) => {
    modal.visible = true;
    this.modal = modal;
  };

  closeModal = () => {
    if (this.modal.onClose) {
      this.modal.onClose();
    }
    this.modal = new ModalInfo();
  };
}
