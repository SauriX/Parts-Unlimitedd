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
    FormItemProps,
  } from "antd";
  import React, { FC, useCallback, useEffect, useState } from "react";
  import { formItemLayout } from "../../../app/util/utils";
  import TextInput from "../../../app/common/form/TextInput";
  import SwitchInput from "../../../app/common/form/SwitchInput";
  import SelectInput from "../../../app/common/form/SelectInput";
  import { useStore } from "../../../app/stores/store";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { IMaquiladorForm, MaquiladorFormValues } from "../../../app/models/maquilador";
  import ImageButton from "../../../app/common/button/ImageButton";
  import HeaderTitle from "../../../app/common/header/HeaderTitle";
  import NumberInput from "../../../app/common/form/NumberInput";
  import { observer } from "mobx-react-lite";
  import { IOptions } from "../../../app/models/shared";
  import alerts from "../../../app/util/alerts";
  import messages from "../../../app/util/messages";
  import { RuleObject } from "antd/lib/form";
  import { RoleValues } from "../../../app/models/role";
  import MaskInput from "../../../app/common/form/MaskInput";
  import { Mask } from "react-text-mask";
  //import { v4 as uuid } from "uuid";
  
  type MaquiladorFormProps = {
    id: number;
    componentRef: React.MutableRefObject<any>;
    printing: boolean;
  };
  const MaquiladorForm: FC<MaquiladorFormProps> = ({ id, componentRef, printing }) => {
    const { maquiladorStore, optionStore, locationStore } = useStore();
    const { getById, create, update, getAll, maquilador } = maquiladorStore;
    const { getColoniesByZipCode } = locationStore;
  
    const navigate = useNavigate();
  
    const [searchParams] = useSearchParams();
  
    const [form] = Form.useForm<IMaquiladorForm>();
  
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [colonies, setColonies] = useState<IOptions[]>([]);
    const [readonly, setReadonly] = useState(
      searchParams.get("mode") === "readonly"
    );
    const [values, setValues] = useState<IMaquiladorForm>(new MaquiladorFormValues());
    const clearLocation = useCallback(() => {
      form.setFieldsValue({
        estado: undefined,
        ciudad: undefined,
        coloniaId: undefined,
      });
      setColonies([]);
    }, [form]);
  
    const getLocation = useCallback(
      async (zipCode: string) => {
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
      },
      [clearLocation, form, getColoniesByZipCode]
    );
  
    useEffect(() => {
      const readMaquilador = async (id: number) => {
        setLoading(true);
        const maquilador = await getById(id);
  
        if (maquilador) {
          form.setFieldsValue(maquilador);
          getLocation(maquilador.codigoPostal.toString());
          setValues(maquilador);
        }
  
        setLoading(false);
        console.log(maquilador);
      };
  
      if (id) {
        readMaquilador(id);
      }
    }, [form, getById, getLocation, id]);
  
    useEffect(() => {
      const readMaquilador = async () => {
        setLoading(true);
        await getAll(searchParams.get("search") ?? "all");
        setLoading(false);
      };
      readMaquilador();
    }, [getAll, searchParams]);
  
    const onFinish = async (newValues: IMaquiladorForm) => {
      const maquilador = { ...values, ...newValues };
  
      // maquilador.telefono = maquilador.telefono
      //   ? parseInt(
      //       maquilador.telefono.toString()?.replaceAll("_", "0")?.replaceAll("-", "")
      //     )
      //   : undefined;  
        
      let success = false;
  
      if (!maquilador.id) {
        success = await create(maquilador);
      } else {
        success = await update(maquilador);
      }
  
      if (success) {
        navigate(`/maquilador?search=${searchParams.get("search") || "all"}`);
      }
    };
    const actualMaquilador = () => {
      if (id) {
        const index = maquilador.findIndex((x) => x.id === id);
        return index + 1;
      }
      return 0;
    };
  
    const prevnextMaquilador = (index: number) => {
      const maquila = maquilador[index];
      navigate(
        `/maquilador/${maquila?.id}?mode=${searchParams.get(
          "mode"
        )}&search=${searchParams.get("search")}`
      );
    };
  
    useEffect(() => {
      console.log(values);
    }, [values]);
  
    const botonEdit = () => {
        setReadonly(false);
        navigate(`/maquilador/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`) ;
      }

    const onValuesChange = async (changeValues: any, values: IMaquiladorForm) => {
      // console.log(changeValues, values);
  
      const field = Object.keys(changeValues)[0];
  
      if (field === "codigoPostal") {
        const zipCode = changeValues[field] as string;
  
        if (zipCode && zipCode.toString().trim().length === 5) {
          getLocation(zipCode);
        } else {
          clearLocation();
        }
      }
    }; 

   
  
    return (
      <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
        <Row style={{ marginBottom: 24 }}>
            {id!=0 &&
                <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
                        <Pagination
                size="small"
                total={maquilador.length}
                pageSize={1}
                current={actualMaquilador()}
                onChange={(value) => {
                prevnextMaquilador(value - 1);
                }}
                />
                </Col>
            }
            
            <Col md={12} sm={24} style={id ? { textAlign: "right"} : { marginLeft: "80%" }}>
            {!readonly && (
            <Button onClick={() => { navigate("/maquilador"); }}> Cancelar </Button>     
            )}
            {readonly ? (
                <ImageButton  key="edit"  title="Editar" image="editar"
                onClick={() => {  botonEdit();}}        
                />           
                
            ): (
              <Button  type="primary"  htmlType="submit"  disabled={disabled}  
                onClick={() => { form.submit();  return; }}>
                    Guardar
                </Button>
            )}
            </Col>
        </Row>
          <Row>
            <Col md={10} sm={24} style={{ marginRight: 20 }}>
                 <Form<IMaquiladorForm>
                     {...formItemLayout}
                     form={form}
                     name="maquilador"
                    onValuesChange={onValuesChange}
                    onFinish={onFinish}
                    scrollToFirstError
                    onFieldsChange={() => {
                    setDisabled(
                    !form.isFieldsTouched() ||
                        form.getFieldsError().filter(({ errors }) => errors.length)
                        .length > 0
                        );
                        }}
                ></Form>
            </Col>
        </Row>
        <div style={{ display: printing ? "none" : "" }}>
          <div ref={componentRef}>
            {printing && (
              <PageHeader
                ghost={false}
                title={<HeaderTitle title="Catálogo de Maquilador" image="maquilador" />}
                className="header-container"
              ></PageHeader>
            )}
            {printing && <Divider className="header-divider" />}
            <Form<IMaquiladorForm>
              {...formItemLayout}
              form={form}
              name="maquilador"
              onValuesChange={onValuesChange}
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
                    type="string"
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
                      name: "correo",
                      label: "Correo",
                    }}
                    max={100}
                    readonly={readonly}
                    type="email"
                  />
                  <MaskInput
                    formProps={{
                      name: "telefono",
                      label: "Teléfono",
                    }}
                    mask={[
                      /[0-9]/,
                      /[0-9]/,
                      /[0-9]/,
                      "-",
                      /[0-9]/,
                      /[0-9]/,
                      /[0-9]/,
                      "-",
                      /[0-9]/,
                      /[0-9]/,
                      "-",
                      /[0-9]/,
                      /[0-9]/,
                    ]}
                    validator={(_, value: any) =>{
                      if (!value || value.indexOf("_") === -1){
                        return Promise.resolve();
                      }
                      return Promise.reject("El campo debe contener 10 dígitos");
                    }}
                    readonly={readonly}
                  />
                  <TextInput
                    formProps={{
                      name: "paginaWeb",
                      label: "Página Web",
                    }}
                    max={100}
                    readonly={readonly}
                    type="url" 
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
                    readonly={readonly}
                  />              
                </Col>
  
                <Col md={12} sm={24}>
                  <NumberInput
                    formProps={{
                      name: "codigoPostal",
                      label: "Código P",
                    }}
                    max={9999999999}
                    min={1111}
                    required
                    readonly={readonly}
                  />
  
                  <TextInput
                    formProps={{
                      name: "estado",
                      label: "Estado",
                    }}
                    max={100}
                    readonly={readonly}
                  />
  
                  <TextInput
                    formProps={{
                      name: "ciudad",
                      label: "Ciudad",
                    }}
                    max={100}
                    readonly={readonly}
                  />
                  <TextInput
                    formProps={{
                      name: "numeroExterior",
                      label: "Número Exterior",
                    }}
                    max={100}
                    required
                    readonly={readonly}
                  />
                  <TextInput
                    formProps={{
                      name: "numeroInterior",
                      label: "Número interior",
                    }}
                    max={100}
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
                  <SelectInput
                    formProps={{
                      name: "coloniaId",
                      label: "Colonia",
                    }}
                    required
                    readonly={readonly}
                    options={colonies}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        </div>  
      </Spin>
    );
  };
  
  export default observer(MaquiladorForm);
  