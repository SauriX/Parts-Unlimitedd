import { Space, Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import { IModalInvoice, IReportIndicators } from "../../../app/models/indicators";
import { CostosFijosColumns, CostosFijosInvoice } from "../columnDefinition/costofijo";

type CostosFijosProps = {
  data: IReportIndicators[];
  invoiceData?: IModalInvoice;
  costoFijo: number;
  loading: boolean;
};

const CostosFijos = ({ data, invoiceData, costoFijo, loading }: CostosFijosProps) => {
  return (
    <Space direction="vertical" size="small">
      <div style={{textAlign: "right", marginTop: 10}}>
        <Tag color="blue" className="table-tag">
          Costo Fijo actual: {costoFijo}
        </Tag>
      </div>
      <Table<IReportIndicators>
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
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
        dataSource={[invoiceData!]}
        scroll={{ y: 500 }}
        bordered
        rowClassName={"row-search"}
      />
    </Space>
  );
};

export default observer(CostosFijos);
