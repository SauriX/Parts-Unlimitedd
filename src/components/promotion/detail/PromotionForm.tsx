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
  Tag,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { IDay, IFormError } from "../../../app/models/shared";
import {
  IPromotionDay,
  IPromotionStudyPack,
  IPromotionForm,
  PromotionDay,
  PromotionFormValues,
} from "../../../app/models/promotion";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import PromotionFormBranches from "./PromotionFormBranches";
import PromotionFormDoctors from "./PromotionFormDoctors";
import PromotionFormStudies from "./PromotionFormStudies";

const tagsData: IDay[] = [
  { id: 1, dia: "L", nombre: "lunes" },
  { id: 2, dia: "M", nombre: "martes" },
  { id: 3, dia: "M", nombre: "miercoles" },
  { id: 4, dia: "J", nombre: "jueves" },
  { id: 5, dia: "V", nombre: "viernes" },
  { id: 6, dia: "S", nombre: "sabado" },
  { id: 7, dia: "D", nombre: "domingo" },
];

const radioOptions = [
  { label: "Porcentaje", value: "p" },
  { label: "Cantidad", value: "q" },
];

type Props = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  download: boolean;
};

const { CheckableTag } = Tag;

const PromotionForm: FC<Props> = ({ id, componentRef, printing, download }) => {
  const { promotionStore, optionStore } = useStore();
  const { promotions, getById, getStudies, getAll, create, update } =
    promotionStore;
  const { priceListOptions, getPriceListOptions } = optionStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm<IPromotionForm>();

  const priceListId = Form.useWatch("listaPrecioId", form);
  const showDoctors = Form.useWatch("aplicaMedicos", form);
  const discountType = Form.useWatch("tipoDescuento", form);

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [studies, setStudies] = useState<IPromotionStudyPack[]>([]);
  const [values, setValues] = useState<IPromotionForm>(
    new PromotionFormValues()
  );
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    getPriceListOptions();
  }, [getPriceListOptions]);

  useEffect(() => {
    const readPromotion = async (id: number) => {
      setLoading(true);
      const promotion = await getById(id);
      form.setFieldsValue(promotion!);
      setValues(promotion!);
      setSelectedBranches(promotion!.sucursales);
      setSelectedDoctors(promotion!.medicos);
      const studies = await getStudies(promotion!, true);
      setStudies(studies);
      setLoading(false);
    };

    if (id) {
      readPromotion(id);
    }
  }, [form, getById, getStudies, id]);

  useEffect(() => {
    if (promotions.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, promotions.length, searchParams]);

  const onFinish = async (newValues: IPromotionForm) => {
    // prettier-ignore
    newValues.fechaInicial = newValues.fechaDescuento ? newValues.fechaDescuento[0].utcOffset(0, false).toDate() : new Date();
    // prettier-ignore
    newValues.fechaFinal = newValues.fechaDescuento ? newValues.fechaDescuento[1].utcOffset(0, false).toDate() : new Date();
    newValues.sucursales = selectedBranches;
    newValues.medicos = selectedDoctors;
    newValues.estudios = studies;

    setLoading(true);

    const reagent = { ...values, ...newValues };

    let success = false;

    if (!reagent.id) {
      success = await create(reagent);
    } else {
      success = await update(reagent);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.promo}?${searchParams}`);
  };

  const setEditMode = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.promo}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: number) => {
    return promotions.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const promo = promotions[page - 1];
    navigate(`/${views.promo}/${promo.id}?${searchParams}`);
  };

  const onValuesChange = (changedValues: any, values: IPromotionForm) => {
    const field = Object.keys(changedValues)[0];
    let value = changedValues[field];
    let studiesToUpdate = [...studies];

    if (field === "listaPrecioId" && !value) {
      setStudies([]);
    } else if (field === "dias") {
      studiesToUpdate = studiesToUpdate.map((x) => ({ ...x, ...value }));
      setStudies(studiesToUpdate);
    } else if (field === "fechaDescuento") {
      // prettier-ignore
      studiesToUpdate = studiesToUpdate.map((x) => ({
        ...x,
        fechaInicial: !!value ? value[0].utcOffset(0, false).toDate(): new Date(),
        fechaFinal: !!value ? value[1].utcOffset(0, false).toDate(): new Date(),
      }));
      setStudies(studiesToUpdate);
    } else if (field === "tipoDescuento" || field === "cantidad") {
      value = value ?? 0;
      studiesToUpdate = studiesToUpdate.map((x) => {
        // prettier-ignore
        let descP = values.tipoDescuento === "p" ? values.cantidad : values.cantidad * 100 / x.precio;
        descP = Number(descP.toFixed(2));
        // prettier-ignore
        let descQ = values.tipoDescuento === "p" ? x.precio * values.cantidad / 100 : values.cantidad;
        descQ = Number(descQ.toFixed(2));

        return {
          ...x,
          descuentoPorcentaje: descP,
          descuentoCantidad: descQ,
          precioFinal: x.precio - descQ,
        };
      });
      setStudies(studiesToUpdate);
    }
  };

  return (
    <Spin
      spinning={loading || printing || download}
      tip={printing ? "Imprimiendo" : download ? "descargando" : ""}
    >
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={promotions?.length ?? 0}
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
                <HeaderTitle
                  title="Catálogo de Promociones en listas de precios"
                  image="promocion"
                />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IPromotionForm>
            {...formItemLayout}
            form={form}
            onFinish={onFinish}
            onFinishFailed={({ errorFields }) => {
              const errors = errorFields.map((x) => ({
                name: x.name[0].toString(),
                errors: x.errors,
              }));
              setErrors(errors);
            }}
            initialValues={new PromotionFormValues()}
            name="promotion"
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row gutter={[0, 12]}>
              <Col md={8} sm={24} xs={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "clave")?.errors}
                />
              </Col>
              <Col md={8} sm={24} xs={24}>
                <SelectInput
                  formProps={{
                    name: "listaPrecioId",
                    label: "Lista de precios",
                  }}
                  required
                  options={priceListOptions}
                  readonly={readonly}
                  errors={
                    errors.find((x) => x.name === "listaPrecioId")?.errors
                  }
                  onChange={() => setFirstLoad(false)}
                />
              </Col>
              <Col md={4} sm={12} xs={12}>
                <SwitchInput
                  labelCol={{ span: 18 }}
                  name="aplicaMedicos"
                  label="Medicos"
                  readonly={readonly}
                />
              </Col>
              <Col md={4} sm={12} xs={12}>
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
              <Col md={8} sm={24} xs={24}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "nombre")?.errors}
                />
              </Col>
              <Col md={16} sm={0} xs={0}></Col>
              <Col md={8} sm={24} xs={24}>
                <Form.Item
                  name="tipoDescuento"
                  label="Tipo de descuento"
                  help=""
                  className="no-error-text"
                >
                  <Radio.Group
                    className={readonly ? "unclickable" : ""}
                    options={radioOptions}
                  />
                </Form.Item>
              </Col>
              <Col md={8} sm={24} xs={24}>
                <NumberInput
                  formProps={{
                    name: "cantidad",
                    label: "Descuento",
                    wrapperCol: { span: 4 },
                  }}
                  min={0}
                  max={
                    discountType === "p"
                      ? 100
                      : studies.length
                      ? Math.min(...studies.map((x) => x.precio))
                      : 0
                  }
                  required
                  readonly={readonly}
                  errors={errors.find((x) => x.name === "cantidad")?.errors}
                ></NumberInput>
              </Col>
              <Col md={8} sm={0} xs={0}></Col>
              <Col md={8} sm={24} xs={24}>
                <DateRangeInput
                  formProps={{
                    name: "fechaDescuento",
                    label: "DescuentoEntre",
                  }}
                  readonly={readonly}
                  required
                />
              </Col>
              <Col md={8} sm={24} xs={12}>
                <Form.Item
                  name="dias"
                  label="Aplicar días"
                  help=""
                  className="no-error-text"
                >
                  <TagDayItem readonly={readonly} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <PromotionFormBranches
            priceListId={priceListId}
            readonly={readonly}
            printing={printing}
            firstLoad={firstLoad}
            selectedBranches={selectedBranches}
            setSelectedBranches={setSelectedBranches}
          />
          {showDoctors && (
            <PromotionFormDoctors
              readonly={readonly}
              printing={printing}
              selectedDoctors={selectedDoctors}
              setSelectedDoctors={setSelectedDoctors}
            />
          )}
          {!!priceListId && (
            <PromotionFormStudies
              priceListId={priceListId}
              form={form}
              studies={studies}
              setStudies={setStudies}
              firstLoad={firstLoad}
              readonly={readonly}
              printing={printing}
            />
          )}
        </div>
      </div>
    </Spin>
  );
};

export default observer(PromotionForm);

type TagDayItemProps = {
  value?: IPromotionDay;
  onChange?: (value: IPromotionDay) => void;
  readonly: boolean;
};

// prettier-ignore
type days = "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo";

const TagDayItem: React.FC<TagDayItemProps> = ({
  value,
  onChange,
  readonly,
}) => {
  const [days, setDays] = useState(value || new PromotionDay());

  useEffect(() => {
    setDays(value || new PromotionDay());
  }, [value]);

  const onSelectTag = (tag: IDay, checked: boolean) => {
    const newDays = { ...days };
    newDays[tag.nombre! as days] = checked;
    setDays(newDays);
    if (typeof onChange === "function") {
      onChange(newDays);
    }
  };

  return (
    <div>
      {tagsData.map((tag) => (
        <CheckableTag
          onChange={(c) => {
            if (readonly) return;
            onSelectTag(tag, c);
          }}
          key={tag.id}
          checked={days[tag.nombre! as days]}
          className={readonly ? "unclickable" : ""}
        >
          {tag.dia}
        </CheckableTag>
      ))}
    </div>
  );
};
