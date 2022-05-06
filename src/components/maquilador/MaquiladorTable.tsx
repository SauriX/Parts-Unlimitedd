import { Button, Divider, PageHeader, Spin, Table, List, Typography, } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState, } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IMaquiladorList } from "../../app/models/maquilador";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import Search from "antd/es/transfer/search";

type MaquiladorTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};


const MaquiladorTable: FC<MaquiladorTableProps> = ({ componentRef, printing }) => {
  const { maquiladorStore } = useStore();
  const { maquilador, getAll } = maquiladorStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

  useEffect(() => {
    const readMaquilador = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readMaquilador();
  }, [getAll, searchParams]);


  const columns: IColumns<IMaquiladorList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, maquilador) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/maquilador/${maquilador.id}?${searchParams}&mode=readonly&search=${searchParams.get("search") ?? "all"}`);
          
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
      ...getDefaultColumnProps("direccion", "Dirección", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("telefono", "Teléfono", {
        searchState,
        setSearchState,
        width: "8%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "14%",
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
      width: windowWidth < resizeWidth ? 100 : "6%",
      render: (value) => (
        <IconButton
          title="Editar Maquilador"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/maquilador/${value}?${searchParams}&mode=edit&search=${searchParams.get("search") ?? "all"}`);
          }}
          
        />
      ),
    },
  ];

  const MaquiladorTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Maquilador" image="maquilador" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IMaquiladorList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 6)}
          pagination={false}
          dataSource={[...maquilador]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IMaquiladorList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...maquilador]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<MaquiladorTablePrint />}</div>
    </Fragment>
  );
};

export default observer(MaquiladorTable);