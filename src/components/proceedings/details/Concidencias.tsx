import {
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  PageHeader,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
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
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import views from "../../../app/util/view";
import { IProceedingList } from "../../../app/models/Proceeding";

const { Title } = Typography;

type ProceedingTableProps = {
  printing: boolean;
  expedientes: IProceedingList[];
  handle: () => Promise<void>;
  handleclose: () => Promise<void>;
};
const Coincidencias: FC<ProceedingTableProps> = ({
  printing,
  expedientes,
  handle,
  handleclose,
}) => {
  const { priceListStore, modalStore } = useStore();
  const { priceLists, getAll } = priceListStore;
  const { closeModal } = modalStore;
  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });


  useEffect(() => {
    const readPriceList = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };

    if (priceLists.length === 0) {
      readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IProceedingList> = [
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, Proceeding) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.proceeding}/${Proceeding.id}?mode=readonly`);
            closeModal();
            handleclose();
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nombrePaciente", "Nombre del paciente", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },

    {
      ...getDefaultColumnProps("fechaNacimiento", "Fecha de nacimiento", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fechaAlta", "Fecha alta expediente", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];

  const PriceListTablePrint = () => {
    return (
      <div>
        <PageHeader
          ghost={false}
          title={
            <HeaderTitle title="Catálogo de Lista de Precios" image="precio" />
          }
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        {/*         <Table<IPriceListList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 3)}
          pagination={false}
          dataSource={[...priceLists]}
        /> */}
      </div>
    );
  };

  return (
    <Fragment>
      <Table<IProceedingList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={expedientes}
        pagination={false}
        // pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<PriceListTablePrint />}</div>
      <Row style={{ marginTop: 10 }}>
        <Col md={24} style={{ textAlign: "center" }}>
          <Title level={4}>¿Desea continuar con el alta?</Title>
        </Col>
        <Col md={8} style={{ textAlign: "center" }}></Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Button
            // style={{ backgroundColor: "#9A0000", color: "white" }}
            onClick={() => {
              closeModal();
            }}
          >
            Cancelar
          </Button>
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              handle();
            }}
          >
            Aceptar
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export default observer(Coincidencias);
