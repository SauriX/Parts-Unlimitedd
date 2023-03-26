import { Button, Col, Form, Input, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { useEffect, useState } from "react";
import DateInput from "../../../app/common/form/proposal/DateInput";
import DateRangeInput from "../../../app/common/form/proposal/DateRangeInput";
import MaskInput from "../../../app/common/form/proposal/MaskInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { IGeneralForm } from "../../../app/models/general";
import { IQuotationFilter } from "../../../app/models/quotation";
import { IFormError, IOptions } from "../../../app/models/shared";
import { useStore } from "../../../app/stores/store";
import { formItemLayout } from "../../../app/util/utils";
import "./css/index.css";

const QuotationFilter = () => {
  const { quotationStore, optionStore, profileStore, generalStore } = useStore();
  const { branchCityOptions, getBranchCityOptions } = optionStore;
  const { getQuotations } = quotationStore;
  const { setGeneralFilter, generalFilter } = generalStore;
  const { profile } = profileStore;
  const [form] = useForm<IQuotationFilter>();

  const selectedCity = Form.useWatch("ciudad", form);

  const [errors, setErrors] = useState<IFormError[]>([]);
  const [cityOptions, setCityOptions] = useState<IOptions[]>([]);
  const [branchOptions, setBranchOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    getBranchCityOptions();
  }, [getBranchCityOptions]);

  useEffect(() => {
    setCityOptions(
      branchCityOptions.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [branchCityOptions]);

  useEffect(() => {
    const profileBranch = profile?.sucursal;
    if (profileBranch) {
      const findCity = branchCityOptions.find((x) =>
        x.options?.some((y) => y.value == profileBranch)
      )?.value;
      if (findCity) {
        form.setFieldValue("ciudad", [findCity]);
      }
      form.setFieldValue("sucursalId", [profileBranch]);
    }
  }, [branchCityOptions, form, profile]);

  useEffect(() => {
    if (selectedCity != undefined && selectedCity != null) {
      var branhces = branchCityOptions.filter((x) =>
        selectedCity.includes(x.value.toString())
      );
      var options = branhces.flatMap((x) =>
        x.options == undefined ? [] : x.options
      );
      setBranchOptions(options);
    }
  }, [branchCityOptions, form, selectedCity]);

  useEffect(() => {
    form.setFieldsValue(generalFilter);
  }, [generalFilter, form]);

  const onFinish = (values: IGeneralForm) => {
    setErrors([]);
    const filter = { ...values };

    if (filter.fechaNacimiento) {
      filter.fechaNInicial = filter.fechaNacimiento.utcOffset(0, true);
    }

    setGeneralFilter(filter);
    getQuotations(filter);
  };

  return (
    <div className="status-container" style={{ marginBottom: 12 }}>
      <Form<IGeneralForm>
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
        size="small"
        initialValues={{
          fecha: [
            moment(Date.now()).utcOffset(0, true),
            moment(Date.now()).utcOffset(0, true),
          ],
        }}
      >
        <Row gutter={[0, 12]}>
          <Col span={8}>
            <DateRangeInput
              formProps={{ name: "fecha", label: "Fecha de alta" }}
              disableAfterDates
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "expediente",
                label: "Buscar",
              }}
              autoFocus
              placeholder="Clave cotización / Nombre"
            />
          </Col>
          <Col span={8}>
            <DateInput
              formProps={{
                name: "fechaNacimiento",
                label: "Fecha nacimiento",
              }}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "correo",
                label: "Correo",
              }}
              type="email"
              errors={errors.find((x) => x.name === "correo")?.errors}
            />
          </Col>
          <Col span={8}>
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
              errors={errors.find((x) => x.name === "telefono")?.errors}
            />
          </Col>
          <Col span={8}>
            <Form.Item label="Sucursales" className="no-error-text" help="">
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
                      multiple
                      options={cityOptions}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectInput
                      form={form}
                      formProps={{
                        name: "sucursalId",
                        label: "Sucursales",
                        noStyle: true,
                      }}
                      multiple
                      options={branchOptions}
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button key="clean" htmlType="reset">
              Limpiar
            </Button>
            <Button key="filter" type="primary" htmlType="submit">
              Filtrar
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default observer(QuotationFilter);
