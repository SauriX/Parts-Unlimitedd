import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate } from "react-router-dom";
import { IMedicsList } from "../../app/models/medics";
import { useStore } from "../../app/stores/store";

const MedicsTable = () => {
  const { medicsStore } = useStore();
  const { medics, getAll } = medicsStore;

  let navigate = useNavigate();
  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

  useEffect(() => {
    const readMedics = async () => {
      setLoading(true);
      await getAll();
      setLoading(false);
    };

    readMedics();
  }, [getAll]);

  const columns: IColumns<IMedicsList> = [
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
            navigate(`/medics/${user.id}`);
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
      ...getDefaultColumnProps("idMedico", "correo","telefono","celular", "observaciones", "especialidad" {
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
    <Table<IMedicsList>
      loading={loading}
      size="small"
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={[...medics]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
    />
  );
};

export default MedicsTable;