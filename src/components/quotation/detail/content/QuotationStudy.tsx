import { isFocusable } from "@testing-library/user-event/dist/utils";
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
import { IOptions } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { moneyFormatter } from "../../../../app/util/utils";
import { status } from "../../../../app/util/catalogs";
import { toJS } from "mobx";

const { Link } = Typography;

const QuotationStudy = () => {
  const { quotationStore, priceListStore, optionStore } = useStore();
  const { studyOptions, packOptions, getStudyOptions, getPackOptions } =
    optionStore;
  //   const {
  //     isStudy,
  //     quotation,
  //     studies,
  //     packs,
  //     studyFilter,
  //     calculateTotals,
  //     setStudy,
  //     setPack,
  //     getPriceStudy,
  //     getPricePack,
  //     deleteStudy,
  //     deletePack,
  //     cancelStudies,
  //     setOriginalTotal,
  //     changeStudyPromotion,
  //     changePackPromotion,
  //     totals,
  //   } = quotationStore;

  //   const [selectedStudies, setSelectedStudies] = useState<IQuotationStudy[]>([]);
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

  //   useEffect(() => {
  //     setOriginalTotal(totals);
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

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

  const columns: IColumns<any> = [
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
        // if (isStudy(item)) {
        //   content = `${value} (${item.parametros
        //     .map((x) => x.clave)
        //     .join(", ")})`;
        // } else {
        //   content = `${value} (${item.estudios
        //     .flatMap((x) => x.parametros)
        //     .map((x) => x.clave)
        //     .join(", ")})`;
        // }
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
      key: "aplicaCargo",
      dataIndex: "aplicaCargo",
      title: "C",
      align: "center",
      width: 35,
      render: (value, item) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            // if (isStudy(item)) {
            //   setStudy({ ...item, aplicaCargo: e.target.checked });
            // } else {
            //   setPack({ ...item, aplicaCargo: e.target.checked });
            // }
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

    // if (option.group === "study") {
    //   await getPriceStudy(value, studyFilter);
    // }

    // if (option.group === "pack") {
    //   await getPricePack(value, studyFilter);
    // }
  };

  const deleteStudyOrPack = (item: any) => {
    // alerts.confirm(
    //   "Eliminar estudio",
    //   `¿Desea eliminar el ${isStudy(item) ? "estudio" : "paquete"} ${
    //     item.nombre
    //   }?`,
    //   async () => {
    //     if (isStudy(item)) {
    //       deleteStudy(item.identificador!);
    //     } else {
    //       deletePack(item.identificador!);
    //     }
    //   }
    // );
  };

  //   const cancel = () => {
  //     if (quotation) {
  //       alerts.confirm(
  //         "Canelar estudio",
  //         `¿Desea cancelar los registros seleccionados?`,
  //         async () => {
  //           const data: IQuotationStudyUpdate = {
  //             expedienteId: quotation.expedienteId,
  //             solicitudId: quotation.solicitudId!,
  //             estudios: selectedStudies,
  //           };
  //           const ok = await cancelStudies(data);
  //           if (ok) {
  //             setSelectedStudies([]);
  //             setSelectedRowKeys([]);
  //           }
  //         }
  //       );
  //     }
  //   };

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
        <Button danger onClick={() => {}}>
          Remover estudios
        </Button>
      </Col>
      <Col span={24}>
        <Table<any>
          size="small"
          rowKey={(record) =>
            record.type + "-" + (record.id ?? record.identificador!)
          }
          columns={columns}
          dataSource={[]}
          pagination={false}
          rowSelection={{
            onSelect: (_item, selected, c) => {
              //   const studies = [
              //     ...c
              //       .filter((x) => x.type === "study")
              //       .map((x) => x as IQuotationStudy),
              //     ...c
              //       .filter((x) => x.type === "pack")
              //       .flatMap((x) => (x as IQuotationPack).estudios),
              //   ];
              //   setSelectedStudies(studies);
              //   setSelectedRowKeys(
              //     c.map((x) => x.type + "-" + (x.id ?? x.identificador!))
              //   );
            },
            getCheckboxProps: (item) => ({
              //   disabled:
              //     item.nuevo ||
              //     (isStudy(item)
              //       ? item.estatusId !== status.quotationStudy.pendiente
              //       : item.estudios.some(
              //           (x) => x.estatusId !== status.quotationStudy.pendiente
              //         )),
            }),
            selectedRowKeys: selectedRowKeys,
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

export default observer(QuotationStudy);
