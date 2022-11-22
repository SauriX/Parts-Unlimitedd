import { Button, Col, Form, Row, Space, Spin, Tabs } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IQuotationGeneral } from "../../../app/models/quotation";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import QuotationAssignment from "./content/QuotationAssignment";
import QuotationGeneral from "./content/QuotationGeneral";
import QuotationIndication from "./content/QuotationIndication";
import QuotationStudy from "./content/QuotationStudy";
import QuotationInvoice from "./QuotationInvoice";
import { onSubmitGeneral, submitGeneral } from "./utils";

const { TabPane } = Tabs;

type QuotationTabProps = {
  branchId: string | undefined;
  recordId: string | undefined;
  setRecordId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

type keys = "general" | "studies" | "indications" | "assignment";

const QuotationTab = ({
  branchId,
  recordId,
  setRecordId,
}: QuotationTabProps) => {
  const { quotationStore } = useStore();
  const {
    quotation,
    studyUpdate,
    getStudies,
    updateGeneral,
    updateStudies,
    assignRecord,
    cancelQuotation,
  } = quotationStore;

  const [formGeneral] = Form.useForm<IQuotationGeneral>();

  const [currentKey, setCurrentKey] = useState<keys>("general");

  const onChangeTab = async (key: string) => {
    const ok = await submit();

    if (ok) {
      setCurrentKey(key as keys);
    }
  };

  const submit = async () => {
    let ok = true;

    if (currentKey === "general") {
      ok = await submitGeneral(formGeneral);
    } else if (currentKey === "studies") {
      ok = await updateStudies(studyUpdate);
    } else if (currentKey === "assignment") {
      console.log(recordId);
      ok = await assignRecord(quotation!.cotizacionId, recordId);
    }

    return ok;
  };

  const cancel = () => {
    alerts.confirm(
      "Cancelar cotización",
      `¿Desea cancelar la cotización?, esta acción no se puede deshacer`,
      async () => {
        if (quotation) {
          await cancelQuotation(quotation.cotizacionId);
        }
      }
    );
  };

  useEffect(() => {
    if (quotation) {
      setRecordId(quotation.expedienteId);
      getStudies(quotation.cotizacionId);
    }
  }, [getStudies, quotation, setRecordId]);

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
      <QuotationGeneral
        branchId={branchId}
        form={formGeneral}
        onSubmit={(quotation) => {
          onSubmitGeneral(quotation, updateGeneral).then((ok) => {
            if (!ok) setCurrentKey("general");
          });
        }}
      />
    );

    if (tabName === "studies") {
      component = <QuotationStudy />;
    } else if (tabName === "indications") {
      component = <QuotationIndication />;
    } else if (tabName === "assignment") {
      component = (
        <QuotationAssignment recordId={recordId} setRecordId={setRecordId} />
      );
    }

    return (
      <Row gutter={8}>
        <Col span={18}>{component}</Col>
        <Col span={6}>
          <QuotationInvoice />
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
      key: "assignment",
      label: "Expediente",
      children: tabRender("assignment"),
    },
  ];

  return (
    <Spin spinning={false}>
      <Tabs
        activeKey={currentKey}
        tabBarExtraContent={operations}
        onChange={onChangeTab}
        items={tabs}
      />
    </Spin>
  );
};

export default observer(QuotationTab);
