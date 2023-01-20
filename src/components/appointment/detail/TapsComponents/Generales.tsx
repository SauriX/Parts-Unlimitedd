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
  DatePicker,
  List,
  Typography,
  Select,
  Table,
  Checkbox,
  Input,
  Tag,
  InputNumber,
  Tabs,
  Descriptions,
  Image,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../../app/stores/store";
import {
  IReagentForm,
  ReagentFormValues,
} from "../../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../../app/util/view";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IFormError, IOptions } from "../../../../app/models/shared";
import moment from "moment";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

import TextArea from "antd/lib/input/TextArea";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
import {
  AppointmentGeneralesFormValues,
  IAppointmentGeneralesForm,
} from "../../../../app/models/appointmen";
type GeneralesFormProps = {
  printing: boolean;
  generales: React.Dispatch<
    React.SetStateAction<IAppointmentGeneralesForm | undefined>
  >;
  handle: boolean;
  data: IAppointmentGeneralesForm | undefined;
  branchId: string | undefined;
  id: string;
};

const GeneralesForm: FC<GeneralesFormProps> = ({
  printing,
  generales,
  data,
  branchId,
  id,
}) => {
  const { optionStore, quotationStore, appointmentStore } = useStore();
  const {
    getMedicOptions,
    getCompanyOptions,
    medicOptions: MedicOptions,
    companyOptions: CompanyOptions,
  } = optionStore;
  const [loading, setLoading] = useState(false);
  const { setStudyFilter, studyFilter, sendTestEmail, sendTestWhatsapp } =
    appointmentStore;
  const [form] = Form.useForm<IAppointmentGeneralesForm>();
  const [values, setValues] = useState<IAppointmentGeneralesForm>(
    new AppointmentGeneralesFormValues()
  );
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [type, SetType] = useState("");
  const doctorId = Form.useWatch("medico", form);
  const companyId = Form.useWatch("compañia", form);
  useEffect(() => {
    form.setFieldsValue(data!);
  }, [data]);
  useEffect(() => {
    const readMedics = async () => {
      await getMedicOptions();
    };
    readMedics();
  }, [getMedicOptions]);
  useEffect(() => {
    const readCompany = async () => {
      await getCompanyOptions();
    };
    readCompany();
  }, [getCompanyOptions]);

  useEffect(() => {
    form.submit();
  }, [generales]);
  useEffect(() => {
    setStudyFilter(branchId, doctorId, companyId);
  }, [branchId, companyId, doctorId, setStudyFilter]);
  const onFinish = async (newValues: IAppointmentGeneralesForm) => {
    const reagent = { ...values, ...newValues };
    console.log("onfinish");
    console.log(reagent);
    generales(reagent);
    setValues(reagent);
    /*     setLoading(true);
        
            const reagent = { ...values, ...newValues };
        
              
              let success = false;
              reagent.taxData = tax;
              if (!reagent.id) {
                 success = await create(reagent);      
              } else{
                success = await update(reagent);
              }
              setLoading(false);
              if (success) {
        
                goBack();
                
              }   */
  };

  const onValuesChange = async (changedValues: IAppointmentGeneralesForm) => {
    const field = Object.keys(changedValues)[0];
    form.submit();
    if (field == "edad") {
      /*  const edad = changedValues[field] as number; */
      var hoy = new Date();
      /*     var cumpleaños =  hoy.getFullYear()-edad; */
      /* hoy.setFullYear(cumpleaños); */
      /* setValues((prev) => ({ ...prev, fechaNacimiento: hoy })) */
    }
    if (field === "cp") {
      /* const zipCode = changedValues[field] as string */
      /*         if (zipCode && zipCode.trim().length === 5) {
            } */
    }
  };
  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Form<IAppointmentGeneralesForm>
        {...formItemLayout}
        form={form}
        name="generales"
        initialValues={values}
        onFinish={onFinish}
        scrollToFirstError
        onValuesChange={onValuesChange}
        onFinishFailed={({ errorFields }) => {
          const errors = errorFields.map((x) => ({
            name: x.name[0].toString(),
            errors: x.errors,
          }));
          setErrors(errors);
        }}
      >
        <Row gutter={[0, 12]}>
          <Col sm={12}>
            <SelectInput
              formProps={{
                name: "procedencia",
                label: "Procedencia",
              }}
              onChange={(value) => {
                setValues({ ...values, procedencia: value });
              }}
              errors={errors.find((x) => x.name === "nombre")?.errors}
              options={[
                { value: "compañia", label: "Compañia" },
                { value: "particular", label: "Particular" },
              ]}
            ></SelectInput>
          </Col>
          <Col sm={12}></Col>
          <Col span={12}>
            <SelectInput
              formProps={{
                name: "compañia",
                label: "Compañia",
              }}
              options={[...CompanyOptions]}
              readonly={values.procedencia == "particular"}
            ></SelectInput>
          </Col>
          <Col sm={12}></Col>
          <Col span={12}>
            <SelectInput
              formProps={{
                name: "medico",
                label: "Médico",
              }}
              options={[...MedicOptions]}
            ></SelectInput>
          </Col>
          <Col sm={12}></Col>
          <Col sm={12}></Col>
          <Col span={14}>
            <TextAreaInput
              formProps={{
                name: "observaciones",
                label: "Observaciones",
                labelCol: { span: 24 },
                wrapperCol: { span: 24 },
              }}
              rows={3}
              errors={errors.find((x) => x.name === "observaciones")?.errors}
            />
          </Col>
          <Col sm={10}></Col>
          <Col sm={12}>
            <label
              style={{ marginLeft: "100px", marginTop: "20px" }}
              htmlFor=""
            >
              Enviar por:{" "}
            </label>
            <Checkbox
              checked={type == "Email" || type == "Ambos"}
              onChange={(values) => {
                values.target.checked ? SetType("Email") : SetType("");
              }}
              style={{ marginLeft: "5px", marginTop: "20px" }}
            >
              Email
            </Checkbox>{" "}
            <Image
              width={15}
              src={`/${process.env.REACT_APP_NAME}/admin/assets/correo.png`}
              preview={false}
            />
            <Checkbox
              checked={type == "Whatsapp" || type == "Ambos"}
              onChange={(values) => {
                values.target.checked ? SetType("Whatsapp") : SetType("");
              }}
              style={{ marginLeft: "5px", marginTop: "20px" }}
            >
              Whatsapp
            </Checkbox>
            <Image
              width={15}
              src={`/${process.env.REACT_APP_NAME}/admin/assets/whats.png`}
              preview={false}
            />
            <Checkbox
              checked={type == "Ambos"}
              onChange={(values) => {
                values.target.checked ? SetType("Ambos") : SetType("");
              }}
              style={{ marginLeft: "10px", marginTop: "20px" }}
            >
              Ambos
            </Checkbox>
            <Image
              width={20}
              src={`/${process.env.REACT_APP_NAME}/admin/assets/all.png`}
              preview={false}
            />
          </Col>
          <Col sm={12}>
            <SwitchInput
              style={{ marginLeft: "100px", marginTop: "10px" }}
              name="activo"
              label="Activo"
              onChange={(value) => {
                if (value) {
                  alerts.info(messages.confirmations.enable);
                } else {
                  alerts.info(messages.confirmations.disable);
                }
              }}
            />
          </Col>
          <Col span={12}>
            <TextInput
              formProps={{
                name: "email",
                label: "E-mail",
              }}
              max={100}
              showLabel
              errors={errors.find((x) => x.name === "nombre")?.errors}
              readonly={type != "Email" && type != "Ambos"}
            />
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                if (type == "Whatsapp") {
                  sendTestWhatsapp("laboratorio", id, values.whatssap);
                }
                if (type == "Email") {
                  sendTestEmail("laboratorio", id, values.whatssap);
                }
                if (type == "Ambos") {
                  sendTestWhatsapp("laboratorio", id, values.whatssap);
                  sendTestEmail("laboratorio", id, values.whatssap);
                }
              }}
            >
              Prueba Envio
            </Button>
          </Col>
          <Col span={9}></Col>
          <Col span={12}>
            <TextInput
              formProps={{
                name: "whatssap",
                label: "Whatsapp",
              }}
              max={100}
              showLabel
              readonly={type != "Whatsapp" && type != "Ambos"}
              errors={errors.find((x) => x.name === "nombre")?.errors}
            />
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                if (type == "Whatsapp") {
                  sendTestWhatsapp("laboratorio", id, values.whatssap);
                }
                if (type == "Email") {
                  sendTestEmail("laboratorio", id, values.whatssap);
                }
                if (type == "Ambos") {
                  sendTestWhatsapp("laboratorio", id, values.whatssap);
                  sendTestEmail("laboratorio", id, values.whatssap);
                }
              }}
            >
              Prueba Envio
            </Button>
          </Col>
          <Col span={9}></Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(GeneralesForm);
