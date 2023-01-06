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
  Image,
} from "antd";
import React, { FC, useCallback, useEffect, useState } from "react";
import { formItemLayout, imageFallback } from "../../../app/util/utils";
import { InboxOutlined } from "@ant-design/icons";
import TextInput from "../../../app/common/form/proposal/TextInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IMedicsForm, MedicsFormValues } from "../../../app/models/medics";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { IClinicList } from "../../../app/models/clinic";
import { observer } from "mobx-react-lite";
import { List, Typography } from "antd";
import { IOptions } from "../../../app/models/shared";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/proposal/MaskInput";

type MedicsFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const MedicsForm: FC<MedicsFormProps> = ({ id, componentRef, printing }) => {
  const { medicsStore, optionStore, locationStore } = useStore();
  const { getById, create, update, getAll, medics } = medicsStore;
  const { clinicOptions, getClinicOptions } = optionStore;
  const { fieldOptions, getfieldsOptions } = optionStore;
  const { getColoniesByZipCode } = locationStore;
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);

  const [values, setValues] = useState<IMedicsForm>(new MedicsFormValues());
  const [clinic, setClinic] = useState<{ clave: ""; id: number }>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<IMedicsForm>();

  const getContent = (url64: string) => {
    if (!url64) {
      return (
        <>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Dar click o arrastrar archivo para cargar
          </p>
          <p className="ant-upload-hint">
            La imagén debe tener un tamaño máximo de 2MB y formato jpeg o png
          </p>
        </>
      );
    }

    const url = url64;

    return (
      <Image
        preview={false}
        style={{ maxWidth: "90%" }}
        src={url}
        fallback={imageFallback}
      />
    );
  };

  const clearLocation = useCallback(() => {
    form.setFieldsValue({
      estadoId: undefined,
      ciudadId: undefined,
      coloniaId: undefined,
    });
    setColonies([]);
  }, [form]);

  const getLocation = useCallback(
    async (zipCode: string) => {
      const location = await getColoniesByZipCode(zipCode);
      if (location) {
        form.setFieldsValue({
          estadoId: location.estado,
          ciudadId: location.ciudad,
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
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  useEffect(() => {
    const readMedics = async (id: string) => {
      setLoading(true);
      const medics = await getById(id);

      if (medics) {
        form.setFieldsValue(medics);
        if (medics.codigoPostal) {
          getLocation(medics.codigoPostal.toString());
        }
        setValues(medics);
      }

      setLoading(false);
      //console.log(medics);
    };

    if (id) {
      readMedics(id);
    }
  }, [form, getById, getLocation, id]);

  useEffect(() => {
    getClinicOptions();
  }, [getClinicOptions]);

  useEffect(() => {
    getfieldsOptions();
  }, [getfieldsOptions]);

  useEffect(() => {
    const readMedics = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readMedics();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: IMedicsForm) => {
    const medics = { ...values, ...newValues };
    let success = false;

    const clinics = [...medics.clinicas];
    clinics.forEach((v, i, a) => {
      a[i].id = typeof a[i].id === "string" ? 0 : v.id;
    });
    medics.clinicas = clinics;

    if (!medics.idMedico) {
      medics.idMedico = "00000000-0000-0000-0000-000000000000";
      success = await create(medics);
    } else {
      success = await update(medics);
    }

    if (success) {
      navigate(`/medics?search=${searchParams.get("search") || "all"}`);
    }
  };
  const actualmedic = () => {
    if (id) {
      const index = medics.findIndex((x) => x.idMedico === id);
      return index + 1;
    }
    return 0;
  };

  const prevnextMedics = (index: number) => {
    const medic = medics[index];
    navigate(
      `/medics/${medic?.idMedico}?mode=${searchParams.get(
        "mode"
      )}&search=${searchParams.get("search")}`
    );
  };

  useEffect(() => {
    //console.log(values);
  }, [values]);

  const onValuesChange = async (changeValues: any, values: IMedicsForm) => {
    // console.log(changeValues, values);

    const code =
      values.nombre.substring(0, 3) +
      values.primerApellido?.substring(0, 1) +
      values.segundoApellido?.substring(0, 1);

    form.setFieldsValue({ clave: code.toUpperCase() });

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
  const addClinic = () => {
    if (clinic) {
      if (values.clinicas.findIndex((x) => x.id === clinic.id) > -1) {
        alerts.warning("Ya esta agregada esta clinica");
        return;
      }
      const clinics: IClinicList[] = [
        ...values.clinicas,
        {
          id: clinic.id,
          clave: clinic.clave,
          nombre: clinic.clave,
          activo: true,
        },
      ];

      setValues((prev) => ({ ...prev, clinicas: clinics }));
    }
  };

  const deleteClinic = (id: number) => {
    const clinics = values.clinicas.filter((x) => x.id !== id);

    setValues((prev) => ({ ...prev, clinicas: clinics }));
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!readonly && (
          <Col md={24} sm={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate("/medics");
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              onClick={() => {
                form.submit();
                return;
              }}
            >
              Guardar{" "}
            </Button>
          </Col>
        )}
        {readonly && (
          <Col md={12} sm={24} style={{ textAlign: "right" }}>
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
        )}
      </Row>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo de Médicos" image="doctor" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IMedicsForm>
            {...formItemLayout}
            form={form}
            name="medics"
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
              <Col span={24}>
                <Row justify="center" gutter={[12, 24]}>
                  <Col md={8} sm={24}>
                    <TextInput
                      formProps={{
                        name: "clave",
                        label: "Clave",
                      }}
                      max={100}
                      required
                      readonly={true}
                      type="string"
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "nombre",
                        label: "Nombre",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "primerApellido",
                        label: "Primer Apellido",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "segundoApellido",
                        label: "Segundo Apellido",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "password",
                        label: "Contraseña",
                      }}
                      max={100}
                      readonly={readonly}
                    />
                    <br />
                    <SelectInput
                      formProps={{
                        name: "especialidadId",
                        label: "Especialidad",
                      }}
                      readonly={readonly}
                      options={fieldOptions}
                    />
                  </Col>
                  <Col md={8} sm={24}>
                    <TextInput
                      formProps={{
                        name: "calle",
                        label: "Calle",
                      }}
                      max={100}
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "numeroExterior",
                        label: "Número Exterior",
                      }}
                      max={9999}
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "numeroInterior",
                        label: "Número interior",
                      }}
                      max={9999}
                      readonly={readonly}
                    />
                    <br />
                    <MaskInput
                      formProps={{
                        name: "codigoPostal",
                        label: "Código P",
                      }}
                      mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
                      validator={(_, value: any) => {
                        if (!value || value.indexOf("_") === -1) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "El campo debe contener 5 dígitos"
                        );
                      }}
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "estadoId",
                        label: "Estado",
                      }}
                      max={100}
                      readonly={readonly}
                    />
                    <br />
                    <TextInput
                      formProps={{
                        name: "ciudadId",
                        label: "Ciudad",
                      }}
                      max={100}
                      readonly={readonly}
                    />
                    <br />
                    <SelectInput
                      formProps={{
                        name: "coloniaId",
                        label: "Colonia",
                      }}
                      readonly={readonly}
                      options={colonies}
                    />
                  </Col>
                  <Col md={8} sm={24}>
                    <TextInput
                      formProps={{
                        name: "correo",
                        label: "Correo",
                      }}
                      max={100}
                      readonly={readonly}
                      type="email"
                    />
                    <br />
                    <MaskInput
                      formProps={{
                        name: "celular",
                        label: "Celular",
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
                      validator={(_, value: any) => {
                        if (!value || value.indexOf("_") === -1) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "El campo debe contener 10 dígitos"
                        );
                      }}
                      readonly={readonly}
                    />
                    <br />
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
                      validator={(_, value: any) => {
                        if (!value || value.indexOf("_") === -1) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "El campo debe contener 10 dígitos"
                        );
                      }}
                      readonly={readonly}
                    />
                    <br />
                    <TextAreaInput
                      formProps={{
                        name: "observaciones",
                        label: "Observaciones",
                      }}
                      max={500}
                      rows={6}
                      autoSize
                      readonly={readonly}
                    />
                    <br />
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
                </Row>
              </Col>
            </Row>
          </Form>

          <Divider orientation="left">Clínica / Empresa</Divider>
          <List<IClinicList>
            header={
              <div>
                <Col md={12} sm={24} style={{ marginRight: 20 }}>
                  Nombre Clínica/Empresa{" "}
                  <Select
                    options={clinicOptions}
                    onChange={(value, option: any) => {
                      if (value) {
                        setClinic({ id: value, clave: option.label });
                      } else {
                        setClinic(undefined);
                      }
                    }}
                    style={{ width: 240, marginRight: 20 }}
                  />
                  {!readonly && (
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
            dataSource={values.clinicas}
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
        </div>
      </div>
    </Spin>
  );
};

export default observer(MedicsForm);
