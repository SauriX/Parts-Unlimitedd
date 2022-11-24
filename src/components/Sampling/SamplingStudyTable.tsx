import { Descriptions, Checkbox, Table } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import moment from "moment";
import { useState } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import {
  IColumns,
  ISearch,
  getDefaultColumnProps,
} from "../../app/common/table/utils";
import { IRequestStudy } from "../../app/models/request";
import {
  IRequestedStudy,
  IRequestedStudyList,
} from "../../app/models/requestedStudy";
import { IsamplingList, IstudySampling } from "../../app/models/sampling";
import { status } from "../../app/util/catalogs";

type expandableProps = {
  activiti: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
};

type tableProps = {
  printTicket: (recordId: string, requestId: string) => Promise<void>;
};

const SamplingStudyColumns = ({ printTicket }: tableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columns: IColumns<IsamplingList> = [
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
            printTicket(record.order, record.id);
          }}
        />
      ),
    },
  ];
  return columns;
};

export const SamplingStudyExpandable = ({
  activiti,
  onChange,
}: expandableProps) => {
  const nestedColumns: IColumns<IstudySampling> = [
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
      render: (_value, record) => record.estatus == 1 ? "Pendiente" : "Toma de muestra",
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
              disabled={!(activiti == "register")}
            >
            </Checkbox>
          )}
          {record.estatus === 2 && (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
              disabled={!(activiti == "cancel")}
            >
            </Checkbox>
          )}
        </>
      ),
    },
  ];

  return {
    expandedRowRender: (item: IsamplingList, index: any) => (
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
