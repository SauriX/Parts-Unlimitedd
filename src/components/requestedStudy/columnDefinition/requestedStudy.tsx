import { Descriptions, Checkbox, Table } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import moment from "moment";
import { useState } from "react";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import { IRequestStudy } from "../../../app/models/request";
import {
  IRequestedStudy,
  IRequestedStudyList,
} from "../../../app/models/requestedStudy";
import { status } from "../../../app/util/catalogs";

type expandableProps = {
  activity: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
};

type tableProps = {
  printOrder: (recordId: string, requestId: string) => Promise<void>;
};

const RequestedStudyColumns = ({ printOrder }: tableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columns: IColumns<IRequestedStudyList> = [
    {
      ...getDefaultColumnProps("solicitud", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
      }),
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
      render: (_value, record) => (
        <PrintIcon
          key="imprimir"
          onClick={() => {
            printOrder(record.order, record.id);
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
}: expandableProps) => {
  const nestedColumns: IColumns<IRequestedStudy> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "20%",
      }),
      render: (_value, record) => record.clave + " - " + record.nombre,
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "20%",
      }),
      render: (_value, record) => record.nombreEstatus,
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
      render: (_value, record) =>
        record.entrega,
    },
    {
      key: "Seleccionar",
      dataIndex: "seleccionar",
      title: "Seleccionar",
      align: "center",
      width: "20%",
      render: (_value, record) => (
        <>
          {record.status === status.requestStudy.tomaDeMuestra &&
            activity == "register" && (
              <Checkbox
                onChange={(e) => onChange(e, record.id, record.solicitudId)}
              >
                Selecciona
              </Checkbox>
            )}
          {record.status === status.requestStudy.solicitado &&
            activity == "cancel" && (
              <Descriptions.Item
                label="Selecciona"
                style={{ maxWidth: 30 }}
                className="description-content"
              >
                <Checkbox
                  onChange={(e) => onChange(e, record.id, record.solicitudId)}
                >
                  Selecciona
                </Checkbox>
              </Descriptions.Item>
            )}
        </>
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
        showHeader={index === 0}
      />
    ),
    rowExpandable: () => true,
    defaultExpandAllRows: true,
  };
};

export default RequestedStudyColumns;
