import { makeAutoObservable, reaction } from "mobx";
import { IMenu, IProfile } from "../models/shared";
import Profile from "../api/profile";
import { getErrors, tokenName } from "../util/utils";
import alerts from "../util/alerts";
import { ILoginForm } from "../models/user";
import history from "../util/history";

export default class ProfileStore {
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem(tokenName, token);
        } else {
          window.localStorage.removeItem(tokenName);
        }
      }
    );
  }

  menu: IMenu[] = [];
  profile: IProfile | undefined;
  token?: string = window.localStorage.getItem(tokenName) ?? undefined;

  get isLoggedIn() {
    return !!this.profile;
  }

  setToken = (token?: string) => {
    this.token = token;
  };

  setProfile = (profile?: IProfile) => {
    this.profile = profile;
  };

  getMenu = async () => {
    try {
      this.menu = await Profile.getMenu();
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  getProfile = async () => {
    try {
      this.profile = await Profile.getProfile();
      this.profile.token = this.token;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  login = async (creds: ILoginForm) => {
    try {
      const profile = await Profile.login(creds);
      this.setToken(profile.token);
      this.setProfile(profile);

      history.push("/");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  logout = () => {
    this.setToken(undefined);
    this.setProfile(undefined);
    history.push("/login");
  };
}
