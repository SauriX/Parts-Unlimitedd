import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData, IStudiesData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Descriptions, Table, Typography } from "antd";
import { moneyFormatter } from "../../../app/util/utils";
import React from "react";
const { Text } = Typography;

const getCompanyStatsColumns = (
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
      ...getDefaultColumnProps("precioEstudios", "Estudios", {
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
      ...getDefaultColumnProps("totalEstudios", "Total", {
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return columns;
};

export const expandablePriceConfig = () => {
  const nestedColumns: IColumns<IStudiesData> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("estudio", "Nombre del estudio", {
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("descuento", "Promoción del estudio", {
        width: "15%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("precioFinal", "Precio", {
        width: "10%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("paquete", "Paquete", {
        width: "10%",
      }),
      render: (_value, record) => record.paquete != null ? record.paquete : "-",
    },
    {
      ...getDefaultColumnProps("promocion", "Promoción del paquete", {
        width: "15%",
      }),
      render: (_value, record) => record.paquete != null ? moneyFormatter.format(_value) : "-",
    },
  ];

  return {
    expandedRowRender: (item: IReportData, index: any) => (
      <Table
        columns={nestedColumns}
        dataSource={item.estudio}
        pagination={false}
        className="header-expandable-table"
        showHeader={index === 0}
      />
    ),
    rowExpandable: () => true,
    defaultExpandAllRows: true,
  };
};

export default getCompanyStatsColumns;
