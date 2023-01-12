import { Space, Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import { IModalInvoice, IServicesCost } from "../../../app/models/indicators";
import {
  CostosFijosColumns,
  CostosFijosInvoice,
} from "../columnDefinition/costofijo";

type CostosFijosProps = {
  data: IServicesCost[];
  costoFijo: number;
  loading: boolean;
};

let totalDiario = 0;
let totalSemanal = 0;
let totalMensual = 0;

const CostosFijos = ({ data, costoFijo, loading }: CostosFijosProps) => {
  {
    data.forEach((item) => {
      totalDiario += item.costoFijo;
    });
  }

  totalSemanal = totalDiario * 6;
  totalMensual = totalDiario * 24;

  const invoiceData: IModalInvoice[] = [
    {
      key: uuid(),
      totalDiario: totalDiario,
      totalSemanal: totalSemanal,
      totalMensual: totalMensual,
    },
  ];

  return (
    <Space direction="vertical" size="small">
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <Tag color="blue" className="table-tag">
          Costo Fijo actual: {costoFijo}
        </Tag>
      </div>
      <Table<IServicesCost>
        loading={loading}
        size="small"
        rowKey={(record) => record.id!}
        columns={CostosFijosColumns()}
        pagination={false}
        dataSource={[...data]}
        scroll={{ y: 500 }}
        bordered
        rowClassName={"row-search"}
      />
      <Table<IModalInvoice>
        loading={loading}
        size="small"
        rowKey={uuid()}
        columns={CostosFijosInvoice()}
        pagination={false}
        dataSource={invoiceData}
        scroll={{ y: 500 }}
        bordered
        rowClassName={"row-search"}
      />
    </Space>
  );
};

export default observer(CostosFijos);
