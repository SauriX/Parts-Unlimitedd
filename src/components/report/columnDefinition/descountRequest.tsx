import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Descriptions } from "antd";
import { moneyFormatter } from "../../../app/util/utils";
import React from "react";

const getDescountRequestColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "35%",
      }),
    },
    {
      ...getDefaultColumnProps("medico", "Nombre del Médico", {
        searchState,
        setSearchState,
        width: "35%",
      }),
    },
    {
      ...getDefaultColumnProps("empresa", "Compañía", {
        searchState,
        setSearchState,
        width: "35%",
      }),
    },
    {
      ...getDefaultColumnProps("subtotal", "Subtotal", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("promocion", "Promoción", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("descuento", "Desc.", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("iva", "IVA", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalEstudios", "Total", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return columns;
};

export default getDescountRequestColumns;
