import { Button, Col, Row, Select, Table, Tooltip, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import IconButton from "../../../../app/common/button/IconButton";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import {
  IRequestPack,
  IRequestStudy,
  IRequestStudyUpdate,
} from "../../../../app/models/request";
import { IOptions } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { moneyFormatter } from "../../../../app/util/utils";
import { status } from "../../../../app/util/catalogs";

const { Link } = Typography;

const RequestStudy = () => {
  const { requestStore, optionStore } = useStore();
  const { studyOptions, packOptions, getStudyOptions, getPackOptions } =
    optionStore;
  const {
    isStudy,
    request,
    studies,
    packs,
    studyFilter,
    getPriceStudy,
    getPricePack,
    deleteStudy,
    deletePack,
    cancelStudies,
    setOriginalTotal,
    changeStudyPromotion,
    changePackPromotion,
    totals,
  } = requestStore;

  const [selectedStudies, setSelectedStudies] = useState<IRequestStudy[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [options, setOptions] = useState<IOptions[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    getStudyOptions();
    getPackOptions();
  }, [getPackOptions, getStudyOptions]);

  useEffect(() => {
    setOriginalTotal(totals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const options: IOptions[] = [
      {
        value: "study",
        label: "Estudios",
        options: studyOptions,
      },
      {
        value: "pack",
        label: "Paquetes",
        options: packOptions,
      },
    ];

    setOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packOptions, studyOptions]);

  const columns: IColumns<IRequestStudy | IRequestPack> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 100,
      }),
      render: (value) => <Link>{value}</Link>,
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: 200,
      }),
      ellipsis: {
        showTitle: false,
      },
      render: (value, item) => {
        let content = "";
        if (isStudy(item)) {
          content = `${value} (${(item.parametros ?? [])
            .map((x) => x.clave)
            .join(", ")})`;
        } else {
          content = `${value} (${item.estudios
            .flatMap((x) => x.parametros)
            .map((x) => x.clave)
            .join(", ")})`;
        }

        content = content.replace(" ()", "");

        return (
          <Tooltip placement="topLeft" title={content}>
            {content}
          </Tooltip>
        );
      },
    },
    {
      key: "n",
      dataIndex: "n",
      title: "",
      align: "center",
      width: 30,
      render: (value) => "N",
    },
    {
      ...getDefaultColumnProps("precio", "Precio", {
        searchable: false,
        width: 85,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      ...getDefaultColumnProps("dias", "Días", {
        searchable: false,
        width: 70,
      }),
    },
    {
      ...getDefaultColumnProps("promocionId", "Promoción", {
        searchable: false,
        width: 200,
      }),
      render: (value, item) =>
        item.promociones && item.promociones.length > 0 ? (
          <Select
            options={item.promociones.map((x) => ({
              value: x.promocionId,
              label: `${x.promocion} (${x.descuentoPorcentaje}%)`,
            }))}
            value={value}
            bordered={false}
            style={{ width: "100%" }}
            allowClear
            placeholder="Seleccionar promoción"
            onChange={(promoId?: number) => {
              if (isStudy(item)) {
                changeStudyPromotion(item, promoId);
              } else {
                changePackPromotion(item, promoId);
              }
            }}
          />
        ) : (
          "Sin promociones disponibles"
        ),
    },
    {
      ...getDefaultColumnProps("precioFinal", "Precio Final", {
        searchable: false,
        width: 120,
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      key: "taponColor",
      dataIndex: "taponColor",
      title: "",
      width: 35,
      align: "center",
      render: (value) => <ContainerBadge color={value} />,
    },
    Table.SELECTION_COLUMN,
    {
      key: "nuevo",
      dataIndex: "nuevo",
      title: "",
      width: 40,
      align: "center",
      render: (value, item) =>
        !!value ? (
          <IconButton
            danger
            title="Eliminar"
            icon={<DeleteOutlined />}
            onClick={() => deleteStudyOrPack(item)}
          />
        ) : null,
    },
  ];

  const addStudy = async (option: IOptions) => {
    const value = parseInt(option.value.toString().split("-")[1]);

    if (isNaN(value)) return;

    if (option.group === "study") {
      await getPriceStudy(value, studyFilter);
    }

    if (option.group === "pack") {
      await getPricePack(value, studyFilter);
    }
  };

  const deleteStudyOrPack = (item: IRequestStudy | IRequestPack) => {
    alerts.confirm(
      "Eliminar estudio",
      `¿Desea eliminar el ${isStudy(item) ? "estudio" : "paquete"} ${
        item.nombre
      }?`,
      async () => {
        if (isStudy(item)) {
          deleteStudy(item.identificador!);
        } else {
          deletePack(item.identificador!);
        }
      }
    );
  };

  const cancel = () => {
    if (request) {
      alerts.confirm(
        "Canelar estudios",
        `¿Desea cancelar los registros seleccionados?`,
        async () => {
          const data: IRequestStudyUpdate = {
            expedienteId: request.expedienteId,
            solicitudId: request.solicitudId!,
            estudios: selectedStudies,
          };
          const ok = await cancelStudies(data);
          if (ok) {
            setSelectedStudies([]);
            setSelectedRowKeys([]);
          }
        }
      );
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24} style={{ textAlign: "end" }}>
        <Select
          showSearch
          value={[]}
          mode="multiple"
          placeholder="Buscar Estudios"
          optionFilterProp="children"
          style={{ width: "45%", textAlign: "left" }}
          onChange={(_, option) => {
            addStudy((option as IOptions[])[0]);
          }}
          filterOption={(input: string, option: any) => {
            if (input.indexOf("-") > -1) {
              const value = input.split("-")[0];
              return (
                option.label.toLowerCase().split("-")[0] ===
                value.toLowerCase() + " "
              );
            }
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          options={options}
        />
      </Col>
      <Col span={24}>
        <Table<IRequestStudy | IRequestPack>
          size="small"
          rowKey={(record) =>
            record.type + "-" + (record.id ?? record.identificador!)
          }
          columns={columns}
          dataSource={[...studies, ...packs]}
          pagination={false}
          rowSelection={{
            onSelect: (_item, selected, c) => {
              const studies = [
                ...c
                  .filter((x) => x.type === "study")
                  .map((x) => x as IRequestStudy),
                ...c
                  .filter((x) => x.type === "pack")
                  .flatMap((x) => (x as IRequestPack).estudios),
              ];
              setSelectedStudies(studies);
              setSelectedRowKeys(
                c.map((x) => x.type + "-" + (x.id ?? x.identificador!))
              );
            },
            getCheckboxProps: (item) => ({
              disabled:
                item.nuevo ||
                !item.asignado ||
                (isStudy(item)
                  ? item.estatusId !== status.requestStudy.pendiente
                  : item.estudios.some(
                      (x) => x.estatusId !== status.requestStudy.pendiente
                    )),
            }),
            selectedRowKeys: selectedRowKeys,
          }}
          sticky
          scroll={{ x: "fit-content" }}
        />
      </Col>
      <Col span={24} style={{ textAlign: "end" }}>
        <Button danger onClick={cancel}>
          Cancelar estudios
        </Button>
      </Col>
    </Row>
  );
};

const ContainerBadge = ({ color }: { color: string }) => {
  return (
    <div className="badge-container" style={{ backgroundColor: color }}></div>
  );
};

export default observer(RequestStudy);
