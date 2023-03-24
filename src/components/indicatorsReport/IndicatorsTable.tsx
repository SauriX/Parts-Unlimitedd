import { Button, Form, Input, InputNumber, Spin, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IColumns } from "../../app/common/table/utils";
import { CheckOutlined } from "@ant-design/icons";
import { IReportIndicators } from "../../app/models/indicators";
import { useStore } from "../../app/stores/store";
import { formItemLayout } from "../../app/util/utils";
import alerts from "../../app/util/alerts";
import { IOptions } from "../../app/models/shared";
import moment from "moment";
import { pickerType } from "../../app/util/catalogs";

type IndicatorsProps = {
  data: IReportIndicators[];
};

const IndicatorsTable = ({ data }: IndicatorsProps) => {
  const { indicatorsStore, optionStore } = useStore();
  const { filter, getForm, loadingReport, getByFilter, datePickerType } =
    indicatorsStore;
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
      await getByFilter(filter);
    }

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
            if (record.NOMBRE === "COSTO REACTIVO" && x !== "NOMBRE") {
              return (
                <BudgetInput
                  loading={loading}
                  datePickerType={datePickerType}
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

  return (
    <Table<any> columns={columns} dataSource={data} loading={loadingReport} />
  );
};

export default observer(IndicatorsTable);

type BudgetInputProps = {
  defaultValue: number;
  onFinish: (budget: number) => void;
  loading: boolean;
  datePickerType: pickerType;
};

const BudgetInput = ({
  defaultValue,
  onFinish,
  loading,
  datePickerType,
}: BudgetInputProps) => {
  const [form] = Form.useForm<IReportIndicators>();

  return (
    <Spin spinning={loading}>
      <Form<IReportIndicators>
        {...formItemLayout}
        form={form}
        name="indicators"
        initialValues={{ costoReactivo: defaultValue }}
        onFinish={(values) => {
          onFinish(values.costoReactivo);
        }}
        scrollToFirstError
        disabled={datePickerType === "week" || datePickerType === "month"}
      >
        <Form.Item className="no-error-text" help="">
          <Input.Group compact>
            <Form.Item name={"costoReactivo"} className="no-error-text">
              <InputNumber min={0} bordered={false} />
            </Form.Item>
            {(datePickerType === "date" && (
                <Button type="primary" htmlType="submit">
                  <CheckOutlined style={{ color: "white" }} />
                </Button>
              ))}
          </Input.Group>
        </Form.Item>
      </Form>
    </Spin>
  );
};
