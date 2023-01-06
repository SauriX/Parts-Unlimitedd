import { Button, Form, Input, InputNumber, Spin, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IColumns } from "../../app/common/table/utils";
import { CheckOutlined } from "@ant-design/icons";
import {
  IReportIndicators,
  IndicatorsFormValues,
} from "../../app/models/indicators";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";
import alerts from "../../app/util/alerts";
import { IOptions } from "../../app/models/shared";
import moment from "moment";

type IndicatorsProps = {
  data: IReportIndicators[];
};

const IndicatorsTable = ({ data }: IndicatorsProps) => {
  const { indicatorsStore, optionStore } = useStore();
  const { filter, getForm } = indicatorsStore;
  const { branchCityOptions } = optionStore;

  const [columns, setColumns] = useState<IColumns>([]);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IOptions[]>([]);

  useEffect(() => {
    setBranches(branchCityOptions.flatMap((x) => x.options ?? []));
  }, [branchCityOptions]);

  const onFinish = async (branchName: string, budget: number) => {
    setLoading(true);

    const branchId = branches.find((x) => x.label === branchName)?.value;
    if (!branchId) {
      alerts.warning("Sucursal invalida");
      return;
    }

    const indicator = {
      sucursalId: branchId as string,
      costoReactivo: budget,
      fechaAlta: moment(filter.fechaIndividual).utcOffset(0, true),
    };
    if (indicator) {
      getForm(indicator);
    }
    console.log(indicator);

    setLoading(false);
  };

  useEffect(() => {
    if (data.length > 0) {
      setColumns(
        Object.keys(data[0]).map((x) => ({
          key: x,
          dataIndex: x,
          title: x,
          render: (value, record: any) => {
            if (record.Nombre === "COSTO REACTIVO" && x !== "Nombre") {
              return (
                <BudgetInput
                  loading={loading}
                  defaultValue={record[x]}
                  onFinish={(budget) => onFinish(x, budget)}
                />
              );
            }
            return value;
          },
        }))
      );
    }
  }, [data]);

  return <Table<any> columns={columns} dataSource={data} />;
};

export default observer(IndicatorsTable);

type BudgetInputProps = {
  defaultValue: number;
  onFinish: (budget: number) => void;
  loading: boolean;
};

const BudgetInput = ({ defaultValue, onFinish, loading }: BudgetInputProps) => {
  const [form] = Form.useForm<IReportIndicators>();

  return (
    <Spin spinning={loading}>
      <Form<IReportIndicators>
        {...formItemLayout}
        form={form}
        name="indicators"
        initialValues={{ costoReactivo: defaultValue }}
        onFinish={(values) => {
          console.log(values);
          onFinish(values.costoReactivo);
        }}
        scrollToFirstError
      >
        <Form.Item className="no-error-text" help="">
          <Input.Group compact>
            <Form.Item name={"costoReactivo"} className="no-error-text">
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