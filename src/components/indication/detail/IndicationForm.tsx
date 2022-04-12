import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Select,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IIndicationForm, IndicationFormValues } from "../../../app/models/indication";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import NumberInput from "../../../app/common/form/NumberInput";
import { List, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Indications from "../../../views/Indications";
import { createSecureContext } from "tls";
import Item from "antd/lib/list/Item";

type IndicationFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const IndicationForm: FC<IndicationFormProps> = ({ id, componentRef, printing  }) => {
  const { indicationStore } = useStore();
  const { getById, create, update, getAll, indication, } = indicationStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IIndicationForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IIndicationForm>(new IndicationFormValues());

  useEffect(() => {
    const readIndication = async (id: number) => {
      setLoading(true);
      const indication = await getById(id);
      form.setFieldsValue(indication!);
      setValues(indication!);
      setLoading(false);
    };

    if (id) {
      readIndication(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    const readIndication = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readIndication();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: IIndicationForm) => {
    const indication = { ...values, ...newValues };

    let success = false;

    if (!indication.id) {
      success = await create(indication);
    } else {
      success = await update(indication);
    }

    if (success) {
      navigate(`/indication?search=${searchParams.get("search")}`);
    }
  };

  const actualIndication =()=>{
    if(id){
      
   const index =  indication.findIndex(x => x.id === id);
   return index + 1;
    }
    return 0;
  }

  const prevnextIndication =(index:number)=>{
    const indi = indication[index];
    navigate(`/indication/${indi?.id}?mode=${searchParams.get("mode")}&search=${searchParams.get("search")}`);
  }

  useEffect(() => {
    console.log(values);
  }, [values]);

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        <Col md={10} sm={24} style={{ textAlign: "left" }}>
          <Pagination size="small" total={indication.length} pageSize={1} current={actualIndication()} onChange={(value) =>{prevnextIndication(value-1)}} />
        </Col>
        <Col md={8} sm={24} style={{marginRight: 20, textAlign: "right" }}>
        {readonly && (
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => {
                setReadonly(false);
              }}
            />
          )}
          </Col>
          <Col md={2} sm={24} style={{marginRight: 20, textAlign: "right" }}>
          <Button onClick={() => {
              navigate("/indication");
            }}
          >
            Cancelar</Button>
          </Col>
            <Col md={2} sm={24} style={{marginRight: 10, textAlign: "right" }}>
            {!readonly && (

            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              onClick={() => {
                form.submit();
              }}
            >
              Guardar
            </Button>
          )}
        </Col>
      </Row>

      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
              <PageHeader
                ghost={false}
                title={<HeaderTitle title="Catálogo de Indicaciones" image="doctor" />}
                className="header-container"
              ></PageHeader>
            )}
          {printing && <Divider className="header-divider" />}
          <Form<IIndicationForm>
          {...formItemLayout}
          form={form}
          name="indication"
          initialValues={values}
          onFinish={onFinish}
          scrollToFirstError
          onFieldsChange={() => {
            setDisabled(
              !form.isFieldsTouched() || 
                form.getFieldsError().filter(({ errors }) => errors.length)
                  .length > 0
            );
          }}
        >
          <Row>
            <Col md={12} sm={24}>
              <TextInput
                formProps={{
                  name: "clave",
                  label: "Clave",
                }}
                max={100}
                required
                readonly={readonly}
              />
            
              <TextInput
                formProps={{
                  name: "nombre",
                  label: "Nombre",
                }}
                max={100}
                required
                readonly={readonly}
              />
              <TextAreaInput
                  formProps={{
                    name: "descripcion",
                    label: "Descripcion",
                  }}
                  max={500}
                  rows={8}
                  required
                  readonly={readonly}
                />
    
              <SwitchInput 
              name="activo" 
              label="Activo" 
              readonly={readonly} 
              />
         
            </Col>
          </Row>
        </Form>
      </div>
    </div>

    </Spin>
  );

  // const columns: IColumns<IIndicationList> = [
  //   {
  //     ...getDefaultColumnProps("clave", "Clave", {
  //       searchState,
  //       setSearchState,
  //       width: "15%",
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //     render: (value, user) => (
  //       <Button
  //         type="link"
  //         onClick={() => {
  //           navigate(`/indication/${user.id}?${searchParams}&mode=readonly&search=${searchParams.get("search") ?? "all"}`);
  //         }}
  //       >
  //         {value}
  //       </Button>
  //     ),
  //   },
  //   {
  //     ...getDefaultColumnProps("nombre", "Nombre", {
  //       searchState,
  //       setSearchState,
  //       width: "20%",
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //   },
  //   {
  //     ...getDefaultColumnProps("descripcion", "Descripcion", {
  //       searchState,
  //       setSearchState,
  //       width: "20%",
  //       minWidth: 150,
  //       windowSize: windowWidth,
  //     }),
  //   },
  // ];

};



export default IndicationForm;
