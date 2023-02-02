import { Button, Col, Form, InputNumber, Row, Spin, Table } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import SelectInput from "../../../../../app/common/form/proposal/SelectInput";
import {
  IColumns,
  getDefaultColumnProps,
} from "../../../../../app/common/table/utils";
import { IRequestStudy, IRequestTag } from "../../../../../app/models/request";
import { useStore } from "../../../../../app/stores/store";
import alerts from "../../../../../app/util/alerts";
import { formItemLayout } from "../../../../../app/util/utils";

const RequestPrintTag = () => {
  const { requestStore } = useStore();
  const { request, allStudies, printTags } = requestStore;

  const [labels, setLabels] = useState<IRequestTag[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const grouped = allStudies.reduce((group: IRequestTag[], study) => {
      const index = group.findIndex((x) => x.taponClave === study.taponClave);
      if (index === -1) {
        group.push({
          taponClave: study.taponClave ?? "",
          taponNombre: study.taponNombre ?? "",
          cantidad: 1,
          estudios: study.clave,
        });
      } else {
        group[index].estudios += `, ${study.clave}`;
      }
      return group;
    }, []);
    setLabels(grouped);
  }, [allStudies]);

  const changeQty = (qty: number, record: IRequestTag) => {
    let index = labels.findIndex((x) => x.taponClave === record.taponClave);
    if (index > -1) {
      const lbls = [...labels];
      lbls[index] = { ...lbls[index], cantidad: qty };
      setLabels(lbls);
    }
  };

  const print = async () => {
    if (request) {
      setLoading(true);
      const toPrint = labels.filter((x) => selectedKeys.includes(x.taponClave));
      await printTags(request.expedienteId, request.solicitudId!, toPrint);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newStudy: IRequestTag = {
      taponClave: labels[0].taponClave ?? "",
      taponNombre: labels[0].taponNombre ?? "",
      estudios: "",
      cantidad: 1,
    };
    setLabels([...labels, newStudy]);
  };

  const onFinish = (study: IRequestTag) => {
    setLoading(true);

    if (!study) {
      alerts.warning("No se ha seleccionado ningún estudio");
      setLoading(false);
      return;
    }

    const index = labels.findIndex((x) => x.taponClave === study.taponClave);
    if (index > -1) {
      const lbls = [...labels];
      lbls[index] = { ...lbls[index], estudios: study.estudios };
      setLabels(lbls);
    }
    setLoading(false);
  };

  const columns: IColumns<IRequestTag> = [
    {
      ...getDefaultColumnProps("taponClave", "Clave", {
        searchable: false,
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("taponNombre", "Tapón", {
        searchable: false,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchable: false,
        width: "50%",
      }),
      render(text: string, record: IRequestTag) {
        return (
          <RequestTag
            defaultValue={record}
            onFinish={(study) => onFinish(study)}
            loading={loading}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("cantidad", "Cant.", {
        searchable: false,
        width: "10%",
      }),
      render: (_, record) => (
        <InputNumber
          value={record.cantidad}
          bordered={false}
          min={1}
          style={{ width: "100%" }}
          onChange={(qty) => {
            changeQty(qty ?? 0, record);
          }}
        />
      ),
    },
    Table.SELECTION_COLUMN,
  ];

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={handleAdd}>
            Agregar etiqueta
          </Button>
        </Col>
        <Col span={24}>
          <Table<IRequestTag>
            size="small"
            rowKey={(record) => record.taponClave}
            columns={columns}
            dataSource={labels}
            pagination={false}
            rowSelection={{
              fixed: "right",
              selectedRowKeys: selectedKeys,
              onSelect: (r, s, selected) => {
                setSelectedKeys(selected.map((x) => x.taponClave));
              },
            }}
            sticky
            scroll={{ x: "fit-content" }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            disabled={selectedKeys.length === 0}
            type="default"
            onClick={print}
          >
            Imprimir
          </Button>
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RequestPrintTag);

type RequestTagProps = {
  defaultValue: IRequestTag;
  onFinish: (value: IRequestTag) => void;
  loading: boolean;
};

const RequestTag = ({ defaultValue, onFinish, loading }: RequestTagProps) => {
  const [form] = Form.useForm<IRequestTag>();

  return (
    <Spin spinning={loading}>
      <Form<IRequestTag>
        {...formItemLayout}
        form={form}
        name="studies"
        initialValues={defaultValue}
        onFinish={(values) => {
          onFinish({ ...defaultValue, estudios: values.estudios });
        }}
        scrollToFirstError
      >
        <Row gutter={8}>
          <Col span={12}>
            <SelectInput
              formProps={{
                name: "estudios",
                label: "",
                noStyle: true,
              }}
              options={[]}
            />
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};
