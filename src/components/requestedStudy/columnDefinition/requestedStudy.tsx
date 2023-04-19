import { Checkbox, Table, Tooltip, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useState } from "react";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import {
  IRequestedStudy,
  IRequestedStudyList,
  IUpdate,
} from "../../../app/models/requestedStudy";
import { EyeOutlined } from "@ant-design/icons";
import { status } from "../../../app/util/catalogs";
import { useNavigate } from "react-router-dom";
const { Link, Text } = Typography;

type expandableProps = {
  activity: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
  updateForm: IUpdate[];
};

type tableProps = {
  printOrder: (recordId: string, requestId: string) => Promise<void>;
};

const RequestedStudyColumns = ({ printOrder }: tableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const navigate = useNavigate();
  const columns: IColumns<IRequestedStudyList> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "5%",
      }),
      render: (_value, record) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link
            onClick={() => {
              navigate(`/requests/${record.expedienteId}/${record.id}`);
            }}
          >
            {record.solicitud}
          </Link>
          <small>
            <Text type="secondary">
              <Text strong>{record.clavePatologica}</Text>{" "}
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
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text style={{ fontWeight: "bolder", marginBottom: -5 }}>{value}</Text>
          {item.sucursal} {item.edad} años {item.sexo}
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
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
      width: "10%",
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
      render: (_value, record) => (
        <PrintIcon
          key="imprimir"
          onClick={() => {
            printOrder(record.expedienteId, record.id);
          }}
        />
      ),
    },
  ];
  return columns;
};

export const RequestedStudyExpandable = ({
  activity,
  onChange,
  updateForm,
}: expandableProps) => {
  const nestedColumns: IColumns<IRequestedStudy> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "59%",
      }),
      render: (_value, record) => record.clave + " - " + record.nombre,
    }, {
      ...getDefaultColumnProps("nombreEstatus", "", {
        width: "1%",
      }),
      render: (_value, record) => (<div>
        {record.nombreEstatus}
      </div>),
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "10%",
      }),
      render: (_value, record) => (<div>

        <>
          {record.estatus === status.requestStudy.tomaDeMuestra && (
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
          {record.estatus === status.requestStudy.solicitado && (
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
      ...getDefaultColumnProps("fechaActualizacion", "Fecha de Actualización", {
        width: "10%",
      }),
      render: (_value, record) =>
        record.fechaActualizacion == null
          ? " - "
          : record.fechaActualizacion + " - " + record.usuarioActualizacion,
    },
    {
      ...getDefaultColumnProps("registro", "Fecha de Registro", {
        width: "10%",
      }),
      render: (_value, record) => record.registro,
    },
    {
      ...getDefaultColumnProps("entrega", "Fecha de Entrega", {
        width: "10%",
      }),
      render: (_value, record) => (
        <Typography>
          <Text style={record.urgencia > 1 ? { color: "red" } : {}}>
            {record.entrega}
          </Text>
        </Typography>
      ),
    },

  ];

  return {
    expandedRowRender: (item: IRequestedStudyList, index: any) => (
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

export default RequestedStudyColumns;
