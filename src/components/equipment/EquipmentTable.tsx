import {
  Button,
  Divider,
  PageHeader,
  Spin,
  Table,
  List,
  Typography,
} from "antd";
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
import { IEquipmentList } from "../../app/models/equipment";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../app/common/header/HeaderTitle";

type EquipmentTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const EquipmentTable: FC<EquipmentTableProps> = ({
  componentRef,
  printing,
}) => {
  const { equipmentStore } = useStore();
  const { equipment, getAll } = equipmentStore;

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
    const readEquipment = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    readEquipment();
  }, [getAll, searchParams]);
  useEffect(() => {});

  const columns: IColumns<IEquipmentList> = [
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
            navigate(
              `/equipment/${user.id}?${searchParams}&mode=readonly&search=${
                searchParams.get("search") ?? "all"
              }`
            );
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
      key: "num_serie",
      dataIndex: "id",
      title: "No. Serie/Mantenimientos",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "20%",
      render: (value, user) => (
        <Button
          type="link"
          onClick={() => {
            navigate("#");
          }}
        >
          {value}
        </Button>
      ),
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
          title="Editar equipo"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/equipment/${value}?${searchParams}&mode=edit&search=${
                searchParams.get("search") ?? "all"
              }`
            );
          }}
        />
      ),
    },
  ];

  const EquipmentTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Equipos" image="Equipos" />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IEquipmentList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 8)}
          pagination={false}
          dataSource={[...equipment]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IEquipmentList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...equipment]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<EquipmentTablePrint />}</div>
    </Fragment>
  );
};

export default observer(EquipmentTable);
