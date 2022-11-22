import { Form, Row, Col, Input, Spin } from "antd";
import DateInput from "../../../app/common/form/proposal/DateInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { IProceedingForm } from "../../../app/models/Proceeding";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import moment from "moment";
import { observer } from "mobx-react-lite";

type QuotationRecordProps = {
  recordId?: string;
  branchId: string;
  setBranchId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const QuotationRecord = ({
  recordId,
  branchId,
  setBranchId,
}: QuotationRecordProps) => {
  const { quotationStore, procedingStore, locationStore, optionStore } =
    useStore();
  const { quotation } = quotationStore;
  const { getById } = procedingStore;
  const { getColoniesByZipCode } = locationStore;
  const { BranchOptions, getBranchOptions } = optionStore;

  const [form] = Form.useForm<IProceedingForm>();

  const branch = Form.useWatch("sucursal", form);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBranchOptions();
  }, [getBranchOptions]);

  useEffect(() => {
    setBranchId(branch);
  }, [branch, setBranchId]);

  useEffect(() => {
    if (quotation) {
      form.setFieldsValue({ sucursal: quotation.sucursalId });
    }
  }, [form, quotation]);

  useEffect(() => {
    console.log(recordId);

    const readRecord = async () => {
      setLoading(true);
      const record = await getById(recordId!);

      if (record) {
        if (record.fechaNacimiento) {
          record.fechaNacimiento = moment(record.fechaNacimiento);
        }

        const copy = (({ sucursal, ...others }) => ({ ...others }))(record);
        form.setFieldsValue({ ...copy });
      }
      setLoading(false);
    };

    if (recordId) {
      readRecord();
    } else {
      form.resetFields();
    }
  }, [form, getById, getColoniesByZipCode, recordId]);

  return (
    <Spin spinning={loading}>
      <Form<IProceedingForm>
        {...formItemLayout}
        initialValues={{ sucursal: branchId }}
        form={form}
        size="small"
      >
        <Row gutter={[0, 12]}>
          {recordId && (
            <>
              <Col span={12}>
                <Form.Item
                  label="Nombre"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  className="no-error-text"
                  help=""
                >
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "nombre",
                            label: "Nombre(s)",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                          readonly
                        />
                      </Col>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "apellido",
                            label: "Apellido(s)",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                          readonly
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "E-Mail",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  max={500}
                  type="email"
                  readonly
                />
              </Col>
              <Col span={4}>
                <TextInput
                  formProps={{
                    name: "expediente",
                    label: "Exp",
                  }}
                  max={500}
                  readonly
                />
              </Col>
              <Col span={4}>
                <SelectInput
                  formProps={{
                    name: "sexo",
                    label: "Sexo",
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  }}
                  options={[
                    { label: "F", value: "F" },
                    { label: "M", value: "M" },
                  ]}
                  readonly
                />
              </Col>
              <Col span={8}>
                <DateInput
                  formProps={{
                    name: "fechaNacimiento",
                    label: "Fecha Nacimiento",
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  }}
                  readonly
                />
              </Col>
              <Col span={4}>
                <TextInput
                  formProps={{
                    name: "edad",
                    label: "Edad",
                    labelCol: { span: 12 },
                    wrapperCol: { span: 12 },
                  }}
                  max={500}
                  suffix={"años"}
                  readonly
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Contacto"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  help=""
                  className="no-error-text"
                >
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "telefono",
                            label: "Teléfono",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                          readonly
                        />
                      </Col>
                      <Col span={12}>
                        <TextInput
                          formProps={{
                            name: "celular",
                            label: "Celular",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                          readonly
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={16}></Col>
            </>
          )}
          <Col span={16}></Col>
          <Col span={8}>
            <SelectInput
              formProps={{
                name: "sucursal",
                label: "Sucursal",
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
              }}
              options={BranchOptions}
            />
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(QuotationRecord);
