import { Button, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const users: IUserInfo[] = [
  {
    id: 1,
    clave: "MFarias",
    nombre: "Miguel Farias",
    tipoUsuario: "Admin",
    activo: true,
  },
];

const UserTable = () => {
  let navigate = useNavigate();
  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

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
  );
};

export default UserTable;
