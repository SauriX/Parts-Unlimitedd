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
import {
  IBranchForm,
  BranchFormValues,
  IBranchDepartment,
} from "../../../app/models/branch";
import { IOptions } from "../../../app/models/shared";
import NumberInput from "../../../app/common/form/NumberInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/MaskInput";
import { error } from "console";

type BranchFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
  isPrinting: boolean;
};
type UrlParams = {
  id: string;
};
const BranchForm: FC<BranchFormProps> = ({
  componentRef,
  load,
  isPrinting,
}) => {
  const { locationStore, branchStore, optionStore } = useStore();
  const { getColoniesByZipCode } = locationStore;
  const { create, update, getAll, sucursales, getById } = branchStore;
  const [searchParams] = useSearchParams();
  const { getDepartmentOptions, departmentOptions } = optionStore;
  const [department, setDepartment] = useState<IBranchDepartment>();
  const navigate = useNavigate();
  const [form] = Form.useForm<IBranchForm>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [values, setValues] = useState<IBranchForm>(new BranchFormValues());
  let { id } = useParams<UrlParams>();
  const CheckReadOnly = () => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  };
  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);

  const deleteClinic = (id: number) => {
    const clinics = values.departamentos.filter((x) => x.departamentoId !== id);

    setValues((prev) => ({ ...prev, departamentos: clinics }));
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
      const all = await getAll("all");
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
    if (department) {
      if (
        values.departamentos.findIndex(
          (x) => x.departamentoId === department.departamentoId
        ) > -1
      ) {
        alerts.warning("Ya esta agregada este departamento");
        return;
      }
      console.log("this the clinics");
      console.log(department);
      const departments: IBranchDepartment[] = [
        ...values.departamentos,
        {
          departamento: department.departamento,
          departamentoId: department.departamentoId,
        },
      ];

      setValues((prev) => ({ ...prev, departamentos: departments }));
      console.log(values);
    }
  };
  useEffect(() => {
    console.log(values);
  }, [values]);
  console.log("Table");
  const onFinish = async (newValues: IBranchForm) => {
    setLoading(true);
    const User = { ...values, ...newValues };
    let success = false;
    if (!User.idSucursal) {
      success = await create(User);
    } else {
      success = await update(User);
    }

    setLoading(false);
    if (success) {
      navigate(`/branches?search=${searchParams.get("search") || "all"}`);
    }
  };
  const actualUser = () => {
    if (id) {
      const index = sucursales.findIndex((x) => x.idSucursal === id);
      return index + 1;
    }
    return 0;
  };
  const siguienteUser = (index: number) => {
    const user = sucursales[index];

    navigate(
      `/branches/${user?.idSucursal}?mode=${searchParams.get("mode")}&search=${
        searchParams.get("search") ?? "all"
      }`
    );
  };
  const spinnerText = () => {
    return isPrinting ? "Imprimiendo..." : "Descargando...";
  };
  return (
    <Spin spinning={loading || load} tip={load ? spinnerText() : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={sucursales?.length ?? 0}
              pageSize={1}
              current={actualUser()}
              onChange={(value) => {
                siguienteUser(value - 1);
              }}
            />
          </Col>
        )}
        {!CheckReadOnly() && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate(`/branches`);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                // e.preventDefault();
                // console.log("form", form.getFieldsValue());
                form.submit();
              }}
            >
              Guardar
            </Button>
          </Col>
        )}
        {CheckReadOnly() && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => {
                navigate(
                  `/branches/${id}?mode=edit&search=${
                    searchParams.get("search") ?? "all"
                  }`
                );
              }}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: load ? "none" : "" }}>
        <div ref={componentRef}>
          {load && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Sucursales" image="laboratorio" />}
              className="header-container"
            ></PageHeader>
          )}
          {load && <Divider className="header-divider" />}
          <Form<IBranchForm>
            {...formItemLayout}
            form={form}
            name="branch"
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
            onValuesChange={onValuesChange}
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
                    label: "Código postal",
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
                <TextInput
                  formProps={{
                    name: "numeroExt",
                    label: "Número Exterior",
                  }}
                  max={20}
                  readonly={CheckReadOnly()}
                  required
                />
                <TextInput
                  formProps={{
                    name: "numeroInt",
                    label: "Número interior",
                  }}
                  max={20}
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
                    return Promise.reject("El campo debe contener 10 dígitos");
                  }}
                  readonly={CheckReadOnly()}
                />
                <TextInput
                  formProps={{
                    name: "clinicosId",
                    label: "Clínicos",
                  }}
                  max={100}
                  readonly={true}
                />
                <TextInput
                  formProps={{
                    name: "presupuestosId",
                    label: "Presupuestos",
                  }}
                  max={100}
                  readonly={true}
                />
                <TextInput
                  formProps={{
                    name: "facturaciónId",
                    label: "Facturación",
                  }}
                  max={100}
                  readonly={true}
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
                <SwitchInput
                  name="matriz"
                  onChange={(value) => {
                    /*                   if (value) {
                    alerts.info(messages.confirmations.enable);
                  } else {
                    alerts.info(messages.confirmations.disable);
                  } */
                  }}
                  label="Matriz"
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
      <List<IBranchDepartment>
        header={
          <div>
            <Col md={12} sm={24} style={{ marginRight: 20 }}>
              Nombre Departamento
              <Select
                options={departmentOptions}
                onChange={(value, option: any) => {
                  if (value) {
                    setDepartment({
                      departamentoId: value,
                      departamento: option.label,
                    });
                  } else {
                    setDepartment(undefined);
                  }
                }}
                style={{ width: 240, marginRight: 20, marginLeft: 10 }}
              />
              {!CheckReadOnly() && (
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
        dataSource={values.departamentos}
        renderItem={(item) => (
          <List.Item>
            <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <Typography.Text mark></Typography.Text>
              {item.departamento}
            </Col>
            <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <ImageButton
                key="Eliminar"
                title="Eliminar Clinica"
                image="Eliminar_Clinica"
                onClick={() => {
                  deleteClinic(item.departamentoId);
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
