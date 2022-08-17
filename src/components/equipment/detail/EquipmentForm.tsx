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
  Input,
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
import SelectInput from "../../../app/common/form/SelectInput";

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
  const [numSerie, setNumSerie] = useState<number>();
  const [newEquipment, setNewEquipment] = useState<IEquipmentForm>(
    new EquipmentFormValues()
  );
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
    // const equipment = { ...values, ...newValues };
    console.log("values", values);
    console.log("newValues", newValues);
    const equipment = { ...newEquipment, ...newValues };
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

  const actualEquipment = () => {
    if (id) {
      const index = equipment.findIndex((x) => x.id === id);
      return index + 1;
    }
    return 0;
  };

  const prevnextEquipment = (index: number) => {
    const indi = equipment[index];
    navigate(
      `/equipment/${indi?.id}?mode=${searchParams.get(
        "mode"
      )}&search=${searchParams.get("search")}`
    );
  };

  useEffect(() => {
    console.log("valores cambiantes", values);
    if (searchParams.get("mode") === "readonly") {
      setNewEquipment({ ...values });
    }
  }, [values]);

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
  const deleteEquipment = (num_serie: number) => {
    const valuesEquipment = newEquipment.valores.filter(
      (x) => x.num_serie !== num_serie
    );

    setNewEquipment((prev) => ({ ...prev, valores: valuesEquipment }));
  };
  const isDuplicate = (numSerie: any) => {
    const valuesEquipment = newEquipment.valores.filter(
      (x) => x.num_serie === numSerie
    );
    return valuesEquipment.length > 0;
  };
  const addConfiguration = () => {
    if (isDuplicate(numSerie)) {
      alerts.info(messages.confirmations.duplicate);
      return;
    }
    if (numSerie && branch) {
      const valuesEquipment: IEquipmentBranch[] = [
        ...newEquipment.valores,
        {
          num_serie: numSerie,
          branchId: branch.branchId,
          branch: branch.branch,
        },
      ];

      setNewEquipment((prev) => ({ ...prev, valores: valuesEquipment }));
      setDisabled(false);
    }
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={equipment?.length ?? 0}
              pageSize={1}
              current={actualEquipment()}
              onChange={(value) => {
                prevnextEquipment(value - 1);
              }}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
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
              onClick={(e) => {
                // e.preventDefault();
                // console.log("formularioi", form.getFieldsValue());
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
              title={<HeaderTitle title="Catálogo de Equipos" image="equipo" />}
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
                <SelectInput
                  options={[
                    { value: "1", label: "Análisis" },
                    { value: "2", label: "Cómputo" },
                    { value: "3", label: "Impresión" },
                  ]}
                  formProps={{
                    name: "categoria",
                    label: "Categoría",
                  }}
                  readonly={readonly}
                />
                <SwitchInput
                  name="activo"
                  // onChange={(value) => {
                  //   if (value) {
                  //     alerts.info(messages.confirmations.enable);
                  //   } else {
                  //     alerts.info(messages.confirmations.disable);
                  //   }
                  // }}
                  label="Activo"
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>

          <Row>
            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            >
              <PageHeader
                ghost={false}
                title={<HeaderTitle title="Valores de equipo:" />}
                className="header-container"
              ></PageHeader>
              <Divider className="header-divider" />

              <List<IEquipmentBranch>
                header={
                  <div>
                    <Form>
                      <Row>
                        <Col md={12} sm={24} style={{ marginRight: 20 }}>
                          <Row>
                            <Col>Número de serie: </Col>
                            <Col
                              md={12}
                              sm={24}
                              style={{ marginLeft: 20, textAlign: "center" }}
                            >
                              <Input
                                type="number"
                                max={100}
                                required
                                disabled={readonly}
                                onChange={(value) => {
                                  if (value.target.value) {
                                    setNumSerie(+value.target.value);
                                  } else {
                                    setNumSerie(undefined);
                                  }
                                  console.log(value.target.value);
                                }}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col md={11} sm={24} style={{ marginRight: 20 }}>
                          Sucursal:
                          <Select
                            disabled={readonly}
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
                            style={{
                              width: 240,
                              marginRight: 20,
                              marginLeft: 10,
                            }}
                          />
                          {!readonly && (
                            <ImageButton
                              key="agregar"
                              title="Agregar Configuración"
                              image="agregar-configuracion"
                              // onClick={addClinic}
                              onClick={addConfiguration}
                            />
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </div>
                }
                footer={<div></div>}
                bordered
                dataSource={newEquipment.valores}
                renderItem={(item: any) => (
                  <List.Item>
                    <Col md={12} sm={24} style={{ textAlign: "left" }}>
                      <Typography.Text mark></Typography.Text>
                      {item.num_serie}
                    </Col>
                    <Col md={12} sm={24} style={{ textAlign: "left" }}>
                      <Typography.Text mark></Typography.Text>
                      {sucursales.find((x) => x.value === item.branchId)?.label}
                    </Col>
                    <Col md={12} sm={24} style={{ textAlign: "left" }}>
                      {!readonly && (
                        <ImageButton
                          key="Eliminar"
                          title="Eliminar Configuración"
                          image="eliminar-configuracion"
                          onClick={() => {
                            deleteEquipment(item.num_serie);
                            console.log("eliminar configuracion", item);
                          }}
                        />
                      )}
                    </Col>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};

export default observer(EquipmentForm);
