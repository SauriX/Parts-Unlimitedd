import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable } from "mobx";
import { INotification } from "../models/shared";
import alerts from "../util/alerts";
import { store } from "./store";

export default class NotificationStore {
  constructor() {
    makeAutoObservable(this);
  }

  hubConnection: HubConnection | null = null;

  createHubConnection = async () => {
    try {
      const hubUrl = process.env.REACT_APP_NOTIFICATION_URL;
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(hubUrl!, {
          accessTokenFactory: () => store.profileStore.token!,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Debug)
        .build();

      try {
        await this.hubConnection.start();
        if (this.hubConnection.state === "Connected") {
          this.hubConnection.invoke("Subscribe");
        }
      } catch (error) {
        console.log("Error al conectar con SignalR: ", error);
      }

      this.hubConnection.onreconnected(() => {
        this.hubConnection!.invoke("Subscribe");
      });

      this.hubConnection.on("Notify", (notification: INotification) => {
        console.log(notification);
        if (notification.esAlerta) {
          alerts.info(notification.mensaje);
        }
      });
    } catch (error) {
      console.log("Error con SignalR: ", error);
    }
  };
}
