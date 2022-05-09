import { ITapon } from "../models/tapon";
import requests from "./agent";

const Tapon = {
    getAll: (): Promise<ITapon[]> => 
    requests.get(`tapon/all`),
}
export default Tapon;