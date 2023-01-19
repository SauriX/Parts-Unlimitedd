import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Switch,
  Table,
  Typography,
} from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import MaskInput from "../../../../app/common/form/proposal/MaskInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import { IFormError } from "../../../../app/models/shared";
import { useStore } from "../../../../app/stores/store";
import { formItemLayout, validateEmail } from "../../../../app/util/utils";
const { Text } = Typography;

type InvoiceCompanyDeliverType = {
  companiaId: string;
  facturapiId: string;
};
const InvoiceCompanyDeliver = ({
  companiaId,
  facturapiId,
}: InvoiceCompanyDeliverType) => {
  const { companyStore, invoiceCompanyStore } = useStore();
  const { getContactsByCompany, contactos } = companyStore;
  const { sendInvoice } = invoiceCompanyStore;
  const [form] = Form.useForm<any>();
  const email = Form.useWatch("correo", form);
  const whatsapp = Form.useWatch("whatsapp", form);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [mediosEnvios, setMediosEnvios] = useState<any[]>([]);
  const [telefono, setTelefono] = useState<string>();
  const [correo, setCorreo] = useState<string>();
  const [isSelectedContacts, setIsSelectedContacts] = useState<boolean>(true);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidWhatsapp, setIsValidWhatsapp] = useState(false);

  useEffect(() => {
    setIsValidEmail(validateEmail(email));
    setIsValidWhatsapp(
      (whatsapp ?? "").replaceAll("-", "").replaceAll("_", "").length === 10
    );
  }, [email, whatsapp]);
  useEffect(() => {
    getContactsByCompany(companiaId);
  }, []);
  const sendOptions = [
    { label: "Mandar via correo electronico", value: "correo" },
    { label: "Mandar via Whatsapp", value: "whatsapp" },
    { label: "Ambos", value: "ambos" },
  ];
  const columns: any[] = [
    {
      key: "nombre",
      dataIndex: "nombre",
      title: "Nombre/Depto.",
      align: "center",
      width: 100,
      //   render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "telefono",
      dataIndex: "telefono",
      title: "Whatsapp",
      align: "center",
      width: 100,
      //   render: (value) => (value ? "Sí" : "No"),
    },
    {
      key: "correo",
      dataIndex: "correo",
      title: "Correo",
      align: "center",
      width: 100,
      //   render: (value) => (value ? "Sí" : "No"),
    },
  ];

  const dummy = [
    {
      id: 1,
      nombre: "aaaaa",
      correo: "asd",
      whatsapp: "",
    },
    {
      id: 2,
      nombre: "bbbbbb",
      correo: "asd",
      whatsapp: "",
    },
    {
      id: 3,
      nombre: "cccccc",
      correo: "asd",
      whatsapp: "",
    },
    {
      id: 4,
      nombre: "ddddddd",
      correo: "asd",
      whatsapp: "",
    },
  ];
  return (
    <>
      <Row>
        <Col span={9}>
          <Text>Seleccionar contacto de agenda</Text>
        </Col>
        <Col>
          <Switch
            defaultChecked
            onChange={(checked) => setIsSelectedContacts(checked)}
          ></Switch>
        </Col>
      </Row>
      <Row>
        <Checkbox.Group
          options={sendOptions}
          defaultValue={mediosEnvios}
          onChange={(checkedValues) => {
            console.log("checkd", toJS(checkedValues));
            if (checkedValues.includes("ambos")) {
              setMediosEnvios(["correo", "whatsapp", "ambos"]);
              return;
            }
            setMediosEnvios(checkedValues);
          }}
        />
      </Row>
      <Row>
        {isSelectedContacts ? (
          <Col span={24}>
            <Table
              rowKey={(record) => record.id}
              columns={columns}
              rowSelection={{
                selectedRowKeys,
                onChange: (newSelectedRowKeys) => {
                  setSelectedRowKeys(newSelectedRowKeys);
                },
              }}
              dataSource={contactos}
            />
          </Col>
        ) : (
          <>
            <Col span={24}>
              <Form {...formItemLayout} form={form} size="small">
                <Col span={24}>
                  <Form.Item
                    label="E-Mail"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    className="no-error-text"
                    help=""
                    required={mediosEnvios?.includes("correo")}
                  >
                    <Input.Group>
                      <Row>
                        <Col span={12}>
                          <TextInput
                            formProps={{
                              name: "correo",
                              label: "E-Mail",
                              noStyle: true,
                            }}
                            readonly={!mediosEnvios?.includes("correo")}
                            required={mediosEnvios?.includes("correo")}
                            errors={
                              errors.find((x) => x.name === "correo")?.errors
                            }
                          />
                        </Col>
                        <Col span={12}>
                          <Button
                            type="primary"
                            disabled={
                              !mediosEnvios?.includes("correo") || !isValidEmail
                            }
                            onClick={() => {
                              let sendInvoiceData = {
                                contactos: [
                                  {
                                    nombre: "",
                                    telefono: whatsapp,
                                    correo: email,
                                  },
                                ],
                                mediosEnvio: ["correo"],
                                facturapiId,
                                esPrueba: true,
                              };
                              sendInvoice(sendInvoiceData);
                            }}
                          >
                            Prueba
                          </Button>
                        </Col>
                      </Row>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Whatsapp"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    className="no-error-text"
                    help=""
                    required={mediosEnvios?.includes("whatsapp")}
                  >
                    <Input.Group>
                      <MaskInput
                        formProps={{
                          name: "whatsapp",
                          label: "Whatsapp",
                          noStyle: true,
                        }}
                        width="50%"
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
                          return Promise.reject(
                            "El campo debe contener 10 dígitos"
                          );
                        }}
                        readonly={!mediosEnvios?.includes("whatsapp")}
                        required={mediosEnvios?.includes("whatsapp")}
                        errors={
                          errors.find((x) => x.name === "whatsapp")?.errors
                        }
                      />
                      <Button
                        type="primary"
                        disabled={
                          !mediosEnvios?.includes("whatsapp") ||
                          !isValidWhatsapp
                        }
                        onClick={() => {
                          let sendInvoiceData = {
                            contactos: [
                              {
                                nombre: "",
                                telefono: whatsapp,
                                correo: email,
                              },
                            ],
                            mediosEnvio: ["whatsapp"],
                            facturapiId,
                            esPrueba: true,
                          };
                          sendInvoice(sendInvoiceData);
                        }}
                        onChange={() => {
                          console.log(
                            "che1",
                            !mediosEnvios?.includes("whatsapp") ||
                              !isValidWhatsapp
                          );
                          console.log(
                            "che2",
                            !mediosEnvios?.includes("whatsapp")
                          );
                          console.log(
                            "che3",

                            !isValidWhatsapp
                          );
                        }}
                      >
                        Prueba
                      </Button>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Form>
            </Col>
          </>
        )}
      </Row>
      <Row>
        <Col span={24}>
          <Button
            disabled={!selectedRowKeys?.length || !mediosEnvios.length}
            onClick={() => {
              let sendInvoiceData = {
                contactos: isSelectedContacts
                  ? contactos
                      .filter((contacto: any) =>
                        selectedRowKeys?.includes(contacto.id)
                      )
                      .map((contacto) => ({
                        ...contacto,
                        telefono: "" + contacto.telefono,
                      }))
                  : [
                      {
                        nombre: "",
                        telefono: whatsapp,
                        correo: email,
                      },
                    ],
                mediosEnvio: mediosEnvios,
                facturapiId,
                esPrueba: false,
              };
              sendInvoice(sendInvoiceData);
            }}
          >
            Enviar
          </Button>{" "}
        </Col>
      </Row>
    </>
  );
};

export default observer(InvoiceCompanyDeliver);
