import {
  Button,
  Divider,
  PageHeader,
  Spin,
  Table,
  List,
  Typography,
  Input,
  Switch,
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
import {
  IEstudiosList,
  ITrackingOrderList,
} from "../../../app/models/trackingOrder";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useReactToPrint } from "react-to-print";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import SwitchInput from "../../../app/common/form/SwitchInput";
import TextInput from "../../../app/common/form/TextInput";
import { toJS } from "mobx";
import { uniqueId } from "lodash";

type TrackingOrderTableProps = {
  // componentRef: React.MutableRefObject<any>;
  id: string;
  printing: boolean;
};

const CreationTrackingOrderTable: FC<TrackingOrderTableProps> = ({
  // componentRef,
  id,
  printing,
}) => {
  const { trackingOrderStore } = useStore();
  const { trackingOrderStudies, trackingOrder, setEscaneado, setTemperature } =
    trackingOrderStore;

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
  //   console.log("estudios", toJS(trackingOrder));
  // }, [trackingOrder]);

  const columns: IColumns<IEstudiosList> = [
    {
      ...getDefaultColumnProps("estudios", "Clave Estudio", {
        searchState,
        setSearchState,
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      align: "center",
      render: (text, record) => {
        return text.map((x: any) => x.clave).join(", ");
      },
    },
    {
      ...getDefaultColumnProps("estudios", "Estudio", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (text, record) => {
        return text.map((x: any) => x.estudio).join(", ");
      },
    },
    {
      ...getDefaultColumnProps("estudios", "Solicitud", {
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
              `/request/${
                value.map((x: any) => x.solicitud)[0] //TODO: chage form solicitud id and url solicitud
                // user.id
              }`
            );
          }}
        >
          {value.map((x: any) => x.solicitud)[0]}
        </Button>
      ),
    },

    {
      key: "nombrePaciente",
      dataIndex: "estudios",
      title: "Paciente",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value) => {
        value.map((x: any) => {
          return x.nombrePaciente;
        })[0];
      },
    },
    {
      key: "escaneado",
      dataIndex: "escaneado",
      title: "Escaneado",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value, fullrow) => (
        <Switch
          checked={value}
          onChange={(value) => {
            console.log("escaneado", value, fullrow);
            setEscaneado(value, fullrow.id!);

            //  else {
            //   alerts.info(messages.confirmations.disable);
            // }
          }}
        />
      ),
    },
    {
      key: "temperatura",
      dataIndex: "temperatura",
      title: "Temperatura",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value, fullrow) => (
        <Input
          max={100}
          required
          value={value}
          type={"number"}
          onChange={(newValue) => {
            setTemperature(+newValue.target.value, fullrow.id);
          }}
        />
      ),
    },
  ];

  const TrackingOrderTablePrint = () => {
    return (
      // <div ref={componentRef}>
      <>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle
              title="Orden de Seguimiento"
              image="ordenseguimiento"
            />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IEstudiosList>
          size="large"
          rowKey={(record) => record.id!}
          columns={columns}
          pagination={false}
          dataSource={[...trackingOrder]}
        />
      </>
      // </div>
    );
  };

  return (
    <Fragment>
      <Table<any>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[...trackingOrder]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      {/* <div style={{ display: "none" }}>{<TrackingOrderTablePrint />}</div> */}
    </Fragment>
  );
};

export default observer(CreationTrackingOrderTable);
