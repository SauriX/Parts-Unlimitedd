import { Button, Col, Form, Row, Space, Tabs } from "antd";
import { useState } from "react";
import { IRequestGeneral, IRequestPrice } from "../../app/models/request";
import alerts from "../../app/util/alerts";
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

type RequestTabProps = {
  recordId: string;
  branchId: string | undefined;
};

const RequestTab = ({ recordId, branchId }: RequestTabProps) => {
  const [data, setData] = useState<IRequestPrice[]>([]);

  const [formGeneral] = Form.useForm<IRequestGeneral>();

  const onSubmitGeneral = (general: IRequestGeneral) => {
    console.log(general);
  };

  const submit = async () => {
    try {
      await formGeneral.validateFields();
      if (data.length === 0) {
        throw Error("Se debe agregar al menos un estudio");
      }
      formGeneral.submit();
    } catch (error: any) {
      if (error && error.hasOwnProperty("errorFields")) {
        alerts.warning("Por favor complete correctamente la información de la pestaña 'Generales'");
      }
      alerts.warning(error.message);
    }
  };

  const operations = (
    <Space>
      <Button key="cancel" size="small" ghost danger>
        Cancelar
      </Button>
      <Button key="save" size="small" type="primary" onClick={submit}>
        Guardar
      </Button>
    </Space>
  );

  const tabRender = (tabName: string) => {
    let component = <RequestGeneral form={formGeneral} onSubmit={onSubmitGeneral} />;

    if (tabName === "studies") {
      component = <RequestStudy data={data} setData={setData} />;
    } else if (tabName === "indications") {
      component = <RequestIndication data={data} />;
    } else if (tabName === "register") {
      component = <RequestRegister recordId={recordId} />;
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

  if (!branchId) {
    return <p>Por favor selecciona una sucursal.</p>;
  }

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
