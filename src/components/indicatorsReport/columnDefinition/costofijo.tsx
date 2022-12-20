import React, { useState } from "react";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import {
  IModalInvoice,
  IReportIndicators,
} from "../../../app/models/indicators";
import { moneyFormatter } from "../../../app/util/utils";

let widthColumns = 100 / 3;

const CostosFijosColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IReportIndicators> = [
    {
      ...getDefaultColumnProps("costoFijo", "Costo Fijo", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("servicio", "Servicio", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("fechaAlta", "Fecha Alta", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
  ];
  return columns;
};

const CostosFijosInvoice = () => {
  const invoiceColumns: IColumns<IModalInvoice> = [
    {
      ...getDefaultColumnProps("totalMensual", "Total Mensual", {
        width: `${widthColumns}%`,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalSemanal", "Total Semanal", {
        width: `${widthColumns}%`,
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalDiario", "Total Diario", {
        width: `${widthColumns}%`,
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];
  
  return invoiceColumns
};

export {CostosFijosColumns, CostosFijosInvoice};
