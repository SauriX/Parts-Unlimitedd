import { Spin, Form, Row, Col, Button, Table, Input } from "antd";
import { useEffect, useState } from "react";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { IFormError, IOptions } from "../../../app/models/shared";
import { ITaxData } from "../../../app/models/taxdata";
import IconButton from "../../../app/common/button/IconButton";
import { EditOutlined } from "@ant-design/icons";
import alerts from "../../../app/util/alerts";
import { regimenFiscal } from "../../../app/util/catalogs";
import { toJS } from "mobx";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

type DatosFiscalesFormProps = {
  local?: boolean;
  recordId?: string;
  onSelectRow?: (taxData: ITaxData) => void;
};

const DatosFiscalesForm = ({
  local,
  recordId,
  onSelectRow,
}: DatosFiscalesFormProps) => {
  const { procedingStore, locationStore } = useStore();
  const { setTax, tax, getTaxData, createTaxData, updateTaxData } =
    procedingStore;
  const { getColoniesByZipCode } = locationStore;

  const [form] = Form.useForm<ITaxData>();

  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string>();
  const [localTaxData, setLocalTaxData] = useState<ITaxData[]>([]);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [errors, setErrors] = useState<IFormError[]>([]);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readTaxData = async () => {
      setLoading(true);
      const taxData = await getTaxData(recordId!);
      setLocalTaxData(taxData);
      setLoading(false);
    };

    if (local && recordId) {
      readTaxData();
    }
  }, [getTaxData, local, recordId]);

  const clearLocation = () => {
    form.setFieldsValue({
      estado: undefined,
      municipio: undefined,
      colonia: undefined,
    });
    setColonies([]);
  };

  const getColonies = async (zipCode: string) => {
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
    }
  };

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "cp") {
      const zipCode = changedValues[field] as string;
      if (zipCode.length < 5) {
        setErrors([{ name: "cp", errors: ["La longitud minima es de 5"] }]);
      } else {
        setErrors([]);
      }
      getColonies(zipCode);
    }
  };

  const onFinish = async (newValues: ITaxData) => {
    setLoading(true);
    setErrors([]);
    if (!newValues.cp || newValues.cp.length < 5) {
      alerts.warning("Favor de ingresar un Código Postal válido");
      setLoading(false);
      return;
    }
    const zipCode = newValues.rfc;
    if (
      zipCode.length === 10 ||
      zipCode.length === 13 ||
      zipCode.length === 12
    ) {
      var rfc = rfcValido(zipCode);
      if (!rfc) {
        alerts.warning(`El RFC ${zipCode} es inválido`);
        setLoading(false);
        return;
      }
    } else {
      alerts.warning(`El RFC ${zipCode} es inválido`);
      setLoading(false);
      return;
    }
    var taxes: ITaxData[] = local ? [...localTaxData] : [...(tax ?? [])];

    if (taxes.find((x) => x.rfc === newValues.rfc)) {
      alerts.warning(`El RFC ${newValues.rfc} ya existe`);
      setLoading(false);
      return;
    }
    newValues.expedienteId = recordId;
    if (newValues.id) {
      var existing = taxes.findIndex((x) => x.id === newValues.id);
      taxes[existing] = newValues;
    } else {
      newValues.id = `tempId${taxes.length}`;
      taxes.push(newValues);
    }

    if (local) {
      if (!newValues.id || newValues.id.startsWith("tempId")) {
        delete newValues.id;
        const id = await createTaxData(newValues);
        if (id) {
          taxes[taxes.length - 1] = { ...taxes[taxes.length - 1], id };
          setLocalTaxData(taxes);
          form.resetFields();
        }
      } else {
        const success = await updateTaxData(newValues);
        if (success) {
          setLocalTaxData(taxes);
          form.resetFields();
        }
      }
    } else {
      setTax(taxes);
      form.resetFields();
    }

    setLoading(false);
  };

  const columnsEstudios: IColumns<ITaxData> = [
    {
      ...getDefaultColumnProps("rfc", "RFC", {
        searchState,
        setSearchState,
        width: "15%",
      }),
    },
    {
      ...getDefaultColumnProps("razonSocial", "Razon Social", {
        searchState,
        setSearchState,
        width: "30%",
      }),
    },
    {
      ...getDefaultColumnProps("calle", "Dirección", {
        searchState,
        setSearchState,
        width: "25%",
      }),
    },
    {
      ...getDefaultColumnProps("correo", "Correo", {
        searchState,
        setSearchState,
        width: "20%",
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Editar",
      align: "center",
      width: "10%",
      render: (_, item) => (
        <IconButton
          title="Editar lista de precio"
          icon={<EditOutlined />}
          onClick={() => {
            getColonies(item.cp);
            console.log("item", toJS(item));
            item.regimenFiscal =
              "" +
                regimenFiscal.find((x) => x.value === item.regimenFiscal)
                  ?.label ?? "";
            form.setFieldsValue(item);
          }}
        />
      ),
    },
  ];
  function rfcValido(rfc: string, aceptarGenerico = true) {
    // patron del RFC, persona moral
    const _rfc_pattern_pm =
      "^(([A-ZÑ&]{3})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{3})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

    // patron del RFC, persona fisica
    const _rfc_pattern_pf =
      "^(([A-ZÑ&]{4})([0-9]{2})([0][13578]|[1][02])(([0][1-9]|[12][\\d])|[3][01])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([0-9]{2})([0][13456789]|[1][012])(([0][1-9]|[12][\\d])|[3][0])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([02468][048]|[13579][26])[0][2]([0][1-9]|[12][\\d])([A-Z0-9]{3}))|" +
      "(([A-ZÑ&]{4})([0-9]{2})[0][2]([0][1-9]|[1][0-9]|[2][0-8])([A-Z0-9]{3}))$";

    if (
      rfc.toUpperCase().match(_rfc_pattern_pm) ||
      rfc.toUpperCase().match(_rfc_pattern_pf)
    ) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <Spin spinning={loading}>
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <Form<ITaxData>
            {...formItemLayout}
            form={form}
            name="taxes"
            onFinish={onFinish}
            onFinishFailed={({ errorFields }) => {
              const errors = errorFields.map((x) => ({
                name: x.name[0].toString(),
                errors: x.errors,
              }));
              setErrors(errors);
            }}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row gutter={[0, 12]}>
              <TextInput
                formProps={{
                  name: "id",
                  style: { display: "none" },
                }}
              />
              <Col md={6} xs={24}>
                <TextInput
                  formProps={{
                    name: "rfc",
                    label: "RFC",
                    labelCol: { span: 8 },
                    wrapperCol: { span: 16 },
                  }}
                  max={13}
                  required
                  errors={errors.find((x) => x.name === "rfc")?.errors}
                />
              </Col>
              <Col md={18} xs={24}>
                <TextInput
                  formProps={{
                    name: "razonSocial",
                    label: "Razón Social",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  max={100}
                  required
                  errors={errors.find((x) => x.name === "razonSocial")?.errors}
                />
              </Col>
              <Col md={18} xs={24}>
                <SelectInput
                  formProps={{
                    name: "regimenFiscal",
                    label: "Regimen Fiscal",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  options={regimenFiscal}
                  errors={
                    errors.find((x) => x.name === "regimenFiscal")?.errors
                  }
                />
              </Col>
              <Col md={16} xs={24}>
                <Form.Item
                  label="CP"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  help=""
                  className="no-error-text"
                  required
                >
                  <Input.Group>
                    <Row gutter={8}>
                      <Col md={6} xs={24}>
                        <TextInput
                          formProps={{
                            name: "cp",
                            label: "CP",
                            noStyle: true,
                          }}
                          max={5}
                          showLabel
                          errors={errors.find((x) => x.name === "cp")?.errors}
                        />
                      </Col>
                      <Col md={9} xs={24}>
                        <TextInput
                          formProps={{
                            name: "estado",
                            label: "Estado",
                            noStyle: true,
                          }}
                          max={500}
                          showLabel
                          readonly
                        />
                      </Col>
                      <Col md={9} xs={24}>
                        <TextInput
                          formProps={{
                            name: "municipio",
                            label: "Municipio",
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
              <Col md={8} xs={24}>
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "E-Mail",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  type="email"
                  max={100}
                  errors={errors.find((x) => x.name === "correo")?.errors}
                />
              </Col>
              <Col md={8} xs={24}>
                <SelectInput
                  formProps={{
                    name: "colonia",
                    label: "Colonia",
                    labelCol: { span: 6 },
                    wrapperCol: { span: 18 },
                  }}
                  options={colonies}
                />
              </Col>
              <Col md={12} xs={24}>
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle y Número",
                    labelCol: { span: 9 },
                    wrapperCol: { span: 15 },
                  }}
                  max={100}
                  errors={errors.find((x) => x.name === "calle")?.errors}
                />
              </Col>
              <Col md={4} xs={24} style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit">
                  Añadir
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={24}>
          <Table<ITaxData>
            tableLayout="auto"
            sticky
            columns={columnsEstudios}
            pagination={false}
            rowKey={(item) => item.id!}
            dataSource={local ? localTaxData : [...(tax ?? [])]}
            scroll={{ x: "max-content" }}
            rowClassName={(taxData) =>
              taxData.id === selectedRow ? "custom-selected-row" : ""
            }
            onRow={(taxData) => {
              return {
                onClick: () => {
                  if (onSelectRow) {
                    setSelectedRow(taxData.id);
                    onSelectRow(taxData);
                  }
                },
              };
            }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(DatosFiscalesForm);
