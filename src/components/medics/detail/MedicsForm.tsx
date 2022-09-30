import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Select, Segmented, Upload, Modal , Image, UploadProps, message,} from "antd";
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import { formItemLayout, imageFallback,  uploadFakeRequest,  beforeUploadValidation,getBase64,objectToFormData,} from "../../../app/util/utils";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IMedicsForm, MedicsFormValues } from "../../../app/models/medics";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { IClinicList } from "../../../app/models/clinic";
import { observer } from "mobx-react-lite";
import { List, Typography } from "antd";
import { IOptions } from "../../../app/models/shared";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import MaskInput from "../../../app/common/form/MaskInput";
import Dragger from "antd/lib/upload/Dragger";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import { IRequestImage } from "../../../app/models/request";
// import { v4 as uuid } from "uuid";
type imageTypes = {
  order: string;
  id: string;
  idBack: string;
  format: string[];
};
const baseUrl = process.env.REACT_APP_MEDICAL_RECORD_URL + "/images/requests";
type MedicsFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};
const MedicsForm: FC<MedicsFormProps> = ({ id, componentRef, printing }) => {
  
  const { medicsStore, optionStore, locationStore } = useStore();
  const { getById, create, update, getAll, medics ,saveImage,deleteImage} = medicsStore;
  const { clinicOptions, getClinicOptions } = optionStore;
  const { fieldOptions, getfieldsOptions } = optionStore;
  const { getColoniesByZipCode } = locationStore;
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [colonies, setColonies] = useState<IOptions[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [values, setValues] = useState<IMedicsForm>(new MedicsFormValues());
  const [clinic, setClinic] = useState<{ clave: ""; id: number }>();
  const [images, setImages] = useState<imageTypes>({
    order: "",
    id: "",
    idBack: "",
    format: [],
  });
  const [type, setType] = useState<"orden" | "ine" | "ineReverso" | "formato">(
    "orden"
  );
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const onChangeImage = (
    info: UploadChangeParam<UploadFile<any>>,
    type: "orden" | "ine" | "ineReverso" | "formato"
  ) => {
    const { status } = info.file;
    if (status === "uploading") {
      return;
    } else if (status === "done") {
      getBase64(info.file.originFileObj, (imageStr) => {
        submitImage(type, info.file.originFileObj!, imageStr!.toString());
      });
    } else if (status === "error") {
      message.error(`Error al cargar el archivo ${info.file.name}`);
    }
  };
  const navigate = useNavigate();
  const props = (
    type: "orden" | "ine" | "ineReverso" | "formato"
  ): UploadProps => ({
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: uploadFakeRequest,
    beforeUpload: (file) => beforeUploadValidation(file),
    onChange: (info) => onChangeImage(info, type),
  });
  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IMedicsForm>();
  const handleCancel = () => setPreviewVisible(false);
  const submitImage = async (
    type: "orden" | "ine" | "ineReverso" | "formato",
    file: RcFile,
    imageUrl: string
  ) => {
    if (values) {
      const requestImage: IRequestImage = {
        solicitudId:values.idMedico!,
        expedienteId: "",
        imagen: file,
        tipo: type,
      };

      setLoading(true);
      const formData = objectToFormData(requestImage);
      const imageName = await saveImage(formData);
      setLoading(false);

      if (imageName) {
        if (type === "orden") {
          setImages({ ...images, order: imageUrl });
        } else if (type === "ine") {
          setImages({ ...images, id: imageUrl });
        } else if (type === "ineReverso") {
          setImages({ ...images, idBack: imageUrl });
        } else if (type === "formato") {
          imageUrl = `${baseUrl}/${values?.clave}/${imageName}.png`;
          setImages({
            ...images,
            format: [...images.format.filter((x) => x !== imageUrl), imageUrl],
          });
        }
      }
    }
  };

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };
  const getContent = (url64: string) => {
    if (!url64) {
      return (
        <>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Dar click o arrastrar archivo para cargar
          </p>
          <p className="ant-upload-hint">
            La imagén debe tener un tamaño máximo de 2MB y formato jpeg o png
          </p>
        </>
      );
    }

    const url = url64;

    return (
      <Image
        preview={false}
        style={{ maxWidth: "90%" }}
        src={url}
        fallback={imageFallback}
      />
    );
  };
  const onChangeImageFormat: UploadProps["onChange"] = ({ file }) => {
    getBase64(file.originFileObj, (imageStr) => {
      submitImage(type, file.originFileObj!, imageStr!.toString());
    });
  };
  const onRemoveImageFormat = async (file: UploadFile<any>) => {
    if (values) {
      setLoading(true);
      const ok = await deleteImage(
        values.idMedico,
        values.idMedico!,
        file.name
      );
      setLoading(false);
      if (ok) {
        setImages((prev) => ({
          ...prev,
          format: prev.format.filter((x) => !x.includes(file.name)),
        }));
      }
      return ok;
    }
    return false;
  };
  const getFormatContent = () => {
    return (
      <Fragment>
        <Upload
          customRequest={uploadFakeRequest}
          beforeUpload={(file) => beforeUploadValidation(file)}
          listType="picture-card"
          fileList={images?.format.map((x) => ({
            uid: x,
            name: x.split("/")[x.split("/").length - 1].slice(0, -4),
            url: x,
          }))}
          onPreview={handlePreview}
          onChange={onChangeImageFormat}
          onRemove={onRemoveImageFormat}
        >
          {uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </Fragment>
    );
  };
  const clearLocation = useCallback(() => {
    form.setFieldsValue({
      estadoId: undefined,
      ciudadId: undefined,
      coloniaId: undefined,
    });
    setColonies([]);
  }, [form]);

  const getLocation = useCallback(
    async (zipCode: string) => {
      const location = await getColoniesByZipCode(zipCode);
      if (location) {
        form.setFieldsValue({
          estadoId: location.estado,
          ciudadId: location.ciudad,
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
    },
    [clearLocation, form, getColoniesByZipCode]
  );
  const [readonly, setReadonly] = useState(searchParams.get("mode") === "readonly");
  useEffect(() => {
    const readMedics = async (id: string) => {
      setLoading(true);
      const medics = await getById(id);

      if (medics) {
        form.setFieldsValue(medics);
        getLocation(medics.codigoPostal!.toString());
        setValues(medics);
      }

      setLoading(false);
      //console.log(medics);
    };

    if (id) {
      readMedics(id);
    }
  }, [form, getById, getLocation, id]);

  useEffect(() => {
    getClinicOptions();
  }, [getClinicOptions]);

  useEffect(() => {
    getfieldsOptions();
  }, [getfieldsOptions]);

  useEffect(() => {
    const readMedics = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readMedics();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: IMedicsForm) => {
    const medics = { ...values, ...newValues };

    // medics.telefono = medics.telefono
    //   ? parseInt(
    //       medics.telefono.toString()?.replaceAll("_", "0")?.replaceAll("-", "")
    //     )
    //   : undefined;
    //   medics.celular = medics.celular
    //   ? parseInt(
    //       medics.celular.toString()?.replaceAll("_", "0")?.replaceAll("-", "")
    //     )
    //   : undefined;   
      
    let success = false;

   //console.log(medics);


    const clinics = [...medics.clinicas];
    clinics.forEach((v, i, a) => {
      a[i].id = typeof a[i].id === "string" ? 0 : v.id;
    });
    medics.clinicas = clinics;

    if (!medics.idMedico) {
      medics.idMedico = "00000000-0000-0000-0000-000000000000"
      success = await create(medics);
    } else {
      success = await update(medics);
    }

    if (success) {
      navigate(`/medics?search=${searchParams.get("search") || "all"}`);
    }
  };
  const actualmedic = () => {
    if (id) {
      const index = medics.findIndex((x) => x.idMedico === id);
      return index + 1;
    }
    return 0;
  };

  const prevnextMedics = (index: number) => {
    const medic = medics[index];
    navigate(
      `/medics/${medic?.idMedico}?mode=${searchParams.get("mode")}&search=${searchParams.get("search")}`
    );
  };

  useEffect(() => {
    //console.log(values);
  }, [values]);

  const onValuesChange = async (changeValues: any, values: IMedicsForm) => {
    // console.log(changeValues, values);

    const code =
      values.nombre.substring(0, 3) +
      values.primerApellido?.substring(0, 1) +
      values.segundoApellido?.substring(0, 1);

    form.setFieldsValue({ clave: code.toUpperCase() });

    const field = Object.keys(changeValues)[0];

    if (field === "codigoPostal") {
      const zipCode = changeValues[field] as string;

      if (zipCode && zipCode.toString().trim().length === 5) {
        getLocation(zipCode);
      } else {
        clearLocation();
      }
    }
  };
  const addClinic = () => {
    if (clinic) {
      if (values.clinicas.findIndex((x) => x.id === clinic.id) > -1) {
        alerts.warning("Ya esta agregada esta clinica");
        return;
      }
      const clinics: IClinicList[] = [
        ...values.clinicas,
        {
          id: clinic.id,
          clave: clinic.clave,
          nombre: clinic.clave,
          activo: true,
        },
      ];

      setValues((prev) => ({ ...prev, clinicas: clinics }));
    }
  };

  const deleteClinic = (id: number) => {
    const clinics = values.clinicas.filter((x) => x.id !== id);

    setValues((prev) => ({ ...prev, clinicas: clinics }));
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={medics.length}
              pageSize={1}
              current={actualmedic()}
              onChange={(value) => {
                prevnextMedics(value - 1);
              }}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate("/medics");}}
            >Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabled}
              onClick={() => {
                form.submit();
                return;}}>Guardar </Button></Col>
        )}
        {readonly && (
          <Col md={12} sm={24} style={{ textAlign: "right" }}>
            {readonly && (
              <ImageButton
                key="edit"
                title="Editar"
                image="editar"
                onClick={() => {
                  setReadonly(false);
                }}
              />
            )}
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo de Médicos" image="doctor" />}
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IMedicsForm>
            {...formItemLayout}
            form={form}
            name="medics"
            onValuesChange={onValuesChange}
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onFieldsChange={() => {
              setDisabled(
                !form.isFieldsTouched() ||
                  form.getFieldsError().filter(({ errors }) => errors.length).length > 0
              );
            }}
          >
            <Row>
              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={true}
                  type="string"
                />

                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "primerApellido",
                    label: "Primer Apellido",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "segundoApellido",
                    label: "Segundo Apellido",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "password",
                    label: "Contraseña",
                  }}
                  max={100}

                  readonly={readonly}
                />
                <SelectInput
                  formProps={{
                    name: "especialidadId",
                    label: "Especialidad",
                  }}
                  required
                  readonly={readonly}
                  options={fieldOptions}
                />

                {/* <NumberInput
                  formProps={{
                    name: "Clinicas",
                    label: "Clinicas",
                  }}
                  max={9999999999}
                  min={9}
                  readonly={true}
                /> */}
                <TextAreaInput
                  formProps={{
                    name: "observaciones",
                    label: "Observaciones",
                  }}
                  max={500}
                  rows={12}
                  readonly={readonly}
                />
                <Row gutter={[0, 12]}>
                  <Col span={24}>
                    <Segmented
                      className="requet-image-segment"
                      defaultValue={"orden"}
                      options={[
                        { label: "Orden", value: "orden" },
                        { label: "INE", value: "ine" },
                        { label: "Formato", value: "formato" },
                      ]}
                      onChange={(value: any) => setType(value)}
                    />
                  </Col>
                  <Col span={24}>
                    {type === "orden" ? (
                      <Dragger {...props("orden")}>{getContent(images.order)}</Dragger>
                    ) : type === "ine" ? (
                      <Row gutter={[24, 24]}>
                        <Col span={12}>
                          <Dragger {...props("ine")}>{getContent(images.id)}</Dragger>
                        </Col>
                        <Col span={12}>
                          <Dragger {...props("ineReverso")}>
                            {getContent(images.idBack)}
                          </Dragger>
                        </Col>
                      </Row>
                    ) : type === "formato" ? (
                      getFormatContent()
                    ) : null}
                  </Col>
                </Row>
              </Col>

              <Col md={12} sm={24}>
              <MaskInput
                  formProps={{
                    name: "codigoPostal",
                    label: "Código P",
                  }}
                  mask={[
                    /[0-9]/,
                    /[0-9]/,
                    /[0-9]/,
                    /[0-9]/,
                    /[0-9]/,
                  ]}
                  validator={(_, value: any) => {
                    if (!value || value.indexOf("_") === -1) {
                      return Promise.resolve();
                    }
                    return Promise.reject("El campo debe contener 5 dígitos");
                  }}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "estadoId",
                    label: "Estado",
                  }}
                  max={100}
                  readonly={readonly}
                />

                <TextInput
                  formProps={{
                    name: "ciudadId",
                    label: "Ciudad",
                  }}
                  max={100}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "numeroExterior",
                    label: "Número Exterior",
                  }}
                  max={9999}
                  required
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "numeroInterior",
                    label: "Número interior",
                  }}
                  max={9999}
                  readonly={readonly}
                />
                <TextInput
                  formProps={{
                    name: "calle",
                    label: "Calle",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
                <SelectInput
                  formProps={{
                    name: "coloniaId",
                    label: "Colonia",
                  }}
                  required
                  readonly={readonly}
                  options={colonies}
                />
                <TextInput
                  formProps={{
                    name: "correo",
                    label: "Correo",
                  }}
                  max={100}
                  readonly={readonly}
                  type="email"
                />
                <MaskInput
                  formProps={{
                    name: "celular",
                    label: "Celular",
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
                {/* <NumberInput
                  formProps={{
                    name: "celular",
                    label: "Celular",
                  }}
                  max={10000000000}
                  min={10}
                  readonly={readonly}
                /> */}
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
                {/* <NumberInput
                  formProps={{
                    name: "telefono",
                    label: "Teléfono",
                  }}
                  max={10000000000}
                  min={10}
                  readonly={readonly}
                /> */}

                <SwitchInput
                  name="activo"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.enable);
                    } else {
                      alerts.info(messages.confirmations.disable);
                    }
                  }}
                  label="Activo"
                  readonly={readonly}
                />
              </Col>
            </Row>
          </Form>

          <Divider orientation="left">Clínica/Empresa</Divider>
      <List<IClinicList>
        header={
          <div>
            <Col md={12} sm={24} style={{ marginRight: 20 }}>
              Nombre Clínica/Empresa .
              <Select
                options={clinicOptions}
                onChange={(value, option: any) => {
                  if (value) {
                    setClinic({ id: value, clave: option.label });
                  } else {
                    setClinic(undefined);
                  }
                }}
                style={{ width: 240, marginRight: 20 }}
              />
              {!readonly && (
                <ImageButton
                  key="agregar"
                  title="Agregar Clinica"
                  image="agregar-archivo"
                  onClick={addClinic}
                />
              )}
            </Col>
          </div>
        }
        footer={<div></div>}
        bordered
        dataSource={values.clinicas}
        renderItem={(item) => (
          <List.Item>
            <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <Typography.Text mark></Typography.Text>
              {item.nombre}
            </Col>
            <Col md={12} sm={24} style={{ textAlign: "left" }}>
              <ImageButton
                key="Eliminar"
                title="Eliminar Clinica"
                image="Eliminar_Clinica"
                onClick={() => {
                  deleteClinic(item.id);
                }}
              />
            </Col>
          </List.Item>
        )}
      />
        </div>
      </div>  
    </Spin>
  );
};

export default observer(MedicsForm);
