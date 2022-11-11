import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Radio,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import NumberInput from "../../../app/common/form/NumberInput";
import { observer } from "mobx-react-lite";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { ILoyaltyForm, LoyaltyFormValues } from "../../../app/models/loyalty";
import views from "../../../app/util/view";
import moment from "moment";
import DateRangeInput from "../../../app/common/form/DateRangeInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
// import { v4 as uuid } from "uuid";

type LoyaltyFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const LoyaltyForm: FC<LoyaltyFormProps> = ({ id, componentRef, printing }) => {
  const { loyaltyStore, optionStore } = useStore();
  const { getById, create, update, getAll, loyaltys } = loyaltyStore;
  const { priceListOptions, getPriceListOptions } = optionStore;
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<ILoyaltyForm>();
  const [formTP] = Form.useForm<{ tipoDescuento: string }>();
  const nameValue = Form.useWatch("tipoDescuento", formTP);

  const [loading, setLoading] = useState(false);
  // const [porcentaje, setporcentaje] = useState<number>();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<ILoyaltyForm>(new LoyaltyFormValues());
  const radioOptions = [
    { label: "Porcentaje", value: "Porcentaje" },
    { label: "Puntos", value: "Puntos" },
  ];
  const [discunt, setDiscunt] = useState<string>();

  useEffect(() => {
    const readLoyalty = async (id: string) => {
      setLoading(true);
      const loyalty = await getById(id);
      loyalty!.fecha = [
        moment(loyalty?.fechaInicial),
        moment(loyalty?.fechaFinal),
      ];
      form.setFieldsValue(loyalty!);
      setValues(loyalty!);
      setLoading(false);
      setDiscunt(loyalty?.tipoDescuento!);
    };

    if (id) {
      readLoyalty(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    const readPriceList = async () => {
      await getPriceListOptions();
    };
    readPriceList();
  }, [getPriceListOptions]);

  useEffect(() => {
    if (loyaltys.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, loyaltys.length, searchParams]);

  const onFinish = async (newValues: ILoyaltyForm) => {
    setLoading(true);

    const loyalty = { ...values, ...newValues };
    loyalty.fechaInicial = newValues.fecha[0].toDate();
    loyalty.fechaFinal = newValues.fecha[1].toDate();

    loyalty.precioLista = (loyalty.precioLista as string[]).map((x) => ({
      precioListaId: x,
    }));

    let success = false;

    if (!loyalty.id) {
      loyalty.id = "00000000-0000-0000-0000-000000000000";
      success = await create(loyalty);
    } else {
      success = await update(loyalty);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.loyalty}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.loyalty}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    return loyaltys.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const loyalty = loyaltys[page - 1];
    navigate(`/${views.loyalty}/${loyalty.id}?${searchParams}`);
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={loyaltys?.length ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button onClick={goBack}>Cancelar</Button>
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
        {readonly && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={setEditMode}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle title="Catálogo de Lealtades" image="lealtad" />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<ILoyaltyForm>
            {...formItemLayout}
            form={form}
            name="loyalty"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row>
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
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <Form form={formTP} layout="vertical" autoComplete="off">
                  <Form.Item name="tipoDescuento">
                    <div style={{ marginLeft: "99px", marginBottom: "20px" }}>
                      Tipo de descuento:
                      <Radio.Group
                        style={{ marginLeft: "10px" }}
                        options={radioOptions}
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            tipoDescuento: e.target.value,
                          }));
                          setDiscunt(e.target.value);
                          console.log(values.cantidad);
                        }}
                        value={discunt}
                      />
                    </div>
                  </Form.Item>
                </Form>
                {/* <Typography>
        <pre>Name Value: {nameValue}</pre>
      </Typography> */}
                <NumberInput
                  formProps={{
                    name: "cantidadDescuento",
                    label: "Descuento/Cantidad",
                  }}
                  // nameValue ?  true : false;
                  min={0}
                  max={nameValue === "Porcentaje" ? 100 : undefined}
                  readonly={readonly}
                  required
                />
                <div style={{ marginBottom: "20px" }}>
                  {/* Descuento entre : */}
                  <DateRangeInput
                    formProps={{ label: "Descuento entre", name: "fecha" }}
                    readonly={readonly}
                  />
                  {/* <RangePicker
                    style={{ marginLeft: "20px" }} //value={moment(item.fechaInicial)}
                    onChange={(value) => console.log(value!)}
                  /> */}
                </div>
              </Col>
              <Col md={12} sm={24} xs={12}>
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
                  required
                />
                <SelectInput
                  formProps={{
                    name: "precioLista",
                    label: "Lista de precios",
                  }}
                  multiple
                  readonly={readonly}
                  options={priceListOptions}
                  required
                />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </Spin>
  );
};

export default observer(LoyaltyForm);
