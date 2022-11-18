import { Descriptions, Checkbox, Table } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import moment from "moment";
import { useState } from "react";
import PrintIcon from "../../app/common/icons/PrintIcon";
import {EyeOutlined } from "@ant-design/icons";
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
import { Ivalidationlist, IvalidationStudyList } from "../../app/models/resultValidation";

import { status } from "../../app/util/catalogs";

type expandableProps = {
  activiti: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
  viewTicket: (recordId: any) => Promise<void>;
};

type tableProps = {
  printTicket: (recordId: string, requestId: string) => Promise<void>;
  
};

const ValidationStudyColumns = ({ printTicket }: tableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columns: IColumns<Ivalidationlist> = [
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
        <>
        <PrintIcon
          key="imprimir"
          onClick={() => {
            printTicket(record.order, record.id);
          }}
        />
           
        </>
      ),
    },
  ];
  return columns;
};

export const ValidationStudyExpandable = ({
  activiti,
  onChange,
  viewTicket
}: expandableProps) => {
  const nestedColumns: IColumns<IvalidationStudyList> = [
    {
      ...getDefaultColumnProps("clave", "Estudio", {
        width: "30%",
      }),
      render: (_value, record) => record.study,
    },
    {
      ...getDefaultColumnProps("nombreEstatus", "Estatus", {
        width: "20%",
      }),
      render: (_value, record) => record.status ,
    },
    {
      ...getDefaultColumnProps("registro", "Registro", {
        width: "20%",
      }),
      render: (_value, record) => moment(record.registro).format("DD/MM/YYYY-h:mmA"),
    },
    {
      ...getDefaultColumnProps("entrega", "Entrega", {
        width: "20%",
      }),
      render: (_value, record) =>moment(record.entrega).format("DD/MM/YYYY-h:mmA"),
    },
    {
      key: "Seleccionar",
      dataIndex: "seleccionar",
      title: "Seleccionar",
      align: "center",
      width: "10%",
      render: (_value, record) => (
        <>
          {record.estatus === 4 && (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
              disabled={!(activiti == "register")}
            >
            </Checkbox>
          )}
          {record.estatus === 5 && (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
              disabled={!(activiti == "cancel")}
            >
            </Checkbox>
          )}
          
         {(record.estatus === 4 || record.estatus === 5) && ( <EyeOutlined
                style={{marginLeft:"20%"}}
          key="imprimir"
          onClick={() => {
            const sendFiles = {
              mediosEnvio: ["selectSendMethods"],
              estudios: [{solicitudId:record.solicitudId,EstudiosId:[{EstudioId:record.id,  }]}],
            };
            console.log(sendFiles,"record");
            viewTicket(sendFiles);
          }}
        />)}
        </>
      ),
    },
  ];

  return {
    expandedRowRender: (item: Ivalidationlist, index: any) => (
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

export default ValidationStudyColumns;
