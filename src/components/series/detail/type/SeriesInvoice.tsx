import {
  Form,
  Row,
  Col,
  Button,
  Upload,
  message,
  UploadFile,
  UploadProps,
  Divider,
  Spin,
  Tag,
  Input,
} from "antd";
import { observer } from "mobx-react-lite";
import { FC, Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DateInput from "../../../../app/common/form/proposal/DateInput";
import PasswordInput from "../../../../app/common/form/proposal/PasswordInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import SwitchInput from "../../../../app/common/form/proposal/SwitchInput";
import TextAreaInput from "../../../../app/common/form/proposal/TextAreaInput";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import {
  ISeries,
  ISeriesNewForm,
  SeriesValues,
} from "../../../../app/models/series";
import { useStore } from "../../../../app/stores/store";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import {
  formItemLayout,
  objectToFormData,
  uploadFakeRequest,
} from "../../../../app/util/utils";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadChangeParam } from "antd/lib/upload";
import React from "react";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import { IOptions } from "../../../../app/models/shared";

type SeriesInvoiceProps = {
  id: number;
  tipoSerie: number;
};

const SeriesInvoice: FC<SeriesInvoiceProps> = ({ id, tipoSerie }) => {
  const { seriesStore, profileStore, optionStore } = useStore();
  const { profile } = profileStore;
  const {
    getById,
    createInvoice,
    updateInvoice,
    setSeriesType,
    getNewForm,
    getBranch,
  } = seriesStore;
  const { getBranchOptions, BranchOptions } = optionStore;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [form] = Form.useForm<ISeries>();
  const [values, setValues] = useState<ISeries>(new SeriesValues());

  const [keyFile, setKeyFile] = useState<RcFile>();
  const [cerFile, setCerFile] = useState<RcFile>();
  const [branch, setBranch] = useState<string>("");

  useEffect(() => {
    getBranchOptions();
  }, [getBranchOptions]);

  useEffect(() => {
    const readSerie = async (serieId: number, tipo: number) => {
      setLoading(true);
      const serie = await getById(serieId, tipo);

      if (serie) {
        serie.factura.año = moment(serie.factura.año);
        setValues(serie);
        form.setFieldsValue(serie);
      }
      setLoading(false);
    };

    if (id) {
      readSerie(id, tipoSerie);
    } else {
      const newForm: ISeriesNewForm = {
        tipoSerie: 1,
        sucursalId: profile?.sucursal!,
      };
      getNewForm(newForm).then((newValues) => {
        if (newValues) {
          newValues.factura.año = moment(newValues.factura.año);
          setValues(newValues);
          form.setFieldsValue(newValues);
        }
      });
    }
  }, [id, getById]);

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    setSeriesType(0);
    navigate("/series");
  };

  const submitFile = async (file: RcFile, fileName: string) => {
    setLoading(true);
    alerts.confirm(
      "Cargar archivo",
      `¿Está seguro que desea cargar el archivo ${fileName}?`,
      async () => {
        // await saveFile(file);
        fileName.split(".")[1] === "key" ? setKeyFile(file) : setCerFile(file);
        message.success(`${fileName} cargado existosamente.`);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  const onChangeFile = (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file;

    if (status === "uploading") {
      return;
    } else if (status === "done") {
      submitFile(info.file.originFileObj!, info.file.name);
    } else if (status === "error") {
      message.error(`Error al cargar el archivo ${info.file.name}.`);
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: uploadFakeRequest,
    onChange: (info) => onChangeFile(info),
  };

  const setEditMode = () => {
    navigate(`/series/${id}/${tipoSerie}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const onChangeBranch = async (value: string) => {
    const branch = await getBranch(value);
    setBranch(value);
    if (branch) {
      form.setFieldsValue({ expedicion: branch });
    }
  };

  const onFinish = async (newValues: ISeries) => {
    setLoading(true);

    const serie = { ...values, ...newValues };
    serie.factura.archivoKey = keyFile;
    serie.factura.archivoCer = cerFile;
    serie.expedicion.sucursalId = branch;

    let serieFormData = objectToFormData(serie);

    let success = false;

    if (id) {
      success = await updateInvoice(serieFormData);
    } else {
      success = await createInvoice(serieFormData);
    }
    setLoading(false);

    if (success) {
      goBack();
    }
  };

  return (
    <Spin spinning={loading} tip={"Guardando"}>
      <Row gutter={[24, 12]}>
        {!readonly && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
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
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={setEditMode}
            />
          </Col>
        )}
      </Row>
      <Form<ISeries>
        {...formItemLayout}
        form={form}
        name="seriesTicket"
        onFinish={onFinish}
        initialValues={values}
        scrollToFirstError
      >
        <Row gutter={[24, 12]}>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["factura", "clave"],
                label: "Clave",
              }}
              required
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["factura", "nombre"],
                label: "Nombre",
              }}
              required
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <DateInput
              formProps={{
                label: "Año",
                name: ["factura", "año"],
              }}
              disableAfterDates
              pickerType="year"
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <SwitchInput
              name={["factura", "cfdi"]}
              label="Crear CFDI"
              required
              readonly={readonly}
            />
          </Col>
          <Col span={6}>
            <SelectInput
              form={form}
              formProps={{ name: ["factura", "tipoSerie"], label: "Tipo" }}
              options={[{ value: 1, label: "Factura" }]}
              required
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <PasswordInput
              formProps={{
                name: ["factura", "contraseña"],
                label: "Contraseña",
              }}
              placeholder={"Contraseña"}
              required
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["factura", "sucursalKey"],
                label: "Key Sucursal",
              }}
              required
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <SwitchInput
              name={["factura", "estatus"]}
              label="Estatus"
              onChange={(value) => {
                if (value) {
                  alerts.info(messages.confirmations.invoiceEnabled);
                } else {
                  alerts.info(messages.confirmations.invoiceDisabled);
                }
              }}
              required
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextAreaInput
              formProps={{
                name: ["factura", "observaciones"],
                label: "Observaciones",
              }}
              rows={4}
              autoSize
              required
              readonly={readonly}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <Form.Item
              name={["factura", "archivoKey"]}
              label="Archivo.Key"
              required
            >
              <Input.Group>
                <Row gutter={4}>
                  <Col span={id ? 12 : 24}>
                    <Upload {...props}>
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        disabled={readonly}
                      >
                        Subir archivo
                      </Button>
                    </Upload>
                  </Col>
                  {id && (
                    <Col span={12}>
                      <Tag color="green">{values.factura.claveKey}</Tag>
                    </Col>
                  )}
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
          <Col md={6} sm={24} xs={12}>
            <Form.Item
              name={["factura", "archivoCer"]}
              label="Archivo.Cer"
              required
            >
              <Input.Group>
                <Row gutter={4}>
                  <Col span={id ? 12 : 24}>
                    <Upload {...props}>
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        disabled={readonly}
                      >
                        Subir archivo
                      </Button>
                    </Upload>
                  </Col>
                  {id && (
                    <Col span={12}>
                      <Tag color="green">{values.factura.claveCer}</Tag>
                    </Col>
                  )}
                </Row>
              </Input.Group>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Datos del emisor</Divider>
        <Row gutter={[24, 12]}>
          <Col md={12} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "rfc"],
                label: "RFC",
              }}
              readonly={true}
            />
          </Col>
          <Col md={12} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "razonSocial"],
                label: "Nombre",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "codigoPostal"],
                label: "Código postal",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "calle"],
                label: "Calle",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "colonia"],
                label: "Colonia",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "ciudad"],
                label: "Municipio",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "estado"],
                label: "Estado",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "pais"],
                label: "País",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "numeroExterior"],
                label: "No. Ext.",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "numeroInterior"],
                label: "No. Int.",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "telefono"],
                label: "Teléfono",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "webSite"],
                label: "WebSite",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["emisor", "correo"],
                label: "E-mail",
              }}
              readonly={true}
            />
          </Col>
        </Row>
        <Divider orientation="left">Lugar de expedición</Divider>
        <Row gutter={[24, 12]} style={{ marginBottom: 12 }}>
          <Col span={6} offset={18}>
            <SelectInput
              formProps={{
                name: ["expedicion", "sucursalId"],
                label: "Sucursal",
              }}
              options={BranchOptions}
              onChange={(value) => {
                onChangeBranch(value);
              }}
              required
              readonly={readonly}
            />
          </Col>
        </Row>
        <Row gutter={[24, 12]}>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "codigoPostal"],
                label: "Código postal",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "calle"],
                label: "Calle",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "colonia"],
                label: "Colonia",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "municipio"],
                label: "Municipio",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "estado"],
                label: "Estado",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "pais"],
                label: "País",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "numeroExterior"],
                label: "No. Ext.",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "numeroInterior"],
                label: "No. Int.",
              }}
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: ["expedicion", "telefono"],
                label: "Teléfono",
              }}
              readonly={true}
            />
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default observer(SeriesInvoice);
