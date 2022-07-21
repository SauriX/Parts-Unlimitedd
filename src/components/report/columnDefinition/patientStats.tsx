import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";

const getPatientStatsColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("nombrePaciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "45%",
      }),
    },
    {
      ...getDefaultColumnProps("solicitudes", "Solicitudes", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("total", "Total Solicitudes", {
        searchState,
        setSearchState,
        width: "30%",
      }),
      render: (value) =>
        value.toLocaleString("es-MX", {
          style: "currency",
          currency: "MXN",
        }),
    },
  ];

  return columns;
};

export default getPatientStatsColumns;
