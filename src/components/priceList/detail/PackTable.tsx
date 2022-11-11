import { Button, Col, Divider, PageHeader, Row, Table } from "antd";
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
import { IPriceListEstudioList, IPriceListList } from "../../../app/models/priceList";

type PriceListTableProps = {
    data:IPriceListEstudioList[];
    closeModal: () => void
    handle: () => Promise<void>;

};

const PackTable: FC<PriceListTableProps> = ({ data,closeModal,handle }) => {
  const { priceListStore } = useStore();
  const { priceLists, getAll } = priceListStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });





  const columns: IColumns<IPriceListEstudioList> = [
    {
        ...getDefaultColumnProps("clave", "Clave", {
          searchState,
          setSearchState,
          width: "30%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
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


  ];



  return (
    <Fragment>
      <Table<IPriceListEstudioList>
        loading={loading }
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...data]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
       <Row>
        <Col md={24} style={{ textAlign: "center" }}>
          <h1>¿Desea continuar con el alta?</h1>
        </Col>
        <Col md={8} style={{ textAlign: "center" }}></Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Button
            style={{ backgroundColor: "#002060", color: "white" }}
            onClick={() => {
              handle();
            }}
          >
            Aceptar
          </Button>
        </Col>
        <Col md={4} style={{ textAlign: "center" }}>
          <Button
            style={{ backgroundColor: "#9A0000", color: "white" }}
            onClick={() => {
              closeModal();
            }}
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export default observer(PackTable);
