import { ILogin, IProfile,IMenu } from "../models/shared";
import requests from "./agent";

const Profile = {
  getmenus: (): Promise<IMenu[]> => requests.get(`Account/menu`),
  getProfile:():Promise<IProfile>=>requests.get(`Account/profile`),
};

export default Profile;
