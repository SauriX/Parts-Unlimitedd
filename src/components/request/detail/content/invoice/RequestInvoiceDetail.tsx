import {
  Button,
  Checkbox,
  Col,
  Form,
  Radio,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import SelectInput from "../../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../../app/common/form/proposal/TextInput";
import { IColumns } from "../../../../../app/common/table/utils";
import {
  IRequestCheckIn,
  IRequestPayment,
} from "../../../../../app/models/request";
import { IFormError, IOptions } from "../../../../../app/models/shared";
import { ITaxData } from "../../../../../app/models/taxdata";
import { useStore } from "../../../../../app/stores/store";
import alerts from "../../../../../app/util/alerts";
import { moneyFormatter } from "../../../../../app/util/utils";

interface IFormInvoice {
  usoCfdi: number;
  cantidad: string;
  numeroCuenta: string;
  formaPago: string;
  configuracion: "desglozado" | "simple" | "concepto";
  metodoEnvio: string[];
}

interface IDetailInvoice {
  concepto: string;
  cantidad: number;
  precioFinal: number;
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const sendOptions = [
  { label: "Mandar via correo electronico", value: "correo" },
  { label: "Mandar via Whatsapp", value: "whatsapp" },
  { label: "Ambos", value: "ambos" },
];

const settingsOptions: IOptions[] = [
  { label: "Desglozado por estudio", value: "desglozado", disabled: true },
  { label: "Simple", value: "simple" },
  { label: "Por concepto", value: "concepto" },
];

type RequestInvoiceDetailProps = {
  recordId: string;
  requestId: string;
  payments: IRequestPayment[];
  taxData: ITaxData;
};

const RequestInvoiceDetail = ({
  recordId,
  requestId,
  payments,
  taxData,
}: RequestInvoiceDetailProps) => {
  const { requestStore, optionStore, modalStore } = useStore();
  const { studies, packs, totals, checkInPayment } = requestStore;
  const { paymentOptions, cfdiOptions, getPaymentOptions, getcfdiOptions } =
    optionStore;
  const { closeModal } = modalStore;

  const [form] = Form.useForm<IFormInvoice>();

  const configuration = Form.useWatch("configuracion", form);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [detailData, setDetailData] = useState<IDetailInvoice[]>([]);
  const [avDetailType, setAvDetailType] = useState(settingsOptions);

  const detailColumns: IColumns<IDetailInvoice> = [
    {
      dataIndex: "concepto",
      key: "concepto",
      title: "Concepto",
      width: "60%",
    },
    {
      dataIndex: "cantidad",
      key: "cantidad",
      title: "Cantidad",
      width: "20%",
    },
    {
      dataIndex: "precioFinal",
      key: "precioFinal",
      title: "Importe final",
      width: "20%",
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
  ];

  useEffect(() => {
    getPaymentOptions();
    getcfdiOptions();
  }, [getPaymentOptions, getcfdiOptions]);

  const onFinish = async (values: IFormInvoice) => {
    const use = cfdiOptions.find((x) => x.value === values.usoCfdi);

    if (!use) {
      alerts.warning("Uso de CFDI inválido");
      return;
    }

    const requestCheckIn: IRequestCheckIn = {
      expedienteId: recordId,
      solicitudId: requestId,
      datoFiscalId: taxData.id!,
      usoCFDI: use.label!.toString(),
      conNombre: values.configuracion.includes("nombre"),
      desglozado: values.configuracion.includes("desglozado"),
      envioCorreo: values.metodoEnvio.includes("correo"),
      envioWhatsapp: values.metodoEnvio.includes("whatsapp"),
      pagos: payments,
      formaPago: "",
    };

    setLoading(true);
    const checkedIn = await checkInPayment(requestCheckIn);
    setLoading(false);

    if (checkedIn.length > 0) {
      closeModal();
    } else {
      alerts.warning("No se facturó ningun pago");
    }
  };

  useEffect(() => {
    form.setFieldValue(
      "cantidad",
      moneyFormatter.format(payments.reduce((acc, o) => acc + o.cantidad, 0))
    );
  }, [form, payments]);

  useEffect(() => {
    const totalPayment = payments.reduce((acc, obj) => acc + obj.cantidad, 0);

    if (totalPayment === totals.total) {
      setAvDetailType((prev) => [
        { label: "Desglozado por estudio", value: "desglozado" },
        ...prev.filter((x) => x.value !== "desglozado"),
      ]);
    }

    const maxPayment = payments.reduce(
      (p, c) => (p.cantidad > c.cantidad ? p : c),
      payments[0]
    );

    form.setFieldsValue({
      formaPago: maxPayment.formaPago,
      numeroCuenta: payments
        .map((x) => x.numeroCuenta)
        .filter((o, i, a) => a.indexOf(o) === i)
        .join(", "),
      configuracion: totalPayment === totals.total ? "desglozado" : "simple",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (configuration === "desglozado") {
      setDetailData([
        ...studies.map((x) => ({
          concepto: x.nombre,
          precioFinal: x.precioFinal,
          cantidad: 1,
        })),
      ]);
    } else if (configuration === "simple") {
      setDetailData([
        {
          concepto: "ANALISIS CLINICOS",
          precioFinal: totals.total,
          cantidad: 1,
        },
      ]);
    } else {
      setDetailData([
        {
          concepto: "",
          precioFinal: totals.total,
          cantidad: 1,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration]);

  return (
    <Spin spinning={loading}>
      <Space direction="vertical">
        <Form<IFormInvoice>
          {...formItemLayout}
          form={form}
          name="invoice"
          onFinish={onFinish}
          onFinishFailed={({ errorFields }) => {
            const errors = errorFields.map((x) => ({
              name: x.name[0].toString(),
              errors: x.errors,
            }));
            setErrors(errors);
          }}
          scrollToFirstError
        >
          <Row gutter={[0, 12]}>
            <Col span={12}>
              <SelectInput
                formProps={{
                  name: "serie",
                  label: "Serie de Factura",
                }}
                options={[{ value: "MT", label: "MT" }]}
                required
                errors={errors.find((x) => x.name === "serie")?.errors}
              />
            </Col>
            <Col span={7}></Col>
            <Col span={5}>
              <TextInput
                formProps={{
                  name: "cantidad",
                  label: "Cantidad",
                  labelCol: { span: 12 },
                  wrapperCol: { span: 12 },
                }}
                readonly
              />
            </Col>
            <Col span={12}>
              <SelectInput
                formProps={{
                  name: "usoCfdi",
                  label: "Uso de CFDI",
                }}
                options={cfdiOptions}
                required
                errors={errors.find((x) => x.name === "usoCfdi")?.errors}
              />
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <SelectInput
                formProps={{ name: "formaPago", label: "Forma de pago" }}
                options={payments
                  .map((x) => x.formaPago)
                  .filter((o, i, a) => a.map((x) => x).indexOf(o) === i)
                  .map((x) => ({
                    value: x,
                    label: x,
                  }))}
                required
                errors={errors.find((x) => x.name === "formaPago")?.errors}
              />
            </Col>
            <Col span={12}></Col>
            <Col span={24}>
              <TextInput
                formProps={{
                  name: "numeroCuenta",
                  label: "Número de cuenta",
                  labelCol: { span: 4 },
                  wrapperCol: { span: 20 },
                }}
                readonly
                errors={errors.find((x) => x.name === "numeroCuenta")?.errors}
              />
            </Col>
            <Col span={24} style={{ textAlign: "start" }}>
              <Form.Item
                noStyle
                name="configuracion"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Radio.Group options={avDetailType} />
              </Form.Item>
            </Col>
            <Col span={18} style={{ textAlign: "start" }}>
              <Form.Item
                noStyle
                name="metodoEnvio"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Checkbox.Group options={sendOptions} />
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: "end" }}>
              <Button type="primary" htmlType="submit">
                Registrar
              </Button>
            </Col>
          </Row>
        </Form>
        <Table<IDetailInvoice>
          key="clave"
          title={() => "Detalle"}
          columns={detailColumns}
          dataSource={detailData}
          pagination={false}
          sticky
          scroll={{ y: 400 }}
        />
      </Space>
    </Spin>
  );
};

export default observer(RequestInvoiceDetail);
