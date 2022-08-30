import { Button, Col, Collapse, DatePicker, Divider, Form, Input, InputNumber, PageHeader, Row, Select, Table } from "antd";
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
import { IProceedingForm, IProceedingList, ISearchMedical, ProceedingFormValues, SearchMedicalFormValues } from "../../app/models/Proceeding";
import moment from "moment";

import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import { formItemLayout } from "../../app/util/utils";
import { useForm } from "antd/lib/form/Form";
import DateInput from "../../app/common/form/proposal/DateInput";
const {Panel}=Collapse
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
  const [form] = useForm();
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
      await getnow(search!);
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
  }, [getnow]);
 const onfinish =async ()=>{

  await getnow(search!);
 }
  const columns: IColumns<IProceedingList> = [
    {
      ...getDefaultColumnProps("expediente", "Expediente", {
        searchState,
        setSearchState,
        width: "10%",
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
          width: "10%",
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
 {/*        <Row>





            <Col xs={8} md={8} sm={12}>
                <label>Sucursal: </label>
                <Select allowClear options={BranchOptions} onChange={(value)=>{setSearch({ ...search,sucursal:value  })}} style={{marginLeft:"10px",width:"300px"}} />
            </Col>
        </Row> */}
            <Collapse ghost className="request-filter-collapse">
      <Panel
        header="Filtros"
        key="filter"
        extra={[
          <Button
            key="clean"
            onClick={(e) => {
              e.preventDefault();
              
              form.resetFields();
            }}
          >
            Limpiar
          </Button>,
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              e.preventDefault();
              form.submit();  
            }}
          >
            Filtrar
          </Button>,
        ]}
      >
        <Form<IProceedingForm> {...formItemLayout} form={form}
        onFinish={onfinish}
        size="small">
          <Row gutter={[0, 12]}>
   
          <Col span={8}>
              <DateRangeInput formProps={{ name: "fechaAlta", label: "Fecha de alta" }} />
            </Col>
            <Col span={16}>
              <TextInput formProps={{ name: "expediente", label: "Expediente/Nombre/Codigo de barras/Huella digital" ,labelCol:{span:12}}} />
            </Col>
            <Col span={8}>
              <TextInput formProps={{ name: "telefono", label: "Telefono" }} />
            </Col>
            <Col span={5}></Col>
            <Col span={9}>
              <DateInput formProps={{ name: "fechaNacimiento", label: "Fecha nacimiento" }} />
            </Col>

            <Col span={8}>
              <SelectInput formProps={{ name: "ciudad", label: "Ciudad" }}  options={cityOptions} />
            </Col>
            <Col span={5}></Col>
            <Col span={9}>
              <SelectInput formProps={{ name: "sucursal", label: "Sucursal" }}  options={BranchOptions} />
            </Col>

          </Row>
        </Form>
      </Panel>
    </Collapse>.
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
