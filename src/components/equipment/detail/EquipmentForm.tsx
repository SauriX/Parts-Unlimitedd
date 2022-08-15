import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Table,
  List,
  Typography,
  Select,
} from "antd";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IEquipmentForm,
  EquipmentFormValues,
  IEquipmentList,
  IEquipmentBranch,
} from "../../../app/models/equipment";

import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  getDefaultColumnProps,
  IColumns,
  defaultPaginationProperties,
  ISearch,
} from "../../../app/common/table/utils";
import { IStudyList } from "../../../app/models/study";
import { observer } from "mobx-react-lite";
import Study from "../../../app/api/study";

type EquipmentFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const EquipmentForm: FC<EquipmentFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { equipmentStore, optionStore } = useStore();
  const { getSucursalesOptions, sucursales } = optionStore;
  const { getById, create, update, getAll, equipment } = equipmentStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IEquipmentForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IEquipmentForm>(
    new EquipmentFormValues()
  );
  const [branch, setBranch] = useState<IEquipmentBranch>();
  useEffect(() => {
    getSucursalesOptions();
  }, [getSucursalesOptions]);
  useEffect(() => {
    const readEquipment = async (id: number) => {
      setLoading(true);
      const equipment = await getById(id);
      form.setFieldsValue(equipment!);
      setValues(equipment!);
      setLoading(false);
    };

    if (id) {
      readEquipment(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    const readEquipment = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readEquipment();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: IEquipmentForm) => {
    const equipment = { ...values, ...newValues };

    let success = false;

    if (!equipment.id) {
      success = await create(equipment);
    } else {
      success = await update(equipment);
    }

    if (success) {
      navigate(`/equipment?search=${searchParams.get("search") ?? "all"}`);
    }
  };
  const addValueEquipment = () => {
    if (branch) {
      const valuesEquipment: IEquipmentBranch[] = [];
    }
  };

  // const actualEquipment = () => {
  //   if (id) {
  //     const index = equipment.findIndex((x) => x.id === id);
  //     return index + 1;
  //   }
  //   return 0;
  // };

  // const prevnextEquipment = (index: number) => {
  //   const indi = equipment[index];
  //   navigate(
  //     `/indications/${indi?.id}?mode=${searchParams.get(
  //       "mode"
  //     )}&search=${searchParams.get("search")}`
  //   );
  // };

  useEffect(() => {
    console.log(values);
  }, [values]);

  //POpConfirm
  //   const {  Popconfirm, message  } = antd;

  // function confirm(e) {
  //   console.log(e);
  //   message.success('El registro ha sido activado');
  // }

  // function cancel(e) {
  //   console.log(e);
  //   message.error('Operacion Cancelada');
  // }

  // ReactDOM.render(
  //   <Popconfirm
  //     title="¿Desea activar el registro? El registro será activado"
  //     onConfirm={confirm}
  //     onCancel={cancel}
  //     okText="Si, Activar"
  //     cancelText="Cancelar"
  //   >
  //     <a href="#">Delete</a>
  //   </Popconfirm>,
  //   mountNode,
  // );
  console.log("Table");
  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IEquipmentList> = [
    {
      ...getDefaultColumnProps("clave", "Clave Estudio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Estudio", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("area", "Area", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
  ];

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!readonly && (
          <Col md={id ? 24 : 48} sm={48} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate("/equipment");
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
              }}
            >
              Guardar
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
              title={
                <HeaderTitle
                  title="Catálogo de Indicaciones"
                  image="Indicaciones"
                />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IEquipmentForm>
            {...formItemLayout}
            form={form}
            name="equipment"
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
              </Col>
              <Col md={12} sm={24}>
                <span>Categoría</span>
                <Select
                  options={[
                    { value: 1, label: "Análisis" },
                    { value: 2, label: "Cómputo" },
                    { value: 3, label: "Impresión" },
                  ]}
                  onChange={(value, option: any) => {
                    if (value) {
                      // setDepartment({
                      //   departamentoId: value,
                      //   departamento: option.label,
                      // });
                    } else {
                      // setDepartment(undefined);
                    }
                  }}
                  style={{ width: 240, marginRight: 20, marginLeft: 10 }}
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
            </Row>
          </Form>
        </div>
      </div>
      <Row>
        <Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}>
          <PageHeader
            ghost={false}
            title={<HeaderTitle title="Valores de equipo:" />}
            className="header-container"
          ></PageHeader>
          <Divider className="header-divider" />

          <List
            header={
              <div>
                <Form>
                  <Row>
                    <Col md={12} sm={24} style={{ marginRight: 20 }}>
                      <TextInput
                        formProps={{
                          name: "num_serie",
                          label: "Número de serie",
                        }}
                        max={100}
                        required
                        readonly={readonly}
                      />
                    </Col>
                    <Col md={11} sm={24} style={{ marginRight: 20 }}>
                      Sucursal
                      <Select
                        options={sucursales}
                        onChange={(value, option: any) => {
                          if (value) {
                            setBranch({
                              branchId: value,
                              branch: option.label,
                            });
                          } else {
                            setBranch(undefined);
                          }
                        }}
                        style={{ width: 240, marginRight: 20, marginLeft: 10 }}
                      />
                      {!readonly && (
                        <ImageButton
                          key="agregar"
                          title="Agregar Configurción"
                          image="agregar-configuracion"
                          // onClick={addClinic}
                          onClick={() => {
                            console.log("formulario", form.getFieldsValue());
                            console.log("agregar configuracion");
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </Form>
              </div>
            }
            footer={<div></div>}
            bordered
            // dataSource={values.departamentos}
            dataSource={[]}
            renderItem={(item: any) => (
              <List.Item>
                <Col md={12} sm={24} style={{ textAlign: "left" }}>
                  <Typography.Text mark></Typography.Text>
                  {item.departamento}
                </Col>
                <Col md={12} sm={24} style={{ textAlign: "left" }}>
                  <ImageButton
                    key="Eliminar"
                    title="Eliminar Configuración"
                    image="eliminar-configuracion"
                    onClick={() => {
                      // deleteClinic(item.departamentoId);
                      console.log("eliminar configuracion");
                    }}
                  />
                </Col>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(EquipmentForm);
