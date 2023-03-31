import { INotificationFilter, INotificationForm, INotificationsList } from "../models/notifications";
import { INotification, IScopes } from "../models/shared";
import requests from "./agent";

const Notifications = {
  access: (): Promise<IScopes> => requests.get("scopes/notifications"),
  getAllNotifications: (search: string): Promise<INotificationsList[]> => requests.get(`notifications/all/notification/${!search ? "all" : search}`),
  getAllAvisos: (search: string): Promise<INotificationsList[]> => requests.get(`notifications/all/avisos/${!search ? "all" : search}`),
  getById: (id: string): Promise<INotificationForm> => requests.get(`notifications/${id}`),
  create: (notification: INotificationForm): Promise<void> => requests.post("notifications", notification),
  update: (notification: INotificationForm): Promise<void> => requests.put("notifications", notification),
  updateStatus: (id:string): Promise<void> => requests.put(`notifications/status/${id}`,id),
  getNotification: (filter:INotificationFilter): Promise<INotification[]> => requests.post(`notification`,filter),

};

export default Notifications;
