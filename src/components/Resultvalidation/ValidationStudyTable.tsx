import { Descriptions, Checkbox, Table, Typography } from "antd";
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
import { useNavigate } from "react-router";
const { Link, Text } = Typography;

type expandableProps = {
  activiti: string;
  onChange: (e: CheckboxChangeEvent, id: number, solicitud: string) => void;
  viewTicket: (recordId: any) => Promise<void>;
  visto: number[],
  setvisto: React.Dispatch<React.SetStateAction<number[]>>
};

type tableProps = {
  printTicket: (recordId: string, requestId: string) => Promise<void>;
  
};

const ValidationStudyColumns = ({ printTicket }: tableProps) => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const navigate = useNavigate();
  const columns: IColumns<Ivalidationlist> = [
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
                `/clinicResultsDetails/${record?.order}/${record?.id}`
              );
/*               navigate(
                `/requests/${record.order}/${record.id}`
              ); */
            }}
          >
            {record.solicitud}
          </Link>
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
  viewTicket,
  visto,
  setvisto
}: expandableProps) => {
  const [ver, setver]=useState<boolean>(false);
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
          {(record.estatus === 4 && visto.includes(record.id) || (ver && visto.includes(record.id) && record.estatus === 4 )) && (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
              disabled={!(activiti == "register")}
            >
            </Checkbox>
          )}
          {record.estatus === 5 &&   (
            <Checkbox
              onChange={(e) => onChange(e, record.id, record.solicitudId)}
              disabled={!(activiti == "cancel")}
            >
            </Checkbox>
          )}
          
         {(record.estatus === 4 ) && ( <EyeOutlined
                style={{marginLeft:"20%"}}
          key="imprimir"
          onClick={ async () => {
            const sendFiles = {
              mediosEnvio: ["selectSendMethods"],
              estudios: [{solicitudId:record.solicitudId,EstudiosId:[{EstudioId:record.id,  }]}],
            };
            var vistos = visto;
             vistos.push(record.id)
            
           await  viewTicket(sendFiles);
            setvisto(vistos);
            setver(!ver)
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
