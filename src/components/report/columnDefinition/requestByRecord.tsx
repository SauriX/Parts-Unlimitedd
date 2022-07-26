import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";

const getRequestByRecordColumns = (
  searchState: ISearch,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  const columns: IColumns<IReportData> = [
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre", {
        searchState,
        setSearchState,
        width: "40%",
      }),
    },
    {
      ...getDefaultColumnProps("noSolicitudes", "Visitas", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
  ];

  return columns;
};

export default getRequestByRecordColumns;
