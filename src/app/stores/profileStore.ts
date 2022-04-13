import { makeAutoObservable } from "mobx";
import { IMenu, IProfile } from "../models/shared";
import Profile from "../api/profile"
export default class ProfileStore {
  constructor() {
    makeAutoObservable(this);
  }
  menu:IMenu[]=[];
  profile: IProfile | undefined = {
    nombre: "Nombre de usuario",
    token: "token",
  };
  getMenu = async ()=>{ 
    const response = await Profile.getmenus();
    if(response){
      this.menu=response;
    }
  }
  getprofile = async ()=>{ 
    const response = await Profile.getProfile();
    console.log(response);
    if(response){
      this.profile=response;
    }
  }
  get isLoggedIn() {
    // return !!this.profile;
    return true;
  }
}
