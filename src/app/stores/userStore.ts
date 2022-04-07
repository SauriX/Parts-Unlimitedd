import { makeAutoObservable } from "mobx";
import User from "../api/user";
import { IUser, IUserInfo, ILoginForm, ILoginResponse,IChangePasswordResponse, IChangePasswordForm,IUserForm,IClave } from "../models/user";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors,tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
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
      if(!this.response.code){
        window.localStorage.setItem(tokenName,response.token);
        this.Token= response.token;
        this.changePasswordFlag=response.changePassword;
        this.idUser = response.id;
        return true;
      }else{
        switch(this.response.code){
          case 1:
            alerts.error("Usuario inactivo");
            break;
          case 2 :
            alerts.error("Usuario/contraseña no coinciden");
            break;
        }
        
      }
      return false;
    }catch(error: any){
      alerts.warning(getErrors(error));
      this.Token = "";
      return false;
    }
  };

  getById = async (id: string) => {
    console.log(id);
    try {
      const reagent = await User.getById(id);
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  create = async (reagent: IUserForm) => {
    try {
      await User.create(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (user: IUserForm) => {
    try {
      await User.update(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  changePassordF=async()=>{
    return  await this.changePasswordFlag
  };
  Clave =async(data:IClave)=>{
    const response = await User.getClave(data);
    return  await response;
  };
  
  generatePass = async ()=>{ 
    const response = await User.gepass();
    return await response;
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
