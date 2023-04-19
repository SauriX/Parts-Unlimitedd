import {
  Button,
  Checkbox,
  Col,
  Row,
  Select,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IOptions } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { moneyFormatter } from "../../../../app/util/utils";
import {
  IQuotationPack,
  IQuotationStudy,
  IQuotationStudyUpdate,
} from "../../../../app/models/quotation";
import InfoStudy from "../../../request/detail/InfoModal/InfoStudy";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";

const { Link, Text } = Typography;

const QuotationStudy = () => {
  const { quotationStore, optionStore, modalStore } = useStore();
  const { openModal } = modalStore;
  const { studyOptions, packOptions, getStudyOptions, getPackOptions } =
    optionStore;
  const {
    isStudy,
    readonly,
    quotation,
    studies,
    packs,
    studyFilter,
    setStudy,
    setPack,
    getPriceStudy,
    getPricePack,
    deleteStudies,
    changeStudyPromotion,
    changePackPromotion,
  } = quotationStore;

  const [selectedStudies, setSelectedStudies] = useState<
    (IQuotationStudy | IQuotationPack)[]
  >([]);
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

  const showStudyDetails = async (id: number, estudio: string) => {
    openModal({
      title: <HeaderTitle image={"infoStudy"} title="Ficha técnica" />,
      body: (
        <InfoStudy id={id} originBranch={""} destinationBranch={""}></InfoStudy>
      ),
      width: 1000,
    });
  };

  const columns: IColumns<IQuotationStudy | IQuotationPack> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 100,
      }),
      // render: (value) => <Link>{value}</Link>,
      render: (value, item) => {
        if (isStudy(item)) {
          return (
            <Link
              onClick={() => {
                showStudyDetails(item.estudioId!, item.nombre);
              }}
            >
              {value}
            </Link>
          );
        } else {
          return <Text>{value}</Text>;
        }
      },
    },
    {
      ...getDefaultColumnProps("nombre", "Estudios", {
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
          content = `${value} (${item.parametros
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
            disabled={readonly}
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
    Table.SELECTION_COLUMN,
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

  const cancel = () => {
    if (quotation) {
      alerts.confirm(
        "Remover estudios",
        `¿Desea remover los registros seleccionados?`,
        async () => {
          const data: IQuotationStudyUpdate = {
            cotizacionId: quotation.cotizacionId,
            estudios: selectedStudies.filter(
              (x) => x.type === "study"
            ) as IQuotationStudy[],
            paquetes: selectedStudies.filter(
              (x) => x.type === "pack"
            ) as IQuotationPack[],
          };
          const ok = await deleteStudies(data);
          if (ok) {
            setSelectedStudies([]);
            setSelectedRowKeys([]);
          }
        }
      );
    }
  };

  const selectRowCheckbox = (
    selectedRows: (IQuotationStudy | IQuotationPack)[]
  ) => {
    const studies = [
      ...selectedRows
        .filter((x) => x.type === "study")
        .map((x) => x as IQuotationStudy),
      ...selectedRows
        .filter((x) => x.type === "pack")
        .map((x) => x as IQuotationPack),
    ];
    setSelectedStudies(studies);
    setSelectedRowKeys(
      selectedRows.map((x) => x.type + "-" + (x.id ?? x.identificador!))
    );
  };

  return (
    <Row gutter={[8, 8]}>
      {!readonly && (
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
            filterOption={(input: any, option: any) => {
              if (input.indexOf("-") > -1) {
                const value = input.split("-")[0];
                return (
                  option.label.toLowerCase().split("-")[0] ===
                  value.toLowerCase() + " "
                );
              }
              return (
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              );
            }}
            options={options}
          />
        </Col>
      )}
      <Col span={24}>
        <Table<IQuotationStudy | IQuotationPack>
          size="small"
          rowKey={(record) =>
            record.type + "-" + (record.id ?? record.identificador!)
          }
          columns={columns}
          dataSource={[...studies, ...packs]}
          pagination={false}
          rowSelection={{
            onSelect: (_item, _selected, selectedRows) => {
              selectRowCheckbox(selectedRows);
            },
            onSelectAll: (_selected, selectedRows) => {
              selectRowCheckbox(selectedRows);
            },
            getCheckboxProps: () => ({
              disabled: readonly,
            }),
            selectedRowKeys: selectedRowKeys,
          }}
          sticky
          scroll={{ x: "fit-content" }}
        />
      </Col>
      <Col span={24} style={{ textAlign: "end" }}>
        {!readonly && (
          <Button
            danger
            onClick={cancel}
            disabled={selectedStudies.length === 0}
          >
            Remover estudios
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default observer(QuotationStudy);
