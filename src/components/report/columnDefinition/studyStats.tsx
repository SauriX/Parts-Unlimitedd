import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData, IStudiesData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Table } from "antd";

const getStudyStatsColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Paciente", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        width: "5%",
      }),
    },
    {
      ...getDefaultColumnProps("sexo", "Sexo", {
        width: "5%",
      }),
    },
    {
      ...getDefaultColumnProps("medico", "Médico", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("fechaEntrega", "Fecha Entrega", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha Solicitud", {
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("parcialidad", "Parcialidad", {
        width: "5%",
      }),
      render: (value) => (value == true ? "Si" : "No"),
    },
  ];

  return columns;
};

export const expandableStudyConfig = () => {
  const nestedColumns: IColumns<IStudiesData> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("estudio", "Estudio", {
        width: "40%",
      }),
    },
    {
      ...getDefaultColumnProps("estatus", "Estatus", {
        width: "30%",
      }),
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

export default getStudyStatsColumns;
