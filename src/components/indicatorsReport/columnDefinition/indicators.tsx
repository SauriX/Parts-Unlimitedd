import { Col, Row, Table, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import { v4 as uuid } from "uuid";
import { IReportIndicators } from "../../../app/models/indicators";
import { useStore } from "../../../app/stores/store";
import moment from "moment";
import { IResult } from "../../../app/models/massResultSearch";
import React from "react";

const { Link, Text } = Typography;

const Indicators = () => {
  const { indicatorsStore } = useStore();
  const { data } = indicatorsStore;

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fixedColumns, setFixedColumns] = useState<any>([]);

  useEffect(() => {
    const cols = data.map((indicators: IReportIndicators) => {
        return {
            ...getDefaultColumnProps("sucursal", "Sucursal", {
                searchState,
                setSearchState,
                width: "20%",  
            }),
            align: "center",
            key: uuid(),
            title: () => {
                return (
                    <Fragment>
                        <Text>{indicators.sucursal}</Text>
                    </Fragment>
                )
            }
        }
    })

    setFixedColumns(cols);
  }, [data])

  const columns: IColumns<IReportIndicators> = [
    {
        ...getDefaultColumnProps("sucursal",  `${moment().format("DD/MM/YYYY")}`, {
            searchState,
            setSearchState,
            width: "20%",  
        }),
        align: "left",
        key: uuid(),
        render: (value, row) => {
            return (
              <Fragment>
                
              </Fragment>
            );
          },
    
          fixed: "left",
    }
  ]

  

  return <div>indicators</div>;
};

export const titleTab = [
  {
    label: "Costo Toma",
    name: "sample",
  },
  {
    label: "Costo Fijo",
    name: "service",
  },
];

export default Indicators;
