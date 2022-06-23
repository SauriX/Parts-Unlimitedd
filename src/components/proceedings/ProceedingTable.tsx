import { Button, Col, DatePicker, Divider, Input, InputNumber, PageHeader, Row, Select, Table } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  defaultPaginationProperties,
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import IconButton from "../../app/common/button/IconButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import views from "../../app/util/view";
import { IProceedingList } from "../../app/models/Proceeding";

type ProceedingTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
/* const expedientes:IProceedingList[] = [{
    id:"1",
    expediente:"445666765",
    nomprePaciente:"Alfredo Gonzalez Juarez",
    genero:"M",
    edad:23,
    fechaNacimiento: new Date("24/6/1999"),
    monederoElectronico: 54.50,
    telefono:"8167889100",
},{
    id:"1",
    expediente:"445666765",
    nomprePaciente:"Luisa Jaramillo Perez",
    genero:"F",
    edad:23,
    fechaNacimiento: new Date("24/6/1999"),
    monederoElectronico: 120.00,
    telefono:"8167889100",
}] */
const ProceedingTable: FC<ProceedingTableProps> = ({ componentRef, printing }) => {
  const { procedingStore } = useStore();
  const { expedientes, getAll,getnow } = procedingStore;

  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");

  useEffect(() => {
    const readPriceList = async () => {
      setLoading(true);
      await getnow();
      setLoading(false);
    };

    if (expedientes.length === 0) {
        readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: IColumns<IProceedingList> = [
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, Proceeding) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.proceeding}/${Proceeding.id}?${searchParams}&mode=readonly`);
          }}
        >
          {value}
        </Button>
      ),
    },
    {
      ...getDefaultColumnProps("nomprePaciente", "Nombre del paciente", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
        ...getDefaultColumnProps("genero", "Genero", {
          searchState,
          setSearchState,
          width: "5%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("edad", "Edad", {
          searchState,
          setSearchState,
          width: "10%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("fechaNacimiento", "Fecha de nacimiento", {
          searchState,
          setSearchState,
          width: "20%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("monederoElectronico", "Monedero electronico", {
          searchState,
          setSearchState,
          width: "10%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("telefono", "Teléfono", {
          searchState,
          setSearchState,
          width: "10%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "20%",
      render: (value) => (
        <IconButton
          title="Editar Expediente"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.proceeding}/${value}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const PriceListTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Lista de Expedientes"  />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IProceedingList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 3)}
          pagination={false}
          dataSource={[...expedientes]}
        />
      </div>
    );
  };

  return (
    <Fragment>
        <Row>
            <Col md={12} sm={12}>
                <label htmlFor="">Expediente/Nombre/Codigo de barras/Huella digital: </label>
                <Input style={{width:"300px" , marginBottom:"30px"}} type={"text"} placeholder={""}></Input>
            </Col>
            <Col md={12} sm={12}>
                <Button type="primary">Buscar</Button>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Telefono: </label>
                <InputNumber   style={{width:"300px",marginBottom:"30px"}} placeholder={""}></InputNumber>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Fecha Nacimiento: </label>
                <DatePicker style={{marginLeft:"10px",width:"200px"}} ></DatePicker>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Fecha Alta Exp.: </label>
                <DatePicker style={{marginLeft:"10px",width:"200px"}} ></DatePicker>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Ciudad: </label>
                <Select style={{marginLeft:"10px",width:"300px",marginBottom:"30px"}} ></Select>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Sucursal: </label>
                <Select style={{marginLeft:"10px",width:"300px"}} ></Select>
            </Col>
        </Row>
      <Table<IProceedingList>
        loading={loading || printing}
        size="small"
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={expedientes}
        pagination={defaultPaginationProperties}
        sticky
        scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
      />
      <div style={{ display: "none" }}>{<PriceListTablePrint />}</div>
    </Fragment>
  );
};

export default observer(ProceedingTable);
