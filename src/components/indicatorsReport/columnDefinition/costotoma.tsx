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
  const { filter, updateSample, loadingReport } = indicatorsStore;
  const { branchCityOptions } = optionStore;

  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<IOptions[]>([]);

  useEffect(() => {
    setBranches(branchCityOptions.flatMap((x) => x.options ?? []));
  }, [branchCityOptions]);

  const onFinish = async (branchName: string, sampleCost: number) => {
    setLoading(true);

    const branchId = branches.find((x) => x.label === branchName)?.value;
    if (!branchId) {
      alerts.warning("Sucursal invalida");
      return;
    }

    const sample = {
      sucursalId: branchId as string,
      sucursal: branchName,
      costoToma: sampleCost,
      fechaAlta: moment(filter.fechaIndividual).utcOffset(0, true),
    };
    
    if (sample) {
      updateSample(sample);
    }
    
    setLoading(false);
  };

  let widthColumns = 100 / 3;

  const columns: IColumns<ISamplesCost> = [
    {
      ...getDefaultColumnProps("costoToma", "Costo Toma", {
        searchState,
        setSearchState,
        width: `${widthColumns}%`,
      }),
      render: (text: string, record: any) => {
        return (
          <SampleCostInput
            loading={loading}
            defaultValue={record.costoToma}
            onFinish={(branch, sample) => onFinish(branch, sample)}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("sucursal", "Sucursal", {
        searchState,
        setSearchState,
        width: `${widthColumns}%`,
      }),
    },
    {
      ...getDefaultColumnProps("fechaAlta", "Fecha Alta", {
        searchState,
        setSearchState,
        width: `${widthColumns}%`,
      }),
    },
  ];
  return columns;
};

export default CostoTomaColumns;

type SampleCostInputProps = {
  defaultValue: number;
  onFinish: (branch:string, sample: number) => void;
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
        initialValues={{ costoToma: defaultValue }}
        onFinish={(values) => {
          console.log(values);
          onFinish(values.sucursal, values.costoToma);
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
