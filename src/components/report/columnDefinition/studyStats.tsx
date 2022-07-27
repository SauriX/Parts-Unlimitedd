import { IColumns, ISearch } from "../../../app/common/table/utils";
import { IReportData } from "../../../app/models/report";
import { getDefaultColumnProps } from "../../../app/common/table/utils";
import { Card, Descriptions, List } from "antd";

const getStudyStatsColumns = (
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
      render: (value) => new Date(value).toLocaleDateString("en-GB"),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha de Solicitud", {
        searchState,
        setSearchState,
        width: "20%",
      }),
      render: (value) => new Date(value).toLocaleDateString("en-GB"),
    },
    {
      ...getDefaultColumnProps("parcialidad", "Parcialidad", {
        searchState,
        setSearchState,
        width: "20%",
      }),
      render: (value) => (value == true ? "Si" : "No"),
    },
  ];

  return columns;
};

export const expandableStudyConfig = {
  expandedRowRender: (item: IReportData) => (
    <div>
        <h4>Estudios</h4>
      {item.estudio.map((x) => {
        return (
          <>
            <Descriptions size="small" bordered labelStyle={{fontWeight: "bold"}} contentStyle={{background: "#fff"}} style={{marginBottom: 5}}>
              <Descriptions.Item label="Clave" style={{maxWidth: 30}}>{x.clave}</Descriptions.Item>
              <Descriptions.Item label="Estudio" style={{maxWidth: 30}}>{x.estudio}</Descriptions.Item>
              <Descriptions.Item label="Estatus" style={{maxWidth: 30}}>{x.estatus}</Descriptions.Item>
            </Descriptions>
          </>
        );
      })}
    </div>
  ),
  rowExpandable: () => true,
};

export default getStudyStatsColumns;
