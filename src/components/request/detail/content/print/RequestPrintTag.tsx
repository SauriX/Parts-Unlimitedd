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
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
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
import { IStudyTag } from "../../../../../app/models/study";
import IconButton from "../../../../../app/common/button/IconButton";
import { DeleteOutlined, DeleteTwoTone } from "@ant-design/icons";

const RequestPrintTag = () => {
  const { requestStore, optionStore } = useStore();
  const { request, allActiveStudies, printTags, tags, setTags, deleteTag } =
    requestStore;

  const [labels, setLabels] = useState<IRequestTag[]>([]);
  const [options, setOptions] = useState<IOptions[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [studyTags, setStudyTags] = useState<IStudyTag[]>([]);

  useEffect(() => {
    setStudyTags(allActiveStudies.flatMap((x) => x.etiquetas));
  }, [allActiveStudies]);

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
    let index = tags.findIndex(
      (x) => x.id === record.id && x.identificador === record.identificador
    );
    if (index > -1) {
      const lbls = [...tags];
      lbls[index] = { ...lbls[index], cantidad: qty };
      setTags(lbls);
    }
  };

  const print = async () => {
    // if (request) {
    //   setLoading(true);
    //   const toPrint = tags.filter((x) => selectedKeys.includes(x.id));
    //   if (toPrint.length === 0) {
    //     alerts.warning("No se ha seleccionado ningún estudio");
    //     setLoading(false);
    //     return;
    //   }
    //   const groupBySumCantidad = toJS(toPrint).reduce(
    //     (group: IRequestTag[], study) => {
    //       const index = group.findIndex((x) => x.estudios === study.estudios);
    //       if (index === -1) {
    //         group.push({
    //           id: uuid(),
    //           taponClave: study.taponClave ?? "",
    //           taponNombre: study.taponNombre ?? "",
    //           estudios: study.estudios,
    //           cantidad: study.cantidad,
    //         });
    //       } else {
    //         group[index].cantidad += study.cantidad;
    //       }
    //       return group;
    //     },
    //     []
    //   );
    //   const groupToPrintBySumCantidad = groupBySumCantidad.map((x) => {
    //     const index = toPrint.findIndex(
    //       (y) => y.cantidad === 1 && y.estudios === x.estudios
    //     );
    //     if (index > -1) {
    //       toPrint[index].cantidad = x.cantidad;
    //     }
    //     return x;
    //   });
    //   console.log("toPrint", toPrint);
    //   console.log("groupBySumEqualToOne", groupToPrintBySumCantidad);
    //   console.log("groupBySumEqualToOne", groupBySumCantidad);
    //   // await printTags(request.expedienteId, request.solicitudId!, groupBySumEqualToOne);
    //   // await printTags(request.expedienteId, request.solicitudId!, toPrint);
    //   setLoading(false);
    // }
  };

  const handleAdd = () => {
    const newStudy: IRequestTag = {
      identificador: uuid(),
      claveEtiqueta: tags[0].claveEtiqueta ?? "",
      nombreEtiqueta: tags[0].nombreEtiqueta ?? "",
      estudios: [],
      cantidad: 0,
      etiquetaId: tags[0].etiquetaId,
      claveInicial: tags[0].claveInicial,
      color: tags[0].color,
    };
    setTags([...tags, newStudy]);
  };

  const onSelectStudy = (value: string, tag: IRequestTag) => {
    const newTags = toJS(tags);
    const index = newTags.findIndex(
      (x) => x.id === tag.id && x.identificador === tag.identificador
    );

    if (index === -1) return;

    const selectedStudyTag = studyTags.find((x) => value === x.identificador);
    if (!selectedStudyTag) return;

    selectedStudyTag.manual = true;
    selectedStudyTag.borrado = false;
    selectedStudyTag.identificadorEtiqueta = tag.identificador!;
    newTags[index].estudios = [
      ...newTags[index].estudios.filter((x) => value !== x.identificador),
      selectedStudyTag,
    ];

    console.log("%conSelectStudy", "color:green");
    console.log(newTags);

    setTags(newTags);
  };

  const onDeselectStudy = (value: string, tag: IRequestTag) => {
    const newTags = toJS(tags);
    const index = newTags.findIndex(
      (x) => x.id === tag.id && x.identificador === tag.identificador
    );

    if (index === -1) return;

    const selectedStudyTag = studyTags.find((x) => value === x.identificador);
    if (!selectedStudyTag) return;

    selectedStudyTag.borrado = true;
    newTags[index].estudios = [
      ...newTags[index].estudios.filter((x) => value !== x.identificador),
      selectedStudyTag,
    ];

    // if (newTags[index].estudios.filter((x) => !x.borrado).length === 0) {
    //   alerts.warning("La etiqueta debe tener al menos un estudio");
    //   return;
    // }

    console.log("%conDeselectStudy", "color:green");
    console.log(newTags);

    setTags(newTags);
  };

  useEffect(() => {
    console.log(studyTags);
  }, [studyTags]);

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
      render(value: IStudyTag[], record) {
        return (
          <RequestTag
            tags={value.filter((x) => !x.borrado)}
            onSelect={(value) => onSelectStudy(value, record)}
            onDeselect={(value) => onDeselectStudy(value, record)}
            loading={loading}
            studyOptions={studyTags
              .filter((x) => x.etiquetaId === record.etiquetaId)
              .filter(
                (x) =>
                  record.estudios
                    .map((y) => y.identificador)
                    .includes(x.identificador) ||
                  !record.estudios
                    .map((y) => y.nombreEstudio)
                    .includes(x.nombreEstudio)
              )
              .filter(
                (v, i, a) =>
                  a.map((x) => x.nombreEstudio).indexOf(v.nombreEstudio) ===
                    i ||
                  record.estudios
                    .map((y) => y.identificador)
                    .includes(v.identificador)
              )
              .filter((x) => !x.borrado)
              .map((x) => ({
                key: x.identificador,
                value: x.identificador,
                label: x.nombreEstudio + ` (${x.cantidad})`,
              }))}
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
      render: (value, item) => (
        <Popconfirm
          title="¿Desea eliminar la etiqueta?"
          okText="Sí"
          cancelText="No"
          trigger="hover"
          onConfirm={() => deleteTag(item.identificador!)}
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
        <Col span={24}>
          <Table<IRequestTag>
            size="small"
            rowKey={(x) => x.id ?? x.identificador!}
            columns={columns}
            dataSource={[...tags.filter((x) => !x.borrado)]}
            pagination={false}
            rowSelection={{
              fixed: "right",
              selectedRowKeys: selectedKeys,
              onSelect: (r, s, selected) => {
                setSelectedKeys(selected.map((x) => x.id ?? x.identificador!));
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
  tags: IStudyTag[];
  onSelect: (value: string) => void;
  onDeselect: (value: string) => void;
  studyOptions: IOptions[];
  loading: boolean;
};

const RequestTag = ({
  tags,
  onSelect,
  onDeselect,
  loading,
  studyOptions,
}: RequestTagProps) => {
  return (
    <Select
      bordered={false}
      options={studyOptions}
      onSelect={onSelect}
      onDeselect={onDeselect}
      style={{ width: "100%" }}
      mode="multiple"
      value={tags.map((x) => x.identificador)}
    />
  );
};
