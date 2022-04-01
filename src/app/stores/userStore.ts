import { makeAutoObservable } from "mobx";
import User from "../api/user";
import { IUser, IUserInfo, ILoginForm, ILoginResponse,IChangePasswordResponse, IChangePasswordForm } from "../models/user";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors,tokenName } from "../util/utils";
export default class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  users: IUserInfo[] = [];
  Token: string = "";
  changePasswordFlag: boolean = false;
  idUser: string = "";
  response?: ILoginResponse ;
  changepassResponse?: IChangePasswordResponse;
  access = async () => {
    try {
      //  await User.access();
      if (Date.now() > 100) return;
      else throw new Error("Test");
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: string) => {
    try {
      const users = await User.getAll(search);
      this.users = users;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.users = [];
    }
  };

  loginuser= async (user:ILoginForm) =>{
    this.Token="";
    
    try{
      const response = await User.login(user);
      this.response = response;
      if(this.response){
        window.localStorage.setItem(tokenName,response.token);
        this.Token= response.token;
        this.changePasswordFlag=response.changePassword;
        this.idUser = response.id;
        return true;
      }else{
        alerts.error("Usuario/contraseña no coinciden");
      }
      return false;
    }catch(error: any){
      alerts.warning(getErrors(error));
      this.Token = "";
      return false;
    }
  };

  changePassordF=async()=>{
    return  await this.changePasswordFlag
  }
  
  changePassword= async (form:IChangePasswordForm)=>{
    try {
      form.token= this.Token;
      const response = await User.changePass(form);
      this.changepassResponse = response;
      if(this.changepassResponse){
        return this.changepassResponse.flagpassword;
      }else{
        alerts.error("Las contraseñas deben ser iguales");
      }
      return false;
    } catch (error:any) {
      alerts.warning(getErrors(error));
      return false;
    }
  }
}
