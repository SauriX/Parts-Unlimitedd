import { Form, Row, Col, Checkbox, Input, Button } from "antd";
import { FormInstance } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import SelectTagInput from "../../../../app/common/form/proposal/SelectTagInput";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { IRequestGeneral } from "../../../../app/models/request";
import { IFormError, IOptions } from "../../../../app/models/shared";
import {
  originOptions,
  urgencyOptions,
} from "../../../../app/stores/optionStore";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { catalog } from "../../../../app/util/catalogs";
import { validateEmail } from "../../../../app/util/utils";
import RequestDeliveryHistory from "../RequestDeliveryHistory";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

const PARTICULAR = 2;

const sendOptions = [
  { label: "Mandar via correo electronico", value: "correo" },
  { label: "Mandar via Whatsapp", value: "whatsapp" },
  { label: "Ambos", value: "ambos" },
];

type RequestGeneralProps = {
  branchId: string | undefined;
  form: FormInstance<IRequestGeneral>;
  onSubmit: (general: IRequestGeneral, showLoader: boolean) => Promise<void>;
};

const RequestGeneral = ({ branchId, form, onSubmit }: RequestGeneralProps) => {
  const { optionStore, requestStore } = useStore();
  const {
    companyOptions: CompanyOptions,
    medicOptions: MedicOptions,
    getCompanyOptions,
    getMedicOptions,
  } = optionStore;
  const {
    request,
    clearStudies,
    hasStudies,
    setStudyFilter,
    getGeneral,
    sendTestEmail,
    sendTestWhatsapp,
  } = requestStore;

  const sendings = Form.useWatch("metodoEnvio", form);
  const doctorId = Form.useWatch("medicoId", form);
  const companyId = Form.useWatch("compañiaId", form);

  const emails = Form.useWatch("correos", form);
  const whatsapps = Form.useWatch("whatsapps", form);
  const sendToMedic = Form.useWatch("envioMedico", form);

  const [errors, setErrors] = useState<IFormError[]>([]);
  const [previousSendings, setPreviousSendings] = useState<string[]>([]);
  const [requestGeneral, setRequestGeneral] = useState<IRequestGeneral>();
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidWhatsapp, setIsValidWhatsapp] = useState(false);
  const [selectedMedic, setSelectedMedic] = useState<IOptions>();

  useEffect(() => {
    getCompanyOptions();
    getMedicOptions();
  }, [getCompanyOptions, getMedicOptions]);

  useEffect(() => {
    setStudyFilter(branchId, doctorId, companyId);
  }, [branchId, companyId, doctorId, setStudyFilter]);

  useEffect(() => {
    const getRequestGeneral = async () => {
      const requestGeneral = await getGeneral(
        request!.expedienteId,
        request!.solicitudId!
      );
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

  useEffect(() => {
    setIsValidEmail(
      !!emails && emails.length > 0 && emails.every(validateEmail)
    );
    setIsValidWhatsapp(
      !!whatsapps &&
        whatsapps.length > 0 &&
        whatsapps.every(
          (whatsapp) =>
            (whatsapp ?? "").replaceAll("-", "").replaceAll("_", "").length ===
            10
        )
    );
  }, [emails, whatsapps]);

  useEffect(() => {
    if (sendToMedic) {
      const medicId = form.getFieldValue("medicoId");
      if (medicId) {
        const medic = MedicOptions.find((x) => x.value === medicId);
        form.setFieldsValue({
          correoMedico: medic?.extra?.correo ?? "Sin correo registrado",
          telefonoMedico: medic?.extra?.celular ?? "Sin celular registrado",
        });
        setSelectedMedic(medic);
      } else {
        setSelectedMedic(undefined);
      }
    } else {
      setSelectedMedic(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendToMedic]);

  const onValuesChange = (changedValues: any) => {
    const path = Object.keys(changedValues)[0];

    if (path === "metodoEnvio") {
      const sendings: string[] = changedValues[path];
      let metodoEnvio: string[] = [];

      if (previousSendings.includes("ambos") && !sendings.includes("ambos")) {
        metodoEnvio = [];
        form.setFieldsValue({ correos: [], whatsapps: [] });
      } else if (
        !previousSendings.includes("ambos") &&
        sendings.includes("ambos")
      ) {
        metodoEnvio = ["correo", "whatsapp", "ambos"];
      } else if (sendings.length === 2 && !sendings.includes("ambos")) {
        metodoEnvio = ["correo", "whatsapp", "ambos"];
      } else {
        metodoEnvio = sendings.filter((x) => x !== "ambos");
      }

      if (!sendings.includes("correo")) {
        form.setFieldsValue({ correos: [] });
      }
      if (!sendings.includes("whatsapp")) {
        form.setFieldsValue({ whatsapps: [] });
      }

      form.setFieldsValue({ metodoEnvio });
      setPreviousSendings(metodoEnvio);
    }
  };

  const onFinish = (values: IRequestGeneral) => {
    setErrors([]);
    const request = { ...requestGeneral, ...values };
    request.correo = !isValidEmail ? undefined : emails?.join(",");
    request.whatsapp = !isValidWhatsapp ? undefined : whatsapps?.join(",");

    if (requestGeneral?.compañiaId !== request.compañiaId && hasStudies) {
      alerts.confirm(
        "Hubo un cambio de compañía",
        "Al cambiar la compañía los estudios serán eliminados",
        async () => {
          request.cambioCompañia = true;
          await submit(request);
        },
        async () => {
          form.setFieldsValue(requestGeneral!);
        }
      );
      return;
    }

    request.cambioCompañia = false;
    submit(request);
  };

  const submit = async (request: IRequestGeneral) => {
    setRequestGeneral((prev) => ({ ...prev!, compañiaId: request.compañiaId }));
    const autoSave = form.getFieldValue("guardadoAutomatico");
    await onSubmit(request, autoSave);
  };

  const sendEmail = async () => {
    if (request && emails) {
      await sendTestEmail(request.expedienteId, request.solicitudId!, emails);
    }
  };

  const sendWhatsapp = async () => {
    if (request && whatsapps) {
      await sendTestWhatsapp(
        request.expedienteId,
        request.solicitudId!,
        whatsapps
      );
    }
  };

  const onCompanyChange = (_value: string, option: IOptions | IOptions[]) => {
    form.setFieldValue("procedencia", (option as IOptions).group);
  };

  return (
    <Form<IRequestGeneral>
      {...formItemLayout}
      form={form}
      onFinish={onFinish}
      onFinishFailed={({ errorFields }) => {
        const errors = errorFields.map((x) => ({
          name: x.name[0].toString(),
          errors: x.errors,
        }));
        setErrors(errors);
      }}
      initialValues={{
        metodoEnvio: [],
        companyId: catalog.company.particulares,
        procedencia: PARTICULAR,
        correos: [],
        whatsapps: [],
      }}
      onValuesChange={onValuesChange}
      size="small"
    >
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "compañiaId",
              label: "Compañía",
            }}
            options={CompanyOptions}
            required
            errors={errors.find((x) => x.name === "compañiaId")?.errors}
            onChange={onCompanyChange}
          />
        </Col>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "procedencia",
              label: "Procedencia",
            }}
            options={originOptions}
            readonly
            required
          />
        </Col>
        <Col span={24}>
          <SelectInput
            formProps={{
              name: "medicoId",
              label: "Médico",
            }}
            options={MedicOptions}
            required
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
          <Form.Item
            noStyle
            name="metodoEnvio"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
          >
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
              <Row>
                <Col span={12}>
                  <SelectTagInput
                    formProps={{
                      name: "correos",
                      label: "E-Mail",
                      noStyle: true,
                    }}
                    regex={/([A-Za-z0-9_.-]+)@([\dA-Za-z.-]+)\.([A-Za-z.]{2,6})$/}
                    readonly={!sendings?.includes("correo")}
                    required={sendings?.includes("correo")}
                    errors={errors.find((x) => x.name === "correos")?.errors}
                  />
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    disabled={!sendings?.includes("correo") || !isValidEmail}
                    onClick={sendEmail}
                  >
                    Prueba
                  </Button>
                </Col>
              </Row>
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
              <Row>
                <Col span={12}>
                  <SelectTagInput
                    formProps={{
                      name: "whatsapps",
                      label: "Whatsapp",
                      noStyle: true,
                    }}
                    regex={/([0-9]{3})-?([0-9]{3})-?([0-9]{2})-?([0-9]{2})$/}
                    readonly={!sendings?.includes("whatsapp")}
                    required={sendings?.includes("whatsapp")}
                    errors={errors.find((x) => x.name === "whatsapps")?.errors}
                  />
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    disabled={
                      !sendings?.includes("whatsapp") || !isValidWhatsapp
                    }
                    onClick={sendWhatsapp}
                  >
                    Prueba
                  </Button>
                </Col>
              </Row>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={24} style={{ textAlign: "start" }}>
          <Form.Item
            noStyle
            name="envioMedico"
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            valuePropName="checked"
          >
            <Checkbox>Enviar resultados a médico</Checkbox>
          </Form.Item>
        </Col>
        {selectedMedic && (
          <Col span={24}>
            <TextInput
              formProps={{
                name: "correoMedico",
                label: "Correo médico",
              }}
              readonly
            />
          </Col>
        )}
        {selectedMedic && (
          <Col span={24}>
            <TextInput
              formProps={{
                name: "telefonoMedico",
                label: "Télefono médico",
              }}
              readonly
            />
          </Col>
        )}
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

        <Col span={20}>
          <RequestDeliveryHistory />
        </Col>
      </Row>
    </Form>
  );
};

export default observer(RequestGeneral);
