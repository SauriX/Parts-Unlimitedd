import { Button, Col, Row, Table } from "antd";
import { FC, Fragment, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { observer } from "mobx-react-lite";
import { IPriceListEstudioList } from "../../../app/models/priceList";

type PriceListTableProps = {
  data: IPriceListEstudioList[];
  closeModal: () => void;
  handle: () => Promise<void>;
};

const PackTable: FC<PriceListTableProps> = ({ data, closeModal, handle }) => {
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
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={[...data]}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <Row>
        <Col md={12} style={{ textAlign: "center" }}></Col>
        <Col md={7} style={{ textAlign: "center" }}>
        </Col>
        <Col md={5} style={{ textAlign: "center" }}>
        <Button
            style={{ backgroundColor: "#9A0000", color: "white" }}
            onClick={() => {
              closeModal();
            }}
          >
            Cancelar
          </Button>
          <Button
            style={{ backgroundColor: "#002060", color: "white" }}
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

export default observer(PackTable);
