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
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ITrackingOrderList } from "../../../app/models/trackingOrder";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import SwitchInput from "../../../app/common/form/SwitchInput";
import TextInput from "../../../app/common/form/TextInput";

type TrackingOrderTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CreationTrackingOrderTable: FC<TrackingOrderTableProps> = ({
  componentRef,
  printing,
}) => {
  const { trackingOrderStore } = useStore();
  const { trackingOrder, getAll } = trackingOrderStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  // console.log("Table");

  // useEffect(() => {
  //   const readTrackingOrder = async () => {
  //     setLoading(true);
  //     await getAll(searchParams.get("search") ?? "all");
  //     setLoading(false);
  //   };

  //   readTrackingOrder();
  // }, [getAll, searchParams]);
  // useEffect(() => {});

  const columns: IColumns<ITrackingOrderList> = [
    {
      ...getDefaultColumnProps("clave", "Clave Estudio", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      align: "center",
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("clave", "Solicitud", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      align: "center",

      render: (value, user) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/tracking-order/${
                user.id
              }?${searchParams}&mode=readonly&search=${
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
      key: "paciente",
      dataIndex: "activo",
      title: "Paciente",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "escaneado",
      dataIndex: "id",
      title: "Escaneado",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <SwitchInput
          name="activo"
          // onChange={(value) => {
          //   if (value) {
          //     alerts.info(messages.confirmations.enable);
          //   } else {
          //     alerts.info(messages.confirmations.disable);
          //   }
          // }}
          readonly={false}
        />
      ),
    },
    {
      key: "temperatura",
      dataIndex: "id",
      title: "Temperatura",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => (
        <TextInput
          formProps={{
            name: "clave",
          }}
          max={100}
          required
          readonly={false}
        />
      ),
    },
  ];

  const TrackingOrderTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle title="Orden de Seguimiento" image="ctrackingOrder" />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<ITrackingOrderList>
          size="large"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 8)}
          pagination={false}
          dataSource={[...trackingOrder]}
        />
      </div>
    );
  };

  return (
    <Fragment>
      <Table<ITrackingOrderList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...trackingOrder]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<TrackingOrderTablePrint />}</div>
    </Fragment>
  );
};

export default observer(CreationTrackingOrderTable);
