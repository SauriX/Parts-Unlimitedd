import { Form, Row, Col, Button, Table, Spin, Divider } from "antd";
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
import { IRequestPayment } from "../../../../app/models/request";
import { IFormError } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { status } from "../../../../app/util/catalogs";
import { moneyFormatter } from "../../../../app/util/utils";
import RequestInvoiceTab from "./invoice/RequestInvoiceTab";

const RequestRegister = () => {
  const { requestStore, optionStore, modalStore, profileStore } = useStore();
  const { profile } = profileStore;
  const { paymentOptions, getPaymentOptions } = optionStore;
  const { request, getPayments, printTicket, createPayment, cancelPayments } =
    requestStore;
  const { openModal } = modalStore;

  const [form] = Form.useForm<IRequestPayment>();

  const [loading, setLoading] = useState<boolean>(false);
  const [payments, setPayments] = useState<IRequestPayment[]>([]);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<IRequestPayment[]>(
    []
  );
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
        searchable: false,
        width: 50,
      }),
      render: (_value, _record, index) => index + 1,
    },
    {
      ...getDefaultColumnProps("documento", "Documento", {
        searchState,
        setSearchState,
        width: 135,
      }),
      render: (_, record) => record.serie + " - " + record.numero,
    },
    {
      ...getDefaultColumnProps("formaPago", "Forma de Pago", {
        searchState,
        setSearchState,
        width: 275,
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: 125,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("usuarioRegistra", "Usuario", {
        searchState,
        setSearchState,
        width: 250,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("fechaPago", "Fecha", {
        searchable: false,
        width: 100,
      }),
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },
    Table.SELECTION_COLUMN,
  ];

  const onFinish = async (values: IRequestPayment) => {
    setErrors([]);
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

  const cancel = async () => {
    alerts.confirm(
      "¿Desea cancelar el pago?",
      "El pago será cancelado, ésta acción no se puede deshacer",
      confirmCancel
    );
  };

  const confirmCancel = async () => {
    if (!profile || !profile.admin) {
      const isAdmin = await verifyAdminCreds();
      if (!isAdmin) {
        alerts.warning("El usuario ingresado debe ser Administrador");
        return;
      }
    }
    if (request) {
      const cancelled = await cancelPayments(
        request.expedienteId,
        request.solicitudId!,
        selectedPayments
      );
      if (cancelled.length > 0) {
        setSelectedPayments([]);
        setPayments(
          payments.map((x) => {
            const payment = cancelled.find((p) => p.id === x.id);
            if (payment) {
              return {
                ...x,
                estatusId: payment.estatusId,
                usuarioRegistra: payment.usuarioRegistra,
              };
            }
            return x;
          })
        );
      }
    }
  };

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
            dataSource={payments.filter(
              (x) =>
                x.estatusId === status.requestPayment.pagado ||
                x.estatusId === status.requestPayment.facturado
            )}
            pagination={false}
            rowSelection={{
              fixed: "right",
              onChange(selectedRowKeys, selectedRows, info) {
                setSelectedPayments(selectedRows);
              },
              selectedRowKeys: selectedPayments.map((x) => x.id),
            }}
            sticky
            scroll={{ x: "max-content" }}
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
            disabled={selectedPayments.length === 0}
            onClick={cancel}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            disabled={
              selectedPayments.filter(
                (x) => x.estatusId === status.requestPayment.pagado
              ).length === 0
            }
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
          <Button
            type="primary"
            disabled={
              selectedPayments.filter(
                (x) => x.estatusId === status.requestPayment.facturado
              ).length === 0
            }
          >
            Descargar XML
          </Button>
        </Col>
        <Col span={24}>
          <Divider orientation="left" className="register-cancelled-divider">
            Pagos Cancelados
          </Divider>
          <Table<IRequestPayment>
            size="small"
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={payments.filter(
              (x) =>
                x.estatusId === status.requestPayment.cancelado ||
                x.estatusId === status.requestPayment.facturaCancelada
            )}
            pagination={false}
            rowSelection={{
              fixed: "right",
              renderCell(value, record, index, originNode) {
                return null;
              },
              hideSelectAll: true,
            }}
            sticky
            scroll={{ x: "max-content" }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RequestRegister);
