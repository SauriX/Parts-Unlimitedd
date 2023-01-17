import { Space, Tag, Table, Col, Row } from "antd";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import { ISamplesCost } from "../../../app/models/indicators";
import CostoTomaColumns from "../columnDefinition/costotoma";

type CostosTomaProps = {
  samples: ISamplesCost[];
  loading: boolean;
};

const CostosToma = ({ samples, loading }: CostosTomaProps) => {
  return (
    <Row gutter={[0, 24]}>
      <Col span={24}>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <Tag color="blue" className="table-tag">
            Costo Toma actual: {samples[0].costoToma}
          </Tag>
        </div>
      </Col>
      <Col span={24}>
        <Table<ISamplesCost>
          loading={loading}
          size="small"
          rowKey={(record) => uuid()}
          columns={CostoTomaColumns()}
          pagination={false}
          dataSource={[...samples]}
          scroll={{ y: 500 }}
          bordered
          rowClassName={"row-search"}
        />
      </Col>
    </Row>
  );
};

export default observer(CostosToma);
