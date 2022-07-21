import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { moneyFormatter } from "../../../app/util/utils";

const getMedicalStatsColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("claveMedico", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("nombreMedico", "Nombre del Médico", {
        searchState,
        setSearchState,
        width: "35%",
      }),
    },
    {
      ...getDefaultColumnProps("total", "Importe", {
        searchState,
        setSearchState,
        width: "20%",
      }),
      render: (value) => moneyFormatter.format(value),
      // render: (_value, record) =>
      //     <ul>
      //       <li>{record.pacientes}</li>
      //       <li>{record.total}</li>
      //     </ul>
    },
    {
      ...getDefaultColumnProps("solicitudes", "Solicitudes", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("pacientes", "No. Pacientes", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
  ];

  return columns;
};

export default getMedicalStatsColumns;
