import { Button, Divider, Table, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import IconButton from "../../../app/common/button/IconButton";
import {
  getDefaultColumnProps,
  IColumns,
} from "../../../app/common/table/utils";
import { IAppointmentList } from "../../../app/models/appointmen";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import views from "../../../app/util/view";
import { useStore } from "../../../app/stores/store";
import moment from "moment";

type ProceedingAppointmentsProps = {
  loading: boolean;
  printing: boolean;
  readonly: boolean;
  citas: IAppointmentList[];
  convertSolicitud: any;
};
const ProceedingAppointments = ({
  loading,
  printing,
  readonly,
  citas,
  convertSolicitud,
}: ProceedingAppointmentsProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigate = useNavigate();
  const { appointmentStore } = useStore();
  const { getByIdDom, getByIdLab } = appointmentStore;
  const columnsC: IColumns<any> = [
    {
      ...getDefaultColumnProps("noSolicitud", "Solicitud de cita", {
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (_value, _item) => (
        <div></div>
        /*         <Link
                  draggable
          onDragStart={() => {
            SetCita(item);
          }} 
        >
          {value}
        </Link> */
      ),
    },
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
    },
    {
      ...getDefaultColumnProps("direccion", "Dirección", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value) => <Tooltip title={value}>{value}</Tooltip>,
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("info", "Datos", {
        width: "15%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (_, data) => (
        <div>{`${data.edad} años, ${data.sexo.substring(0, 1)}`}</div>
      ),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value, item) => (
        <IconButton
          title="Editar cita"
          icon={<EditOutlined />}
          disabled={readonly}
          onClick={() => {
            navigate(
              `/${views.appointment}/${value}?type=${item.type}&mode=edit`
            );
          }}
        />
      ),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (_value, item) => (
        <Button
          type="primary"
          title=""
          disabled={readonly}
          onClick={async () => {
            if (item.type == "laboratorio") {
              // const convert: IConvertToRequest = {
              //   id: item.id,
              //   type: "Laboratorio",
              // };
              // convertirASolicitud(convert);
              var citas = await getByIdLab(item.id);
              convertSolicitud(citas!);
            } else {
              // const convert: IConvertToRequest = {
              //   id: item.id,
              //   type: "Dom",
              // };
              // convertirASolicitud(convert);
              var citas = await getByIdDom(item.id);
              convertSolicitud(citas!);
            }
          }}
        >
          Convertir a solicitud
        </Button>
      ),
    },
  ];
  return (
    <>
      <Divider orientation="left">Cita</Divider>
      <Table<any>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columnsC}
        dataSource={citas}
        sticky
        scroll={{
          x: windowWidth < resizeWidth ? "max-content" : "auto",
        }}
      />
    </>
  );
};

export default observer(ProceedingAppointments);
