import { Col, Row, Space, Table, Tag } from "antd";
import { dataTool } from "echarts";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  IModalInvoice,
  IServicesCost,
  IServicesInvoice,
} from "../../../app/models/indicators";
import { useStore } from "../../../app/stores/store";
import CostosFijosColumns, {
  CostosFijosInvoice,
} from "../columnDefinition/costofijo";

type CostosFijosProps = {
  data: IServicesInvoice;
  loading: boolean;
};

const CostosFijos = ({ data, loading }: CostosFijosProps) => {
  const convertToServiceInvoiceArray = (data: IServicesInvoice) => {
    let array: IServicesInvoice[] = [
      {
        totalMensual: data.totalMensual,
        totalSemanal: data.totalSemanal,
        totalDiario: data.totalDiario,
      },
    ];

    return array;
  };

  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Tag color="blue" className="table-tag">
            Costo Fijo actual: {data.totalMensual}
          </Tag>
        </div>
      </Col>
      <Col span={24}>
        <Table<IServicesCost>
          loading={loading}
          size="small"
          rowKey={uuid()}
          columns={CostosFijosColumns()}
          pagination={false}
          dataSource={[...data.servicios!]}
          scroll={{ y: 500 }}
          bordered
          rowClassName={"row-search"}
        />
      </Col>
      <Col span={24}>
        <Table<IServicesInvoice>
          loading={loading}
          size="small"
          rowKey={uuid()}
          columns={CostosFijosInvoice()}
          pagination={false}
          dataSource={convertToServiceInvoiceArray(data)}
          scroll={{ y: 500 }}
          bordered
          rowClassName={"row-search"}
        />
      </Col>
    </Row>
  );
};

export default observer(CostosFijos);
