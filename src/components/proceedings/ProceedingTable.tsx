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
import { IProceedingList, ISearchMedical, ProceedingFormValues, SearchMedicalFormValues } from "../../app/models/Proceeding";
import moment from "moment";

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
  const { procedingStore,optionStore,locationStore } = useStore();
  const { expedientes, getAll,getnow,setSearch,search } = procedingStore;
  const {BranchOptions,getBranchOptions}= optionStore;
  const {getCity,cityOptions}=locationStore;
  const [searchParams] = useSearchParams();

  let navigate = useNavigate();

  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
  //const [search,SetSearch] = useState<ISearchMedical>(new SearchMedicalFormValues())
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");
  useEffect(()=>{
    const readData = async(search:ISearchMedical)=>{
      await getBranchOptions();
    }

    readData(search);
  },[getBranchOptions]);
  useEffect(()=>{
    const readData = async()=>{
      await getCity();
    }
    readData();
  },[getCity])
  useEffect(() => {
    const readPriceList = async () => {
      setLoading(true);
      await getnow(search!);
      setLoading(false);
    };

    if (expedientes.length === 0) {
        readPriceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 const onfinish =async ()=>{
  await getnow(search!);
 }
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
        ...getDefaultColumnProps("monederoElectronico", "Monedero electrónico", {
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
          columns={columns.slice(0, 7)}
          pagination={false}
          dataSource={[...expedientes]}
        />
      </div>
    );
  };

  return (
    <Fragment>
        <Row>
            <Col md={18} sm={12}>
                <label htmlFor="">Expediente/Nombre/Codigo de barras/Huella digital: </label>
                <Input value={search.expediente} onChange={(value)=>{setSearch({ ...search,expediente:value.target.value  })}} style={{width:"600px" , marginBottom:"30px"}} type={"text"} placeholder={""}></Input>
            </Col>
            <Col md={6} sm={12}>
                <Button type="primary" onClick={onfinish}>Buscar</Button>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Teléfono: </label>
                <Input value={search.telefono} onChange={(value)=>{setSearch({ ...search,telefono:value.target.value  })}}  style={{width:"300px",marginBottom:"30px"}} placeholder={""}></Input>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Fecha Nacimiento: </label>
                <DatePicker  value={moment(search.fechaNacimiento)} onChange={(value)=>{setSearch({ ...search,fechaNacimiento:value?.toDate()!  })}} style={{marginLeft:"10px",width:"200px"}} ></DatePicker>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Fecha Alta Exp.: </label>
                <DatePicker value={moment(search.fechaAlta)}  onChange={(value)=>{setSearch({ ...search,fechaAlta:value?.toDate()!  })}} style={{marginLeft:"10px",width:"200px"}} ></DatePicker>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Ciudad: </label>
                <Select value={search.ciudad} options={cityOptions} onChange={(value)=>{setSearch({ ...search,ciudad:value  })}} style={{marginLeft:"10px",width:"300px",marginBottom:"30px"}} ></Select>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Sucursal: </label>
                <Select options={BranchOptions} onChange={(value)=>{setSearch({ ...search,sucursal:value  })}} style={{marginLeft:"10px",width:"300px"}} />
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
