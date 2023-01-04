import { Button, Form, Input, InputNumber, Table } from "antd";
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

type IndicatorsProps = {
  data: IReportIndicators[];
};

const IndicatorsTable = ({ data }: IndicatorsProps) => {
  const { indicatorsStore } = useStore();
  const { create, update } = indicatorsStore;

  const [values, setValues] = useState<IReportIndicators>(
    new IndicatorsFormValues()
  );
  const [form] = Form.useForm<IReportIndicators>();
  const [columns, setColumns] = useState<IColumns>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.length > 0) {
      setColumns(
        Object.keys(data[0]).map((x) => ({
          key: x,
          dataIndex: x,
          title: x,
          render: (value, record: any) => {
            if (record.Nombre === "COSTO REACTIVO" && x !== "Nombre") {
              const onFinish = async (newValues: IReportIndicators) => {
                setLoading(true);

                const indicator = { ...values, ...newValues };
                if (!indicator.id) {
                  await create(indicator);
                } else {
                  await update(indicator);
                }

                setLoading(false);
              };

              return (
                <Form<IReportIndicators>
                  {...formItemLayout}
                  form={form}
                  name="loyalty"
                  initialValues={values}
                  onFinish={onFinish}
                  scrollToFirstError
                >
                  <Form.Item className="no-error-text" help="">
                    <Input.Group compact>
                      <InputNumber
                        min={0}
                        bordered={false}
                        onPressEnter={() => {
                          form.submit();
                        }}
                      />
                      <Button
                        type="primary"
                        onClick={() => {
                          form.submit();
                        }}
                      >
                        <CheckOutlined style={{ color: "white" }} />
                      </Button>
                    </Input.Group>
                  </Form.Item>
                </Form>
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
