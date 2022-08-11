import { isFocusable } from "@testing-library/user-event/dist/utils";
import { Button, Checkbox, Col, Row, Select, Table, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IPriceListInfoFilter } from "../../../../app/models/priceList";
import { IRequestStudy } from "../../../../app/models/request";
import { IOptions } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import { moneyFormatter } from "../../../../app/util/utils";

const { Link } = Typography;

type RequestStudyProps = {
  data: IRequestStudy[];
  total: number;
  setData: React.Dispatch<React.SetStateAction<IRequestStudy[]>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

const RequestStudy: FC<RequestStudyProps> = ({ data, setData, setTotal, total }) => {
  const { priceListStore, optionStore,quotationStore } = useStore();
  const {  getPriceStudys, getPricePacks,studyFilter} = quotationStore;
  const { studyOptions, packOptions, getStudyOptions, getPackOptions, } = optionStore;

  const [selectedRows, setSelectedRows] = useState<IRequestStudy[]>([]);

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

  const columns: IColumns<IRequestStudy> = [
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
        return `${value} (${item.parametros.map((x) => x.clave).join(", ")})`;
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
      key: "cargo",
      dataIndex: "Cargo",
      title: "C",
      align: "center",
      width: "5%",
      render: (value) => <Checkbox />,
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

    if (option.group === "study") {

      const study = await getPriceStudys(studyFilter,value);
      if (study == null) {
        return;
      }
      var totalParcial = total + study.precio;
      setTotal(totalParcial);
      // setData((prev) => [
      //   ...prev,
      //   {
      //     precioListaId: study.precioListaId,
      //     estudioId: study.estudioId,
      //     clave: study.clave,
      //     nombre: study.nombre,
      //     precio: study.precioListaPrecio,
      //     descuento: false,
      //     cargo: false,
      //     copago: false,
      //     precioFinal: study.precioListaPrecio,
      //     type: "study",
      //     parametros: study.parametros.map((x) => ({
      //       id: x.id,
      //       clave: x.clave,
      //       nombre: x.nombre,
      //       nombreCorto: x.nombreCorto,
      //       area: x.area,
      //       departamento: x.departamento,
      //       activo: x.activo,
      //     })),
      //     indicaciones: study.indicaciones.map((x) => ({
      //       id: x.id,
      //       clave: x.clave,
      //       nombre: x.nombre,
      //       descripcion: x.descripcion,
      //       activo: x.activo,
      //       estudios: [],
      //     })),
      //   },
      // ]);
      console.log(study);
    }

    if (option.group === "pack") {
      const pack = await getPricePacks(studyFilter,value);
      if (pack == null) {
        return;
      }
      // setData((prev) => [
      //   ...prev,
      //   {
      //     precioListaId: pack.precioListaId,
      //     estudioId: pack.paqueteId,
      //     clave: pack.clave,
      //     nombre: pack.nombre,
      //     precio: pack.precioListaPrecio,
      //     descuento: false,
      //     cargo: false,
      //     copago: false,
      //     precioFinal: pack.precioListaPrecio,
      //     type: "pack",
      //     parametros: pack.estudios
      //       .flatMap((x) => x.parametros)
      //       .map((x) => ({
      //         id: x.id,
      //         clave: x.clave,
      //         nombre: x.nombre,
      //         nombreCorto: x.nombreCorto,
      //         area: x.area,
      //         departamento: x.departamento,
      //         activo: x.activo,
      //       })),
      //     indicaciones: pack.estudios
      //       .flatMap((x) => x.indicaciones)
      //       .map((x) => ({
      //         id: x.id,
      //         clave: x.clave,
      //         nombre: x.nombre,
      //         descripcion: x.descripcion,
      //         activo: x.activo,
      //         estudios: [],
      //       })),
      //   },
      // ]);
      console.log(pack);
    }

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
        {/* <DebounceSelect
          fetchOptions={fetch}
          style={{ width: "100%" }}
          mode="multiple"
          value={[]}
          placeholder="Buscar Estudios"
          onChange={(newValue) => {
            // setValue(newValue as UserValue[]);
          }}
          maxTagCount={0}
          maxTagPlaceholder={null}
          tagRender={() => <div>Hola</div>}
          // style={{ width: '100%' }}
        /> */}
      </Col>
      <Col span={24}>
        <Table<IRequestStudy>
          size="small"
          rowKey={(record) => record.type + "-" + (record.estudioId ?? record.paqueteId)}
          columns={columns}
          dataSource={[...data]}
          pagination={false}
          rowSelection={{
            onSelect: (value) => {
              console.log(value, "selected");
            },
          }}
          sticky
          scroll={{ x: "auto" }}
        />
      </Col>
      <Col span={24}>
        <Button
          style={{ borderColor: "#87CEFA", marginTop: "40px", marginLeft: "400px", width: "700px;" }}
          onClick={() => {
            setData([]);
            getStudyOptions();
            getPackOptions();
          }}
        >
          Remover estudios
        </Button>
      </Col>
    </Row>
  );
};

const ContainerBadge = ({ color }: { color: string }) => {
  return <div className="badge-container" style={{ backgroundColor: color }}></div>;
};

export default observer(RequestStudy);
