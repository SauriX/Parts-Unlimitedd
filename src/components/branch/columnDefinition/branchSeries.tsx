import { useState } from "react";
import { Checkbox } from "antd";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ISeriesList } from "../../../app/models/series";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

type ColumnProps = {
  onChange: (e: CheckboxChangeEvent, id: number) => void;
};

const BranchSeriesColumns = ({onChange}: ColumnProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<ISeriesList> = [
    {
      ...getDefaultColumnProps("clave", "Serie", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("tipoSerie", "Tipo", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("descripcion", "Descripción", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("cfdi", "CFDI", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (_value, record) =>
        record.cfdi
          ? "SI"
          : record.cfdi == null || record.tipo === 2
          ? ""
          : "NO",
    },
    {
      ...getDefaultColumnProps("año", "Año", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("activo", "Estatus", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (_value, record) =>
        record.activo && record.tipo === 1
          ? "Vigente"
          : record.activo == null || record.tipo === 2
          ? ""
          : "Caducado",
    },
    {
      key: "relacion",
      dataIndex: "relacion",
      title: "Usar",
      align: "center",
      width: "10%",
      render: (_value, record) => (
        <Checkbox checked={record.relacion} onChange={(e) => onChange(e, record.id)}  />
      ),
    },
  ];

  return columns;
};

export default BranchSeriesColumns;
