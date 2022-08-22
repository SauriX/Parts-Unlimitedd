import { IColumns, ISearch } from "../../../app/common/table/utils";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";
import { Invoice } from "../../../app/models/cashRegister";

const getInvoiceColumns = (
  searchState: ISearch,
) => {
  const columns: IColumns<Invoice> = [
    {
      ...getDefaultColumnProps("sumaEfectivo", "Efectivo", {
        searchState,
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("sumaTDC", "TDC", {
        searchState,
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),

    },
    {
      ...getDefaultColumnProps("sumaTransferencia", "Transf. E", {
        searchState,
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("sumaCheque", "Cheque", {
        searchState,
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        searchState,
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("sumaPP", "PP", {
        searchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("total", "Total", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return columns;
};

export default getInvoiceColumns;
