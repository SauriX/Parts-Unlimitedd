import { Form, Row, Col, Button, Table, Spin } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { verifyAdminCreds } from "../../../../app/common/administrator/adminCreds";
import NumberInput from "../../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IRequestStudy, IRequestPayment } from "../../../../app/models/request";
import { IFormError } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import RequestInvoiceTab from "./invoice/RequestInvoiceTab";

const RequestRegister = () => {
  const { requestStore, optionStore, modalStore } = useStore();
  const { paymentOptions, getPaymentOptions } = optionStore;
  const { request, getPayments, printTicket, createPayment } = requestStore;
  const { openModal } = modalStore;

  const [form] = Form.useForm<IRequestPayment>();

  const [loading, setLoading] = useState<boolean>(false);
  const [payments, setPayments] = useState<IRequestPayment[]>([]);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    getPaymentOptions();
  }, [getPaymentOptions]);

  const columns: IColumns<IRequestPayment> = [
    {
      ...getDefaultColumnProps("id", "#", {
        searchState,
        setSearchState,
        width: 75,
      }),
      render: (_value, _record, index) => index + 1,
    },
    {
      ...getDefaultColumnProps("documento", "Documento", {
        searchState,
        setSearchState,
        width: 175,
      }),
      render: (_, record) => record.serie + " - " + record.numero,
    },
    {
      ...getDefaultColumnProps("formaPago", "Forma de Pago", {
        searchState,
        setSearchState,
        width: 150,
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: 125,
      }),
    },
    {
      ...getDefaultColumnProps("usuarioRegistra", "Usuario", {
        searchable: false,
        width: 175,
      }),
    },
    {
      ...getDefaultColumnProps("fechaPago", "Fecha", {
        searchable: false,
        width: 125,
      }),
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },
    Table.SELECTION_COLUMN,
  ];

  const onFinish = async (values: IRequestPayment) => {
    const payment: IRequestPayment = {
      ...values,
      expedienteId: request!.expedienteId,
      solicitudId: request!.solicitudId!,
    };
    payment.formaPago = paymentOptions
      .find((x) => x.value === payment.formaPagoId)!
      .label!.toString();
    const newPayment = await createPayment(payment);

    if (newPayment) {
      setPayments((prev) => [...prev, newPayment]);
      form.resetFields();
    }
  };

  useEffect(() => {
    const readPayments = async () => {
      if (request) {
        const payments = await getPayments(
          request.expedienteId,
          request.solicitudId!
        );
        setPayments(payments);
      }
    };

    readPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24}>
          <Form<IRequestPayment>
            layout="vertical"
            form={form}
            onFinish={onFinish}
            onFinishFailed={({ errorFields }) => {
              const errors = errorFields.map((x) => ({
                name: x.name[0].toString(),
                errors: x.errors,
              }));
              setErrors(errors);
            }}
            initialValues={{ cantidad: 0 }}
            size="small"
          >
            <Row gutter={[8, 12]} align="bottom">
              <Col span={5}>
                <SelectInput
                  formProps={{
                    name: "formaPagoId",
                    label: "Forma de Pago",
                  }}
                  options={paymentOptions}
                  errors={errors.find((x) => x.name === "formaPagoId")?.errors}
                  required
                />
              </Col>
              <Col span={2}>
                <NumberInput
                  formProps={{
                    name: "cantidad",
                    label: "Cantidad",
                  }}
                  min={0}
                  max={999999}
                  formatter={(value) => {
                    return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                  parser={(value) => {
                    const val = value!.replace(/\$\s?|(,*)/g, "");
                    return Number(val);
                  }}
                  errors={errors.find((x) => x.name === "cantidad")?.errors}
                  required
                />
              </Col>
              <Col span={5}>
                <TextInput
                  formProps={{
                    name: "numeroCuenta",
                    label: "Número de cuenta",
                  }}
                  max={100}
                  errors={errors.find((x) => x.name === "numeroCuenta")?.errors}
                  required
                />
              </Col>
              <Col span={2}>
                <SelectInput
                  formProps={{
                    name: "serie",
                    label: "Serie",
                  }}
                  options={[{ key: "MT", value: "MT", label: "MT" }]}
                  required
                  errors={errors.find((x) => x.name === "serie")?.errors}
                />
              </Col>
              <Col span={4}>
                <TextInput
                  formProps={{
                    name: "numero",
                  }}
                  placeholder="Número"
                  max={100}
                  required
                  errors={errors.find((x) => x.name === "numero")?.errors}
                />
              </Col>
              <Col span={6} style={{ textAlign: "right" }}>
                <Button htmlType="submit" type="primary">
                  Registrar Pago
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Table<IRequestPayment>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={payments}
            pagination={false}
            rowSelection={{
              fixed: "right",
            }}
            sticky
            scroll={{ x: "fit-content" }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="default"
            onClick={async () => {
              if (request) {
                setLoading(true);
                await printTicket(request.expedienteId, request.solicitudId!);
                setLoading(false);
              }
            }}
          >
            Imprimir
          </Button>
          <Button
            ghost
            danger
            type="primary"
            onClick={async () => {
              const hasPermission = await verifyAdminCreds();
              console.log(hasPermission);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={() => {
              openModal({
                title: "Datos Fiscales",
                body: <RequestInvoiceTab recordId={request!.expedienteId} />,
                width: 900,
              });
            }}
          >
            Facturar
          </Button>
          <Button type="primary">Descargar XML</Button>
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RequestRegister);
