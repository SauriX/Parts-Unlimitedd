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
import { observer } from "mobx-react-lite";
import { List, Typography } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Medics from "../../../views/Medics";
import { createSecureContext } from "tls";
import Item from "antd/lib/list/Item";
import alerts from "../../../app/util/alerts";
import { claveValues } from "../../../app/models/user";
// import { v4 as uuid } from "uuid";

type MedicsFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const MedicsForm: FC<MedicsFormProps> = ({ id, componentRef, printing }) => {
  const { medicsStore, optionStore } = useStore();
  const { getById, create, update, getAll, medics } = medicsStore;
  const { clinicOptions, getClinicOptions } = optionStore;
  // let clave : IClave = new claveValues();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IMedicsForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IMedicsForm>(new MedicsFormValues());
  const [clinic, setClinic] = useState<{ clave: ""; id: number }>();

  useEffect(() => {
    const readMedics = async (id: number) => {
      setLoading(true);
      const medics = await getById(id);
      form.setFieldsValue(medics!);
      setValues(medics!);
      setLoading(false);
      console.log(medics);
    };

    if (id) {
      readMedics(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    getClinicOptions();
  }, [getClinicOptions]);

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
    console.log(values);
  }, [values]);

  const onValuesChange = (changeValues: any, values: IMedicsForm) => {
    // console.log(changeValues, values);

    const code =
      values.nombre.substring(0, 3) +
      values.primerApellido?.substring(0, 1) +
      values.segundoApellido?.substring(0, 1);

    form.setFieldsValue({ clave: code.toUpperCase() });
  };

  const addClinic = () => {
    if (clinic) {
      if(values.clinicas.findIndex(x => x.id === clinic.id) > -1){
        alerts.warning("Ya esta agregada esta clinica")
        return ;
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
        <Col md={10} sm={24} style={{  marginRight: 20 }}>
          <Pagination
            size="small"
            total={medics.length}
            pageSize={1}
            current={actualmedic()}
            onChange={(value) => {
              prevnextMedics(value - 1);
            }}
          />
          <Form<IMedicsForm>
            {...formItemLayout}
            form={form}
            name="medics"
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
        <Col md={8} sm={24} style={{ marginRight: 20, textAlign: "right"}}>
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
          <Col md={2} sm={24} style={{ marginRight: 20, textAlign: "right" }}>
          <Button
            onClick={() => {
              navigate("/medics");
            }}
          >
            Cancelar
          </Button>
        </Col>
        <Col md={2} sm={24} style={{ marginRight: 10, textAlign: "right" }}>
          {!readonly && (
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              onClick={() => {
                form.submit();     
                return ;
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
                  readonly={true}
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
                {/* <NumberInput
                  formProps={{
                    name: "Clinicas",
                    label: "Clinicas",
                  }}
                  max={9999999999}
                  min={9}
                  readonly={true}
                /> */}
                <TextAreaInput
                  formProps={{
                    name: "observaciones",
                    label: "Observaciones",
                  }}
                  max={500}
                  rows={12}
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
        <div></div>
      </div>

      <Divider orientation="left">Clinica/Empresa</Divider>
      <List<IClinicList>
        header={
          <div>
            <Col md={12} sm={24} style={{ marginRight: 20  }}>
              Nombre Clinica/Empresa
              <Select
                options={clinicOptions }
                onChange={(value, option: any) => {
                  if (value) {
                    setClinic({ id: value, clave: option.label });
                  } else {
                    setClinic(undefined);
                  }
                }}
                style={{ width: 240, marginRight: 20  }}
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
    </Spin>
  );
};

export default observer(MedicsForm);
