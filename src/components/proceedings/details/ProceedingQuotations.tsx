import { Button, Col, Divider, Row, Table, Tag } from "antd";
import { observer } from "mobx-react-lite";
import {
  getDefaultColumnProps,
  IColumns,
} from "../../../app/common/table/utils";
import { IQuotationInfo } from "../../../app/models/quotation";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { useNavigate } from "react-router-dom";
import views from "../../../app/util/view";
import IconButton from "../../../app/common/button/IconButton";
import { EditOutlined } from "@ant-design/icons";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";

type ProceedingQuotationsProps = {
  loading: boolean;
  printing: boolean;
  readonly: boolean;
  searchParams: any;
};
const ProceedingQuotations = ({
  loading,
  printing,
  readonly,
  searchParams,
}: ProceedingQuotationsProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const navigate = useNavigate();
  const { requestStore, quotationStore } = useStore();
  const { getQuotations, quotations, convertToRequest, cancelQuotation } =
    quotationStore;
  const { getRequests: getByFilter } = requestStore;

  useEffect(()=>{
    const readQuotation = async()=>{
      await getQuotations(searchParams);
    } 
    if(searchParams){
      readQuotation();
    }
  },[getQuotations]);
  const columnsP: IColumns<IQuotationInfo> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, cotizacion) => (
        <Button
          type="link"
          onClick={() => {
            navigate(
              `/${views.quotation}/${cotizacion.cotizacionId}?${searchParams}&mode=readonly`
            );
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("paciente", "Nombre del paciente", {
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    // {
    //   ...getDefaultColumnProps("estudios", "Estudios", {
    //     width: 150,
    //     minWidth: 150,
    //     windowSize: windowWidth,
    //   }),
    //   render: (value, record, index) => (
    //     <Row align="middle">
    //       {value.map((x: any, i: any) => (
    //         <Col
    //           key={x.clave + "-" + x.id}
    //           style={{ display: "flex", alignItems: "center" }}
    //         >
    //           <ContainerBadge color={"grey"} text={x.clave} />
    //         </Col>
    //       ))}
    //     </Row>
    //   ),
    // },
    {
      ...getDefaultColumnProps("correo", "Email", {
        width: 150,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("whatsapp", "Whatsapp", {
        width: 100,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },

    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        width: 100,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },

    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: 200,
      render: (_value, cotizacion) => (
        <IconButton
          disabled={readonly}
          title="Editar Expediente"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(
              `/${views.quotation}/${cotizacion.cotizacionId}?${searchParams}&mode=edit`
            );
          }}
        />
      ),
    },
    {
      key: "convertir",
      dataIndex: "id",
      title: "Convertir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (_value, item) => (
        <Button
          type="primary"
          title=""
          onClick={async () => {
            await convertToRequest(item.cotizacionId);
            await cancelQuotation(item.cotizacionId);
            await getByFilter({
              expediente: item?.expediente,
            });
            await getQuotations({
              expediente: item?.expediente,
            });
          }}
          disabled={!item?.activo}
        >
          Convertir a solicitud
        </Button>
      ),
    },
  ];
  return (
    <>
      <Divider orientation="left">Presupuestos</Divider>
      <Table<IQuotationInfo>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.clave}
        columns={columnsP}
        dataSource={quotations}
        /*    pagination={defaultPaginationProperties} */
        sticky
        scroll={{
          x: windowWidth < resizeWidth ? "max-content" : "auto",
        }}
      />
    </>
  );
};
const ContainerBadge = ({ color, text }: { color: string; text?: string }) => {
  return <Tag color={color}>{text}</Tag>;
};
export default observer(ProceedingQuotations);
