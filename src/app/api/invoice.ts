import { IReagentForm, IReagentList } from "../models/reagent";
import { IScopes } from "../models/shared";
import requests from "./agent";

const Invoice = {
  printXML: (invoiceId: string): Promise<void> =>
    requests.download(`invoice/print/xml/${invoiceId}`),
};

export default Invoice;
