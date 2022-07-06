import { Form, Row, Col, Checkbox, Input, Button, Table, Typography } from "antd";
import React, { useState } from "react";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import { IRequestPrice } from "../../../app/models/request";
import { IFormError } from "../../../app/models/shared";
import { moneyFormatter } from "../../../app/util/utils";

const { Link } = Typography;

const RequestRegister = () => {
  const [form] = Form.useForm();

  const [errors, setErrors] = useState<IFormError[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  // const formItemLayout = {
  //   labelCol: { span: 4 },
  //   wrapperCol: { span: 10 },
  // };

  const columns: IColumns<IRequestPrice> = [
    {
      ...getDefaultColumnProps("id", "#", {
        searchState,
        setSearchState,
        width: 75,
      }),
    },
    {
      ...getDefaultColumnProps("documento", "Documento", {
        searchState,
        setSearchState,
        width: 175,
      }),
    },
    {
      ...getDefaultColumnProps("serie", "Serie", {
        searchState,
        setSearchState,
        width: 125,
      }),
    },
    {
      ...getDefaultColumnProps("numero", "Número", {
        searchable: false,
        width: 125,
      }),
    },
    {
      ...getDefaultColumnProps("formaPago", "Forma de Pago", {
        searchState,
        setSearchState,
        width: 150,
      }),
    },
    {
      ...getDefaultColumnProps("cantidad", "Cantidad", {
        searchState,
        setSearchState,
        width: 125,
      }),
    },
    {
      ...getDefaultColumnProps("usuario", "Usuario", {
        searchable: false,
        width: 175,
      }),
    },
    {
      ...getDefaultColumnProps("fecha", "Fecha", {
        searchable: false,
        width: 125,
      }),
    },
    Table.SELECTION_COLUMN,
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Form
          // {...formItemLayout}
          layout="vertical"
          form={form}
          onFinish={(values) => {
            console.log(values);
          }}
          onFinishFailed={({ errorFields }) => {
            const errors = errorFields.map((x) => ({ name: x.name[0].toString(), errors: x.errors }));
            setErrors(errors);
          }}
          size="small"
        >
          <Row gutter={[8, 12]} align="bottom">
            <Col span={5}>
              <SelectInput
                formProps={{
                  name: "formaPagoId",
                  label: "Forma de Pago",
                }}
                options={[
                  { label: "Compañía", value: 1 },
                  { label: "Particular", value: 2 },
                ]}
              />
            </Col>
            <Col span={5}>
              <NumberInput
                formProps={{
                  name: "cantidad",
                  label: "Cantidad",
                }}
                max={100}
                min={0}
                // errors={["error"]}
              />
            </Col>
            <Col span={5}>
              <TextInput
                formProps={{
                  name: "noCuenta",
                  label: "Número de cuenta",
                }}
                max={100}
                errors={errors.find((x) => x.name === "sexo")?.errors}
              />
            </Col>
            <Col span={5}>
              <TextInput
                formProps={{
                  name: "fechaNacimiento",
                  label: "Afiliación",
                }}
                max={100}
              />
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <Button type="primary">Registrar Pago</Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col span={24}>
        <Table<IRequestPrice>
          size="small"
          rowKey={(record) => record.type + "-" + (record.estudioId ?? record.paqueteId)}
          columns={columns}
          dataSource={[]}
          pagination={false}
          rowSelection={{
            fixed: "right",
          }}
          sticky
          scroll={{ x: "fit-content" }}
        />
      </Col>
    </Row>
  );
};

export default RequestRegister;
