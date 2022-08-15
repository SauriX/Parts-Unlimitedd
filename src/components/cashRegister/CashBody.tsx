import { FC, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Row, Spin } from "antd";
import CashFilter from "./CashFilter";
import CashTable from "./CashTable";

type CashDefaultProps = {
  printing: boolean;
};

const ReportBody: FC<CashDefaultProps> = ({ printing }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <CashFilter />
        </Col>
        <Col span={24}>
          <CashTable />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(ReportBody);
