import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
  Table,
  Typography,
  Space,
  Divider,
} from "antd";
// import TextArea from "antd/lib/input/TextArea";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";
import { formItemLayout, moneyFormatter } from "../../../app/util/utils";
import { useParams } from "react-router-dom";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  DownCircleTwoTone,
} from "@ant-design/icons";
import { useStore } from "../../../app/stores/store";
import moment from "moment";
import { useEffect, useState } from "react";
import { IOptions } from "../../../app/models/shared";
import { v4 as uuid } from "uuid";
import { toJS } from "mobx";
import SelectInput from "../../../app/common/form/proposal/SelectInput";

const { Title, Text } = Typography;
const { TextArea } = Input;

type UrlParams = {
  id: string;
  tipo: string;
};

interface IDetailInvoice {
  id: string;
  clave?: string;
  claveProdServ?: string;
  solicitudClave?: string;
  estudioClave?: string;
  concepto?: string;
  cantidad: number;
  importe: number;
  redondeo?: boolean;
}
type InvoiceFreeDetailProps = {
  estudios: any[];
  totalEstudios: number;
};
const InvoiceFreeDetail = ({
  estudios,
  totalEstudios,
}: InvoiceFreeDetailProps) => {
  let { id, tipo } = useParams<UrlParams>();
  const [form] = Form.useForm<any>();
  const [formSetting] = Form.useForm<any>();
  const [formConcepts] = Form.useForm<any>();
  const [formRedondeo] = Form.useForm<any>();
  const configuration = Form.useWatch("configuracion", formSetting);
  const redondeo = Form.useWatch("redondeo", formRedondeo);
  const cantidad = Form.useWatch("cantidad", form);
  const iva = Form.useWatch("iva", form);

  const { invoiceCompanyStore, profileStore, requestStore } = useStore();
  const { profile } = profileStore;
  const {
    serie,
    consecutiveBySerie,
    setDetailInvoice,
    setConfigurationInvoice,
    invoice,
  } = invoiceCompanyStore;
  const { studies } = requestStore;
  const [detailData, setDetailData] = useState<IDetailInvoice[]>([]);
  const [estudiosDetalle, setEstudiosDetalle] = useState<any[]>([]);
  const [ivaFinal, setIvaFinal] = useState<any>();
  const [totalFinal, setTotalFinal] = useState<number>(0);
  const soloLectura = id !== "new";

  const [currentTime, setCurrentTime] = useState<string>();
  let timer: any = null;
  useEffect(() => {
    timer = window.setInterval(() => {
      setCurrentTime(moment().format("hh:mm:ss a"));
    }, 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setDetailData(invoice?.detalles);
    // formSetting.setFieldValue("configuracion", invoice?.tipoDesgloce);
  }, [invoice]);
  useEffect(() => {}, [estudios, totalEstudios]);
  useEffect(() => {
    const total = detailData.reduce((acc, obj) => acc + obj.importe, 0);
    setTotalFinal(total);
    setDetailInvoice(detailData);
  }, [detailData]);
  useEffect(() => {
    if (redondeo) {
      setDetailData((detailData) => [
        ...detailData,
        {
          id: uuid(),
          concepto: "",
          importe: Math.trunc(totalFinal + 1) - totalFinal,
          cantidad: 1,
          redondeo: true,
        },
      ]);
    } else {
      setDetailData(detailData.filter((detalle) => !detalle.redondeo));
    }
  }, [redondeo]);
  useEffect(() => {
    if (configuration === "simple") {
      setDetailData([
        {
          id: uuid(),
          concepto: "ANALISIS CLINICOS",
          importe: totalEstudios,
          cantidad: 1,
        },
      ]);
    }
    if (configuration === "concepto") {
      setDetailData([]);
    }
    if (configuration === "desglozado") {
      setDetailData(
        estudios.map((detalle) => {
          return {
            id: uuid(),
            solicitudClave: detalle.claveSolicitud,
            estudioClave: detalle.clave,
            clave: detalle.clave,
            concepto: detalle.estudio,
            importe: detalle.precioFinal,
            cantidad: 1,
          };
        })
      );
    }
    setConfigurationInvoice(configuration);
  }, [configuration]);
  useEffect(() => {
    if (configuration === "desglozado") {
      // setTotalFinal(totalEstudios);
      setDetailData(
        estudios.map((detalle) => {
          return {
            id: uuid(),
            solicitudClave: detalle.claveSolicitud,
            estudioClave: detalle.clave,
            clave: detalle.clave,
            concepto: detalle.estudio,
            importe: detalle.precioFinal,
            cantidad: 1,
          };
        })
      );
    }
  }, [totalEstudios, estudios]);

  useEffect(() => {
    setIvaFinal(!!cantidad && !!iva ? (cantidad * iva) / 100 : 0);
  }, [cantidad, iva]);

  useEffect(() => {
    if (tipo === "free") {
      formSetting.setFieldValue("configuracion", "concepto");
    }
  }, []);

  const items: IOptions[] = [
    {
      label: "Sucursal",
      key: "branch",
      // description: "ESTUDIOS DE LABORATORIO REALIZADOS EN SUCURSAL [branch]",
      value: "ESTUDIOS DE LABORATORIO REALIZADOS EN SUCURSAL [branch]",
    },
    {
      label: "Paciente",
      key: "patient",
      // description: "PACIENTE: [patient]",
      value: "PACIENTE: [patient]",
      // disabled: !selectedRequests.length,
    },
    {
      label: "Copago",
      key: "cup",
      // description: "COPAGO TOTAL [total]",
      value: "COPAGO TOTAL [total]",
      disabled: configuration === "company" ? false : true,
    },
    {
      label: "Consulta",
      key: "simple",
      // description: "CONSULTA MEDICA",
      value: "CONSULTA MEDICA",
    },
  ];
  const [allItems, setAllItems] = useState<IOptions[]>(items);

  const detailColumns: IColumns<IDetailInvoice> = [
    {
      key: "claveProdServ",
      dataIndex: "claveProdServ",
      title: "Clave Prod/Serv.",
      align: "center",
      width: "30%",
      render: (value, row) => {
        return (
          <>
            <Select
              showArrow={true}
              disabled={soloLectura}
              size="small"
              bordered={false}
              allowClear
              style={{ width: "100%" }}
              placeholder="Prod/Serv"
              defaultValue={value}
              onChange={(seleccion: string[]) => {
                console.log("Prod/Serv", seleccion);
                const final = detailData.map((detalle: any) => {
                  if (detalle.id === row.id) {
                    return {
                      ...detalle,
                      claveProdServ: seleccion,
                    };
                  }
                  return detalle;
                });
                setDetailData(final);
                console.log("FINAL", final);
              }}
              options={[
                {
                  label:
                    "85121800 - Laboratorios médicos (Servicios de análisis clínicos)",
                  value: "85121800",
                },
                {
                  label:
                    "85121811 - Servicios de laboratorios de detección del COVID",
                  value: "85121811",
                },
              ]}
            />
          </>
        );
      },
    },
    {
      dataIndex: "concepto",
      key: "concepto",
      title: "Concepto",
      width: "40%",
      className: "no-padding-cell",
      render: (value: any, row: any) => {
        return (
          <Row>
            <Col span={9}>
              <Select
                disabled={soloLectura}
                size="small"
                mode="multiple"
                showArrow={true}
                allowClear
                style={{ width: "100%" }}
                placeholder="Concepto"
                defaultValue={value}
                onChange={(seleccion: string[]) => {
                  const final = detailData.map((detalle: any) => {
                    if (detalle.id === row.id) {
                      return {
                        ...detalle,
                        concepto: seleccion.join("\n"),
                      };
                    }
                    return detalle;
                  });
                  setDetailData(final);
                }}
                options={allItems}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Form
                      form={formConcepts}
                      onFinish={(newFormValues: any) => {
                        setAllItems((allItems) => [
                          ...allItems,
                          {
                            label: newFormValues.alias,
                            value: newFormValues.descripcion,
                          },
                        ]);
                        formConcepts.resetFields();
                      }}
                    >
                      <Divider style={{ margin: "8px 0" }} />
                      <Space style={{ padding: "0 8px 4px" }}>
                        <Form.Item
                          name="alias"
                          style={{ margin: 0, padding: 0 }}
                          required
                        >
                          <Input placeholder="Alias" required />
                        </Form.Item>
                        <Form.Item
                          name="descripcion"
                          style={{ margin: 0, padding: 0 }}
                          required
                        >
                          <Input placeholder="Descripción" required />
                        </Form.Item>

                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            formConcepts.submit();
                          }}
                        >
                          Agregar
                        </Button>
                      </Space>
                    </Form>
                  </>
                )}
              />
            </Col>
            <Col span={15}>
              <TextArea
                value={value}
                autoSize
                bordered={false}
                onChange={(e: any) => {
                  const final = detailData.map((detalle: any) => {
                    if (detalle.id === row.id) {
                      return {
                        ...detalle,
                        concepto: e.target.value,
                      };
                    }
                    return detalle;
                  });
                  setDetailData(final);
                }}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      dataIndex: "cantidad",
      key: "cantidad",
      title: "Cantidad",
      width: "10%",
    },
    {
      dataIndex: "importe",
      key: "importe",
      title: "Importe final",
      width: "10%",
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      dataIndex: "quitar",
      key: "quitar",
      title: "Quitar",
      width: "2%",
      align: "center",
      render: (value, fullRow) => (
        <>
          {" "}
          {fullRow.redondeo ?? (
            <Button
              size="small"
              shape="circle"
              type="primary"
              icon={<MinusOutlined />}
              onClick={() => {
                const final = detailData.filter(
                  (detalle) => detalle.id !== fullRow.id
                );
                setDetailData(final);
              }}
            />
          )}
        </>
      ),
    },
  ];
  const columns: IColumns<IDetailInvoice> = [
    {
      key: "claveProdServ",
      dataIndex: "claveProdServ",
      title: "Clave Prod/Serv.",
      align: "center",
      width: "20%",
      render: (value, row) => {
        return (
          <>
            <Select
              showArrow={true}
              disabled={soloLectura}
              size="small"
              bordered={false}
              allowClear
              style={{ width: "100%" }}
              placeholder="Prod/Serv"
              defaultValue={value}
              onChange={(seleccion: string[]) => {
                console.log("Prod/Serv", seleccion);
                const final = detailData.map((detalle: any) => {
                  if (detalle.id === row.id) {
                    return {
                      ...detalle,
                      claveProdServ: seleccion,
                    };
                  }
                  return detalle;
                });
                setDetailData(final);
                console.log("FINAL", final);
              }}
              options={[
                {
                  label:
                    "85121800 - Laboratorios médicos (Servicios de análisis clínicos)",
                  value: "85121800",
                },
                {
                  label:
                    "85121811 - Servicios de laboratorios de detección del COVID",
                  value: "85121811",
                },
              ]}
            />
          </>
        );
      },
    },
    {
      key: "claveSolicitud",
      dataIndex: "solicitudClave",
      title: "Solicitud",
      align: "center",
    },
    {
      key: "clave",
      dataIndex: "clave",
      title: "Clave Estudio",
      align: "center",
    },
    {
      key: "nombre",
      dataIndex: "concepto",
      title: "Nombre del Estudio",
      align: "center",
    },
    {
      key: "importe",
      dataIndex: "importe",
      title: "Importe",
      align: "center",
      render(value, record, index) {
        return moneyFormatter.format(+value);
      },
    },
  ];
  const settingsOptions: IOptions[] = [
    { label: "Desglozado por estudio", value: "desglozado" },
    { label: "Simple", value: "simple" },
    { label: "Por concepto", value: "concepto" },
  ];
  const addDetail = (newFormValues: any) => {
    setDetailData((detailData) => [
      ...detailData,
      {
        id: uuid(),
        // concepto: ",
        importe: newFormValues.cantidad,
        cantidad: newFormValues.unidades,
      },
    ]);
    form.resetFields();
  };
  return (
    <>
      <Row>
        <Title level={5}>Detalle de la factura</Title>
      </Row>

      <Row justify="end" gutter={[0, 0]}>
        <Col span={21} style={{ margin: 0, padding: 0 }}>
          <Form
            {...formItemLayout}
            form={form}
            name="invoice"
            onFinish={addDetail}
            initialValues={{
              configuracion: "desglozado",
              cantidad: 0,
              iva: 16,
              unidades: 1,
            }}
          >
            <Row>
              <Col>
                <NumberInput
                  formProps={{
                    name: "cantidad",
                    label: "Cantidad",
                  }}
                  min={1}
                  formatter={(value) => {
                    return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }}
                  parser={(value) => {
                    const val = value!.replace(/\$\s?|(,*)/g, "");
                    return Number(val);
                  }}
                  required
                  // errors={errors.find((x) => x.name === "cantidad")?.errors}
                />
              </Col>
              <Col>
                <NumberInput
                  formProps={{ label: "Unidades", name: "unidades" }}
                  parser={(value) => {
                    const val = value!.replace(/\$\s?|(,*)/g, "");
                    return Number(val);
                  }}
                />
              </Col>
              <Col>
                <NumberInput
                  formProps={{ label: "IVA", name: "iva" }}
                  formatter={(value) => {
                    return Intl.NumberFormat("default", {
                      style: "percent",
                      minimumFractionDigits: 0,
                    }).format(value! / 100);
                  }}
                  required
                  // parser={(value) => {
                  //   const val = value!.replace(/\$\s?|(,*)/g, "");
                  //   return Number(val);
                  // }}
                />
              </Col>
              <Col span={3} style={{ textAlign: "center" }}>
                <div>
                  <Text>
                    IVA {iva}%: {moneyFormatter.format(ivaFinal)}{" "}
                  </Text>
                </div>
                <div>
                  <Text mark>Total: {moneyFormatter.format(cantidad)}</Text>
                </div>
              </Col>

              <Col span={4}>
                <Button
                  size="large"
                  shape="circle"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    form.submit();
                  }}
                />
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={3} style={{ margin: 0, padding: 0 }}>
          <Form {...formItemLayout} form={formRedondeo} name="invoice">
            <Form.Item name="redondeo" label="Redondeo">
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                size="default"
                disabled={!detailData.length}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form
            {...formItemLayout}
            form={formSetting}
            name="invoiceSetting"
            initialValues={{ configuracion: "desglozado" }}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  noStyle
                  name="configuracion"
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Radio.Group
                    options={settingsOptions}
                    disabled={id !== "new" || tipo === "free"}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Descriptions column={5} size="small" className="invoice-detail">
            <Descriptions.Item label="Documento">
              {id !== "new" ? invoice?.serie : serie}
            </Descriptions.Item>
            <Descriptions.Item label="Consecutivo">
              {id !== "new" ? invoice?.consecutivo : consecutiveBySerie}
            </Descriptions.Item>
            <Descriptions.Item label="Usuario">
              {profile?.nombre}
            </Descriptions.Item>
            <Descriptions.Item label="Fecha">
              {moment().format("L")}
            </Descriptions.Item>
            <Descriptions.Item label="Hora">{currentTime}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            size="small"
            bordered
            rowKey={(record) => record.id}
            pagination={false}
            dataSource={detailData}
            // rowClassName={"row-search"}
            className="header-expandable-table"
            columns={configuration === "desglozado" ? columns : detailColumns}
            summary={(pageData: any) => {
              return (
                <>
                  <Table.Summary fixed="top">
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        align="right"
                        colSpan={configuration === "desglozado" ? 4 : 3}
                      >
                        Total (Con IVA) :{" "}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center">
                        <Text> {moneyFormatter.format(totalFinal)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                </>
              );
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default observer(InvoiceFreeDetail);
