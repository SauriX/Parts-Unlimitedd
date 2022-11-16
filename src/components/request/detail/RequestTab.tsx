import { Button, Col, Form, Row, Space, Spin, Tabs } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { IRequestGeneral } from "../../../app/models/request";
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
    loadingTabContent,
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
  const { getActive, getByDate } = loyaltyStore;

  const [formGeneral] = Form.useForm<IRequestGeneral>();

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
    console.log("expediente", toJS(expediente));
    const fechaCreaccionSolicitud = moment(request?.registro);
    const fechaActivacionMonedero = moment(expediente?.fechaActivacionMonedero);
    console.log("#fechas", fechaActivacionMonedero, fechaCreaccionSolicitud);
    if (
      expediente?.hasWallet &&
      !studyFilter.compañiaId &&
      contieneMedico &&
      fechaCreaccionSolicitud.isSameOrAfter(fechaCreaccionSolicitud)
    ) {
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

    return ok;
  };

  const cancel = () => {
    alerts.confirm(
      "Cancelar solicitud",
      `¿Desea cancelar la solicitud?, esta acción no se puede deshacer`,
      async () => {
        if (request) {
          await cancelRequest(request.expedienteId, request.solicitudId!);
          await modificarSaldo();
        }
      }
    );
  };

  useEffect(() => {
    if (request) {
      getStudies(request.expedienteId, request.solicitudId!);
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
      component = <RequestRegister />;
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

  const tabs = [
    {
      key: "general",
      label: "Generales",
      children: tabRender("general"),
    },
    {
      key: "studies",
      label: "Estudios",
      children: tabRender("studies"),
    },
    {
      key: "indications",
      label: "Indicaciones",
      children: tabRender("indications"),
    },
    {
      key: "register",
      label: "Caja",
      children: tabRender("register"),
    },
    {
      key: "request",
      label: "Solicitar Estudio",
      children: tabRender("request"),
    },
    {
      key: "print",
      label: "Imprimir",
      children: tabRender("print"),
    },
    {
      key: "sampler",
      label: "Tomador de muestra",
      children: tabRender("sampler"),
    },
    {
      key: "images",
      label: "Imágenes",
      children: tabRender("images"),
    },
  ];

  return (
    <Spin spinning={loadingTabContent}>
      <Tabs
        activeKey={currentKey}
        tabBarExtraContent={operations}
        onChange={onChangeTab}
        items={tabs}
      />
    </Spin>
  );
};

export default observer(RequestTab);
