import { Form, Spin, Input, InputNumber, Button } from "antd";
import { useEffect, useState } from "react";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { ISamplesCost } from "../../../app/models/indicators";
import { formItemLayout } from "../../../app/util/utils";
import { CheckOutlined } from "@ant-design/icons";
import moment from "moment";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";

const CostoTomaColumns = () => {
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const { indicatorsStore, optionStore } = useStore();
  const {
    updateSample,
    modalFilter,
    getSamplesCostsByFilter,
    getByFilter,
    filter,
  } = indicatorsStore;
  const { branchCityOptions } = optionStore;

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IOptions[]>([]);

  useEffect(() => {
    setBranches(branchCityOptions.flatMap((x) => x.options ?? []));
  }, [branchCityOptions]);

  const onFinish = async (sample: ISamplesCost) => {
    setLoading(true);

    if (!sample) {
      alerts.warning("Sucursal invalida");
      setLoading(false);
      return;
    }

    await updateSample(sample);
    await getSamplesCostsByFilter(modalFilter);
    await getByFilter(filter);

    setLoading(false);
  };

  const columns: IColumns<ISamplesCost> = [
    {
      ...getDefaultColumnProps("costoToma", "Costo Toma", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (text: string, record: ISamplesCost) => {
        return (
          <SampleCostInput
            loading={loading}
            defaultValue={record}
            onFinish={(sample) => onFinish(sample)}
          />
        );
      },
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
      render: (text: string, record: any) => {
        return moment(record.fechaAlta).format("DD/MM/YYYY");
      },
    },
    {
      ...getDefaultColumnProps("aplica", "Aplica para", {
        searchState,
        setSearchState,
        width: "25%",
      }),
      render: (text: string, record: ISamplesCost) => {
        let aplicaText = record.aplica.slice(1);
        return `${record.aplica.charAt(0).toUpperCase()}${aplicaText}`;
      },
    },
  ];
  return columns;
};

export default CostoTomaColumns;

type SampleCostInputProps = {
  defaultValue: ISamplesCost;
  onFinish: (sample: ISamplesCost) => void;
  loading: boolean;
};

const SampleCostInput = ({
  defaultValue,
  onFinish,
  loading,
}: SampleCostInputProps) => {
  const [form] = Form.useForm<ISamplesCost>();

  return (
    <Spin spinning={loading}>
      <Form<ISamplesCost>
        {...formItemLayout}
        form={form}
        name="samples"
        initialValues={defaultValue}
        onFinish={(values) => {
          onFinish({ ...defaultValue, costoToma: values.costoToma });
        }}
        scrollToFirstError
      >
        <Form.Item className="no-error-text" help="">
          <Input.Group compact>
            <Form.Item name={"costoToma"} className="no-error-text">
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
