import { Form, Row, Col, Checkbox, Input, Button, Table, Typography, Spin } from "antd";
import React, { useState } from "react";
import Request from "../../../../app/api/request";
import { verifyAdminCreds } from "../../../../app/common/administrator/adminCreds";
import NumberInput from "../../../../app/common/form/proposal/NumberInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../../app/common/table/utils";
import { IRequestStudy } from "../../../../app/models/request";
import { IFormError } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import { moneyFormatter } from "../../../../app/util/utils";
import RequestInvoiceTab from "./invoice/RequestInvoiceTab";

const { Link } = Typography;

const data = [
  {
    id: 213123,
    documento: "Factura",
    serie: "123",
    numero: "A-79345",
    formaPago: "Efectivo",
    cantidad: 1,
    usuario: "Oscar",
    fecha: "06/07/2022",
  },
];

type RequestRegisterProps = {
  recordId: string;
};

const RequestRegister = ({ recordId }: RequestRegisterProps) => {
  const { requestStore, modalStore } = useStore();
  const { printTicket } = requestStore;
  const { openModal } = modalStore;

  const [form] = Form.useForm<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<IRequestStudy> = [
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
    <Spin spinning={loading}>
      <Row gutter={[8, 12]}>
        <Col span={24}>
          <Form
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
          <Table<any>
            size="small"
            rowKey={(record) => record.type + "-" + (record.estudioId ?? record.paqueteId)}
            columns={columns}
            dataSource={[...data]}
            pagination={false}
            rowSelection={{
              fixed: "right",
            }}
            sticky
            scroll={{ x: "fit-content" }}
          />
        </Col>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            type="default"
            onClick={async () => {
              setLoading(true);
              await printTicket("", "");
              setLoading(false);
            }}
          >
            Imprimir
          </Button>
          <Button
            ghost
            danger
            type="primary"
            onClick={async () => {
              const hasPermission = await verifyAdminCreds();
              console.log(hasPermission);
            }}
          >
            Cancelar
          </Button>
          <Button
            type="primary"
            onClick={() => {
              openModal({
                title: "Datos Fiscales",
                body: <RequestInvoiceTab recordId={recordId} />,
                width: 900,
              });
            }}
          >
            Facturar
          </Button>
          <Button type="primary">Descargar XML</Button>
        </Col>
      </Row>
    </Spin>
  );
};

export default RequestRegister;
