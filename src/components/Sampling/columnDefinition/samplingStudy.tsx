import { Checkbox, Input, Table, Tooltip, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import TextArea from "antd/lib/input/TextArea";
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
import alerts from "../../../app/util/alerts";
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
        width: "15%",
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
            <Text type="secondary">{item.solicitud}</Text>
          </small>
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre del Paciente", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        searchState,
        setSearchState,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("edad", "Edad", {
        searchState,
        setSearchState,
        width: "5%",
      }),
    },
    {
      ...getDefaultColumnProps("sexo", "Sexo", {
        searchState,
        setSearchState,
        width: "5%",
      }),
    },

    {
      ...getDefaultColumnProps("compañia", "Compañía", {
        searchState,
        setSearchState,
        width: "10%",
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
              <Tooltip title={record.observacion} color='#108ee9'>
                <EyeOutlined
                style={{ cursor: "pointer" }}
              />
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
      title: "Imprimir orden",
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
  activity: activity,
  onChange,
  updateForm,
}: expandableProps) => {
  console.log(updateForm);

  const nestedColumns: IColumns<IStudySampling> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "20%",
      }),
      render: (_value, record) => record.clave + " - " + record.nombre,
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "15%",
      }),
      render: (_value, record) => record.nombreEstatus,
    },
    {
      ...getDefaultColumnProps("fechaActualizacion", "Fecha de Actualización", {
        width: "15%",
      }),
      render: (_value, record) =>
        record.fechaActualizacion == null
          ? " - "
          : record.fechaActualizacion + " - " + record.usuarioActualizacion,
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
          <Text style={record.urgencia > 1 ? { color: "red" } : {}}>
            {record.entrega}
          </Text>
        </Typography>
      ),
    },
    {
      key: "Seleccionar",
      dataIndex: "seleccionar",
      title: "Seleccionar",
      align: "center",
      width: "5%",
      render: (_value, record) => (
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
      ),
    },
  ];

  return {
    expandedRowRender: (item: ISamplingList, index: any) => (
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

export default SamplingStudyColumns;
