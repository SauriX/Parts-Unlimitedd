import { makeAutoObservable } from "mobx";
import { ReactNode } from "react";

interface IModalInfo {
  visible?: boolean;
  title?: ReactNode;
  body?: ReactNode;
  width?: string | number;
  closable?: boolean;
}

class ModalInfo implements IModalInfo {
  visible?: boolean = false;
  title?: ReactNode;
  body?: ReactNode;
  width?: string | number | undefined;
  closable?: boolean | undefined;

  constructor(init?: IModalInfo) {
    Object.assign(this, init);
  }
}

export default class ModalStore {
  constructor() {
    makeAutoObservable(this);
  }

  modal: IModalInfo = new ModalInfo();

  openModal = (modal: IModalInfo) => {
    modal.visible = true;
    this.modal = modal;
  };

  closeModal = () => {
    this.modal = new ModalInfo();
  };
}
