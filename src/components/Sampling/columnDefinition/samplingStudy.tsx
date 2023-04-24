import { Checkbox, Table, Tooltip, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import { EyeOutlined } from "@ant-design/icons";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import {
  ISamplingList,
  IStudySampling,
  IUpdate,
} from "../../../app/models/sampling";
const { Link, Text } = Typography;

type expandableProps = {
  activity: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
  updateForm: IUpdate[];
};

type tableProps = {
  printOrder: (recordId: string, requestId: string) => Promise<void>;
};

const SamplingStudyColumns = ({ printOrder }: tableProps) => {
  let navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<ISamplingList> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "5%",
      }),
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            onClick={() => {
              navigate(
                // ""
                `/requests/${item.expedienteId!}/${item.id}`
              );
            }}
          >
            {value}
          </Link>
          <small>
            <Text type="secondary">{item.clavePatologica}</Text>
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
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ fontWeight: "bolder", marginBottom: -5 }}>{value}</Text>
          {item.sucursal} {item.edad} años {item.sexo}
        </div>
      ),
    },    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "8%",
      }),
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            onClick={() => {
              navigate(
                // ""
                `/expedientes/${item.expedienteId!}?&mode=readonly`
              );
            }}
          >
            {value}
          </Link>
          <small>
            <Text type="secondary">{item.clavePatologica}</Text>
          </small>
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("registro", "Fecha Alta Solicitud", {
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
    },
    {
      key: "observacion",
      dataIndex: "observacion",
      title: "Observación",
      align: "center",
      width: "30%",
      render: (_value, record) => {
        return (
          <>
            {record.observacion != null ? (
              <Tooltip title={record.observacion} color="#108ee9">
                <EyeOutlined style={{ cursor: "pointer" }} />
              </Tooltip>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
    {
      key: "imprimir",
      dataIndex: "imprimir",
      title: "Orden",
      align: "center",
      width: "5%",
      render: (_value, record) => {
        return (
          <PrintIcon
            key="imprimir"
            onClick={() => {
              printOrder(record.expedienteId!, record.id);
            }}
          />
        );
      },
    },
  ];
  return columns;
};

export const SamplingStudyExpandable = ({
  activity,
  onChange,
  updateForm,
}: expandableProps) => {
  const nestedColumns: IColumns<IStudySampling> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "50%",
      }),
      render: (_value, record) => record.clave + " - " + record.nombre,
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "", {
        width: "1%",
      }),
      render: (_value, record) => (<div style={{ display: "inline-block" }}>
        <>
          {record.estatus === 1 && (
            <Checkbox
              onChange={(e) =>
                onChange(e, record.solicitudEstudioId, record.solicitudId)
              }
              checked={
                updateForm.find((x) =>
                  x.estudioId.includes(record.solicitudEstudioId)
                ) != null
              }
              disabled={!(activity == "register")}
            ></Checkbox>
          )}
          {record.estatus === 2 && (
            <Checkbox
              onChange={(e) =>
                onChange(e, record.solicitudEstudioId, record.solicitudId)
              }
              checked={
                updateForm.find((x) =>
                  x.estudioId.includes(record.solicitudEstudioId)
                ) != null
              }
              disabled={!(activity == "cancel")}
            ></Checkbox>
          )}
        </>
      </div>),
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "10%",
      }),
      render: (_value, record) => (<div style={{ display: "inline-block" }}>
        <Text>{record.nombreEstatus}</Text>
      </div>),
    },
    {
      ...getDefaultColumnProps("fechaActualizacion", "Fecha de Actualización", {
        width: "15%",
      }),
      render: (_value, record) =>
        record.fechaActualizacion == null
          ? " - "
          : record.fechaActualizacion + " - " + record.usuarioActualizacion +" (Actualización)",
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de Entrega", {
        width: "15%",
      }),
      render: (_value, record) => (
        <Typography>
          <Text style={record.urgencia > 1 ? { color: "red" } : {}}>
            {record.entrega} (Entrega)
          </Text>
        </Typography>
      ),
    }
  ];

  return {
    expandedRowRender: (item: ISamplingList, index: any) => (
      <Table
        columns={nestedColumns}
        dataSource={item.estudios}
        pagination={false}
        className="header-expandable-table"
        showHeader={false}
      />
    ),
    rowExpandable: () => true,
    defaultExpandAllRows: true,
  };
};

export default SamplingStudyColumns;
