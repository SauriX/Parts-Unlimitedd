import { Button, Col, Row, Table, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../app/common/table/utils";
import { moneyFormatter } from "../../app/util/utils";
import { SendOutlined, DollarOutlined } from "@ant-design/icons";

const CreditMonitoringTable = () => {
  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "documento",
      title: "Documento",
      align: "left",
      //   width: "15%",
    },
    {
      key: "id",
      dataIndex: "cliente",
      title: "Cliente",
      align: "center",
      //   width: "15%",
    },
    {
      key: "id",
      dataIndex: "fechaCreacion",
      title: "Fecha Creación",
      align: "center",
      //   width: "15%",
    },
    {
      key: "id",
      dataIndex: "fechaLimite",
      title: "Fecha límite crédito",
      align: "center",
      //   width: "15%",
    },
    {
      key: "id",
      dataIndex: "monto",
      title: "Monto",
      align: "center",
      //   width: "15%",
      render: (value: any) => `${moneyFormatter.format(value)} `,
    },
    {
      key: "id",
      dataIndex: "montoPagado",
      title: "Monto pagado",
      align: "center",
      //   width: "15%",
      render: (value: any) => `${moneyFormatter.format(value)} `,
    },
    {
      key: "id",
      dataIndex: "saldo",
      title: "Saldo",
      align: "center",
      //   width: "15%",
      render: (value: any) => `${moneyFormatter.format(value)} `,
    },
    {
      key: "id",
      dataIndex: "estatus",
      title: "Estatus",
      align: "center",
      //   width: "15%",
    },
    {
      key: "id",
      dataIndex: "acciones",
      title: "Acciones",
      align: "center",
      width: "5%",
      render: (value: any) => (
        <>
          <Row justify="center">
            <Col span={12}>
              <Tooltip title="Enviar">
                <Button
                  shape="circle"
                  size="middle"
                  icon={<SendOutlined></SendOutlined>}
                ></Button>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip title="Registrar">
                <Button
                  shape="circle"
                  size="middle"
                  icon={<DollarOutlined></DollarOutlined>}
                ></Button>
              </Tooltip>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  const dummyData: any = [
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
    {
      documento: "MT201",
      cliente: "GNP",
      fechaCreacion: "25/09/22",
      fechaLimite: "27/09/22",
      monto: 500,
      montoPagado: 200,
      saldo: 300,
      estatus: "vigente",
    },
  ];
  return (
    <>
      <Table<any>
        bordered
        columns={columns}
        pagination={false}
        loading={false}
        dataSource={dummyData}
        rowClassName="row-search"
        rowSelection={{
          type: "checkbox",
        }}
      ></Table>
    </>
  );
};

export default observer(CreditMonitoringTable);
