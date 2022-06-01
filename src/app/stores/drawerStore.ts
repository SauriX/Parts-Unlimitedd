import { makeAutoObservable } from "mobx";
import { ReactNode } from "react";

interface IDrawerInfo {
  visible?: boolean;
  title?: ReactNode;
  body?: ReactNode;
  width?: string | number;
}

class DrawerInfo implements IDrawerInfo {
  visible?: boolean = false;
  title?: ReactNode;
  body?: ReactNode;
  width?: string | number | undefined;

  constructor(init?: IDrawerInfo) {
    Object.assign(this, init);
  }
}

export default class DrawerStore {
  constructor() {
    makeAutoObservable(this);
  }

  drawer: IDrawerInfo = new DrawerInfo();

  openDrawer = (drawer: IDrawerInfo) => {
    drawer.visible = true;
    this.drawer = drawer;
  };

  closeDrawer = () => {
    this.drawer = new DrawerInfo();
  };
}
