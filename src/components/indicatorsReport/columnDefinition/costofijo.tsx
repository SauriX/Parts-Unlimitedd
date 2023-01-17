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
  IServicesInvoice,
} from "../../../app/models/indicators";
import { CheckOutlined } from "@ant-design/icons";
import { formItemLayout, moneyFormatter } from "../../../app/util/utils";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import moment from "moment";

const CostosFijosColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const { indicatorsStore, optionStore } = useStore();
  const { modalFilter, updateService, getServicesCost,  } = indicatorsStore;
  const { branchCityOptions } = optionStore;

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IOptions[]>([]);

  useEffect(() => {
    setBranches(branchCityOptions.flatMap((x) => x.options ?? []));
  }, [branchCityOptions]);

  const onFinish = async (service: IServicesCost) => {
    setLoading(true);

    if (!service) {
      alerts.warning("Servicio invalido");
      setLoading(false);
      return;
    }

    await updateService(service);
    await getServicesCost(modalFilter);

    setLoading(false);
  };

  const columns: IColumns<IServicesCost> = [
    {
      ...getDefaultColumnProps("costoFijo", "Costo Fijo", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (text: string, record: IServicesCost) => {
        return (
          <ServiceCostInput
            loading={loading}
            defaultValue={record}
            onFinish={(service) => onFinish(service)}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("nombre", "Servicio", {
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
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },
  ];
  return columns;
};

export const CostosFijosInvoice = () => {
  const invoiceColumns: IColumns<IServicesInvoice> = [
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

  return invoiceColumns;
};

export default CostosFijosColumns;

type ServiceCostInputProps = {
  defaultValue: IServicesCost;
  onFinish: (service: IServicesCost) => void;
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
        name="service"
        initialValues={defaultValue}
        onFinish={(values) => {
          console.log(values);
          onFinish({ ...defaultValue, costoFijo: values.costoFijo });
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
