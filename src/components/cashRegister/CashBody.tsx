import { FC, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, PageHeader, Row, Spin } from "antd";
import CashFilter from "./CashFilter";
import CashTable from "./CashTable";
import { ICashRegisterData } from "../../app/models/cashRegister";
import { useStore } from "../../app/stores/store";
import InvoiceTable from "./InvoiceTable";
import HeaderTitle from "../../app/common/header/HeaderTitle";

type CashDefaultProps = {
  printing: boolean;
};

const CashBody: FC<CashDefaultProps> = ({ printing }) => {
  const [loading, setLoading] = useState(false);
  const { cashRegisterStore } = useStore();
  const { cashRegisterData } = cashRegisterStore;

  return (
    <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
      <Col span={24}>
        <CashFilter />
      </Col>
      <Col span={24}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="PACIENTES DEL DÍA" />}
          className="header-container"
        />
      </Col>
      <Col span={24}>
        <CashTable data={cashRegisterData.perDay} loading={loading} />
      </Col>
      <Col span={24}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="CANCELACIONES DEL DÍA" />}
          className="header-container"
        />
      </Col>
      <Col span={24}>
        <CashTable data={cashRegisterData.canceled} loading={loading} />
      </Col>
      <Col span={24}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="PAGOS DE OTROS DÍAS" />}
          className="header-container"
        />
      </Col>
      <Col span={24}>
        <CashTable data={cashRegisterData.otherDay} loading={loading} />
      </Col>
      <Col span={24}>
        <InvoiceTable data={cashRegisterData.cashTotal} loading={loading} />
      </Col>
    </Spin>
  );
};

export default observer(CashBody);
