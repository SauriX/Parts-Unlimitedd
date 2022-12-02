import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData, IStudiesData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Descriptions, Table } from "antd";
import "../css/report.less";
import { moneyFormatter } from "../../../app/util/utils";

const getMaquilaExternColumns = (
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
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("sexo", "Sexo", {
        searchState,
        setSearchState,
        width: "15%",
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
      ...getDefaultColumnProps("fechaEntrega", "Fecha de Entrega", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
  ];

  return columns;
};

export const expandableMaquilaExternConfig = () => {
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
      ...getDefaultColumnProps("estatus", "Estatus", {
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("maquila", "Maquilador", {
        width: "20%",
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

export default getMaquilaExternColumns;
