import { Badge, Button, Col, Descriptions, PageHeader, Radio, Row, Space, Tabs, Typography } from "antd";
import React from "react";
import "./index.less";

const { Text } = Typography;
const { TabPane } = Tabs;

const RequestTab = () => {
  return (
    <Tabs defaultActiveKey="1" centered>
      <TabPane tab="Generales" key="1">
        <PageHeader
          className="header-container"
          extra={[
            <Button key="save" size="small" type="primary">
              Guardar
            </Button>,
            <Button key="cancel" size="small" ghost danger>
              Cancelar
            </Button>,
          ]}
        />
        <Row gutter={8}>
          <Col span={18}>1</Col>
          <Col span={6}>
            <Descriptions
              labelStyle={{ width: "60%", padding: "8px" }}
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
          </Col>
        </Row>
      </TabPane>
      <TabPane tab="Estudios" key="2">
        Content of Tab Pane 2
      </TabPane>
      <TabPane tab="Indicaciones" key="3">
        Content of Tab Pane 3
      </TabPane>
      <TabPane tab="Cite dom." key="4">
        Content of Tab Pane 4
      </TabPane>
      <TabPane tab="Factura" key="5">
        Content of Tab Pane 5
      </TabPane>
      <TabPane tab="Solicitar Estudio" key="6">
        Content of Tab Pane 6
      </TabPane>
      <TabPane tab="Imprimir" key="7">
        Content of Tab Pane 7
      </TabPane>
      <TabPane tab="Tomador de muestra" key="8">
        Content of Tab Pane 8
      </TabPane>
      <TabPane tab="Imágenes" key="9">
        Content of Tab Pane 9
      </TabPane>
    </Tabs>
  );
};

export default RequestTab;
