import { ILogin, IProfile, IMenu } from "../models/shared";
import { ILoginForm } from "../models/user";
import requests from "./agent";

const Profile = {
  getMenu: (): Promise<IMenu[]> => requests.get(`profile/menu`),
  getProfile: (): Promise<IProfile> => requests.get(`profile/me`),
  login: (creds: ILoginForm): Promise<IProfile> => requests.post("profile/login", creds),
};

export default Profile;
