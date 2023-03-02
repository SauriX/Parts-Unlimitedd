import { Button, Col, Divider, Form, Row, Typography } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateRangeInput from "../../../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { IOptions } from "../../../../app/models/shared";
import optionStore from "../../../../app/stores/optionStore";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout } from "../../../../app/util/utils";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DatosFiscalesForm from "../../../proceedings/details/DatosFiscalesForm";
import { ITaxData } from "../../../../app/models/taxdata";
import { IMotivo } from "../../../../app/models/Invoice";
import { toJS } from "mobx";

const { Title, Text } = Typography;
type InvoiceCompanyInfoProps = {
  company: any;
  facturapiId: string;
  estatusFactura: any;
};
type UrlParams = {
  id: string;
  tipo: string;
};
const InvoiceCompanyInfo = ({
  company,
  facturapiId,
  estatusFactura,
}: InvoiceCompanyInfoProps) => {
  const [form] = Form.useForm();
  const [formCancel] = Form.useForm();
  let { id, tipo } = useParams<UrlParams>();
  const { optionStore, invoiceCompanyStore, modalStore, procedingStore } =
    useStore();
  const {
    fechas,
    cancelInvoice,
    selectedRows,
    setSelectedRequests,
    setTaxData,
    setNombreSeleccionado,
    invoice,
    getCompanyById,
  } = invoiceCompanyStore;
  const { getById, getTaxData } = procedingStore;

  const nombre = Form.useWatch("nombre", form);
  const razonSocial = Form.useWatch("razonSocial", form);
  const { openModal, closeModal } = modalStore;
  const navigate = useNavigate();

  const [nameOptions, setNameOptions] = useState<IOptions[]>([]);
  const [companyLocal, setCompanyLocal] = useState<any>();
  // const [taxData, setTaxData] = useState<ITaxData>();
  useEffect(() => {
    if (companyLocal && tipo === "company") {
      console.log("COMPAÑIA LOCAL", companyLocal);
      companyLocal.direccionFiscal = `${companyLocal?.estado ?? ""} ${
        companyLocal?.ciudad ?? ""
      } ${companyLocal?.codigoPostal ?? ""} ${
        companyLocal?.colonia ?? ""
      } `.trim();
      form.setFieldsValue(companyLocal);
    }
  }, [companyLocal]);
  useEffect(() => {
    if (company) {
      console.log("COMPAÑIA", toJS(company));
      setCompanyLocal(company);
    }
  }, [company]);
  useEffect(() => {
    if (invoice) {
      // getTaxData(invoice.taxDataId);
      if (tipo === "request") {
        const consultarInformacionFiscal = async () => {
          const generalDataRequest = await getById(invoice.expedienteId);
          const taxDataInfo = generalDataRequest?.taxData?.find(
            (x) => x.id === invoice.taxDataId
          );
          onSelectTaxData(taxDataInfo!);
        };
        consultarInformacionFiscal();
        form.setFieldValue("nombre", invoice.nombre);
      }
      if (tipo === "company") {
        const loadCompany = async () => {
          const companyResult = await getCompanyById(invoice.compañiaId);
          console.log("COMPAÑIA", toJS(companyResult));
          setCompanyLocal(companyResult);
        };
        loadCompany();
      }
    }
  }, [invoice]);
  const onFinish = async (newFormValues: any) => {
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

  const onSelectTaxData = (taxData: ITaxData) => {
    console.log("TAXDATA", taxData);
    form.setFieldsValue(taxData);
    form.setFieldValue(
      "direccionFiscal",
      `${taxData?.calle ?? ""} ${taxData?.municipio} ${taxData?.estado} ${
        taxData?.cp
      }`.trim()
    );
    setTaxData(taxData);
  };
  useEffect(() => {
    form.setFieldValue("fechas", fechas);
  }, []);

  useEffect(() => {
    if (tipo === "request") {
      const nameOptionData: IOptions[] = selectedRows.map((x) => {
        return {
          value: x.expedienteId,
          label: x.nombre,
        };
      });
      setNameOptions(nameOptionData);
    }
  }, [selectedRows]);

  useEffect(() => {
    console.log("NOMBRE", nombre);
    if (true) {
    }
    setSelectedRequests(nombre);
    setNombreSeleccionado(nombre);
  }, [nombre, razonSocial]);

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
  return (
    <>
      <Row justify="end" className="filter-buttons">
        <Col span={24}>
          <Button
            type="primary"
            disabled={id === "new"}
            onClick={() => formCancel.submit()}
          >
            Cancelar
          </Button>
        </Col>
      </Row>
      <div className="status-container" style={{ marginBottom: 12 }}>
        <Form<any>
          {...formItemLayout}
          form={formCancel}
          name="invoiceCancel"
          onFinish={onFinish}
          size="small"
          initialValues={{ fechas: [moment(), moment()] }}
        >
          <Row justify="space-between" gutter={[0, 12]}>
            <Col span={16}>
              <Title level={5}>
                {tipo === "company"
                  ? "Datos de la compañia"
                  : "Datos del cliente"}
              </Title>
            </Col>
            <Col span={8}>
              <SelectInput
                form={formCancel}
                formProps={{ label: "Selecciona motivo", name: "motivo" }}
                options={reasonCancelation}
                readonly={id === "new"}
                required
              />
            </Col>
          </Row>
        </Form>
        <Form<any>
          {...formItemLayout}
          form={form}
          name="invoiceCompany"
          onFinish={onFinish}
          size="small"
          initialValues={{ fechas: [moment(), moment()] }}
        >
          {/* <Row justify="space-between" gutter={[0, 12]}>
            <Col span={16}>
              <Title level={5}>Datos de la compañia</Title>
            </Col>
            <Col span={8}>
              <SelectInput
                form={form}
                formProps={{ label: "Selecciona motivo", name: "motivo" }}
                options={reasonCancelation}
              />
            </Col>
          </Row> */}
          <Row justify="space-between" gutter={[0, 12]}>
            <Col span={24}>
              <Row justify="space-between">
                <Col span={8}>
                  {tipo === "company" && (
                    <TextInput
                      formProps={{ name: "clave", label: "Clave" }}
                      style={{ marginBottom: 10 }}
                      readonly
                    />
                  )}
                  {tipo === "company" && (
                    <TextInput
                      formProps={{ name: "nombre", label: "Nombre" }}
                      readonly
                    />
                  )}
                  {tipo === "request" && (
                    <SelectInput
                      formProps={{ name: "nombre", label: "Nombre" }}
                      options={nameOptions}
                      readonly={id !== "new"}
                      required
                    />
                  )}
                </Col>
                <Col span={8}>
                  <DateRangeInput
                    formProps={{
                      label: "Periodo de búsqueda",
                      name: "fechas",
                    }}
                    readonly
                  />
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <TextInput formProps={{ name: "rfc", label: "RFC" }} readonly />
            </Col>
            <Col span={14}>
              {tipo === "request" && (
                <Button
                  onClick={() =>
                    openModal({
                      title: "Seleccionar o Ingresar Datos Fiscales",
                      body: (
                        <DatosFiscalesForm
                          local={true}
                          recordId={nombre}
                          onSelectRow={onSelectTaxData}
                        />
                      ),
                      width: 900,
                    })
                  }
                  style={{
                    backgroundColor: "#6EAA46",
                    color: "white",
                    borderColor: "#6EAA46",
                  }}
                  disabled={!nombre}
                >
                  Datos Fiscales
                </Button>
              )}
            </Col>
            <Col span={24}>
              <Row style={{ paddingBottom: 10 }}>
                <Col span={8}>
                  <TextAreaInput
                    formProps={{
                      name: "direccionFiscal",
                      label: "Dirección fiscal",
                    }}
                    rows={3}
                    readonly
                  />
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <TextInput
                    formProps={{ name: "razonSocial", label: "Razón social" }}
                    readonly
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default observer(InvoiceCompanyInfo);
