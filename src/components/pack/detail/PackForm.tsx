import React, { FC, useEffect, useState } from "react";
import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Select, Input } from "antd";
import { List, Typography } from "antd";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { IOptions } from "../../../app/models/shared";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/MaskInput";
import { IPackForm, PackFormValues } from "../../../app/models/packet";
import views from "../../../app/util/view";

const { Search } = Input;
type PackFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
};
type UrlParams = {
  id: string;
};
const PackForm: FC<PackFormProps> = ({ componentRef, load }) => {
  const { locationStore, branchStore, optionStore } = useStore();
  const { getColoniesByZipCode } = locationStore;
  const { create, update, getAll, sucursales, getById } = branchStore;
  const [searchParams] = useSearchParams();
  const { getdepartamentoOptions, departamentOptions } = optionStore;
  const navigate = useNavigate();
  const [form] = Form.useForm<IPackForm>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [values, setValues] = useState<IPackForm>(new PackFormValues());
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
    getdepartamentoOptions();
  }, [getdepartamentoOptions]);



  useEffect(() => {
    const readuser = async (idUser: string) => {
      setLoading(true);
      console.log("here");
      const all = await getAll("all");
      console.log(all);
      const user = await getById(idUser);
      //form.setFieldsValue(user!);

      //setValues(user!);
      
      setLoading(false);
    };
    if (id) {
      readuser(id);
    }
  }, [/* form */, getById, id]);

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "codigoPostal") {
      const value = changedValues[field];
    }
  };

  const onFinish = async (newValues: IPackForm) => {
    setLoading(true);
    //const User = { ...values, ...newValues };
/*     let success = false;
    if (!User.idSucursal) {
      success = await create(User);
    } else {
      success = await update(User);
    } */

    setLoading(false);
/*     if (success) {
      navigate(`/branches?search=${searchParams.get("search") || "all"}`);
    } */
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
  return (
    <Spin spinning={loading || load} tip={load ? "Imprimiendo" : ""}>
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
                //form.submit();
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
                navigate(`/branches/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`);
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
              title={<HeaderTitle title="Catálogo Paquetes" image="paquete" />}
              className="header-container"
            ></PageHeader>
          )}
          {load && <Divider className="header-divider" />}
          <Form<IPackForm>
            {...formItemLayout}
            form={form}
            name="branch"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
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
                    name: "nombreLargo",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
                <SelectInput
                formProps={{ name: "departamentoId", label: "Departamento" }}
                options={departamentOptions}
                readonly={CheckReadOnly()}
                required
              />
                            <SelectInput
                formProps={{ name: "areaId", label: "Área" }}
                options={/* areas */[]}
                readonly={CheckReadOnly()}
                required
              />
              </Col>
              <Col md={12} sm={24} xs={12}>
              <SwitchInput
                name="activo"
                label="Visible"
                onChange={(value) => {
                  if (value) {
                    alerts.info("El paquete sera visble en la web");
                  } else {
                    alerts.info("El paquete ya no visble en la web");
                  }
                }}
                readonly={CheckReadOnly()}
              />
              <SwitchInput
                name="activo"
                label="Activo"
                onChange={(value) => {
                  if (value) {
                    alerts.info(messages.confirmations.enable);
                  } else {
                    alerts.info(messages.confirmations.disable);
                  }
                }}
                readonly={CheckReadOnly()}
                
              />
            </Col>
            </Row>
          </Form>
          <Divider orientation="left">Estudios</Divider>
          <Row>
          <Col md={6} sm={24} xs={12}>
            <label htmlFor="">Búsqueda por:</label>
          </Col>
          <Col md={9} sm={24} xs={12}>
          <SelectInput
                formProps={{ name: "departamentoId", label: "Departamento" }}
                options={departamentOptions}
                readonly={CheckReadOnly()}
                required
              />
              </Col>
              <Col md={9} sm={24} xs={12}>
                <SelectInput
                formProps={{ name: "areaId", label: "Área" }}
                options={/* areas */[]}
                readonly={CheckReadOnly()}
                required
              />
              </Col>
              <Col md={6} sm={24} xs={12}></Col>
              <Col md={9} sm={24} xs={12}>
              <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
            navigate(`/${views.pack}?search=${value}`);
          }}
        />,</Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(PackForm);
