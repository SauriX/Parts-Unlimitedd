import { ICity, ILocation } from "../models/location";
import requests from "./agent";

const Location = {
  getColoniesByZipCode: (zipCode: string): Promise<ILocation> =>
    requests.get(`location/getByZipCode/${zipCode}`),

    getCities: (): Promise<ICity[]> =>
    requests.get(`location/getcity`),

    getCity: (): Promise<ILocation> =>
    requests.get(`location/getCity/`),
};

export default Location;
