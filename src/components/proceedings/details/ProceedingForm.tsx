import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import { useStore } from "../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import NumberInput from "../../../app/common/form/NumberInput";
import SelectInput from "../../../app/common/form/SelectInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IOptions } from "../../../app/models/shared";
import DatosFiscalesForm from "./DatosFiscalesForm";
import Concidencias from "./Concidencias";
import { IProceedingForm, ISearchMedical, ProceedingFormValues } from "../../../app/models/Proceeding";
import moment from "moment";
import { ITaxForm } from "../../../app/models/taxdata";
type ProceedingFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const ProceedingForm: FC<ProceedingFormProps> = ({ id, componentRef, printing }) => {
  const navigate = useNavigate();
  const { modalStore, procedingStore, locationStore, optionStore } = useStore();
  const { getById, update, create, coincidencias, getnow, setTax,expedientes, search,tax } = procedingStore;
  const { BranchOptions, getBranchOptions } = optionStore;
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  const [form] = Form.useForm();
  const [values, setValues] = useState<IProceedingForm>(new ProceedingFormValues());
  const { getColoniesByZipCode } = locationStore;
  const { openModal } = modalStore;
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [date, setDate] = useState(moment(new Date(moment.now())));
  const [continuar, SetContinuar] = useState<boolean>(true);
  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.proceeding}?${searchParams}`);
  };

  const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  };


  useEffect(() => {
    const readExpedinte = async (id: string) => {
      setLoading(true);
      var expediente = await getById(id);
      console.log(expediente, "exp");
      form.setFieldsValue(expediente!);
      setTax(expediente?.taxData!);
      setValues(expediente!);
      setLoading(false);
    };

    if (id) {
      readExpedinte(id);
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getById]);

  useEffect(() => {
    const readData = async (search: ISearchMedical) => {
      await getnow(search);
    }

    readData(search);
  }, [search, getnow])
  useEffect(() => {
    const readData = async (search: ISearchMedical) => {
      await getBranchOptions();
    }

    readData(search);
  }, [getBranchOptions])
  const setEditMode = () => {
    navigate(`/${views.proceeding}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };
  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "cp") {
      const zipCode = changedValues[field] as string;

      if (zipCode && zipCode.trim().length === 5) {
        const location = await getColoniesByZipCode(zipCode);
        if (location) {
          form.setFieldsValue({
            estado: location.estado,
            municipio: location.ciudad,
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
  const setPage = (page: number) => {
    const priceList = expedientes[page - 1];
    navigate(`/${views.proceeding}/${priceList.id}?${searchParams}`);
  };
  const getPage = (id: string) => {
    return expedientes.findIndex(x => x.id === id) + 1;
  };
  const coincidencia = async (values: IProceedingForm) => {
    var coincidencia = await coincidencias(values);
    if (coincidencia.length > 0) {
      openModal({ title: "Se encuentran coincidencias con los siguientes expedientes", body: <Concidencias handle={SetContinuar} expedientes={coincidencia} printing={false}></Concidencias>, closable: true, width: "55%" })
      return true;
    } else {
      return false;
    }
  }
  const onFinish = async (newValues: IProceedingForm) => {
    setLoading(true);


    const reagent = { ...values, ...newValues };


    console.log(reagent, "en el onfish")
    console.log(reagent);
    let success = false;
    reagent.taxData = tax;
    if (!reagent.id) {
      var coincide = await coincidencia(newValues);
      if (coincide) {
        if (!continuar) {
          return
        } else {
          success = await create(reagent);
        }
      } else {
        success = await create(reagent);
      }

    } else {
      success = await update(reagent);
    }

    setLoading(false);

    if (success) {
      goBack();
    }
  };

  const handleChangeTax = (tax: ITaxForm[]) => {
    setTax(tax);
  }

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={expedientes?.length ?? 0}
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
            <ImageButton key="edit" title="Editar" image="editar" onClick={setEditMode} />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "" : "none", height: 300 }}></div>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Expediente" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IProceedingForm>
            {...formItemLayout}
            form={form}
            name="proceeding"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col md={9} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre(s)",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={7} sm={24} xs={12}>
              </Col>
              <Col md={8} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Exp",
                  }}
                  max={100}
                  readonly={readonly}
                />
              </Col>
              <Col md={9} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "apellido",
                    label: "Apellido (s)",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={7} sm={24} xs={12}></Col>
              <Col md={8} sm={24} xs={12}></Col>
              <Col md={7} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "sexo",
                    label: "Sexo",
                  }}
                  required
                  readonly={readonly}
                  options={[{ value: "M", label: "M" }, { value: "F", label: "F" }]}></SelectInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <label style={{ marginLeft: "30px" }} htmlFor="">Fecha Nacimiento: </label>
                <DatePicker value={moment(values.fechaNacimiento)} disabled={readonly} onChange={(value) => { setValues((prev) => ({ ...prev, fechaNacimiento: value?.toDate() })) }} style={{ marginLeft: "10px" }} />
              </Col>
              <Col md={4} sm={24} xs={12}>
                <NumberInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                  }}
                  min={0}
                  readonly={readonly}
                ></NumberInput>
              </Col>
              <Col md={6} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "telefono",
                    label: "Teléfono",
                  }}
                  max={100}
                  readonly={readonly}
                ></TextInput>
              </Col>
              <Col md={7} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "E-Mail",
                  }}
                  required
                  max={100}
                  readonly={readonly}
                ></TextInput>
              </Col>

              <Col md={4} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "cp",
                    label: "CP",
                  }}
                  readonly={readonly}
                  required
                  max={100}
                ></TextInput>
              </Col>
              <Col md={4} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "estado",
                    label: "Estado",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col md={5} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "municipio",
                    label: "Municipio",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />

              </Col>
              <Col md={4} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "celular",
                    label: "Celular",
                  }}
                  readonly={readonly}
                  max={100}
                ></TextInput>
              </Col>




              <Col md={1} sm={24} xs={12}></Col>
              <Col md={6} sm={24} xs={12}>
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle y Número",
                  }}
                  required
                  max={100}
                  readonly={readonly}
                ></TextInput>
              </Col>

              <Col md={5} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "colonia",
                    label: "Colonia",
                  }}
                  required
                  options={colonies}
                  readonly={readonly}
                />
              </Col>
              <Col md={24} style={{ textAlign: "center" }}>
                <Button onClick={() => openModal({ title: "Seleccionar o Ingresar Datos Fiscales", body: <DatosFiscalesForm ></DatosFiscalesForm>, closable: true, width: "55%" })} style={{ backgroundColor: "#6EAA46", color: "white", borderColor: "#6EAA46" }}>Datos Fiscales</Button>
              </Col>
              <Col md={5} sm={24} xs={12}>
                <SelectInput
                  formProps={{
                    name: "sucursal",
                    label: "Sucursal",
                  }}
                  required
                  options={BranchOptions}
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>

        </div>
      </div>
    </Spin>
  );
}

export default observer(ProceedingForm);