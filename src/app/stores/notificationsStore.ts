import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import { getParsedCommandLineOfConfigFile } from "typescript";
import Notifications from "../api/notiofications";
import { INotificationForm, INotificationsList } from "../models/notifications";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class NotificationsStore {
  constructor() {
    makeAutoObservable(this);
  }


  scopes?: IScopes;
  notifications: INotificationsList[] = [];
  avisos: INotificationsList[] = [];
  clearScopes = () => {
    this.scopes = undefined;
  };

  clearNotifications= () => {
    this.notifications = [];
  };
  clearAvisos= () => {
    this.avisos = [];
  };
  
  access = async () => {
    try {
      const scopes = await Notifications.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAllNotifications = async (search: string) => {
    try {
      const notifications = await Notifications.getAllNotifications(search);
      this.notifications = notifications;
      return notifications;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.notifications = [];
    }
  };
  getAllAvisos = async (search: string) => {
    try {
      const avisos = await Notifications.getAllAvisos(search);
      this.avisos = avisos;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.avisos= [];
    }
  };

  getById = async (id: string) => {
    try {
      const notification = await Notifications.getById(id);
      return notification;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  create = async (notifications: INotificationForm) => {
    try {
      await Notifications.create(notifications);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (notifications: INotificationForm) => {
    try {
      await Notifications.update(notifications);

      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  changeStatusAvisos = (id:string)=>{
    let avisos = [...this.avisos];
    var aviso = avisos.find(x=>x.id===id);
    aviso!.activo = !aviso!.activo;
    var avisoIndex = avisos.findIndex(x=>x.id===id);
    avisos[avisoIndex]=aviso!;
    this.avisos = avisos;
  };
  changeStatusNotificacion = (id:string)=>{
    let notificationes = [...this.notifications];
    var notificacion = notificationes.find(x=>x.id===id);
    notificacion!.activo = !notificacion!.activo;
    var notificacionIndex = notificationes.findIndex(x=>x.id===id);
    notificationes[notificacionIndex]=notificacion!;
    this.avisos = notificationes;
  };
  updateStatus = async (id:string) => {
    try {

      await Notifications.updateStatus(id);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
}