import {
  Button,
  Col,
  Dropdown,
  MenuProps,
  notification,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  IServicesCost,
  IServicesInvoice,
  IUpdateService,
  ServicesCost,
} from "../../../app/models/indicators";
import { useStore } from "../../../app/stores/store";
import CostosFijosColumns, {
  CostosFijosInvoice,
} from "../columnDefinition/costofijo";
import { DownOutlined } from "@ant-design/icons";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import { MenuInfo } from "rc-menu/lib/interface";
import alerts from "../../../app/util/alerts";
import { toJS } from "mobx";

type CostosFijosProps = {
  data: IServicesInvoice;
  loading: boolean;
};

const CostosFijos = ({ data, loading }: CostosFijosProps) => {
  const { optionStore, indicatorsStore } = useStore();
  const {
    setServicesCost,
    servicesCost,
    updateService,
    modalFilter,
    getServicesCost,
    services,
  } = indicatorsStore;
  const { servicesOptions, getServicesOptions } = optionStore;

  useEffect(() => {
    setServicesCost(services.servicios!);
    console.log(toJS(services.servicios));
    console.log("servicesCost", toJS(servicesCost));
  }, [services]);

  useEffect(() => {
    getServicesOptions();
  }, [getServicesOptions]);

  const convertToServiceInvoiceArray = (data: IServicesInvoice) => {
    let array: IServicesInvoice[] = [
      {
        totalMensual: data.totalMensual,
        totalSemanal: data.totalSemanal,
        totalDiario: data.totalDiario,
      },
    ];

    return array;
  };

  const handleMenuClick = (e: MenuInfo) => {
    let nameService = servicesOptions.find(
      (x) => x.key === Number(e.key)
    )?.value;

    let newService = new ServicesCost();
    newService.costoFijoId = Number(e.key);
    newService.identificador = uuid();
    newService.nombre = nameService as string;
    newService.costoFijo = 0;

    setServicesCost([...servicesCost, newService]);
  };

  const items: MenuProps["items"] = servicesOptions as ItemType[];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const openNotification = () => {
    alerts.warning(
      "Es necesario agregar una sucursal, una fecha y asignar un costo fijo mayor a 0"
    );
  };

  const onFinish = async () => {
    const serviceWithDataNull = servicesCost.find(
      (x) =>
        x.costoFijo === 0 || x.sucursales?.length === 0 || x.fechaAlta === null
    );

    if (serviceWithDataNull) {
      openNotification();
      return;
    }

    let newService: IUpdateService = {
      servicios: servicesCost,
      filtros: modalFilter,
    };
    alerts.confirm(
      "Guardar costos fijos",
      "¿Estás seguro de guardar los cambios?",
      async () => {
        await updateService(newService);
        await getServicesCost(modalFilter);
      }
    );
  };

  return (
    <Row gutter={[0, 12]} justify="space-between">
      <Col span={12} style={{ marginTop: 12 }}>
        <Tag color="blue" className="table-tag">
          Costo Fijo actual: {data?.totalMensual ? data.totalMensual : 0}
        </Tag>
      </Col>
      <Col span={12} style={{ marginTop: 12, textAlign: "right" }}>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              Agregar servicio
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
        <Button type="primary" onClick={() => onFinish()}>
          Guardar
        </Button>
      </Col>
      <Col span={24}>
        <Table<IServicesCost>
          loading={loading}
          size="small"
          rowKey={uuid()}
          columns={CostosFijosColumns()}
          pagination={false}
          dataSource={services.servicios! as IServicesCost[]}
          scroll={{ y: 500 }}
          bordered
          rowClassName={"row-search"}
        />
      </Col>
      <Col span={24}>
        <Table<IServicesInvoice>
          loading={loading}
          size="small"
          rowKey={uuid()}
          columns={CostosFijosInvoice()}
          pagination={false}
          dataSource={convertToServiceInvoiceArray(data)}
          scroll={{ y: 500 }}
          bordered
          rowClassName={"row-search"}
        />
      </Col>
    </Row>
  );
};

export default observer(CostosFijos);
