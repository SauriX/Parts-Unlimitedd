import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
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

type MedicsFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
]; 
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
          <ImageButton key="edit" title="Editar" image="edit" onClick={() => {
              setReadonly(false);
                }} />
            /*<Button
            onClick={() => {
           setReadonly(false);
             }}
            >
              Editar
            </Button>*/
            
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
              </Col>
              
              <Col md={12} sm={24}>
                <NumberInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Codigo Postal",
                  }}
                  max={9999999999}
                  min={1111}
                  required
                  readonly={readonly}
                />
              </Col>

              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={0}>
                <NumberInput
                  formProps={{
                    name: "estadoId",
                    label: "Estado",
                  }}
                  max={9999999999}
                  min={0}
                  readonly={readonly}
                />
              </Col>

              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "primerApellido",
                    label: "PrimerApellido",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={0}>
                <NumberInput
                  formProps={{
                    name: "ciudadId",
                    label: "Ciudad",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={readonly}
                />
              </Col>

              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "segundoApellido",
                    label: "SegundoApellido",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24}>
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
              </Col>
              <Col md={12} sm={24}>
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
              </Col>

              <Col md={12} sm={0}>
                <NumberInput
                  formProps={{
                    name: "numeroInterior",
                    label: "Numero interior",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={readonly}
                />
              </Col>

              <Col md={12} sm={0}>
                <TextInput
                  formProps={{
                    name: "observaciones",
                    label: "Observaciones",
                  }}
                  max={100}
                  readonly={readonly}
                />
              </Col>


              <Col md={12} sm={12}>
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>


              <Col md={12} sm={12}>
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
              </Col>

              <Col md={12} sm={12}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "Correo",
                  }}
                  max={100}
                  readonly={readonly}
                  type="email"
                />
              </Col>
              <Col md={12} sm={12}>
                <NumberInput
                  formProps={{
                    name: "telefono",
                    label: "Telefono",
                  }}
                  max={9999999999}
                  min={1111111111}
                  readonly={readonly}
                />
              </Col>

              <Col md={12} sm={0}>
                <NumberInput
                  formProps={{
                    name: "celular",
                    label: "Celular",
                  }}
                  max={9999999999}
                  min={1000000000}
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}>
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
      
         <Divider orientation="left">Default Size</Divider>
         <List<IClinicList>
           header={<div>
             <Col md={12} sm={24}>
             <SelectInput
              formProps={{ name: "nombre", label: "Clinica/Empresa" }}
             options={[]}
              readonly={readonly}
               /></Col>
               <Col md={2} sm={24}>
            <ImageButton key="agregar" title="Agregar Clinica" image="agregar-archivo" onClick={ () => {} } />
            </Col>
           </div>} 
            footer={<div></div>} 
            bordered
            //dataSource={IClinicList}
            renderItem={item => (
              <List.Item>
              <Typography.Text mark>[ITEM]</Typography.Text> {item}
              </List.Item>
              )}
            />
          );
      </Spin>
    );
 };

export default MedicsForm;
