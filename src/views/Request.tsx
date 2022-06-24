import { Button, Col, Divider, Form, Input, Radio, Row, Select } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import TextInput from "../app/common/form/proposal/TextInput";
import { useStore } from "../app/stores/store";
import { formItemLayout } from "../app/util/utils";
import RequestHeader from "../components/request/RequestHeader";
import RequestTab from "../components/request/RequestTab";

const { Option } = Select;

type LayoutType = Parameters<typeof Form>[0]["layout"];

const Request = () => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState<LayoutType>("horizontal");

  const [errors, setErrors] = useState<{ name: string; errors: string[] }[]>([]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const formItemLayout =
    formLayout === "horizontal"
      ? {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        }
      : null;

  const buttonItemLayout =
    formLayout === "horizontal"
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : null;

  console.log(form.getFieldsError());

  return (
    <Fragment>
      <RequestHeader handlePrint={() => {}} handleDownload={async () => {}} />
      <Divider className="header-divider" />
      {/* <RequestTable componentRef={componentRef} printing={loading} /> */}
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        onFinish={(values) => {
          console.log(values);
          console.log("test");
        }}
        onFinishFailed={({ errorFields }) => {
          const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
          setErrors(errors);
        }}
        size="small"
        onValuesChange={(e) => {
          // console.log(e);
          //   console.log(form.getFieldsError());
          //   const errors = form.getFieldsError().map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
          //   setErrors(errors);
        }}
      >
        <Row gutter={[8, 12]}>
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
                      max={100}
                      required
                      isGroup
                      errors={errors.find((x) => x.name === "nombre")?.errors}
                    />
                  </Col>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "apellidos",
                        label: "Apellido(s)",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
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
              max={100}
              required
              type="email"
              errors={errors.find((x) => x.name === "correo")?.errors}
            />
          </Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "exp",
                label: "Exp",
              }}
              max={100}
              required
              errors={errors.find((x) => x.name === "exp")?.errors}
            />
          </Col>
          <Col span={4}>
            <TextInput
              formProps={{
                name: "sexo",
                label: "Sexo",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              max={100}
              required
              errors={errors.find((x) => x.name === "sexo")?.errors}
            />
          </Col>
          <Col span={8}>
            <TextInput
              formProps={{
                name: "fechaNacimiento",
                label: "Fecha Nacimiento",
                labelCol: { span: 12 },
                wrapperCol: { span: 12 },
              }}
              max={100}
              required
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
              max={100}
              required
              style={
                {
                  // textAlign: "end",
                }
              }
              suffix={"años"}
              errors={errors.find((x) => x.name === "edad")?.errors}
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
                        // hasFeedback: true,
                        help: "Teléfono",
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "celular",
                        label: "Celular",
                        noStyle: true,
                      }}
                      max={100}
                      isGroup
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Dirección"
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
              help=""
              className="no-error-text"
            >
              <Input.Group>
                <Row gutter={8}>
                  <Col span={2}>
                    <TextInput
                      formProps={{
                        name: "cp",
                        label: "CP",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                  <Col span={4}>
                    <TextInput
                      formProps={{
                        name: "estado",
                        label: "Estado",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                  <Col span={4}>
                    <TextInput
                      formProps={{
                        name: "municipio",
                        label: "Municipio",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                  <Col span={5}>
                    <TextInput
                      formProps={{
                        name: "colonia",
                        label: "Colonia",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                  <Col span={6}>
                    <TextInput
                      formProps={{
                        name: "calle",
                        label: "Calle",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                  <Col span={3}>
                    <TextInput
                      formProps={{
                        name: "numero",
                        label: "Número",
                        noStyle: true,
                      }}
                      max={100}
                      required
                      isGroup
                    />
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "end" }}>
            <Button
              type="primary"
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
      {/* <Divider></Divider> */}
      <RequestTab />
    </Fragment>
  );
};

export default Request;
