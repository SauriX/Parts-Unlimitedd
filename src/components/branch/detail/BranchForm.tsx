import React, { FC, useEffect, useState } from "react";
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
import { IDepartamenList } from "../../../app/models/departament";
import { List, Typography } from "antd";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { IBranchForm,BranchFormValues } from "../../../app/models/branch";
import { IOptions } from "../../../app/models/shared";
import NumberInput from "../../../app/common/form/NumberInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";


type BranchFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
};
type UrlParams = {
  id: string;
};
const BranchForm: FC<BranchFormProps> = ({componentRef, load }) => {
  const { locationStore,branchStore,optionStore } = useStore();
  const { getColoniesByZipCode } = locationStore;
  const { create,update,getAll,sucursales,getById }=branchStore;
  const [searchParams] = useSearchParams();
  const { getdepartamentoOptions, departamentOptions } = optionStore;
  const [clinic, setClinic] = useState<{ clave: ""; id: number }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<IBranchForm>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [values, setValues] = useState<IBranchForm>(new BranchFormValues);
  let { id } = useParams<UrlParams>();
  const CheckReadOnly = () => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  }
  useEffect(() => {
    getdepartamentoOptions();
  }, [getdepartamentoOptions]);



  const deleteClinic = (id: number) => {
    const clinics = values.departaments.filter((x) => x.id !== id);

    setValues((prev) => ({ ...prev, clinicas: clinics }));
  };
  
  const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      ciudad: undefined,
      coloniaId: undefined,
    });
    setColonies([]);
  };

  useEffect(() => {

    const readuser = async (idUser: string) => {
      setLoading(true);
      console.log("here");
      const all =await getAll("all");
      console.log(all);
      const user = await getById(idUser);
      form.setFieldsValue(user!);

      setValues(user!);
      if (user?.codigoPostal && user?.codigoPostal.trim().length === 5) {
        const location = await getColoniesByZipCode(user?.codigoPostal);
        if (location) {
          form.setFieldsValue({
            estado: location.estado,
            ciudad: location.ciudad,
          });
          setColonies(
            location.colonias.map((x) => ({
              value: x.id,
              label: x.nombre,
            }))
          );
        } else {
          clearLocation();
        }
      } else {
        clearLocation();
      }
      setLoading(false);
    };
    if (id) {
      readuser(id);
    }
  }, [form, getById, id]);
  
   const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "codigoPostal") {
      const zipCode = changedValues[field] as string;

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
          form.setFieldsValue({
            estado: location.estado,
            ciudad: location.ciudad,
          });
          setColonies(
            location.colonias.map((x) => ({
              value: x.id,
              label: x.nombre,
            }))
          );
        } else {
          clearLocation();
        }
      } else {
        clearLocation();
      }
    }
  }; 
   const addClinic = () => {

    if (clinic) {
    
        if (values.departaments.findIndex((x) => x.id === clinic.id) > -1) {
          alerts.warning("Ya esta agregada esta clinica");
          return;
        }
        console.log("this the clinics");
        console.log(clinic);
      const clinics: IDepartamenList[] = [
        ...values.departaments,
        {
          id: clinic.id,
          clave: clinic.clave,
          nombre: clinic.clave,
          activo: true,
        },
      ];
        
      setValues((prev) => ({ ...prev, departaments: clinics }));
      console.log(values);
    }
  }; 
  useEffect(() => {
    console.log(values);
  }, [values]);
  console.log("Table");
   const onFinish = async (newValues: IBranchForm) => {
    const User = { ...values, ...newValues };
    let success = false;
    if (!User.idSucursal) {
      success = await create(User);
    } else {
      success = await update(User);
    }

    if (success) {
      navigate(`/sucursales?search=${searchParams.get("search") || "all"}`);
    }
  }; 
   const actualUser = () => {
    if (id) {
      const index = sucursales.findIndex(x => x.idSucursal === id);
      return index + 1;
    }
    return 0;
  }
  const siguienteUser = (index: number) => {
  
    const user = sucursales[index];

    navigate(`/sucursales/${user?.idSucursal}?mode=${searchParams.get("mode")}&search=${searchParams.get("search") ?? "all"}`);
  }  
  return (
    <Spin spinning={loading || load} tip={load ? "Imprimiendo" : ""}>
              <Row style={{ marginBottom: 24 }}>
          {id &&
            <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
              <Pagination size="small" total={sucursales.length} pageSize={1} current={actualUser()} onChange={(value) => { siguienteUser(value - 1) }} />
            </Col>
           }
          {!CheckReadOnly() &&
            <Col md={24} sm={24} xs={24} style={id ? { textAlign: "right" } : { marginLeft: "80%" }}>
              <Button onClick={() => { navigate(`/sucursales`); }} >Cancelar</Button>
              <Button type="primary" htmlType="submit" onClick={() => { form.submit() }}>
                Guardar
              </Button>
            </Col>
          }
          {
            CheckReadOnly() &&
            <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
              <ImageButton key="edit" title="Editar" image="editar" onClick={() => { navigate(`/sucursales/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`); }} />
            </Col>
          }
        </Row>
      <div style={{ display: load ? "none" : "" }}>
        <div ref={componentRef}>
          {load && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="sucursales" image="reagent" />}
              className="header-container"
            ></PageHeader>
          )}
          {load && <Divider className="header-divider" />}
          <Form<IBranchForm>
            {...formItemLayout}
            form={form}
            name="branch"
            initialValues={values}
            onFinish={ onFinish }
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              );
            }}
            onValuesChange={ onValuesChange }
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
                readonly={CheckReadOnly()}
              />
            
              <TextInput
                formProps={{
                  name: "nombre",
                  label: "Nombre",
                }}
                max={100}
                required
                readonly={CheckReadOnly()}
              />
                <TextInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Codigo postal",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "estado",
                    label: "Estado",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "ciudad",
                    label: "Ciudad",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <SelectInput
                  formProps={{
                    name: "coloniaId",
                    label: "Colonia",
                  }}
                  required
                  options={colonies}
                  readonly={CheckReadOnly()}
                />
                            <NumberInput
                  formProps={{
                    name: "numeroExt",
                    label: "Número Exterior",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={CheckReadOnly()}
                  required
                />
              <NumberInput
                  formProps={{
                    name: "numeroInt",
                    label: "Número interior",
                  }}
                  max={9999999999}
                  min={1}
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle",
                  }}
                  max={100}
                  required
                   readonly={CheckReadOnly()}
                />
                  </Col>
                  <Col md={12} sm={24} xs={12}>
                  <TextInput
                  formProps={{
                    name: "correo",
                    label: "Correo",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                  type="email"
                />
                <NumberInput
                  formProps={{
                    name: "telefono",
                    label: "Teléfono",
                  }}
                  max={9999999999}
                  min={1111111111}
                  readonly={CheckReadOnly()}

                />
                <TextInput
                  formProps={{
                    name: "clinicosId",
                    label: "Clinicos",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                  required
                />
                <TextInput
                  formProps={{
                    name: "presupuestosId",
                    label: "Presupuestos",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                  required
                />
                <TextInput
                  formProps={{
                    name: "facturaciónId",
                    label: "Facturacion",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                  required
                />
                <SwitchInput
                  name="activo"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.enable);
                    } else {
                      alerts.info(messages.confirmations.disable);
                    }
                  }}
                  label="Activo"
                  readonly={CheckReadOnly()}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div>
        <div></div>
      </div>
      <Divider orientation="left">Departamentos</Divider>
      <List<IDepartamenList>
         header={
         <div>
           <Col md={12} sm={24} style={{ marginRight: 20 }}>
            Nombre Departamento
            <Select
              options={departamentOptions}
              onChange={(value, option: any) => {
                if (value) {
                  setClinic({ id: value, clave: option.label });
                } else {
                  setClinic(undefined);
                }
              }}
              style={{ width: 240, marginRight: 20 }}
            />
             {!CheckReadOnly()&& (
                <ImageButton
                  key="agregar"
                  title="Agregar Clinica"
                  image="agregar-archivo"
                  onClick={addClinic}
                />
              )}
           </Col>
         </div>
         }
         footer={<div></div>}
         bordered
         dataSource={values.departaments}
         renderItem={(item) => (
          <List.Item>
              <Col md={12} sm={24} style={{ textAlign: "left" }}>
                <Typography.Text mark></Typography.Text>
                {item.nombre}
              </Col>
              <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <ImageButton
                key="Eliminar"
                title="Eliminar Clinica"
                image="Eliminar_Clinica"
                onClick={() => {
                  deleteClinic(item.id);
                }}
              />
            </Col>
          </List.Item>
         )}
      />
    </Spin>
  );
};

export default observer(BranchForm);
