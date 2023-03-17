import {
  Button,
  Col,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
  IColumns,
  getDefaultColumnProps,
} from "../../../../../app/common/table/utils";
import {
  IRequestTag,
  IRequestTagStudy,
} from "../../../../../app/models/request";
import { useStore } from "../../../../../app/stores/store";
import alerts from "../../../../../app/util/alerts";
import { DeleteTwoTone } from "@ant-design/icons";
import { ITagStudy } from "../../../../../app/models/tag";
import TextAreaInput from "../../../../../app/common/form/proposal/TextAreaInput";

const { Option } = Select;
const { Text } = Typography;

const RequestPrintTag = () => {
  const { requestStore } = useStore();
  const {
    request,
    availableTagStudies: availableStudyTags,
    printTags,
    tags,
    setTags,
    deleteTag,
  } = requestStore;

  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const changeQty = (qty: number, record: IRequestTag) => {
    let index = tags.findIndex((x) => x.id === record.id);
    if (index > -1) {
      const lbls = [...tags];
      lbls[index] = { ...lbls[index], cantidad: qty };
      setTags(lbls);
    }
  };

  const print = async () => {
    if (request) {
      const toPrint = tags.filter((x) => selectedKeys.includes(x.id));

      if (toPrint.length === 0) {
        alerts.warning("No se ha seleccionado ningúna etiqueta");
        return;
      }

      setLoading(true);
      await printTags(request.expedienteId, request.solicitudId!, toPrint);
      setLoading(false);
    }
  };

  const onChangeStudies = (values: string[], tag: IRequestTag) => {
    const newTags = [...tags];
    const index = newTags.findIndex((x) => x.id === tag.id);

    if (index === -1) return;

    const selectedStudyTag = availableStudyTags.filter((x) =>
      values.includes(x.nombreEstudio)
    );

    newTags[index].estudios = selectedStudyTag;
    setTags(newTags);
  };

  const columns: IColumns<IRequestTag> = [
    {
      ...getDefaultColumnProps("claveEtiqueta", "Clave", {
        searchable: false,
        width: "10%",
      }),
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.claveEtiqueta.localeCompare(b.claveEtiqueta),
    },
    {
      ...getDefaultColumnProps("nombreEtiqueta", "Tapón", {
        searchable: false,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchable: false,
        width: "35%",
      }),
      render(value: IRequestTagStudy[], record) {
        return (
          <RequestTag
            tags={value}
            onChange={(values) => onChangeStudies(values, record)}
            loading={loading}
            studyOptions={availableStudyTags.filter(
              (x) => x.etiquetaId === record.etiquetaId
            )}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("observaciones", "Observación", {
        searchable: false,
        width: "20%",
      }),
      render: (value, record) => (
        <TextAreaInput
          formProps={{
            name: "observaciones",
            label: "",
            noStyle: true,
          }}
          bordered={record ? true : false}
          rows={3}
          autoSize
        />
      ),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cant.", {
        searchable: false,
        width: "5%",
      }),
      render: (_, record) => (
        <InputNumber
          value={record.cantidad}
          bordered={false}
          min={1}
          step="1"
          style={{ width: "100%" }}
          onChange={(qty) => {
            changeQty(qty ?? 1, record);
          }}
        />
      ),
    },
    {
      key: "borrado",
      dataIndex: "borrado",
      title: "",
      width: "5%",
      align: "center",
      render: (value, item) =>
        item.destinoTipo === 3 && (
          <Popconfirm
            title="¿Desea eliminar la etiqueta?"
            okText="Sí"
            cancelText="No"
            trigger="hover"
            onConfirm={() => deleteTag(item.id)}
          >
            <DeleteTwoTone twoToneColor="red" />
          </Popconfirm>
        ),
    },
    Table.SELECTION_COLUMN,
  ];

  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        {availableStudyTags.some((x) => !x.asignado) && (
          <Col span={24}>
            <Text type="danger">
              Pendientes por asignar:{" "}
              {availableStudyTags
                .filter((x) => !x.asignado)
                .map((x) => x.nombreEstudio)
                .join(", ")}
            </Text>
          </Col>
        )}
        <Col span={24}>
          <Table<IRequestTag>
            size="small"
            rowKey={(x) => x.id}
            columns={columns}
            dataSource={[...tags]}
            pagination={false}
            rowSelection={{
              fixed: "right",
              selectedRowKeys: selectedKeys,
              onChange: (keys) => {
                setSelectedKeys(keys);
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
  tags: IRequestTagStudy[];
  onChange: (values: string[]) => void;
  studyOptions: ITagStudy[];
  loading: boolean;
};

const RequestTag = ({
  tags,
  onChange,
  loading,
  studyOptions,
}: RequestTagProps) => {
  return (
    <Select
      bordered={false}
      onChange={onChange}
      style={{ width: "100%" }}
      mode="multiple"
      value={tags.map((x) => x.nombreEstudio)}
    >
      {studyOptions.map((x) => (
        <Option key={x.nombreEstudio} value={x.nombreEstudio}>
          <span className={x.asignado ? "" : "option-not-assigned"}>
            {x.nombreEstudio}
          </span>
        </Option>
      ))}
    </Select>
  );
};
