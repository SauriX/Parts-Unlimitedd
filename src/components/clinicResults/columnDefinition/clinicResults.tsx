import { Descriptions, Typography } from "antd";
import { useState } from "react";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import { IClinicResultList } from "../../../app/models/clinicResults";
import { useNavigate } from "react-router-dom";

const { Link, Text } = Typography;

const ClinicResultsColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const navigate = useNavigate();
  const columns: IColumns<IClinicResultList> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
      }),
      render: (_value, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            onClick={() => {
              navigate(
                `/clinicResultsDetails/${record.expedienteId}/${record.id}`
              );
            }}
          >
            {record.solicitud}
          </Link>
          <small>
            <Text type="secondary">
              Sucrusal: <Text strong>{record.sucursal}</Text>{" "}
            </Text>
          </small>
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      ...getDefaultColumnProps("nombreMedico", "Médico", {
        searchState,
        setSearchState,
        width: "15%",
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
      ...getDefaultColumnProps("compañia", "Compañía", {
        searchState,
        setSearchState,
        width: "20%",
      }),
      render: (_value, record) => (
        <ul>
          <li>
            {record.compañia == null
              ? "No pertenece a una compañía"
              : record.compañia}
          </li>
          <li>
            Procedencia: {record.procedencia == 1 ? "Compañía" : "Particulares"}
          </li>
        </ul>
      ),
    },
  ];
  return columns;
};

export const ClinicResultsExpandable = () => {
  return {
    expandedRowRender: (item: IClinicResultList) => (
      <div>
        <h4>Estudios</h4>
        {item.estudios.map((x) => {
          return (
            <Descriptions
              key={x.id}
              size="small"
              bordered
              style={{ marginBottom: 5 }}
              layout="vertical"
            >
              <Descriptions.Item
                label="Estudio"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                {x.clave} - {x.nombre}
              </Descriptions.Item>
              <Descriptions.Item
                label="Estatus"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                {x.nombreEstatus} - {x.entrega}
              </Descriptions.Item>
            </Descriptions>
          );
        })}
      </div>
    ),
    rowExpandable: () => true,
    defaultExpandAllRows: true,
  };
};

export default ClinicResultsColumns;
