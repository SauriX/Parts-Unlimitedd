import { makeAutoObservable } from "mobx";
import { IProfile } from "../models/shared";

export default class ProfileStore {
  constructor() {
    makeAutoObservable(this);
  }

  profile: IProfile | undefined = {
    nombre: "Nombre de usuario",
    token: "token",
  };

  get isLoggedIn() {
    // return !!this.profile;
    return true;
  }
}
