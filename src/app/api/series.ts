import { ISeriesList } from "../models/series";
import requests from "./agent";

const Series = {
  getByBranch: (branchId: string, type: number): Promise<ISeriesList[]> =>
    requests.get(`series/branch/${branchId}/${type}`),
};

export default Series;
