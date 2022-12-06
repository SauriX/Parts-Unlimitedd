import { IColumns } from "../../../app/common/table/utils";
import {
  InvoiceData,
} from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";

const getInvoiceDataColumns = (
  report: string
) => {
  const columns: IColumns<InvoiceData> = [
    {
      ...getDefaultColumnProps("totalEstudios", "Estudios", {
        width: "15%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalDescuentosPorcentual", report === "cargo" ? "Cargo %" : "Desc. %", {
        width: "15%",
      }),
      render: (_value, record) => record.totalDescuentoPorcentual + "%",
    },
    {
      ...getDefaultColumnProps("totalDescuentos", report === "cargo" ? "Cargo" : "Desc.", {
        width: "15",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        width: "15%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("iva", "IVA", {
        width: "15%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("total", "Total", {
        width: "25%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return columns;
};

export default getInvoiceDataColumns;
