import { Col, Descriptions, Row, Table, Typography } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import { IColumns } from "../../../../app/common/table/utils";
import { useStore } from "../../../../app/stores/store";
import { moneyFormatter } from "../../../../app/util/utils";

const { Title, Text } = Typography;
type InvoiceCompanyDetailProps = {
  estudios: any[];
  totalEstudios: number;
};
const InvoiceCompanyDetail = ({
  estudios,
  totalEstudios,
}: InvoiceCompanyDetailProps) => {
  const { invoiceCompanyStore, profileStore } = useStore();
  const { selectedRows, serie, consecutiveBySerie } = invoiceCompanyStore;
  const { profile } = profileStore;

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
  return (
    <>
      <Row>
        <Title level={5}>Detalle de la factura</Title>
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
            dataSource={estudios}
            rowClassName={"row-search"}
            className="header-expandable-table"
            columns={columns}
            summary={(pageData: any) => {
              return (
                <>
                  <Table.Summary fixed="top">
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} align="right" colSpan={3}>
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
