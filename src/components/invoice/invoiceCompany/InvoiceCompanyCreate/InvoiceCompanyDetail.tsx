import {
  Col,
  Descriptions,
  Dropdown,
  Form,
  Radio,
  Row,
  Space,
  Table,
  Typography,
  MenuProps,
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { IColumns } from "../../../../app/common/table/utils";
import { IOptions } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import { moneyFormatter } from "../../../../app/util/utils";
import { DownOutlined } from "@ant-design/icons";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { IRequest } from "../../../../app/models/request";
import TextArea from "antd/lib/input/TextArea";
import { v4 as uuid } from "uuid";
import { IBranchInfo } from "../../../../app/models/branch";
import { ICompanyForm } from "../../../../app/models/company";
import branch from "../../../../app/api/branch";

const { Title, Text } = Typography;
type InvoiceCompanyDetailProps = {
  estudios: any[];
  totalEstudios: number;
};

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const settingsOptions: IOptions[] = [
  { label: "Desglozado por estudio", value: "desglozado" },
  { label: "Simple", value: "simple" },
  { label: "Por concepto", value: "concepto" },
];
type ItemTypeExt = ItemType & {
  key: string;
  disabled?: boolean;
  description?: string;
};
interface MenuPropsExt extends MenuProps {
  items: ItemTypeExt[];
}

interface IDetailInvoice {
  id: string;
  concepto: string;
  cantidad: number;
  precioFinal: number;
}
const InvoiceCompanyDetail = ({
  estudios,
  totalEstudios,
}: InvoiceCompanyDetailProps) => {
  const { invoiceCompanyStore, profileStore, requestStore, branchStore } =
    useStore();
  const { getById } = branchStore;
  const { selectedRows, serie, consecutiveBySerie } = invoiceCompanyStore;
  const { studies } = requestStore;
  const { profile } = profileStore;
  const [form] = Form.useForm<any>();

  const configuration = Form.useWatch("configuracion", form);
  const items: MenuPropsExt["items"] = [
    {
      label: "Sucursal",
      key: "branch",
      description: "ESTUDIOS DE LABORATORIO REALIZADOS EN SUCURSAL [branch]",
    },
    {
      label: "Paciente",
      key: "patient",
      description: "PACIENTE: [patient]",
    },
    {
      label: "Copago",
      key: "cup",
      description: "COPAGO TOTAL [total]",
      disabled: configuration === "company" ? false : true,
    },
    {
      label: "Consulta",
      key: "simple",
      description: "CONSULTA MEDICA",
    },
  ];

  const [avDetailType, setAvDetailType] = useState(settingsOptions);
  const [currentTime, setCurrentTime] = useState<string>();
  const [conceptItems, setConceptItems] = useState<ItemTypeExt[]>(items);
  const [detailData, setDetailData] = useState<IDetailInvoice[]>([]);
  const [simpleConcept, setSimpleConcept] = useState("");
  const [request, setRequest] = useState<IRequest>();
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
    if (configuration === "simple") {
      setSimpleConcept("ANALISIS CLINICOS");
      setDetailData([
        {
          id: uuid(),
          concepto: "ANALISIS CLINICOS",
          precioFinal: totalEstudios,
          cantidad: 1,
        },
      ]);
    } else {
      setSimpleConcept("");
      setDetailData([
        { id: uuid(), concepto: "", precioFinal: totalEstudios, cantidad: 1 },
      ]);
    }
  }, [configuration]);

  const detailColumns: IColumns<IDetailInvoice> = [
    {
      dataIndex: "concepto",
      key: "concepto",
      title: "Concepto",
      width: "60%",
      className: "no-padding-cell",
      render: (value) => {
        if (configuration === "desglozado") return value;
        return (
          <TextArea
            value={simpleConcept}
            autoSize
            bordered={false}
            onChange={(e) => setSimpleConcept(e.target.value)}
          />
        );
      },
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
  const columns: IColumns<any> = [
    {
      key: "claveSolicitud",
      dataIndex: "claveSolicitud",
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
      dataIndex: "estudio",
      title: "Nombre del Estudio",
      align: "center",
    },
    {
      key: "id",
      dataIndex: "precioFinal",
      title: "Importe",
      align: "center",
      render(value, record, index) {
        return moneyFormatter.format(+value);
      },
    },
  ];
  const onClick: MenuProps["onClick"] = async ({ key }) => {
    console.log("CAMBIO DE CONCEPTO", key);
    const item = conceptItems.find((x) => x.key === key);
    const initial = simpleConcept.length === 0 ? "" : simpleConcept + "\n";

    // if (!request) return;

    let newText = "";

    if (key === "branch") {
      const branch = await getById(profile?.sucursal!);
      newText =
        initial + item?.description?.replace("[branch]", branch?.nombre!);
    } else if (key === "patient") {
      newText = initial + item?.description?.replace("[patient]", "");
    } else if (key === "cup") {
      newText =
        initial +
        item?.description?.replace(
          "[total]",
          moneyFormatter.format(
            studies.reduce((acc, obj) => acc + (obj.copago ?? 0), 0)
          )
        );
    } else {
      newText = initial + item?.description;
    }

    setSimpleConcept(newText);
  };
  return (
    <>
      <Row>
        <Title level={5}>Detalle de la factura</Title>
      </Row>
      <Row>
        <Col span={24}>
          <Form
            {...formItemLayout}
            form={form}
            name="invoice"
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
                  <Radio.Group options={avDetailType} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span={20}>
          <Descriptions column={5} size="small" className="invoice-detail">
            <Descriptions.Item label="Documento">{serie}</Descriptions.Item>
            <Descriptions.Item label="Consecutivo">
              {consecutiveBySerie}
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
        <Col span={20}>
          <Table
            size="small"
            bordered
            pagination={false}
            dataSource={configuration === "desglozado" ? estudios : detailData}
            rowClassName={"row-search"}
            className="header-expandable-table"
            columns={configuration === "desglozado" ? columns : detailColumns}
            title={() => (
              <Row>
                {/* <Col span={12}>Detalle</Col> */}
                {configuration === "concepto" && (
                  <Col span={24} style={{ textAlign: "right" }}>
                    <Dropdown menu={{ items: items, onClick }}>
                      <a href="/#" onClick={(e) => e.preventDefault()}>
                        <Space>
                          Agregar concepto
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  </Col>
                )}
              </Row>
            )}
            summary={(pageData: any) => {
              return (
                <>
                  <Table.Summary fixed="top">
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        index={0}
                        align="right"
                        colSpan={configuration === "desglozado" ? 3 : 2}
                      >
                        Total (Con IVA) :{" "}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} align="center">
                        <Text> {moneyFormatter.format(totalEstudios)}</Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                </>
              );
            }}
          ></Table>
        </Col>
      </Row>
    </>
  );
};

export default observer(InvoiceCompanyDetail);
