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
import { IMedicsForm, MedicsFormValues } from "../../../app/models/medics";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import NumberInput from "../../../app/common/form/NumberInput";
import { IClinicList } from "../../../app/models/clinic";
import { List, Typography, } from 'antd';
import TextArea from "antd/lib/input/TextArea";

type MedicsFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const MedicsForm: FC<MedicsFormProps> = ({ id, componentRef, printing }) => {
  const { medicsStore } = useStore();
  const { getById, create, update } = medicsStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IMedicsForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IMedicsForm>(new MedicsFormValues());

  useEffect(() => {
    const readMedics = async (id: number) => {
      setLoading(true);
      const medics = await getById(id);
      form.setFieldsValue(medics!);
      setValues(medics!);
      setLoading(false);
    };

    if (id) {
      readMedics(id);
    }
  }, [form, getById, id]);

  const onFinish = async (newValues: IMedicsForm) => {
    const medics = { ...values, ...newValues };

    let success = false;

    if (!medics.idMedico) {
      success = await create(medics);
    } else {
      success = await update(medics);
    }

    if (success) {
      navigate(`/medics?search=${searchParams.get("search")}`);
    }
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      
      <Row style={{ marginBottom: 24 }}>
        <Col md={12} sm={24} style={{ textAlign: "left" }}>
          <Pagination size="small" total={50} pageSize={1} current={9} />
        </Col>
        <Col md={12} sm={24} style={{ textAlign: "right" }}>
        {readonly && (
          <ImageButton key="edit" title="Editar" image="editar" onClick={() => {
              setReadonly(false);
                }} />
            
          )}
          < Button
            onClick={() => {
              navigate("/medics");
            }}
          >
            Cancelar
          </Button>
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
              title={<HeaderTitle title="Catálogo de Medicos" image="doctor" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IMedicsForm>
            {...formItemLayout}
            form={form}
            name="medics"
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
                <TextInput
                  formProps={{
                    name: "primerApellido",
                    label: "Primer Apellido",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "segundoApellido",
                    label: "Segundo Apellido",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "especialidadId",
                    label: "Especialidad",
                  }}
                  max={9999999999}
                  min={9}
                  required
                  readonly={readonly}
                />
                <TextAreaInput
                  formProps={{
                    name: "observaciones",
                    label: "Observaciones", 
                  }}
                  max={100}
                  rows ={12}
                  readonly={readonly}
                />

              </Col>

              <Col md={12} sm={24}>
              <NumberInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Código Postal",
                  }}
                  max={9999999999}
                  min={1111}
                  required
                  readonly={readonly}
                />
                
                <NumberInput
                  formProps={{
                    name: "estadoId",
                    label: "Estado",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={readonly}
                />

                <NumberInput
                  formProps={{
                    name: "ciudadId",
                    label: "Ciudad",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "numeroExterior",
                    label: "Numero Exterior",
                  }}
                  max={9999999999}
                  min={1}
                  required
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "numeroInterior",
                    label: "Número interior",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "coloniaId",
                    label: "Colonia",
                  }}
                  max={9999999999}
                  min={1}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "Correo",
                  }}
                  max={100}
                  readonly={readonly}
                  type="email"
                />
                <NumberInput
                  formProps={{
                    name: "celular",
                    label: "Celular",
                  }}
                  max={9999999999}
                  min={1000000000}
                  readonly={readonly}
                />
                <NumberInput
                  formProps={{
                    name: "telefono",
                    label: "Teléfono",
                  }}
                  max={9999999999}
                  min={1111111111}
                  readonly={readonly}
                />

              <SwitchInput name="activo" label="Activo" readonly={readonly} />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div>
        <div>
        </div>
      </div>
      
         <Divider orientation="left">Clinica/Empresa</Divider>
         <List<IClinicList>
           header={<div>
             <Col md={12} sm={24}> Clinica/Empresa 
             <Select
             options={[{label:"Clinica 1", value:1},
             {label:"Clinica 2", value:2}, 
             {label:"Clinica 3", value:3}]}
             onChange={(value, option)=>{

             }}
               />
               {!readonly && (
                 <ImageButton key="agregar" title="Agregar Clinica" image="agregar-archivo" onClick={ () => {} } />
              )}           
            </Col>
           </div>} 
            footer={<div></div>} 
            bordered
            dataSource={values.clinicas}
            renderItem={item => (
              <List.Item>
              <Typography.Text mark>[ITEM] <ImageButton key="Eliminar" title="Eliminar Clinica" image="Eliminar_Clinica" onClick={ () => {} } />
              </Typography.Text> {item}
              </List.Item>
              )}
            />          
      </Spin>
      
    );
 };

export default MedicsForm;
