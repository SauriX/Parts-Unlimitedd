import { Button, Divider, PageHeader, Spin, Table } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { IUserInfo } from "../../app/models/user";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate,useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

/*const users: IUserInfo[] = [
  {
    id: "asd",
    clave: "MFarias",
    nombre: "Miguel Farias",
    tipoUsuario: "Admin",
    activo: true,
  },
];*/
type UserTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const UserTable:FC<UserTableProps> = ({ componentRef, printing }) => {
  const { userStore } = useStore();
  const { users, getAll } = userStore;
  let navigate = useNavigate();
  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");
    useEffect(() => {
      const readUsers = async () => {
        setLoading(true);
        await getAll(searchParams.get("search") ?? "all");
        setLoading(false);
      };

      readUsers();
    }, [getAll, searchParams]);
  const columns: IColumns<IUserInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, user) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/users/${user.id}`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("tipoUsuario", "Tipo de usuario", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "contraseña",
      dataIndex: "contraseña",
      title: "Contraseña",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: () => <IconButton title="Cambiar contraseña" icon={<LockOutlined />} />,
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <IconButton
          title="Editar usuario"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/users/${value}`);
          }}
        />
      ),
    },
  ];

  return (
    <div ref={componentRef}>
    <Table<IUserInfo>
      loading={loading}
      size="small"
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={[...users]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    />
    </div>
  );
};

export default UserTable;
