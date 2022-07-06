import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber, Tabs, Descriptions } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../../app/util/view";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import { defaultPaginationProperties, getDefaultColumnProps, IColumns, ISearch } from "../../../../app/common/table/utils";
import { IOptions } from "../../../../app/models/shared";
import moment from "moment";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import TextArea from "antd/lib/input/TextArea";
import { IQuotationEstudiosForm, IQuotationExpedienteSearch, IQuotationForm, IQuotationPrice, QuotationEstudiosFormValues, QuotationExpedienteSearchValues } from "../../../../app/models/quotation";
import { moneyFormatter } from "../../../../app/util/utils";
import { IProceedingList } from "../../../../app/models/Proceeding";
import IconButton from "../../../../app/common/button/IconButton";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { EditOutlined } from "@ant-design/icons";
import DateInput from "../../../../app/common/form/proposal/DateInput";
type GeneralesFormProps = {
    printing: boolean;
    handleIdExpediente: React.Dispatch<React.SetStateAction<IProceedingList | undefined>>;
    handleCotizacion: React.Dispatch<React.SetStateAction<IQuotationForm>>;
  };

const BusquedaForm:FC<GeneralesFormProps> = ({printing,handleIdExpediente,handleCotizacion})=>{
    const{ quotationStore }=useStore();
    const { getExpediente,records}=quotationStore;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm<IQuotationExpedienteSearch>();
    const [values, setValues] = useState<IQuotationExpedienteSearch>(new QuotationExpedienteSearchValues());
    const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
      });
      useEffect(()=>{
        const readexp=async ()=>{
          await getExpediente(values);
        }
        readexp();
      },[getExpediente]);
  const { width: windowWidth } = useWindowDimensions();

    const onFinish = async (newValues: IQuotationExpedienteSearch) => {
             setLoading(true);
        
            const reagent = { ...values, ...newValues };
              await getExpediente(reagent);
              setLoading(false);

    };
    const onValuesChange = async (changedValues: IQuotationExpedienteSearch) => {
        const field = Object.keys(changedValues)[0];
        if(field=="edad"){
         /*  const edad = changedValues[field] as number; */
          var hoy = new Date();
      /*     var cumpleaños =  hoy.getFullYear()-edad; */
          /* hoy.setFullYear(cumpleaños); */
          /* setValues((prev) => ({ ...prev, fechaNacimiento: hoy })) */
        }
        if (field === "cp") {
          /* const zipCode = changedValues[field] as string */;
    
  /*         if (zipCode && zipCode.trim().length === 5) {
            } */

        }
    };
    const columns: IColumns<IProceedingList> = [
        {
          ...getDefaultColumnProps("expediente", "Expediente", {
            searchState,
            setSearchState,
            width: "20%",
            minWidth: 150,
            windowSize: windowWidth,
          }),
          render: (value, expediente) => (
            <Button
              type="link"
              onClick={() => {
                handleIdExpediente(expediente);
                console.log("here");
                console.log(expediente);
                handleCotizacion((prev) => ({ ...prev,expedienteid:expediente.id,
                  expediente:expediente.expediente,
                  nomprePaciente:expediente.nomprePaciente,
                  edad:expediente.edad,
                  fechaNacimiento:moment(expediente.fechaNacimiento, 'YYYY-MM-DD'),
                  genero:expediente.genero,
                }))
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
          render: (value,expediente) => (
            <IconButton
              title="Editar Expediente"
              icon={<EditOutlined />}
              onClick={() => {
                handleIdExpediente(expediente);
                console.log("here");
                console.log(expediente);
                handleCotizacion((prev) => ({ ...prev,expedienteid:expediente.id,
                  expediente:expediente.expediente,
                  nomprePaciente:expediente.nomprePaciente,
                  edad:expediente.edad,
                  fechaNacimiento:moment(expediente.fechaNacimiento.getFullYear(), 'YYYY-MM-DD'),
                  genero:expediente.genero,
                }))
              }}
            />
          ),
        },
      ];
      
    return(
        <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
            <Form<IQuotationExpedienteSearch>
                {...formItemLayout}
                form={form} 
                name="generales"
                initialValues={values}
                onFinish={onFinish}
                scrollToFirstError
                onValuesChange={onValuesChange} 
            >
                <Row>
                <Col span={12}>
                        <TextInput
                            formProps={{
                            name: "buscar",
                            label: "Buscar",
                            }}
                            showLabel
                            max={100}
                            //errors={errors.find((x) => x.name === "exp")?.errors}
                        />
                    </Col>
                    <Col span={3}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                             form.submit(); 
                        }}
                        >
                        Buscar
                    </Button>
                    </Col>
                    <Col span={4}></Col>
                    <Col sm={10}>
                    <DateInput 
                      formProps={{
                        name: "fechaNacimiento",
                        label: "Fecha Incial",
                        
                      }}
                     />
                    </Col>
                    <Col sm={10}>
                    <DateInput 
                      formProps={{
                        name: "fechaNacimiento",
                        label: "Fecha FInal",
                        
                      }}/>
                    </Col>
                    <Col sm={2}></Col>
                    <Col sm={11}>
                    <TextInput
                            formProps={{
                            name: "email",
                            label: "Email",
                            style:{marginTop:"10px"}
                            }}
                            max={100}
                            //errors={errors.find((x) => x.name === "exp")?.errors}
                        />
                    </Col>
                    <Col sm={11}>
                    <TextInput
                            formProps={{
                            name: "telefono",
                            label: "Telefono",
                            style:{marginTop:"10px"}
                            }}
                            max={100}
                            //errors={errors.find((x) => x.name === "exp")?.errors}
                        />
                    </Col>
                </Row>
            </Form>
            <Table<IProceedingList>
                loading={loading || printing}
                size="small"
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={records}
                pagination={defaultPaginationProperties}
                sticky
                scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
            />
        </Spin>
    )
}
export default observer(BusquedaForm);