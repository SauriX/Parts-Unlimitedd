import React, { useState } from "react";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { IReportIndicators } from "../../../app/models/indicators";

const CostoTomaColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  let widthColumns = 100 / 3;

  const columns: IColumns<IReportIndicators> = [
    {
      ...getDefaultColumnProps("costoToma", "Costo Toma", {
        searchState,
        setSearchState,
        width: `${widthColumns}%`,
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: `${widthColumns}%`,
      }),
    },
    {
      ...getDefaultColumnProps("fechaAlta", "Fecha Alta", {
        searchState,
        setSearchState,
        width: `${widthColumns}%`,
      }),
    },
  ];
  return columns;
};

export default CostoTomaColumns;
