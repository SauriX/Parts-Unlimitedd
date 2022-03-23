import { ILogin, IProfile } from "../models/shared";
import requests from "./agent";

const Profile = {
  login: (login: ILogin): Promise<IProfile> => requests.post("/profile/login", login),
};

export default Profile;
