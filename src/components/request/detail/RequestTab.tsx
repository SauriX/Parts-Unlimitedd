import { Button, Col, Form, Row, Space, Spin, Tabs } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  IRequestGeneral,
  IRequestStudyUpdate,
} from "../../../app/models/request";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import RequestGeneral from "./content/RequestGeneral";
import RequestImage from "./content/RequestImage";
import RequestIndication from "./content/RequestIndication";
import RequestPrint from "./content/RequestPrint";
import RequestRegister from "./content/RequestRegister";
import RequestRequest from "./content/RequestRequest";
import RequestSampler from "./content/RequestSampler";
import RequestStudy from "./content/RequestStudy";
import RequestInvoice from "./RequestInvoice";
import { onSubmitGeneral, submitGeneral } from "./utils";

const { TabPane } = Tabs;

type RequestTabProps = {
  recordId: string;
  branchId: string | undefined;
};

type keys =
  | "general"
  | "studies"
  | "indications"
  | "register"
  | "request"
  | "print"
  | "sampler"
  | "images";

const RequestTab = ({ recordId, branchId }: RequestTabProps) => {
  const { requestStore, procedingStore, loyaltyStore } = useStore();
  const {
    request,
    studyUpdate,
    getStudies,
    updateGeneral,
    updateStudies,
    cancelRequest,
    studyFilter,
    totals,
    totalsOriginal,
    setOriginalTotal,
  } = requestStore;
  const { activateWallet, getById } = procedingStore;
  const { getActive, loyaltys, getByDate } = loyaltyStore;

  const [formGeneral] = Form.useForm<IRequestGeneral>();

  const [loading, setLoading] = useState(false);
  const [currentKey, setCurrentKey] = useState<keys>("general");

  const onChangeTab = async (key: string) => {
    const ok = await submit();

    if (ok) {
      setCurrentKey(key as keys);
    }
  };

  useEffect(() => {
    getActive();
  }, [getActive]);

  const modificarSaldo = async () => {
    const loyal = await getByDate(moment().toDate());
    const contieneMedico = loyal?.precioLista.some((l) => l === "Medicos");
    const expediente = await getById(request?.expedienteId!);

    if (expediente?.hasWallet && !studyFilter.compañiaId && contieneMedico) {
      if (loyal?.tipoDescuento === "Porcentaje") {
        const bonoActual = (loyal?.cantidadDescuento! * totals.total) / 100;
        const bonoAnterior =
          (loyal?.cantidadDescuento! * totalsOriginal.total) / 100;

        let bonoFinal: number;
        bonoFinal =
          expediente.wallet > 0
            ? expediente.wallet - bonoAnterior + bonoActual
            : expediente.wallet + bonoActual;

        setOriginalTotal(totals);

        await activateWallet(request?.expedienteId!, bonoFinal);
      } else {
        await activateWallet(
          request?.expedienteId!,
          expediente.wallet - loyal?.cantidadDescuento!
        );
      }
    }
  };

  const submit = async () => {
    let ok = true;

    setLoading(true);
    if (currentKey === "general") {
      ok = await submitGeneral(formGeneral);
    } else if (
      currentKey === "studies" ||
      currentKey === "request" ||
      currentKey === "sampler"
    ) {
      ok = await updateStudies(studyUpdate);
      await modificarSaldo();
    }
    setLoading(false);

    return ok;
  };

  const cancel = () => {
    alerts.confirm(
      "Cancelar solicitud",
      `¿Desea cancelar la solicitud?, esta acción no se puede deshacer`,
      async () => {
        if (request) {
          setLoading(true);
          await cancelRequest(request.expedienteId, request.solicitudId!);
          await modificarSaldo();
          setLoading(false);
        }
      }
    );
  };

  useEffect(() => {
    if (request) {
      setLoading(true);
      getStudies(request.expedienteId, request.solicitudId!).finally(() =>
        setLoading(false)
      );
    }
  }, [getStudies, request]);

  const operations = (
    <Space>
      <Button key="cancel" size="small" ghost danger onClick={cancel}>
        Cancelar
      </Button>
      <Button key="save" size="small" type="primary" onClick={submit}>
        Guardar
      </Button>
    </Space>
  );

  const tabRender = (tabName: string) => {
    let component = (
      <RequestGeneral
        branchId={branchId}
        form={formGeneral}
        onSubmit={(request) => {
          onSubmitGeneral(request, updateGeneral).then((ok) => {
            if (!ok) setCurrentKey("general");
          });
        }}
      />
    );

    if (tabName === "studies") {
      component = <RequestStudy />;
    } else if (tabName === "indications") {
      component = <RequestIndication />;
    } else if (tabName === "register") {
      component = <RequestRegister recordId={recordId} />;
    } else if (tabName === "request") {
      component = <RequestRequest formGeneral={formGeneral} />;
    } else if (tabName === "print") {
      component = <RequestPrint />;
    } else if (tabName === "sampler") {
      component = <RequestSampler formGeneral={formGeneral} />;
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
    <Spin spinning={loading}>
      <Tabs
        activeKey={currentKey}
        tabBarExtraContent={operations}
        onChange={onChangeTab}
      >
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
    </Spin>
  );
};

export default observer(RequestTab);
