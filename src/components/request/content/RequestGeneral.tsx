import { Form, Row, Col, Checkbox, Input, Button } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IRequestGeneral, IRequestStudy } from "../../../app/models/request";
import { IFormError } from "../../../app/models/shared";
import { originOptions, urgencyOptions } from "../../../app/stores/optionStore";
import { useStore } from "../../../app/stores/store";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

const compañia = 1;
const particular = 2;

const sendOptions = [
  { label: "Mandar via correo electronico", value: "correo" },
  { label: "Mandar via Whatsapp", value: "whatsapp" },
  { label: "Ambos", value: "ambos" },
];

type RequestGeneralProps = {
  branchId: string | undefined;
  form: FormInstance<IRequestGeneral>;
  onSubmit: (general: IRequestGeneral) => void;
};

const RequestGeneral = ({ branchId, form, onSubmit }: RequestGeneralProps) => {
  const { optionStore, requestStore } = useStore();
  const {
    companyOptions: CompanyOptions,
    medicOptions: MedicOptions,
    getCompanyOptions,
    getMedicOptions,
  } = optionStore;
  const { request, setStudyFilter, getGeneral } = requestStore;

  const origin = Form.useWatch("procedencia", form);
  const sendings = Form.useWatch("metodoEnvio", form);
  const doctorId = Form.useWatch("medicoId", form);
  const companyId = Form.useWatch("compañiaId", form);

  const [errors, setErrors] = useState<IFormError[]>([]);
  const [previousSendings, setPreviousSendings] = useState<string[]>([]);
  const [requestGeneral, setRequestGeneral] = useState<IRequestGeneral>();

  useEffect(() => {
    getCompanyOptions();
    getMedicOptions();
  }, [getCompanyOptions, getMedicOptions]);

  useEffect(() => {
    setStudyFilter(branchId, doctorId, companyId);
  }, [branchId, companyId, doctorId, setStudyFilter]);

  useEffect(() => {
    if (origin === particular) {
      form.setFieldsValue({
        compañiaId: undefined,
      });
    }
  }, [form, origin]);

  useEffect(() => {
    const getRequestGeneral = async () => {
      const requestGeneral = await getGeneral(request!.expedienteId, request!.solicitudId!);
      if (requestGeneral) {
        setRequestGeneral(requestGeneral);
        form.setFieldsValue(requestGeneral);
      }
    };

    if (request && request.solicitudId && request.expedienteId) {
      getRequestGeneral();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const onValuesChange = (changedValues: any) => {
    const path = Object.keys(changedValues)[0];

    if (path === "metodoEnvio") {
      const sendings: string[] = changedValues[path];
      let metodoEnvio: string[] = [];

      if (previousSendings.includes("ambos") && !sendings.includes("ambos")) {
        metodoEnvio = [];
        form.setFieldsValue({ correo: undefined, whatsapp: undefined });
      } else if (!previousSendings.includes("ambos") && sendings.includes("ambos")) {
        metodoEnvio = ["correo", "whatsapp", "ambos"];
      } else if (sendings.length === 2 && !sendings.includes("ambos")) {
        metodoEnvio = ["correo", "whatsapp", "ambos"];
      } else {
        metodoEnvio = sendings.filter((x) => x !== "ambos");
      }

      if (!sendings.includes("correo")) {
        form.setFieldsValue({ correo: undefined });
      }
      if (!sendings.includes("whatsapp")) {
        form.setFieldsValue({ whatsapp: undefined });
      }

      form.setFieldsValue({ metodoEnvio });
      setPreviousSendings(metodoEnvio);
    }
  };

  const onFinish = (values: IRequestGeneral) => {
    const request = { ...requestGeneral, ...values };

    onSubmit(request);
  };

  return (
    <Form<IRequestGeneral>
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      onFinishFailed={({ errorFields }) => {
        const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
        setErrors(errors);
      }}
      initialValues={{ metodoEnvio: [] }}
      onValuesChange={onValuesChange}
      size="small"
    >
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "procedencia",
              label: "Procedencia",
            }}
            options={originOptions}
            errors={errors.find((x) => x.name === "procedencia")?.errors}
            required
          />
        </Col>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "compañiaId",
              label: "Compañía",
            }}
            options={CompanyOptions}
            readonly={origin !== compañia}
            required={origin === compañia}
          />
        </Col>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "medicoId",
              label: "Médico",
            }}
            options={MedicOptions}
          />
        </Col>
        <Col span={24}>
          <TextInput
            formProps={{
              name: "afiliacion",
              label: "Afiliación",
            }}
            max={100}
          />
        </Col>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "urgencia",
              label: "Urgencia",
            }}
            options={urgencyOptions}
            required
            errors={errors.find((x) => x.name === "urgencia")?.errors}
          />
        </Col>
        <Col span={24} style={{ textAlign: "start" }}>
          <Form.Item noStyle name="metodoEnvio" labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Checkbox.Group options={sendOptions} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="E-Mail"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className="no-error-text"
            help=""
            required={sendings?.includes("correo")}
          >
            <Input.Group>
              <TextInput
                formProps={{
                  name: "correo",
                  label: "E-Mail",
                  noStyle: true,
                }}
                width="50%"
                max={100}
                type="email"
                readonly={!sendings?.includes("correo")}
                required={sendings?.includes("correo")}
                errors={errors.find((x) => x.name === "correo")?.errors}
              />
              <Button type="primary" disabled={!sendings?.includes("correo")}>
                Prueba
              </Button>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Whatsapp"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            className="no-error-text"
            help=""
            required={sendings?.includes("whatsapp")}
          >
            <Input.Group>
              <TextInput
                formProps={{
                  name: "whatsapp",
                  label: "Whatsapp",
                  noStyle: true,
                }}
                width="50%"
                max={100}
                readonly={!sendings?.includes("whatsapp")}
                required={sendings?.includes("whatsapp")}
                errors={errors.find((x) => x.name === "whatsapp")?.errors}
              />
              <Button type="primary" disabled={!sendings?.includes("whatsapp")}>
                Prueba
              </Button>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={24}>
          <TextAreaInput
            formProps={{
              name: "observaciones",
              label: "Observaciones",
              labelCol: { span: 24 },
              wrapperCol: { span: 24 },
            }}
            rows={3}
            errors={errors.find((x) => x.name === "observaciones")?.errors}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default observer(RequestGeneral);
