import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  PageHeader,
  Pagination,
  Row,
  Spin,
} from "antd";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import NumberInput from "../../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../../app/common/form/proposal/SwitchInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import {
  ICatalogBudgetForm,
  CatalogBudgetFormValues,
  IBranchList,
} from "../../../../app/models/catalog";
import { IOptions } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout } from "../../../../app/util/utils";

const catalogName = "costofijo";

type CatalogBudgetFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CatalogBudgetForm: FC<CatalogBudgetFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { catalogStore, optionStore } = useStore();
  const { catalogs, getIndex, getById, create, update } = catalogStore;
  const { branchCityOptions, getBranchCityOptions } = optionStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<ICatalogBudgetForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [values, setValues] = useState<ICatalogBudgetForm>(
    new CatalogBudgetFormValues()
  );

  const selectedCity = Form.useWatch("ciudad", form);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  useEffect(() => {
    let citiesId: string[] = [];
    let branchesId: string[] = [];

    values.sucursales?.forEach((x: any) => {
      citiesId.push(x.ciudad!);
      branchesId.push(x.sucursalId);
    });

    citiesId = deleteRepeated(citiesId);
    branchesId = deleteRepeated(branchesId);

    form.setFieldValue("ciudad", citiesId);
    form.setFieldValue("sucursales", branchesId);
  }, [values]);

  const deleteRepeated = (array: any[]) => {
    return array.filter((item, index) => {
      return array.indexOf(item) === index;
    });
  };

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    setBranchOptions(
      branchCityOptions
        .filter((x) => selectedCity?.includes(x.value as string))
        .flatMap((x) => x.options ?? [])
    );
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    const readCatalog = async (id: number) => {
      setLoading(true);
      const catalog = await getById<ICatalogBudgetForm>(catalogName, id);
      form.setFieldsValue(catalog!);
      setValues(catalog!);
      setLoading(false);
    };

    if (id) {
      readCatalog(id);
    }
  }, [form, getById, id]);

  const onFinish = async (newValues: ICatalogBudgetForm) => {
    setLoading(true);
    const catalog = { ...values, ...newValues };

    let branchCityBudgetList: any[] = [];
    catalog.sucursales?.forEach((x) => {
      branchCityOptions.forEach((y) => {
        if (y.options?.find((option) => option.value === x)) {
          branchCityBudgetList.push({
            sucursalId: x,
            ciudad: "" + y.value,
          });
        }
      });
    });

    catalog.sucursales = branchCityBudgetList;
    console.log(catalog);

    let success = false;

    if (!catalog.id) {
      success = await create(catalogName, catalog);
    } else {
      success = await update(catalogName, catalog);
    }
    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/catalogs?${searchParams}`);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        <Col md={12} sm={24} style={{ textAlign: "left" }}>
          {id > 0 && (
            <Pagination
              size="small"
              total={catalogs.length}
              pageSize={1}
              current={getIndex(id) + 1}
              onChange={(page) => {
                const catalog = catalogs[page - 1];
                navigate(`/catalogs/${catalog.id}?${searchParams}`);
              }}
            />
          )}
        </Col>
        <Col md={12} sm={24} style={{ textAlign: "right" }}>
          <Button onClick={goBack}>Cancelar</Button>
          {readonly ? (
            <ImageButton
              title="Editar"
              image="editar"
              onClick={() => setReadonly(false)}
            />
          ) : (
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
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo General" image="catalogo" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<ICatalogBudgetForm>
            {...formItemLayout}
            form={form}
            name="catalog"
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
            <Row gutter={[0, 16]}>
              <Col md={12} sm={24} xs={12}>
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
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nombreServicio",
                    label: "Nombre Servicio",
                  }}
                  max={256}
                  min={0}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <Form.Item label="Sucursal" className="no-error-text" help="">
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <SelectInput
                          form={form}
                          formProps={{
                            name: "ciudad",
                            label: "Ciudad",
                            noStyle: true,
                          }}
                          options={cityOptions}
                          multiple
                        />
                      </Col>
                      <Col span={12}>
                        <SelectInput
                          form={form}
                          formProps={{
                            name: "sucursales",
                            label: "Sucursales",
                            noStyle: true,
                          }}
                          options={branchOptions}
                          multiple
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col md={12} sm={24} xs={12}></Col>
              <Col md={12} sm={24} xs={12}>
                <SwitchInput name="activo" label="Activo" readonly={readonly} />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default observer(CatalogBudgetForm);
