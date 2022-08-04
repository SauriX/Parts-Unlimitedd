import { isFocusable } from "@testing-library/user-event/dist/utils";
import { Checkbox, Col, Row, Select, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { IRequestPack, IRequestStudy } from "../../../app/models/request";
import { IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import { moneyFormatter } from "../../../app/util/utils";

const { Link } = Typography;

const RequestStudy = () => {
  const { requestStore, priceListStore, optionStore } = useStore();
  const { studyOptions, packOptions, getStudyOptions, getPackOptions } = optionStore;
  const { isStudy, studies, packs, studyFilter, calculateTotals, setStudy, setPack, getPriceStudy, getPricePack } =
    requestStore;

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
  }, [packOptions, studyOptions]);

  const columns: IColumns<IRequestStudy | IRequestPack> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
      }),
      render: (value) => <Link>{value}</Link>,
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: "30%",
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
      width: "5%",
      render: (value) => "N",
    },
    {
      ...getDefaultColumnProps("precio", "Precio", {
        searchable: false,
        width: "10%",
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      key: "aplicaDescuento",
      dataIndex: "aplicaDescuento",
      title: "D",
      align: "center",
      width: "5%",
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
      width: "5%",
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
      width: "5%",
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
        width: "10%",
      }),
    },
    {
      ...getDefaultColumnProps("precioFinal", "Precio Final", {
        searchable: false,
        width: "15%",
      }),
      align: "right",
      render: (value) => moneyFormatter.format(value),
    },
    {
      key: "contenedor",
      dataIndex: "contenedor",
      title: "",
      width: "5%",
      align: "center",
      render: () => <ContainerBadge color="#108ee9" />,
    },
    Table.SELECTION_COLUMN,
  ];

  const addStudy = async (option: IOptions) => {
    const value = parseInt(option.value.toString().split("-")[1]);

    if (isNaN(value)) return;
    let ok = false;

    if (option.group === "study") {
      ok = await getPriceStudy(value, studyFilter);
    }

    if (option.group === "pack") {
      ok = await getPricePack(value, studyFilter);
    }

    if (ok) {
      setOptions((prev) => {
        let studies = [...prev.find((x) => x.value === "study")!.options!];
        let packs = [...prev.find((x) => x.value === "pack")!.options!];

        if (option.group === "study") {
          studies = studies.filter((x) => x.value !== option.value);
        } else if (option.group === "pack") {
          packs = packs.filter((x) => x.value !== option.value);
        }

        return [
          {
            value: "study",
            label: "Estudios",
            options: studies,
          },
          {
            value: "pack",
            label: "Paquetes",
            options: packs,
          },
        ];
      });
    }
  };

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
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
      <Col span={24}>
        <Table<IRequestStudy | IRequestPack>
          size="small"
          rowKey={(record) => record.type + "-" + record.clave}
          columns={columns}
          dataSource={[...studies, ...packs]}
          pagination={false}
          rowSelection={{}}
          sticky
          scroll={{ x: "auto" }}
        />
      </Col>
    </Row>
  );
};

const ContainerBadge = ({ color }: { color: string }) => {
  return <div className="badge-container" style={{ backgroundColor: color }}></div>;
};

export default observer(RequestStudy);
