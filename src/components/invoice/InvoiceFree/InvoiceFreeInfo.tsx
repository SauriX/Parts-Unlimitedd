import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Switch,
  Typography,
  Input,
  Select,
} from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useNavigate, useParams } from "react-router";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IOptions } from "../../../app/models/shared";
import { formItemLayout } from "../../../app/util/utils";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import InvoiceFreeSearchCompany from "./InvoiceFreeSearchCompany";
import { regimenFiscal } from "../../../app/util/catalogs";
import { IMotivo } from "../../../app/models/Invoice";

const { Title, Text } = Typography;
const { Search } = Input;

type UrlParams = {
  id: string;
  tipo: string;
};

const InvoiceFreeInfo = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formCancel] = Form.useForm();
  const tipoFactura = Form.useWatch("tipoFactura", form);
  let { id, tipo } = useParams<UrlParams>();
  const { modalStore, invoiceFreeStore, invoiceCompanyStore } = useStore();
  const { openModal } = modalStore;
  const { setReceptor, setTipoFacturaLibre } = invoiceFreeStore;
  const { invoice, cancelInvoice } = invoiceCompanyStore;
  const [receptorLocal, setReceptorLocal] = useState<any>();

  const onFinish = (newFormValues: any) => {};
  const onFinishCancel = async (newFormValues: any) => {
    let cancelationInvoiceData: IMotivo = {
      facturapiId: invoice?.facturapiId!,
      motivo: newFormValues.motivo,
    };

    await cancelInvoice(cancelationInvoiceData);
    if (tipo === "company") {
      navigate(`/invoice/company`);
    }
    if (tipo === "request") {
      navigate(`/invoice/request`);
    }
  };

  useEffect(() => {
    form.resetFields([
      "regimenFiscal",
      "razonSocial",
      "rfc",
      "direccionFiscal",
      "nombreComercial",
      "clave",
    ]);
    form.setFieldValue("fechas", [(moment(), moment())]);
    setTipoFacturaLibre(tipoFactura);
  }, [tipoFactura]);
  useEffect(() => {
    form.setFieldsValue(receptorLocal);
    form.submit();
    setReceptor(receptorLocal);
  }, [receptorLocal]);
  useEffect(() => {
    if (id !== "new" && !!invoice) {
      form.setFieldsValue(invoice);
      form.setFieldValue("clave", invoice.claveExterna);
      form.setFieldValue("nombreComercial", invoice.nombre);
      form.setFieldValue(
        "direccionFiscal",
        !!invoice.direccionFiscal ? invoice.direccionFiscal : ""
      );
      form.setFieldValue("rfc", invoice.rfc);
      form.setFieldValue("razonSocial", invoice.razonSocial);
      form.setFieldValue("regimenFiscal", invoice.regimenFiscal);
    }
  }, [invoice]);

  const reasonCancelation: IOptions[] = [
    {
      label: "01 Comprobantes emitidos con errores con relación.",
      value: "01",
    },
    {
      label: "02 Comprobantes emitidos con errores sin relación",
      value: "02",
    },
    {
      label: "03 No se llevó a cabo la operación.",
      value: "03",
    },
    {
      label: "04 Operación nominativa relacionada en una factura global.",
      value: "04",
    },
  ];

  const seleccionarCompañia = (compañiaSeleccionada: any) => {
    compañiaSeleccionada.direccionFiscal = `${
      compañiaSeleccionada?.estado ?? ""
    } ${compañiaSeleccionada?.ciudad ?? ""} ${
      compañiaSeleccionada?.codigoPostal ?? ""
    } `;
    console.log("compañias", compañiaSeleccionada.direccionFiscal);
    setReceptorLocal(compañiaSeleccionada);
  };

  return (
    <>
      <div className="status-container" style={{ marginBottom: 12 }}>
        <Row gutter={[24, 8]}>
          <Col span={16}>
            <Title level={5}>
              {tipoFactura ? "Datos de la compañia" : "Datos del cliente"}
            </Title>
          </Col>
          <Col span={6}>
            <Form<any>
              {...formItemLayout}
              form={formCancel}
              name="invoiceCancel"
              onFinish={onFinishCancel}
              size="small"
              initialValues={{ fechas: [moment(), moment()] }}
            >
              <Row justify="space-between" gutter={[0, 12]}>
                <Col span={24}>
                  <SelectInput
                    formProps={{ label: "Selecciona motivo", name: "motivo" }}
                    options={reasonCancelation}
                    readonly={id === "new"}
                    required
                  />
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={2}>
            <Button
              type="primary"
              disabled={id === "new"}
              onClick={() => formCancel.submit()}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
        <Row gutter={[24, 8]}>
          <Col span={24}>
            <Form<any>
              {...formItemLayout}
              form={form}
              name="invoiceFree"
              onFinish={onFinish}
              size="small"
              initialValues={{
                fechas: [moment(), moment()],
                tipoFactura: true,
              }}
              onChange={(e: any) => {
                form.submit();
              }}
            >
              <Row justify="center" gutter={[24, 8]}>
                <Col span={8}>
                  <TextInput
                    formProps={{ label: "Clave", name: "clave" }}
                    readonly={id !== "new" || tipoFactura}
                    style={{ marginBottom: 10 }}
                  />

                  <TextInput
                    formProps={{ label: "Nombre", name: "nombreComercial" }}
                    readonly={id !== "new" || tipoFactura}
                    style={{ marginBottom: 10 }}
                  />

                  <TextAreaInput
                    formProps={{
                      label: "Dirección Fiscal",
                      name: "direccionFiscal",
                    }}
                    readonly={id !== "new" || tipoFactura}
                    rows={4}
                  />
                </Col>
                <Col span={1}>
                  <Button
                    shape="round"
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                      openModal({
                        title: "Búsqueda de compañía",
                        body: (
                          <InvoiceFreeSearchCompany
                            setSelectedCompany={seleccionarCompañia}
                          />
                        ),
                        width: 800,
                      });
                    }}
                    disabled={id !== "new" || !tipoFactura}
                  >
                    Buscar
                  </Button>
                </Col>
                <Col span={8}>
                  <TextInput
                    formProps={{ label: "RFC", name: "rfc" }}
                    readonly={id !== "new" || tipoFactura}
                    style={{ marginBottom: 10 }}
                  />
                  <TextInput
                    formProps={{ label: "Razón social", name: "razonSocial" }}
                    readonly={id !== "new" || tipoFactura}
                    style={{ marginBottom: 10 }}
                  />

                  <SelectInput
                    form={form}
                    formProps={{
                      label: "Régimen fiscal",
                      name: "regimenFiscal",
                    }}
                    options={regimenFiscal}
                    readonly={id !== "new" || tipoFactura}
                    style={{ marginBottom: 10 }}
                    onChange={() => {
                      form.submit();
                    }}
                  />
                </Col>
                <Col span={7} style={{ alignItems: "center" }}>
                  <Form.Item
                    name="tipoFactura"
                    style={{ alignItems: "center" }}
                  >
                    <Switch
                      checkedChildren="Compañia"
                      unCheckedChildren="Solicitud"
                      defaultChecked
                      size="default"
                      disabled={id !== "new"}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default observer(InvoiceFreeInfo);
