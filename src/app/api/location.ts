import { ILocation } from "../models/location";
import requests from "./agent";

const Location = {
  getColoniesByZipCode: (zipCode: string): Promise<ILocation> =>
    requests.get(`location/getByZipCode/${zipCode}`),
};

export default Location;
