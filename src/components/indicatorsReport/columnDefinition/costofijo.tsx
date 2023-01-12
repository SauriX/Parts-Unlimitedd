import { Form, Spin, Input, InputNumber, Button } from "antd";
import React, { useEffect, useState } from "react";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../app/common/table/utils";
import {
  IModalInvoice,
  IReportIndicators,
  IServicesCost,
} from "../../../app/models/indicators";
import { CheckOutlined } from "@ant-design/icons";
import { formItemLayout, moneyFormatter } from "../../../app/util/utils";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import moment from "moment";

let widthColumns = 100 / 3;

const CostosFijosColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const { indicatorsStore, optionStore } = useStore();
  const { filter, updateService, loadingReport } = indicatorsStore;
  const { branchCityOptions } = optionStore;

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IOptions[]>([]);

  useEffect(() => {
    setBranches(branchCityOptions.flatMap((x) => x.options ?? []));
  }, [branchCityOptions]);

  const onFinish = async (serviceId: number, serviceCost: number) => {
    setLoading(true);

    if (!serviceId) {
      alerts.warning("Servicio invalido");
      return;
    }

    const service = {
      id: serviceId,
      costoFijo: serviceCost,
      fechaAlta: moment(filter.fechaIndividual).utcOffset(0, true),
    };
    
    if (service) {
      updateService(service);
    }
    
    setLoading(false);
  };

  const columns: IColumns<IServicesCost> = [
    {
      ...getDefaultColumnProps("costoFijo", "Costo Fijo", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (text: string, record: any) => {
        return (
          <ServiceCostInput
            loading={loading}
            defaultValue={record.costoToma}
            onFinish={(id, service) => onFinish(id, service)}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("servicio", "Servicio", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("fechaAlta", "Fecha Alta", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
  ];
  return columns;
};

const CostosFijosInvoice = () => {
  const invoiceColumns: IColumns<IModalInvoice> = [
    {
      ...getDefaultColumnProps("totalMensual", "Total Mensual", {
        width: "33%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalSemanal", "Total Semanal", {
        width: "33%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("totalDiario", "Total Diario", {
        width: "33%",
      }),
      render: (value) => moneyFormatter.format(value),
    },
  ];
  
  return invoiceColumns
};

export {CostosFijosColumns, CostosFijosInvoice};

type ServiceCostInputProps = {
  defaultValue: number;
  onFinish: (id: number, service: number) => void;
  loading: boolean;
};

const ServiceCostInput = ({
  defaultValue,
  onFinish,
  loading,
}: ServiceCostInputProps) => {
  const [form] = Form.useForm<IServicesCost>();

  return (
    <Spin spinning={loading}>
      <Form<IServicesCost>
        {...formItemLayout}
        form={form}
        name="samples"
        initialValues={{ costoFijo: defaultValue }}
        onFinish={(values) => {
          console.log(values);
          onFinish(values.id!, values.costoFijo);
        }}
        scrollToFirstError
      >
        <Form.Item className="no-error-text" help="">
          <Input.Group compact>
            <Form.Item name={"costoFijo"} className="no-error-text">
              <InputNumber min={0} bordered={false} />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              <CheckOutlined style={{ color: "white" }} />
            </Button>
          </Input.Group>
        </Form.Item>
      </Form>
    </Spin>
  );
};
