import React, { useCallback, useEffect, useState } from "react";
import { Form, Row, Col, Button, Spin, Input } from "antd";
import TextInput from "../../app/common/form/TextInput";
import { observer } from "mobx-react-lite";
import { IConfigurationFiscal } from "../../app/models/configuration";
import { useStore } from "../../app/stores/store";
import { IOptions } from "../../app/models/shared";
import SelectInput from "../../app/common/form/SelectInput";
import MaskInput from "../../app/common/form/MaskInput";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const ConfigurationFiscalForm = () => {
  const { configurationStore, locationStore } = useStore();
  const { scopes, getFiscal, updateFiscal } = configurationStore;
  const { getColoniesByZipCode } = locationStore;

  const [form] = Form.useForm<IConfigurationFiscal>();
  const cp = Form.useWatch("codigoPostal", form);

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);

  useEffect(() => {
    const readEmail = async () => {
      setLoading(true);
      const fiscal = await getFiscal();
      if (fiscal) {
        form.setFieldsValue(fiscal);
      }
      setLoading(false);
    };

    readEmail();
  }, [form, getFiscal]);

  useEffect(() => {
    if (scopes?.modificar) {
      setReadonly(false);
    }
  }, [scopes]);

  const onFinish = async (email: IConfigurationFiscal) => {
    setLoading(true);
    await updateFiscal(email);
    setLoading(false);
  };

  const clearLocation = useCallback(() => {
    form.setFieldsValue({
      estado: undefined,
      ciudad: undefined,
      colonia: undefined,
    });
    setColonies([]);
  }, [form]);

  const getLocation = useCallback(
    async (zipCode: string) => {
      setLoading(true);
      const location = await getColoniesByZipCode(zipCode);
      setLoading(false);

      if (location) {
        form.setFieldsValue({
          estado: location.estado,
          ciudad: location.ciudad,
        });
        setColonies(
          location.colonias.map((x) => ({
            value: x.nombre,
            label: x.nombre,
          }))
        );
      }
    },
    [form, getColoniesByZipCode]
  );

  useEffect(() => {
    if (cp && cp.replaceAll("_", "").length === 5) {
      getLocation(cp);
    } else {
      clearLocation();
    }
  }, [clearLocation, cp, getLocation]);

  return (
    <Spin spinning={loading}>
      <Form<IConfigurationFiscal>
        {...formItemLayout}
        form={form}
        name="fiscal"
        onFinish={onFinish}
        scrollToFirstError
      >
        <TextInput formProps={{ name: "rfc", label: "RFC" }} max={4000} required readonly={readonly} />
        <TextInput
          formProps={{ name: "razonSocial", label: "Razón social" }}
          max={4000}
          required
          readonly={readonly}
        />
        <Form.Item label="Código Postal" required>
          <Input.Group compact>
            <MaskInput
              formProps={{
                name: "codigoPostal",
                label: "Código Postal",
                noStyle: true,
              }}
              mask={[/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]}
              validator={(_, value: any) => {
                if (!value || value.indexOf("_") === -1) {
                  return Promise.resolve();
                }
                return Promise.reject("El campo debe contener 5 dígitos");
              }}
              readonly={readonly}
              width="30%"
            />
            <TextInput
              formProps={{
                name: "estado",
                label: "Estado",
                noStyle: true,
              }}
              max={4000}
              readonly
              width="35%"
            />
            <TextInput
              formProps={{
                name: "ciudad",
                label: "Ciudad",
                noStyle: true,
              }}
              max={4000}
              readonly
              width="35%"
            />
          </Input.Group>
        </Form.Item>
        <SelectInput
          formProps={{
            name: "colonia",
            label: "Colonia",
          }}
          required
          readonly={readonly}
          options={colonies}
        />
        <Form.Item label="Dirección" required>
          <Input.Group compact>
            <TextInput
              formProps={{
                name: "calle",
                label: "Calle",
                noStyle: true,
              }}
              max={4000}
              required
              readonly={readonly}
              width="65%"
            />
            <TextInput
              formProps={{
                name: "numero",
                label: "Número",
                noStyle: true,
              }}
              max={4000}
              required
              readonly={readonly}
              width="35%"
            />
          </Input.Group>
        </Form.Item>
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
          readonly={readonly}
        />
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            {!readonly && (
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(ConfigurationFiscalForm);
