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
import { UploadChangeParam } from "antd/lib/upload";

type SeriesInvoiceProps = {
  id: number;
};

const SeriesInvoice: FC<SeriesInvoiceProps> = ({ id }) => {
  const { seriesStore, optionStore } = useStore();
  //   const {} = optionStore
  const { getById, createInvoice, updateInvoice, setSeriesType, getNewForm } =
    seriesStore;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<ISeries>();
  const [values, setValues] = useState<ISeries>(new SeriesValues());

  useEffect(() => {
    const readSerie = async (serieId: number) => {
      setLoading(true);
      const serie = await getById(serieId);

      if (serie) {
        setValues(serie);
      } else {
        const newForm: ISeriesNewForm = {
          tipoSerie: 1,
          sucursalId: "0",
        };
        let newValues = await getNewForm(newForm);

        if (newValues) {
          setValues(newValues);
        }
      }
      setLoading(false);
    };

    if (id) {
      readSerie(id);
    }
  }, [id, getById]);

  const goBack = () => {
    setSeriesType(0);
    navigate("/series");
  };

  const submitFile = async (file: FormData, fileName: string) => {
    setLoading(true);
    alerts.confirm(
      "Cargar archivo",
      `¿Está seguro que desea cargar el archivo ${fileName}?`,
      async () => {
        // await saveFile(file);
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
      submitFile(
        objectToFormData({ archivo: info.file.originFileObj }),
        info.file.name
      );
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

  const onFinish = async (newValues: ISeries) => {
    setLoading(true);

    const serie = { ...values, ...newValues };
    serie.factura.tipoSerie = 1;

    if (id) {
      await updateInvoice(serie);
    } else {
      await createInvoice(serie);
    }
    setLoading(false);
    goBack();
  };

  return (
    <Fragment>
      <Row>
        <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
          <Button onClick={goBack}>Cancelar</Button>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Col>
      </Row>
      <Form<ISeries>
        {...formItemLayout}
        form={form}
        name="seriesTicket"
        onFinish={onFinish}
        initialValues={values}
        scrollToFirstError
      >
        <Row>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "factura.clave",
                label: "Clave",
              }}
              required
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "factura.nombre",
                label: "Nombre",
              }}
              required
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <DateInput
              formProps={{
                name: "factura.año",
                label: "Año",
              }}
              pickerType="year"
              required
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <SwitchInput name="factura.cfdi" label="Crear CFDI" required />
          </Col>
          <Col span={6}>
            <SelectInput
              form={form}
              formProps={{ name: "factura.tipoSerie", label: "Tipo" }}
              options={[{ value: 1, label: "Factura" }]}
              required
              readonly={true}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <PasswordInput
              formProps={{
                name: "factura.contraseña",
                label: "Contraseña",
              }}
              placeholder={"Contraseña"}
              required
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <SwitchInput
              name="factura.estatus"
              label="Estatus"
              onChange={(value) => {
                if (value) {
                  alerts.info(messages.confirmations.invoiceEnabled);
                } else {
                  alerts.info(messages.confirmations.invoiceDisabled);
                }
              }}
              required
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextAreaInput
              formProps={{
                name: "factura.observaciones",
                label: "Observaciones",
              }}
              rows={4}
              autoSize
              required
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <Form.Item name="factura.archivoKey" label="Archivo.Key" required>
              <Upload {...props}>
                <Button type="primary" icon={<UploadOutlined />}>
                  Subir archivo
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col md={6} sm={24} xs={12}>
            <Form.Item name="factura.archivoCer" label="Archivo.Cer" required>
              <Upload {...props}>
                <Button type="primary" icon={<UploadOutlined />}>
                  Subir archivo
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Datos del emisor</Divider>
        <Row>
          <Col md={12} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.rfc",
                label: "RFC",
              }}
            />
          </Col>
          <Col md={12} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.nombre",
                label: "Nombre",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.codigoPostal",
                label: "Código postal",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.calle",
                label: "Calle",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.colonia",
                label: "Colonia",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.ciudad",
                label: "Municipio",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.estado",
                label: "Estado",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.pais",
                label: "País",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.numeroExterior",
                label: "No. Ext.",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.numeroInterior",
                label: "No. Int.",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.telefono",
                label: "Teléfono",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.website",
                label: "WebSite",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "emisor.correo",
                label: "E-mail",
              }}
            />
          </Col>
        </Row>
        <Divider orientation="left">Lugar de expedición</Divider>
        <Row>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.codigoPostal",
                label: "Código postal",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.calle",
                label: "Calle",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.colonia",
                label: "Colonia",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.ciudad",
                label: "Municipio",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.estado",
                label: "Estado",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.pais",
                label: "País",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.numeroExterior",
                label: "No. Ext.",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.numeroInterior",
                label: "No. Int.",
              }}
            />
          </Col>
          <Col md={6} sm={24} xs={12}>
            <TextInput
              formProps={{
                name: "expedicion.telefono",
                label: "Teléfono",
              }}
            />
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default observer(SeriesInvoice);
