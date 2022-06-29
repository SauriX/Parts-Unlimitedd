import { Button, Col, Row, Space, Tabs } from "antd";
import { useState } from "react";
import { IRequestPrice } from "../../app/models/request";
import RequestGeneral from "./content/RequestGeneral";
import RequestImage from "./content/RequestImage";
import RequestIndication from "./content/RequestIndication";
import RequestPrint from "./content/RequestPrint";
import RequestRegister from "./content/RequestRegister";
import RequestRequest from "./content/RequestRequest";
import RequestSampler from "./content/RequestSampler";
import RequestStudy from "./content/RequestStudy";
import RequestInvoice from "./RequestInvoice";

const { TabPane } = Tabs;

const RequestTab = () => {
  const [data, setData] = useState<IRequestPrice[]>([]);

  const operations = (
    <Space>
      <Button key="cancel" size="small" ghost danger>
        Cancelar
      </Button>
      <Button key="save" size="small" type="primary">
        Guardar
      </Button>
    </Space>
  );

  const tabRender = (tabName: string) => {
    let component = <RequestGeneral />;

    if (tabName === "studies") {
      component = <RequestStudy data={data} setData={setData} />;
    } else if (tabName === "indications") {
      component = <RequestIndication data={data} />;
    } else if (tabName === "register") {
      component = <RequestRegister />;
    } else if (tabName === "request") {
      component = <RequestRequest />;
    } else if (tabName === "print") {
      component = <RequestPrint />;
    } else if (tabName === "sampler") {
      component = <RequestSampler />;
    } else if (tabName === "images") {
      component = <RequestImage />;
    }

    return (
      <Row gutter={8}>
        <Col span={18}>{component}</Col>
        <Col span={6}>
          <RequestInvoice />
        </Col>
      </Row>
    );
  };

  return (
    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
      <TabPane tab="Generales" key="general">
        {tabRender("general")}
      </TabPane>
      <TabPane tab="Estudios" key="studies">
        {tabRender("studies")}
      </TabPane>
      <TabPane tab="Indicaciones" key="indications">
        {tabRender("indications")}
      </TabPane>
      <TabPane tab="Caja" key="register">
        {tabRender("register")}
      </TabPane>
      <TabPane tab="Solicitar Estudio" key="request">
        {tabRender("request")}
      </TabPane>
      <TabPane tab="Imprimir" key="print">
        {tabRender("print")}
      </TabPane>
      <TabPane tab="Tomador de muestra" key="sampler">
        {tabRender("sampler")}
      </TabPane>
      <TabPane tab="Imágenes" key="images">
        {tabRender("images")}
      </TabPane>
    </Tabs>
  );
};

export default RequestTab;
