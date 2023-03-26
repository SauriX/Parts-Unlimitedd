import { Button, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import { IParameterList } from "../../app/models/parameter";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

const ParameterTable = () => {
  const { parameterStore } = useStore();
  const { getAll, parameters } = parameterStore;
  const { width: windowWidth } = useWindowDimensions();
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readUsers = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readUsers();
  }, [getAll, searchParams]);
  const columns: IColumns<IParameterList> = [
    //clave
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
      render: (value, parameter) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/parameters/${parameter.id}?mode=ReadOnly&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    //nombre
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("tipo", "Tipo", {
        searchState,
        setSearchState,
        width: "15%",
        windowSize: windowWidth,
      }),
    },
    //nombre corto
    {
      ...getDefaultColumnProps("nombreCorto", "Nombre corto", {
        searchState,
        setSearchState,
        width: "15%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "requerido",
      dataIndex: "requerido",
      title: "Requerido",
      align: "center",
      width: "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    //editar
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: "10%",
      render: (value, parameter) => (
        <IconButton
          title="Editar parámetro"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/parameters/${parameter.id}?search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <Table<IParameterList>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...parameters]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
    </Fragment>
  );
};

export default observer(ParameterTable);
