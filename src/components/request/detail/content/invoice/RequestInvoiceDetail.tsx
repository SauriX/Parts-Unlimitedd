import { Button, Checkbox, Col, Form, Row, Space, Spin, Table } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import SelectInput from "../../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../../app/common/form/proposal/TextInput";
import { IColumns } from "../../../../../app/common/table/utils";
import {
  IRequestCheckIn,
  IRequestPayment,
} from "../../../../../app/models/request";
import { IFormError } from "../../../../../app/models/shared";
import { ITaxData } from "../../../../../app/models/taxdata";
import { useStore } from "../../../../../app/stores/store";
import alerts from "../../../../../app/util/alerts";
import { moneyFormatter } from "../../../../../app/util/utils";

interface IFormInvoice {
  usoCfdi: number;
  cantidad: string;
  numeroCuenta: string;
  configuracion: string[];
  metodoEnvio: string[];
}

interface IDetailInvoice {
  clave: string;
  descripcion: string;
  importe: string;
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

const settingsOptions = [
  { label: "Desglozado", value: "desglozado" },
  { label: "Con Nombre", value: "nombre" },
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [detailData, setDetailData] = useState<IDetailInvoice[]>([]);

  const detailColumns: IColumns<IDetailInvoice> = [
    {
      dataIndex: "clave",
      key: "clave",
      title: "Clave",
      width: "30%",
    },
    {
      dataIndex: "descripcion",
      key: "descripcion",
      title: "Descripción",
      width: "50%",
    },
    {
      dataIndex: "importe",
      key: "importe",
      title: "Importe",
      width: "20%",
      align: "right",
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
      setDetailData([
        ...studies.map((x) => ({
          clave: x.clave,
          descripcion: x.nombre,
          importe: moneyFormatter.format(x.precioFinal),
        })),
      ]);
    } else {
      setDetailData([
        {
          clave: taxData.rfc,
          descripcion: `Pago por ${moneyFormatter.format(totalPayment)}`,
          importe: moneyFormatter.format(totalPayment),
        },
      ]);
    }
  }, []);

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
                  name: "usoCfdi",
                  label: "Uso de CFDI",
                }}
                options={cfdiOptions}
                required
                errors={errors.find((x) => x.name === "usoCfdi")?.errors}
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
              <TextInput
                formProps={{
                  name: "numeroCuenta",
                  label: "Número de cuenta",
                }}
                required
                errors={errors.find((x) => x.name === "numeroCuenta")?.errors}
              />
            </Col>
            {/* <Col span={9}>
            <SelectInput
              formProps={{ name: "serieCfdi", label: "Serie CFDI" }}
              options={[]}
            />
          </Col> */}
            <Col span={24} style={{ textAlign: "start" }}>
              <Form.Item
                noStyle
                name="configuracion"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Checkbox.Group options={settingsOptions} />
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
