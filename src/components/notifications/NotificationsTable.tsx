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
    modulo: "Pruebas",
    descripcion: "Pruebas",
    activos: "Pruebas",
    titulo: "Pruebas",
  },
  {
    key: "2",
    fechaCreacion: "2021-05-05",
    clave: "2",
    editar: "Editar",
    modulo: "Pruebas",
    descripcion: "Pruebas",
    activos: "Pruebas",
    titulo: "Pruebas",
  },
  {
    key: "3",
    fechaCreacion: "2021-05-05",
    clave: "3",
    editar: "Editar",
    modulo: "Pruebas",
    descripcion: "Pruebas",
    activos: "Pruebas",
    titulo: "Pruebas",
  },
  {
    key: "4",
    fechaCreacion: "2021-05-05",
    clave: "4",
    editar: "Editar",
    modulo: "Pruebas",
    descripcion: "Pruebas",
    activos: "Pruebas",
    titulo: "Pruebas",
  },
  {
    key: "5",
    fechaCreacion: "2021-05-05",
    clave: "5",
    editar: "Editar",
    modulo: "Pruebas",
    descripcion: "Pruebas",
    activos: "Pruebas",
    titulo: "Pruebas",
  },
  {
    key: "6",
    fechaCreacion: "2021-05-05",
    clave: "6",
    editar: "Editar",
    modulo: "Pruebas",
    descripcion: "Pruebas",
    activos: "Pruebas",
    titulo: "Pruebas",
  },
];
const NotificationsTable = () => {
  const navigate = useNavigate();
  const { notificationsStore } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const { getAllNotifications,  updateStatus, changeStatusNotificacion } = notificationsStore;
  const[notifications,setNotifications]= useState<INotificationsList[]>([])
  useEffect(() => {
    const readAvisos = async () => {
      var notificaciones =await getAllNotifications(searchParams.get("search") || "all");
      setNotifications(notificaciones!);
    }
    readAvisos();
  }, [getAllNotifications, searchParams]);


  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const onchangeStatus = async (id: string) => {
    let notificationes = [...notifications!];
    var notificacion = notificationes.find(x=>x.id===id);
    notificacion!.activo = !notificacion!.activo;
    var notificacionIndex = notificationes.findIndex(x=>x.id===id);
    notificationes[notificacionIndex]=notificacion!;
    setNotifications(notificationes);
    await updateStatus(id);
  }

  const columns: IColumns<INotificationsList> = [
    {
      key: "titulo",
      dataIndex: "titulo",
      title: "Titulo",
      align: "center",
      width: 80,
    },
    {
      ...getDefaultColumnProps("contenido", "Contenido", {
        searchState,
        setSearchState,
        width: 200,
      }),
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
      <Table size="small" columns={columns} dataSource={[...notifications!]} />
    </>
  );
};
export default observer(NotificationsTable);
