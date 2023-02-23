import { ITag } from "../models/tag";
import requests from "./agent";

const Tapon = {
    getAll: (): Promise<ITag[]> => 
    requests.get(`tapon/all`),
}
export default Tapon;