import { Descriptions, Table, TableColumnsType, Typography } from "antd";
import { useState } from "react";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import {
  IClinicResultList,
  IClinicStudy,
} from "../../../app/models/clinicResults";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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
              <Text strong>{record.clavePatologica}</Text>{" "}
            </Text>
          </small>
          <small>
            <Text type="secondary">
              Sucursal: <Text strong>{record.sucursal}</Text>{" "}
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
      ...getDefaultColumnProps("usuarioCreo", "Usuario Registró", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },

    {
      ...getDefaultColumnProps("compañia", "Compañía", {
        searchState,
        setSearchState,
        width: "20%",
      }),
      render: (_value, record) =>
        record.compañia == null
          ? "No pertenece a una compañía"
          : record.compañia,
    },
  ];
  return columns;
};

export const ClinicResultsExpandable = () => {
  const nestedColumns: IColumns<IClinicStudy> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "40%",
      }),
      render: (_value, record) => record.clave + " - " + record.nombre,
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "15%",
      }),
      render: (_value, record) => record.nombreEstatus!,
    },
    {
      ...getDefaultColumnProps("fechaActualizacion", "Fecha de Actualización", {
        width: "15%",
      }),
      render: (_value, record) => record.fechaActualizacion == null ? " - " : record.fechaActualizacion + " - " + record.usuarioActualizacion,
    },
    {
      ...getDefaultColumnProps("registro", "Fecha de Registro", {
        width: "15%",
      }),
      render: (_value, record) => record.registro,
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de Entrega", {
        width: "15%",
      }),
      render: (_value, record) => (
        <Typography>
          <Text style={record.urgencia! > 1 ? {color: "red"} : {}}>
            {record.entrega}
          </Text>
        </Typography>
      ),
    },
  ];

  return {
    expandedRowRender: (item: IClinicResultList, index: any) => (
      <Table
        columns={nestedColumns}
        dataSource={item.estudios}
        pagination={false}
        className="header-expandable-table"
        showHeader={index === 0}
      />
    ),
    rowExpandable: () => true,
    defaultExpandAllRows: true,
  };
};

export default ClinicResultsColumns;
