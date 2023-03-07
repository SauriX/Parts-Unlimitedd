import { Button, Switch, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../../app/common/button/IconButton";
import { EditOutlined } from "@ant-design/icons";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
const dummyData = [
  {
    key: "1",
    fechaCreacion: "2021-05-05",
    clave: "1",
    editar: "Editar",
    modulo: "Avisos",
    descripcion: "Avisos",
    activos: "Avisos",
    titulo: "Avisos",
  },
  {
    key: "2",
    fechaCreacion: "2021-05-05",
    clave: "2",
    editar: "Editar",
    modulo: "Avisos",
    descripcion: "Avisos",
    activos: "Avisos",
    titulo: "Avisos",
  },
  {
    key: "3",
    fechaCreacion: "2021-05-05",
    clave: "3",
    editar: "Editar",
    modulo: "Avisos",
    descripcion: "Avisos",
    activos: "Avisos",
    titulo: "Avisos",
  },
  {
    key: "4",
    fechaCreacion: "2021-05-05",
    clave: "4",
    editar: "Editar",
    modulo: "Avisos",
    descripcion: "Avisos",
    activos: "Avisos",
    titulo: "Avisos",
  },
  {
    key: "5",
    fechaCreacion: "2021-05-05",
    clave: "5",
    editar: "Editar",
    modulo: "Avisos",
    descripcion: "Avisos",
    activos: "Avisos",
    titulo: "Avisos",
  },
  {
    key: "6",
    fechaCreacion: "2021-05-05",
    clave: "6",
    editar: "Editar",
    modulo: "Avisos",
    descripcion: "Avisos",
    activos: "Avisos",
    titulo: "Avisos",
  },
];
const AvisosTable = () => {
  const navigate = useNavigate();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columns: IColumns<any> = [
    //cambiar tipo de dato
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 60,
      }),
      render: (value, role) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/notifications/${value}`);
          }}
        >
          {value}
        </Button>
      ),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("fechaCreacion", "Fecha de creación", {
        searchState,
        setSearchState,
        width: 80,
      }),
    },
    {
      key: "titulo",
      dataIndex: "titulo",
      title: "Titulo",
      align: "center",
      width: 220,
    },
    {
      ...getDefaultColumnProps("editar", "Editar", {
        searchState,
        setSearchState,
        width: 1,
      }),
      render: (value, role) => (
        <IconButton
          title="Editar notificación"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/#`);
          }}
        />
      ),
    },
  ];
  const columnsDetail: IColumns<any> = [
    {
      ...getDefaultColumnProps("modulo", "Módulo", {
        searchState,
        setSearchState,
        width: 120,
      }),
      render: (value, role) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/#`);
          }}
        >
          {value}
        </Button>
      ),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("descripcion", "Descripción", {
        searchState,
        setSearchState,
        width: 180,
      }),
    },
    {
      ...getDefaultColumnProps("activos", "Activos", {
        searchState,
        setSearchState,
        width: 180,
      }),
      render: (value, role) => (
        <Switch defaultChecked onChange={() => console.log("changed")} />
      ),
    },
  ];
  return (
    <>
      <Table size="small" columns={columns} dataSource={dummyData} />
      <Table size="small" columns={columnsDetail} dataSource={dummyData} />
    </>
  );
};
export default observer(AvisosTable);
