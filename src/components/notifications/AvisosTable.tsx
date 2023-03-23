import { Button, Switch, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconButton from "../../app/common/button/IconButton";
import { EditOutlined } from "@ant-design/icons";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { useStore } from "../../app/stores/store";
import { INotificationsList } from "../../app/models/notifications";
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
  const { notificationsStore } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAllAvisos, avisos, updateStatus, changeStatusAvisos } = notificationsStore;
  useEffect(() => {
    const readAvisos = async () => {
      await getAllAvisos(searchParams.get("search") || "all");
    }
    readAvisos();
  }, [getAllAvisos, searchParams]);


  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const onchangeStatus = async (id: string) => {
    changeStatusAvisos(id);
    await updateStatus(id);
  }

  const columns: IColumns<INotificationsList> = [
    
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 60,
      }),
      render: (value, item) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/notifications/${item.id}?mode=readonly`);
          }}
        >
          {value}
        </Button>
      ),
      fixed: "left",
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha de creación", {
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
      render: (value, item) => (
        <IconButton
          title="Editar notificación"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/notifications/${item.id}`);
          }}
        />
      ),
    },
    {
      ...getDefaultColumnProps("activo", "Activo", {
        searchState,
        setSearchState,
        width: 180,
      }),
      render: (value, item) => (
        <Switch checked={value} onChange={async () => { onchangeStatus(item.id) }} />
      ),
    },
  ];

  return (
    <>
      <Table size="small" columns={columns} dataSource={avisos} />
    </>
  );
};
export default observer(AvisosTable);
