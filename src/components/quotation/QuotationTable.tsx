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
import moment from "moment";
import SwitchInput from "../../app/common/form/SwitchInput";
import VirtualTable from "../../app/common/table/VirtualTable";
import { IQuotationList, ISearchQuotation } from "../../app/models/quotation";
import DateInput from "../../app/common/form/proposal/DateInput";
import TextInput from "../../app/common/form/proposal/TextInput";
import DateRangeInput from "../../app/common/form/proposal/DateRangeInput";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import { formItemLayout } from "../../app/util/utils";
import { useForm } from "antd/lib/form/Form";
const {Panel}=Collapse
type QuotationTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const cotizaciones =[{
    id:"12345678-1234-1234-1234-123456789124",
    presupuesto:"445666765 ",
    nomprePaciente:"Alfredo Gonzalez Juarez",
    estudios:"Rayos X,Electrocardiograma",
    email:"alfredo.gj@...",
    whatsapp:"8167889100 ",
    fecha:new  Date(moment.now()),
    expediente:"12312",
    activo:true,
},{
    id:"12345678-1234-1234-1234-123456789123",
    presupuesto:"445666765 ",
    nomprePaciente:"Alfredo Gonzalez Juarez",
    estudios:"Rayos X,Electrocardiograma",
    email:"alfredo.gj@...",
    whatsapp:"8167889100 ",
    fecha:new  Date(moment.now()),
    expediente:"12312",
    activo:true,
}];
const QuotationTable: FC<QuotationTableProps> = ({ componentRef, printing }) => {
  const { optionStore,locationStore,quotationStore } = useStore();
  const {  setSearch,getAll,search,quotatios } = quotationStore;
  const {BranchOptions,getBranchOptions}= optionStore;
  const {getCity,cityOptions}=locationStore;
  const [searchParams] = useSearchParams();

  let navigate = useNavigate();
  const [form] = useForm();
  const { width: windowWidth } = useWindowDimensions();

  const [loading, setLoading] = useState(false);
  //const [search,SetSearch] = useState<ISearchMedical>(new SearchMedicalFormValues())
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  console.log("Table");
  useEffect(()=>{
     const readData = async()=>{
      await getBranchOptions();
    }

     readData();
  },[getBranchOptions]);
  useEffect(()=>{
    const readData = async()=>{
      await getCity();
      await getAll(search!); 
    }
    readData();
  },[getCity])

  useEffect(() => {
    console.log(quotatios,"hola");

    const readPriceList = async (search:ISearchQuotation) => {
      setLoading(true);
      console.log("getexpedientes");
       await getAll(search!); 
      setLoading(false);
    };
    
     if (quotatios.length === 0) {
        readPriceList(search);
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 const onfinish =async ()=>{
   await getAll(search!); 
 }
    const columns: IColumns<IQuotationList> = [
    {
      ...getDefaultColumnProps("presupuesto", "Presupuesto", {
        searchState,
        setSearchState,
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
      render: (value, cotizacion) => (
        <Button
          type="link"
          onClick={() => {
            navigate(`/${views.quotatiion}/${cotizacion.id}?${searchParams}&mode=readonly`);
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
        width: 200,
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
        ...getDefaultColumnProps("estudios", "Estudios", {
          searchState,
          setSearchState,
          width: 150,
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("email", "Email", {
          searchState,
          setSearchState,
          width: 150,
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("whatsapp", "Whatsapp", {
          searchState,
          setSearchState,
          width:100,
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("fecha", "Fecha", {
          searchState,
          setSearchState,
          width: 200,
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },

      {
        ...getDefaultColumnProps("expediente", "Expediente", {
          searchState,
          setSearchState,
          width: 100,
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
      
        {
      key: "activo",
      dataIndex: "activo",
      title: "Activo",
      align: "center",
      width: 100,
      render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width:  200,
      render: (value,cotizacion) => (
        <IconButton
          title="Editar Expediente"
          icon={<EditOutlined />}
          onClick={() => {
            navigate(`/${views.quotatiion}/${cotizacion.id}?${searchParams}&mode=edit`);
          }}
        />
      ),
    },
  ];

  const QuotationTablePrint = () => {
    return (
      <div ref={componentRef}>
        <PageHeader
          ghost={false}
          title={<HeaderTitle title="Catálogo de Cotizaciones"  />}
          className="header-container"
        ></PageHeader>
        <Divider className="header-divider" />
        <Table<IQuotationList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns.slice(0, 7)}
          pagination={false}
          dataSource={quotatios}
        />
      </div>
    );
  };
  return (
    <Fragment>
{/*         <Row>
            <Col md={13} sm={12}>
                <label htmlFor="">Presupuesto/Nombre: </label>
                <Input value={search.presupuesto} onChange={(value)=>{ setSearch({ ...search,presupuesto:value.target.value  }) }} style={{width:"500px" , marginBottom:"30px"}} type={"text"} placeholder={""}></Input>
            </Col>

            <Col md={6} sm={12}>
                <Button type="primary" onClick={onfinish}>Buscar</Button>
            </Col>
            <Col md={5} sm={12}>
            <SwitchInput
                name="activo"
                label="Activo"
                onChange={(value) => {
                    setSearch({ ...search,activo:value })
                }}
              />
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Teléfono: </label>
                <Input maxLength={10} value={search.telefono} onChange={(value)=>{setSearch({ ...search,telefono:value.target.value  })}}  style={{width:"300px",marginBottom:"30px"}} placeholder={""}></Input>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Fecha: </label>
                <DatePicker  value={moment(search.fechaAlta)} onChange={(value)=>{setSearch({ ...search,fechaAlta:value?.toDate()!  })}} style={{width:"200px"}} ></DatePicker>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Email:</label>
                <Input  value={search.email} onChange={(value)=>{setSearch({ ...search,email:value.target.value  })}} type={"email"}  style={{width:"300px",marginBottom:"30px"}}></Input>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Ciudad: </label>
                <Select value={search.ciudad} options={cityOptions} onChange={(value)=>{setSearch({ ...search,ciudad:value  })}} style={{width:"300px",marginBottom:"30px"}} ></Select>
            </Col>
            <Col xs={8} md={8} sm={12}>
                <label>Sucursal: </label>
                <Select options={BranchOptions} onChange={(value)=>{setSearch({ ...search,sucursal:value  })}} style={{width:"300px"}} />
            </Col>
        </Row> */}
 <Row gutter={[0, 12]}>

  <Col md={4} style={{marginLeft:"92%"}}>
  <Button
            key="clean"
            onClick={(e) => {
              e.preventDefault();
              
              form.resetFields();
            }}
          >
            Limpiar
          </Button>
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              form.submit();  
            }}
          >
            Filtrar
          </Button>
  </Col>
 </Row>
<Collapse ghost className="request-filter-collapse">
      <Panel
        header="Filtros"
        key="filter"
        extra={[

        ]}
      >
        <Form<ISearchQuotation> {...formItemLayout} form={form}
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
         {/* <VirtualTable columns={columns as any} dataSource={cotizaciones} scroll={{ y: 300, x: '100vw' }} />  */}
         <Table<IQuotationList>
          size="small"
          rowKey={(record) => record.id}
          columns={columns}
          pagination={false}
          dataSource={quotatios}
        />
      <div style={{ display: "none" }}>{<QuotationTablePrint />}</div>
    </Fragment>
  );
};

export default observer(QuotationTable);
