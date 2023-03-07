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
  Table,
} from "antd";
import { List, Typography } from "antd";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/proposal/TextInput";
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
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/proposal/MaskInput";
import { ISeries, ISeriesList } from "../../../app/models/series";
import BranchSeriesColumns from "../columnDefinition/branchSeries";
import { v4 as uuid } from "uuid";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import PasswordInput from "../../../app/common/form/proposal/PasswordInput";

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
  const { locationStore, branchStore, optionStore, seriesStore } = useStore();
  const { getColoniesByZipCode } = locationStore;
  const { create, update, getAll, sucursales, getById } = branchStore;
  const { getSeries } = seriesStore;
  const [searchParams] = useSearchParams();
  const {
    getDepartmentOptions,
    departmentOptions,
    seriesOptions,
    getSeriesOptions,
  } = optionStore;
  const [department, setDepartment] = useState<IBranchDepartment>();

  const navigate = useNavigate();
  const [form] = Form.useForm<IBranchForm>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [values, setValues] = useState<IBranchForm>(new BranchFormValues());
  const [series, setSeries] = useState<ISeriesList[]>([]);
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
    getSeriesOptions(id!);
    getDepartmentOptions();
  }, [getDepartmentOptions, getSeriesOptions]);

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

      const user = await getById(idUser);
      form.setFieldsValue(user!);

      setSeries(user?.series!);

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

      const departments: IBranchDepartment[] = [
        ...values.departamentos,
        {
          departamento: department.departamento,
          departamentoId: department.departamentoId,
        },
      ];

      setValues((prev) => ({ ...prev, departamentos: departments }));
    }
  };

  const onChange = (e: CheckboxChangeEvent, id: number) => {
    const index = series.findIndex((x) => x.id === id);
    const newSeries = [...series];
    newSeries[index].relacion = e.target.checked;
    setSeries(newSeries);
  };

  const onFinish = async (newValues: IBranchForm) => {
    setLoading(true);

    const User = { ...values, ...newValues };
    console.log(User);

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
            <Row gutter={[12, 24]}>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Código postal",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "numeroExt",
                    label: "Número Exterior",
                  }}
                  max={20}
                  readonly={CheckReadOnly()}
                  required
                />
              </Col>

              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "estado",
                    label: "Estado",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "numeroInt",
                    label: "Número interior",
                  }}
                  max={20}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
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
              </Col>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "ciudad",
                    label: "Ciudad",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24}>
                <PasswordInput
                  formProps={{
                    name: "sucursalKey",
                    label: "Facturación Key",
                  }}
                  max={100}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
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
              </Col>
              <Col md={8} sm={24}>
                <SelectInput
                  formProps={{
                    name: "coloniaId",
                    label: "Colonia",
                  }}
                  required
                  options={colonies}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
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
              <Col md={8} sm={24} xs={8}>
                <SelectInput
                  form={form}
                  formProps={{
                    name: "departamentos",
                    label: "Departamentos",
                  }}
                  multiple
                  options={departmentOptions}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col md={8} sm={24}>
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
              <Col md={8} sm={24} xs={8}>
                <SwitchInput
                  name="matriz"
                  label="Matriz"
                  readonly={CheckReadOnly()}
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <Divider orientation="left">Series</Divider>
      <Table<ISeriesList>
        columns={BranchSeriesColumns({ onChange })}
        dataSource={series}
        rowKey={uuid()}
        pagination={false}
        loading={loading}
        size="small"
      />
    </Spin>
  );
};

export default observer(BranchForm);
