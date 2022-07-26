import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";

const getPatientStatsColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("paciente", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "45%",
      }),
    },
    {
      ...getDefaultColumnProps("noSolicitudes", "Solicitudes", {
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
      render: (value) => moneyFormatter.format(value),
    },
  ];

  return columns;
};

export default getPatientStatsColumns;
