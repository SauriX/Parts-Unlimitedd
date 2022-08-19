import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Descriptions } from "antd";

const getUrgentStatsColumns = (
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
    {
      ...getDefaultColumnProps("urgencia", "Urgencia", {
        searchState,
        setSearchState,
        width: "20%",
      }),
      render: (value) => (value == 2 ? "Urgencia" : "Urgencia por cargo"),
    },
  ];

  return columns;
};

export default getUrgentStatsColumns;
