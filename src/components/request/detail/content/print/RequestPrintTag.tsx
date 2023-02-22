import {
  Button,
  Col,
  Form,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Typography,
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import SelectInput from "../../../../../app/common/form/proposal/SelectInput";
import {
  IColumns,
  getDefaultColumnProps,
} from "../../../../../app/common/table/utils";
import {
  IRequestStudy,
  IRequestTag,
  IRequestTagStudy,
} from "../../../../../app/models/request";
import { IOptions } from "../../../../../app/models/shared";
import { useStore } from "../../../../../app/stores/store";
import alerts from "../../../../../app/util/alerts";
import { formItemLayout, getDistinct } from "../../../../../app/util/utils";
import { v4 as uuid } from "uuid";
import { IStudyTag } from "../../../../../app/models/study";
import IconButton from "../../../../../app/common/button/IconButton";
import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";
import { ITagStudy } from "../../../../../app/models/tag";

const { Option } = Select;
const { Text } = Typography;

const RequestPrintTag = () => {
  const { requestStore, optionStore } = useStore();
  const {
    request,
    allActiveStudies,
    availableTagStudies: availableStudyTags,
    printTags,
    tags,
    setTags,
    deleteTag,
  } = requestStore;

  const [labels, setLabels] = useState<IRequestTag[]>([]);
  const [options, setOptions] = useState<IOptions[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [studyTags, setStudyTags] = useState<IStudyTag[]>([]);

  // useEffect(() => {
  //   setStudyTags(getDistinct(allActiveStudies.flatMap((x) => x.etiquetas)));
  // }, [allActiveStudies]);

  // useEffect(() => {
  //   const tags = allStudies
  //     .flatMap((x) => x.etiquetas)
  //     .map((y) => {
  //       const { estudioId, orden, nombreEstudio, cantidad, id, ...tag } = y;
  //       return tag;
  //     });

  //   const studyTags = allStudies
  //     .flatMap((x) => x.etiquetas)
  //     .sort((a, b) => {
  //       console.log("A: ", a);
  //       console.log("B: ", b);
  //       return (
  //         a.orden - b.orden && a.claveEtiqueta.localeCompare(b.claveEtiqueta)
  //       );
  //     });
  //   console.log(studyTags);
  //   setStudyTags([...studyTags]);

  //   let requestTags: IRequestTag[] = [];
  //   while (studyTags.length > 0) {
  //     const studyTag = studyTags.shift();
  //     const tag = tags.find((x) => x.etiquetaId === studyTag?.etiquetaId);

  //     if (!studyTag || !tag) continue;

  //     const index = requestTags
  //       .reverse()
  //       .findIndex((x) => x.claveEtiqueta === studyTag.claveEtiqueta);
  //     if (
  //       index === -1 ||
  //       requestTags[index].estudios.reduce((a, b) => a + b.cantidad, 0) +
  //         studyTag.cantidad >
  //         1
  //     ) {
  //       requestTags.push({
  //         identificador: uuid(),
  //         ...tag,
  //         cantidad: 1,
  //         estudios: [studyTag],
  //       });
  //     } else {
  //       requestTags[index].estudios.push(studyTag);
  //     }
  //   }

  //   // console.table(tags);
  //   console.table(studyTags);
  //   console.log(requestTags);

  //   setTags(requestTags);
  // }, [allStudies]);

  // useEffect(() => {
  //   if (request) {
  //     const getStudiesFromRequest = (request: IRequestStudy[]) => {
  //       const studies = request.map((x) => "study-" + x.estudioId);

  //       let filterStudies = studyOptions.filter((x) =>
  //         studies.includes(x.value as string)
  //       );

  //       return filterStudies;
  //     };

  //     const studies = getStudiesFromRequest(allStudies);
  //     setOptions(studies);
  //   }
  // }, [request, studyOptions]);

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

    const selectedStudyTag = availableStudyTags.filter(
      (x) => values.includes(x.nombreEstudio) //&& tag.destinoId === x.destinoId
    );

    // selectedStudyTag.manual = true;
    // selectedStudyTag.borrado = false;
    newTags[index].estudios = selectedStudyTag;

    console.log("%conSelectStudy", "color:green");
    console.log(newTags);

    setTags(newTags);
  };

  // const onSelectStudy = (value: number, tag: IRequestTag) => {
  //   const newTags = [...tags];
  //   const index = newTags.findIndex((x) => x.id === tag.id);

  //   if (index === -1) return;

  //   const selectedStudyTag = studyTags.find(
  //     (x) => value === x.estudioId && tag.destinoId === x.destinoId
  //   );
  //   if (!selectedStudyTag) return;

  //   // selectedStudyTag.manual = true;
  //   // selectedStudyTag.borrado = false;
  //   newTags[index].estudios = [
  //     ...newTags[index].estudios.filter((x) => value !== x.estudioId),
  //     selectedStudyTag,
  //   ];

  //   console.log("%conSelectStudy", "color:green");
  //   console.log(newTags);

  //   setTags(newTags);
  // };

  // const onDeselectStudy = (value: number, tag: IRequestTag) => {
  //   const newTags = toJS(tags);
  //   const index = newTags.findIndex((x) => x.id === tag.id);

  //   if (index === -1) return;

  //   const selectedStudyTag = studyTags.find((x) => value === x.estudioId);
  //   if (!selectedStudyTag) return;

  //   // selectedStudyTag.borrado = true;
  //   newTags[index].estudios = [
  //     // ...newTags[index].estudios.filter((x) => value !== x.identificador),
  //     selectedStudyTag,
  //   ];

  //   // if (newTags[index].estudios.filter((x) => !x.borrado).length === 0) {
  //   //   alerts.warning("La etiqueta debe tener al menos un estudio");
  //   //   return;
  //   // }

  //   console.log("%conDeselectStudy", "color:green");
  //   console.log(newTags);

  //   setTags(newTags);
  // };

  // useEffect(() => {
  //   console.log(studyTags);
  // }, [studyTags]);

  // const confirmDeleteTag = (id: string) => {
  //   alerts.confirm(
  //     "Eliminar etiqueta",
  //     `¿Desea eliminar la etiqueta?`,
  //     async () => {
  //       deleteTag(id);
  //     }
  //   );
  // };

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
        width: "28%",
      }),
    },
    {
      ...getDefaultColumnProps("estudios", "Estudios", {
        searchable: false,
        width: "45%",
      }),
      render(value: IRequestTagStudy[], record) {
        return (
          <RequestTag
            tags={value}
            // onSelect={(value) => onSelectStudy(value, record)}
            // onDeselect={(value) => onDeselectStudy(value, record)}
            onChange={(values) => onChangeStudies(values, record)}
            loading={loading}
            studyOptions={availableStudyTags.filter(
              (x) => x.etiquetaId === record.etiquetaId
              // && x.destinoId === record.destinoId
            )}
          />
        );
      },
    },
    {
      ...getDefaultColumnProps("cantidad", "Cant.", {
        searchable: false,
        width: "8%",
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
          // <IconButton
          //   danger
          //   title="Eliminar"
          //   icon={<DeleteOutlined />}
          //   onClick={() => confirmDeleteTag(item.identificador!)}
          // />
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
  // onSelect: (value: number) => void;
  // onDeselect: (value: number) => void;
  onChange: (values: string[]) => void;
  studyOptions: ITagStudy[];
  loading: boolean;
};

const RequestTag = ({
  tags,
  // onSelect,
  // onDeselect,
  onChange,
  loading,
  studyOptions,
}: RequestTagProps) => {
  return (
    <Select
      bordered={false}
      // options={studyOptions}
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
