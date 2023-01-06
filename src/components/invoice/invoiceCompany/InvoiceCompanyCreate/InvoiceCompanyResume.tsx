import { Col, Descriptions, InputNumber, Radio, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { moneyFormatter } from "../../../../app/util/utils";

const { Text, Title } = Typography;

const InvoiceCompanyResume = () => {
  const [totalEstudios, setTotalEstudios] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  useEffect(() => {}, []);
  return (
    <>
      <Col span={24}>
        <Descriptions
          labelStyle={{ width: "60%" }}
          className="request-description"
          bordered
          column={1}
          size="small"
        >
          <Descriptions.Item label="Concepto">Total</Descriptions.Item>
          <Descriptions.Item label="Estudio" className="number-desc">
            {moneyFormatter.format(totalEstudios)}
          </Descriptions.Item>

          <Descriptions.Item label="Total" className="number-desc">
            {moneyFormatter.format(totalEstudios)}
          </Descriptions.Item>
          <Descriptions.Item label="Saldo" className="number-desc">
            {moneyFormatter.format(saldo)}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </>
  );
};

export default observer(InvoiceCompanyResume);
