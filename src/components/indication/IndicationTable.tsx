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
import { IIndicationList } from "../../app/models/indication";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import Search from "antd/es/transfer/search";
import Indications from "../../views/Indications";

type IndicationsTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const IndicationTable: FC<IndicationsTableProps> = ({ componentRef, printing }) => {
  const { indicationStore } = useStore();
  const { indication, getAll } = indicationStore;

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
    const readIndication = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readIndication();
  }, [getAll, searchParams]);

  const columns: IColumns<IIndicationList> = [
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
            navigate(`/indication/${user.id}?${searchParams}&mode=readonly&search=${searchParams.get("search") ?? "all"}`);
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
      ...getDefaultColumnProps("descripcion", "Descripcion", {
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
            navigate(`/indication/${value}?${searchParams}&mode=edit&search=${searchParams.get("search") ?? "all"}`);
          }}
        />
      ),
    },
  ];

  const IndicationsTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Indicaciones" image="doctor" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IIndicationList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 8)}
          pagination={false}
          dataSource={[...indication]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IIndicationList>
      loading={loading|| printing}
      size="small"
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={[...indication]}
      pagination={defaultPaginationProperties}
      sticky
      scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<IndicationsTablePrint />}</div>

    </Fragment>
    
  );
};

export default observer (IndicationTable);
