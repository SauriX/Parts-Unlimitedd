import { Button, Divider, Table } from "antd";
import { observer } from "mobx-react-lite";
import {
  getDefaultColumnProps,
  IColumns,
} from "../../../app/common/table/utils";
import { IRequestInfo } from "../../../app/models/request";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { useNavigate } from "react-router-dom";
import { moneyFormatter } from "../../../app/util/utils";
import views from "../../../app/util/view";

type ProceedingRequestsProps = {
  loading: boolean;
  printing: boolean;
  requests: IRequestInfo[];
};

const ProceedingRequests = ({
  loading,
  printing,
  requests,
}: ProceedingRequestsProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigate = useNavigate();
  const columns: IColumns<IRequestInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        width: 150,
      }),
      render: (value, item) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            type="link"
            onClick={() => {
              navigate(
                `/${views.request}/${item.expedienteId}/${item.solicitudId}`
              );
            }}
          >
            {value}
          </Button>

          <small>{item.clavePatologica}</small>
        </div>
      ),
    },
    {
      ...getDefaultColumnProps("afiliacion", "Afiliación", {
        width: 180,
      }),
    },
    {
      ...getDefaultColumnProps("paciente", "Paciente", {
        width: 240,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("compañia", "Compañia", {
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("procedencia", "Procedencia", {
        width: 180,
      }),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      ...getDefaultColumnProps("importe", "Importe", {
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("descuento", "Descuento", {
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("total", "Total", {
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("saldo", "Saldo", {
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
  ];
  return (
    <>
      <Divider orientation="left">Solicitud</Divider>
      <Table<IRequestInfo>
        rowKey={(record) => record.solicitudId}
        loading={loading || printing}
        size="small"
        columns={columns}
        dataSource={[...requests]}
        /*    pagination={defaultPaginationProperties} */
        sticky
        scroll={{
          x: windowWidth < resizeWidth ? "max-content" : "auto",
        }}
      />
    </>
  );
};

export default observer(ProceedingRequests);
