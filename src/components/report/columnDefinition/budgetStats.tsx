import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData, IStudiesData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";
import React from "react";
import { Table } from "antd";

const getBudgetRequestColumns = (
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
      ...getDefaultColumnProps("nombrePaciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "35%",
      }),
      render: (value) => value == null ? "-" : value
    },
    {
      ...getDefaultColumnProps("nombreMedico", "Nombre del Médico", {
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

export const expandableBudgetStatsConfig = () => {
    const nestedColumns: IColumns<IStudiesData> = [
      {
        ...getDefaultColumnProps("clave", "Clave", {
          width: "20%",
        }),
      },
      {
        ...getDefaultColumnProps("estudio", "Nombre del estudio", {
          width: "40%",
        }),
      },
      {
        ...getDefaultColumnProps("precioFinal", "Precio", {
          width: "20%",
        }),
        render: (value) => moneyFormatter.format(value),
      },
      {
        ...getDefaultColumnProps("descuento", "Descuento", {
          width: "20%",
        }),
        render: (value) => moneyFormatter.format(value),
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
  
export default getBudgetRequestColumns;
