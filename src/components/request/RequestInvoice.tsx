import { Descriptions, Radio, Typography } from "antd";
import React from "react";

const { Text } = Typography;

const RequestInvoice = () => {
  return (
    <Descriptions
      labelStyle={{ width: "60%" }}
      className="request-description"
      bordered
      column={1}
      size="small"
    >
      <Descriptions.Item label="Cancelar">Modificar</Descriptions.Item>
      <Descriptions.Item label="Estudio">$ 1,540.00</Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Desc</Text>
            <Radio.Group className="request-radio">
              <Radio value={1}>%</Radio>
              <Radio value={2}>$</Radio>
            </Radio.Group>
          </div>
        }
      >
        $ 910.00
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Cargo</Text>
            <Radio.Group className="request-radio">
              <Radio value={1}>%</Radio>
              <Radio value={2}>$</Radio>
            </Radio.Group>
          </div>
        }
      >
        {}
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text>Copago</Text>
            <Radio.Group className="request-radio">
              <Radio value={1}>%</Radio>
              <Radio value={2}>$</Radio>
            </Radio.Group>
          </div>
        }
      >
        {}
      </Descriptions.Item>
      <Descriptions.Item label="Total">$ 630.00</Descriptions.Item>
      <Descriptions.Item label="Saldo">$ 0.00</Descriptions.Item>
    </Descriptions>
  );
};

export default RequestInvoice;
