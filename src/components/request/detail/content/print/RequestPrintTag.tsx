import { Button, Col, Form, InputNumber, Row, Spin, Table } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import SelectInput from "../../../../../app/common/form/proposal/SelectInput";
import {
  IColumns,
  getDefaultColumnProps,
} from "../../../../../app/common/table/utils";
import { IRequestStudy, IRequestTag } from "../../../../../app/models/request";
import { IOptions } from "../../../../../app/models/shared";
import { useStore } from "../../../../../app/stores/store";
import alerts from "../../../../../app/util/alerts";
import { formItemLayout } from "../../../../../app/util/utils";
import { v4 as uuid } from "uuid";

const RequestPrintTag = () => {
  const { requestStore, optionStore } = useStore();
  const { studyOptions, getStudyOptions } = optionStore;
  const { request, allStudies, printTags, tags, setTags } = requestStore;

  const [labels, setLabels] = useState<IRequestTag[]>([]);
  const [options, setOptions] = useState<IOptions[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getStudyOptions();
  }, [getStudyOptions]);

  useEffect(() => {
    const grouped = allStudies.reduce((group: IRequestTag[], study) => {
      const index = group.findIndex((x) => x.taponClave === study.taponClave);
      if (index === -1) {
        group.push({
          tableId: uuid(),
          estudioId: "study-" + study.estudioId,
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
    setTags(grouped);
  }, [allStudies]);

  useEffect(() => {
    if (request) {
      const getStudiesFromRequest = (request: IRequestStudy[]) => {
        const studies = request.map((x) => "study-" + x.estudioId);

        let filterStudies = studyOptions.filter((x) =>
          studies.includes(x.value as string)
        );

        return filterStudies;
      };

      const studies = getStudiesFromRequest(allStudies);
      setOptions(studies);
    }
  }, [request, studyOptions]);

  const changeQty = (qty: number, record: IRequestTag) => {
    let index = tags.findIndex((x) => x.tableId === record.tableId!);
    if (index > -1) {
      const lbls = [...tags];
      lbls[index] = { ...lbls[index], cantidad: qty };
      setTags(lbls);
    }
  };

  const print = async () => {
    if (request) {
      setLoading(true);
      const toPrint = tags.filter((x) => selectedKeys.includes(x.tableId!));

      if (toPrint.length === 0) {
        alerts.warning("No se ha seleccionado ningún estudio");
        setLoading(false);
        return;
      }

      const groupBySumCantidad = toJS(toPrint).reduce(
        (group: IRequestTag[], study) => {
          const index = group.findIndex((x) => x.estudios === study.estudios);
          if (index === -1) {
            group.push({
              tableId: uuid(),
              taponClave: study.taponClave ?? "",
              taponNombre: study.taponNombre ?? "",
              estudios: study.estudios,
              cantidad: study.cantidad,
            });
          } else {
            group[index].cantidad += study.cantidad;
          }
          return group;
        },
        []
      );

      const groupToPrintBySumCantidad = groupBySumCantidad.map(
        (x) => {
          const index = toPrint.findIndex((y) => y.cantidad === 1 && y.estudios === x.estudios);
          if (index > -1) {
            toPrint[index].cantidad = x.cantidad;
          }
          return x;
        }
      );

      console.log("toPrint", toPrint);
      console.log("groupBySumEqualToOne", groupToPrintBySumCantidad);
      console.log("groupBySumEqualToOne", groupBySumCantidad);

      // await printTags(request.expedienteId, request.solicitudId!, groupBySumEqualToOne);
      // await printTags(request.expedienteId, request.solicitudId!, toPrint);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const newStudy: IRequestTag = {
      tableId: uuid(),
      taponClave: tags[0].taponClave ?? "",
      taponNombre: tags[0].taponNombre ?? "",
      estudios: "",
      cantidad: 0,
    };
    setTags([...tags, newStudy]);
  };

  const onFinish = (study: IRequestTag) => {
    setLoading(true);

    if (!study.estudios) {
      alerts.warning("No se ha seleccionado ningún estudio");
      setLoading(false);
      return;
    }

    const getLabel = studyOptions
      .find((x) => x.value === study.estudios)
      ?.label?.toString();
    let studyLabel = getLabel?.split(" - ") ?? "";

    study.estudios = studyLabel[0];

    const index = tags.findIndex((x) => x.tableId === study.tableId!);
    if (index > -1) {
      const lbls = [...tags];
      lbls[index] = { ...lbls[index], estudios: study.estudios };
      setTags(lbls);
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
            studyOptions={options}
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
          min={0}
          step="0.1"
          style={{ width: "100%" }}
          onChange={(qty) => {
            changeQty(qty ?? 0.5, record);
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
            rowKey={(x) => x.tableId!}
            columns={columns}
            dataSource={tags}
            pagination={false}
            rowSelection={{
              fixed: "right",
              selectedRowKeys: selectedKeys,
              onSelect: (r, s, selected) => {
                setSelectedKeys(selected.map((x) => x.tableId!));
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
  studyOptions: IOptions[];
  loading: boolean;
};

const RequestTag = ({
  defaultValue,
  onFinish,
  loading,
  studyOptions,
}: RequestTagProps) => {
  const [form] = Form.useForm<IRequestTag>();

  return (
    <Spin spinning={loading}>
      <Form<IRequestTag>
        {...formItemLayout}
        form={form}
        name="studies"
        initialValues={{ estudios: defaultValue.estudioId }}
        scrollToFirstError
      >
        <Row gutter={8}>
          <Col span={12}>
            <SelectInput
              form={form}
              formProps={{
                name: "estudios",
                label: "",
                noStyle: true,
              }}
              options={studyOptions}
              onChange={(value) => {
                onFinish({ ...defaultValue, estudios: value });
              }}
              defaultValue={defaultValue.estudioId}
            />
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};
