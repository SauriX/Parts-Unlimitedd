import { makeAutoObservable } from "mobx";
import User from "../api/user";
import { IUser } from "../models/user";
import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors } from "../util/utils";

export default class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  users: IUser[] = [];

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
}
