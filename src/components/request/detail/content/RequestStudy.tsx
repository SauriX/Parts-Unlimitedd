import { isFocusable } from "@testing-library/user-event/dist/utils";
import { Button, Checkbox, Col, Row, Select, Table, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import IconButton from "../../../../app/common/button/IconButton";
import {
  defaultPaginationProperties,
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
import { toJS } from "mobx";

const { Link } = Typography;

const RequestStudy = () => {
  const { requestStore, priceListStore, optionStore } = useStore();
  const { studyOptions, packOptions, getStudyOptions, getPackOptions } =
    optionStore;
  const {
    isStudy,
    request,
    studies,
    packs,
    studyFilter,
    calculateTotals,
    setStudy,
    setPack,
    getPriceStudy,
    getPricePack,
    deleteStudy,
    deletePack,
    cancelStudies,
    setOriginalTotal,
    totals,
  } = requestStore;

  const [selectedStudies, setSelectedStudies] = useState<IRequestStudy[]>([]);

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
  }, []);

  useEffect(() => {
    console.log(selectedStudies);
  }, [selectedStudies]);

  useEffect(() => {
    const options: IOptions[] = [
      {
        value: "study",
        label: "Estudios",
        options: studyOptions.filter(
          (x) =>
            !studies
              .map((s) => s.estudioId.toString())
              .includes(x.value.toString().split("-")[1])
        ),
      },
      {
        value: "pack",
        label: "Paquetes",
        options: packOptions.filter(
          (x) =>
            !packs
              .map((s) => s.paqueteId.toString())
              .includes(x.value.toString().split("-")[1])
        ),
      },
    ];

    setOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packOptions, studyOptions, packs.length, studies.length]);

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
      render: (value, item) => {
        if (isStudy(item)) {
          return `${value} (${item.parametros.map((x) => x.clave).join(", ")})`;
        } else {
          return `${value} (${item.estudios
            .flatMap((x) => x.parametros)
            .map((x) => x.clave)
            .join(", ")})`;
        }
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
      key: "aplicaDescuento",
      dataIndex: "aplicaDescuento",
      title: "D",
      align: "center",
      width: 35,
      render: (value, item) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            if (isStudy(item)) {
              setStudy({ ...item, aplicaDescuento: e.target.checked });
            } else {
              setPack({ ...item, aplicaDescuento: e.target.checked });
            }
          }}
        />
      ),
    },
    {
      key: "aplicaCargo",
      dataIndex: "aplicaCargo",
      title: "C",
      align: "center",
      width: 35,
      render: (value, item) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            if (isStudy(item)) {
              setStudy({ ...item, aplicaCargo: e.target.checked });
            } else {
              setPack({ ...item, aplicaCargo: e.target.checked });
            }
          }}
        />
      ),
    },
    {
      key: "aplicaCopago",
      dataIndex: "aplicaCopago",
      title: "CP",
      align: "center",
      width: 45,
      render: (value, item) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            if (isStudy(item)) {
              setStudy({ ...item, aplicaCopago: e.target.checked });
            } else {
              setPack({ ...item, aplicaCopago: e.target.checked });
            }
          }}
        />
      ),
    },
    {
      ...getDefaultColumnProps("dias", "Días", {
        searchable: false,
        width: 70,
      }),
    },
    {
      ...getDefaultColumnProps("promocion", "Promoción", {
        searchable: false,
        width: 200,
      }),
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
            title="Eliminar"
            icon={<DeleteOutlined style={{ color: "red" }} />}
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
          deleteStudy(item.estudioId);
        } else {
          deletePack(item.paqueteId);
        }
      }
    );
  };

  const cancel = () => {
    if (request) {
      alerts.confirm(
        "Canelar estudio",
        `¿Desea cancelar los registros seleccionados?`,
        async () => {
          const data: IRequestStudyUpdate = {
            expedienteId: request.expedienteId,
            solicitudId: request.solicitudId!,
            estudios: selectedStudies,
          };
          cancelStudies(data);
        }
      );
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={18}>
        <Select
          showSearch
          value={[]}
          mode="multiple"
          placeholder="Buscar Estudios"
          optionFilterProp="children"
          style={{ width: "100%" }}
          onChange={(_, option) => {
            addStudy((option as IOptions[])[0]);
          }}
          filterOption={(input: any, option: any) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          options={options}
        />
      </Col>
      <Col span={6} style={{ textAlign: "end" }}>
        <Button danger onClick={cancel}>
          Cancelar estudios
        </Button>
      </Col>
      <Col span={24}>
        <Table<IRequestStudy | IRequestPack>
          size="small"
          rowKey={(record) => record.type + "-" + record.clave}
          columns={columns}
          dataSource={[...studies, ...packs]}
          pagination={false}
          rowSelection={{
            onSelect: (_item, _selected, c) => {
              const studies = [
                ...c
                  .filter((x) => x.type === "study")
                  .map((x) => x as IRequestStudy),
                ...c
                  .filter((x) => x.type === "pack")
                  .flatMap((x) => (x as IRequestPack).estudios),
              ];
              setSelectedStudies(studies);
            },
            getCheckboxProps: (item) => ({
              disabled: isStudy(item)
                ? item.estatusId !== status.requestStudy.pendiente
                : item.estudios.some(
                    (x) => x.estatusId !== status.requestStudy.pendiente
                  ),
            }),
          }}
          sticky
          scroll={{ x: "fit-content" }}
        />
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
