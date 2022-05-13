import { Button, Divider, PageHeader, Spin, Table } from "antd";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
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
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import views from "../../app/util/view";
import { IPacketList } from "../../app/models/packet";

type ReagentTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const PackTable: FC<ReagentTableProps> = ({ componentRef, printing }) => {
  const { packStore } = useStore();
  const { getAll,packs } = packStore;
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
    const readReagents = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

     
      readReagents();
     
  }, [getAll, searchParams]);

  const columns: IColumns<IPacketList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, reagent) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.pack}/${reagent.id}?${searchParams}&mode=ReadOnly`);
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
        width: "30%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombreLargo", "Nombre largo", {
        searchState,
        setSearchState,
        width: "30%",
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
          title="Editar reactivo"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.pack}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const ReagentTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Paquetes" image="paquete" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IPacketList>
          size="small"
          rowKey={(record) => record.clave}
          columns={columns.slice(0, 4)}
          pagination={false}
          dataSource={packs}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IPacketList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.clave}
        columns={columns}
        dataSource={packs}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<ReagentTablePrint />}</div>
    </Fragment>
  );
};

export default observer(PackTable);
