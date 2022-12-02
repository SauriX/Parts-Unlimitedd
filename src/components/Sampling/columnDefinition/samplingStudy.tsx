import { Checkbox, Table, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import { ISamplingList, IStudySampling } from "../../../app/models/sampling";
const { Link, Text } = Typography;
type expandableProps = {
  activity: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
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
        width: "15%",
      }),
    },
    {
      key: "imprimir",
      dataIndex: "imprimir",
      title: "Imprimir orden",
      align: "center",
      width: "10%",
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
}: expandableProps) => {
  const nestedColumns: IColumns<IStudySampling> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "30%",
      }),
      render: (_value, record) => record.clave + " - " + record.nombre,
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "20%",
      }),
      render: (_value, record) => record.nombreEstatus
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        width: "20%",
      }),
      render: (_value, record) => record.registro,
    },
    {
      ...getDefaultColumnProps("entrega", "Entrega", {
        width: "20%",
      }),
      render: (_value, record) => record.entrega,
    },
    {
      key: "Seleccionar",
      dataIndex: "seleccionar",
      title: "Seleccionar",
      align: "center",
      width: "10%",
      render: (_value, record) => (
        <>
          {record.estatus === 1 && (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
              disabled={!(activity == "register")}
            ></Checkbox>
          )}
          {record.estatus === 2 && (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
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