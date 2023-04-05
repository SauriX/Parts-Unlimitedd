import { FC, Fragment, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Divider, Row, Spin } from "antd";
import CashFilter from "./CashFilter";
import CashTable from "./CashTable";
import { useStore } from "../../app/stores/store";
import InvoiceTable from "./InvoiceTable";
import ReportChartSelector from "../report/ReportChartSelector";

type CashDefaultProps = {
  printing: boolean;
};

const CashBody: FC<CashDefaultProps> = ({ printing }) => {
  const [loading, setLoading] = useState(false);
  const { cashRegisterStore } = useStore();
  const { cashRegisterData, showChart } = cashRegisterStore;
  const currentReport = "corte_caja";

  return (
    <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
      <Row gutter={[12, 4]}>
        <Col span={24}>
          <CashFilter />
        </Col>
        {!showChart ? (
          <Fragment>
            <Col span={24}>
              <Divider>PACIENTES DEL DÍA</Divider>
              <CashTable data={cashRegisterData.perDay} loading={loading} />
            </Col>
            <Col span={24}>
              <Divider>CANCELACIONES DEL DÍA</Divider>
              <CashTable data={cashRegisterData.canceled} loading={loading} />
            </Col>
            <Col span={24}>
              <Divider>PAGOS DE OTROS DÍAS</Divider>
              <CashTable data={cashRegisterData.otherDay} loading={loading} />
            </Col>
            <Col span={24}>
              <Divider>TOTALES</Divider>
              <InvoiceTable
                data={cashRegisterData.cashTotal}
                loading={loading}
              />
            </Col>
          </Fragment>
        ) : (
          <ReportChartSelector report={currentReport} data={cashRegisterData.perDay} />
        )}
      </Row>
    </Spin>
  );
};

export default observer(CashBody);
