import React, { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import series from "../../../app/api/series";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ISeriesList } from "../../../app/models/series";
import moment from "moment";

const { Link, Text } = Typography;

const SeriesColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const navigate = useNavigate();

  const columns: IColumns<ISeriesList> = [
    {
      ...getDefaultColumnProps("id", "Reg.", {
        searchState,
        setSearchState,
        width: "15%",
      }),
      render: (_value, record) => (
        <Link
          onClick={() => {
            navigate(`/series/${record.id}/${record.tipo}`);
          }}
        >
          {record.id}
        </Link>
      ),
    },
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
      render: (_value, record) => (record.cfdi ? "SI" : record.cfdi == null ? "-" : "NO"), 
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
        render: (_value, record) => (record.activo && record.tipo === 1 ? "Vigente" : record.activo == null ? "-" : "Caducado"),
      },
  ];

  return columns;
};

export default SeriesColumns;
