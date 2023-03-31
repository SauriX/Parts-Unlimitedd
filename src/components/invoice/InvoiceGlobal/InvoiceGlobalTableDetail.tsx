import { Button, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { IColumns } from "../../../app/common/table/utils";
import { useStore } from "../../../app/stores/store";
import { moneyFormatter } from "../../../app/util/utils";
import { DeleteOutlined } from "@ant-design/icons";
import InvoiceGlobalCancelModal from "./InvoiceGlobalCancelModal";
import { useNavigate } from "react-router-dom";
const { Text, Link } = Typography;

type InvoiceGlobalTableProps = {
  indice: number;
  facturas: any[];
  sucursal: string;
};

const InvoiceGlobalTable = ({
  indice,
  facturas,
  sucursal,
}: InvoiceGlobalTableProps) => {
  const { modalStore } = useStore();
  const { openModal } = modalStore;
  const navigate = useNavigate();
  const columns: IColumns<any> = [
    {
      key: "id",
      dataIndex: "clave",
      title: "Clave de factura",
      align: "left",
      width: "15%",
      render: (_, fullRow) => {
        return (
          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Link
                onClick={() => {
                  navigate(`/invoice/request/${fullRow.facturapiId}`);
                }}
              >
                {fullRow?.serie}-{fullRow?.consecutivo}
              </Link>
              <span>
                <small>
                  <Text type="secondary">
                    <Text
                      strong
                      type={
                        fullRow.estatus.nombre === "Cancelado"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {`(${fullRow.estatus?.clave})`}
                    </Text>
                  </Text>
                </small>
              </span>
            </div>
          </>
        );
      },
    },
    {
      key: "id",
      dataIndex: "nombre",
      title: "Nombre",
      align: "center",
      width: "15%",
    },
    {
      key: "id",
      dataIndex: "formaPago",
      title: "Forma de pago",
      align: "center",
      width: "15%",
    },
    {
      key: "id",
      dataIndex: "cantidadTotal",
      title: "Monto",
      align: "center",
      width: "15%",
      render: (value) => `${moneyFormatter.format(value)}`,
    },
    {
      key: "id",
      dataIndex: "nombreSucursal",
      title: "Sucursal",
      align: "center",
      width: "15%",
      render: () => sucursal,
    },
    {
      key: "id",
      dataIndex: "fechaCreo",
      title: "Hora/Usuario",
      align: "center",
      width: "15%",
      render: (_, fullRow) => {
        return (
          <>
            <Text>{fullRow.fechaCreo}</Text>
          </>
        );
      },
    },
    {
      key: "id",
      dataIndex: "facturapiId",
      title: "Cancelar",
      align: "center",
      width: "15%",
      render: (facturapiId, fullRow) => {
        return (
          <>
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                openModal({
                  title: `Cancelar factura ${fullRow?.serie}-${fullRow?.consecutivo}`,
                  body: (
                    <InvoiceGlobalCancelModal
                      facturapiId={fullRow.facturapiId}
                    />
                  ),
                });
              }}
              disabled={fullRow.estatus.nombre === "Cancelado"}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table
        bordered
        rowKey={(record) => record.facturaId}
        columns={columns}
        pagination={false}
        dataSource={facturas}
        showHeader={indice === 0}
      ></Table>
    </>
  );
};

export default observer(InvoiceGlobalTable);
