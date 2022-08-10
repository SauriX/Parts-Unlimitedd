import { ICashRegisterData, ICashRegisterFilter } from "../models/cashRegister";
import { IScopes } from "../models/shared";
import requests from "./agent";

const CashRegister = {
  access: (): Promise<IScopes> => requests.get("scopes/cash"),
  getByFilter: (
    filter: ICashRegisterFilter
  ): Promise<ICashRegisterData[]> => requests.post(`report/corte_caja/filter`, filter),
  printPdf: (filter: ICashRegisterFilter): Promise<void> =>
    requests.download(`report/corte_caja/download/pdf`, filter),
};

export default CashRegister;
