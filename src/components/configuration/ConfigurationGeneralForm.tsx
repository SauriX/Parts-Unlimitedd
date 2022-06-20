import React, { useEffect, useState } from "react";
import { Form, Row, Col, Button, Spin, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import TextInput from "../../app/common/form/TextInput";
import { observer } from "mobx-react-lite";
import { IConfigurationGeneral } from "../../app/models/configuration";
import { useStore } from "../../app/stores/store";
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/lib/upload/interface";
import { UploadRequestOption } from "rc-upload/lib/interface";
import alerts from "../../app/util/alerts";
import "./configuration.less";
import { objectToFormData } from "../../app/util/utils";

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

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    alerts.info("Solo archivos .jpeg o .png son permitidos");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alerts.info("El tamaño máximo es de  2MB");
  }
  return isJpgOrPng && isLt2M;
};

const ConfigurationGeneralForm = () => {
  const { configurationStore, profileStore } = useStore();
  const { scopes, getGeneral, updateGeneral } = configurationStore;
  const { setLogoImg } = profileStore;

  const [form] = Form.useForm<IConfigurationGeneral>();

  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>();
  const [image, setImage] = useState<File>();

  useEffect(() => {
    const readEmail = async () => {
      setLoading(true);
      const general = await getGeneral();
      if (general) {
        form.setFieldsValue(general!);
      }
      setLoading(false);
    };

    readEmail();
  }, [form, getGeneral]);

  useEffect(() => {
    if (scopes?.modificar) {
      setReadonly(false);
    }
  }, [scopes]);

  const onFinish = async (general: IConfigurationGeneral) => {
    setLoading(true);
    general.logo = image;
    const formData = objectToFormData(general);
    const success = await updateGeneral(formData);
    if (success) {
      document.title = general.nombreSistema;
      if (imageUrl) {
        setLogoImg(imageUrl);
      }
    }
    setLoading(false);
  };

  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const file = info.file.originFileObj as RcFile;
      setImage(file);
      getBase64(file, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    } else if (info.file.status === "error") {
      alerts.warning(`${info.file.name} falló al cargar la imagen.`);
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Spin spinning={loading}>
      <Form<IConfigurationGeneral>
        {...formItemLayout}
        form={form}
        name="general"
        onFinish={onFinish}
        scrollToFirstError
      >
        <TextInput
          formProps={{ name: "nombreSistema", label: "Nombre Sistema" }}
          max={4000}
          required
          readonly={readonly}
        />
        <Row>
          <Col span={24} style={{ textAlign: "center" }}>
            <ImgCrop shape="rect" aspect={2.5} minZoom={0.25} quality={0.8}>
              <Upload
                key="upload"
                name="logo"
                className="upload-image"
                showUploadList={false}
                listType="picture-card"
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onPreview={onPreview}
                multiple={false}
                customRequest={({ file, onSuccess }: UploadRequestOption) => {
                  setTimeout(() => {
                    onSuccess!("ok");
                  }, 0);
                }}
                disabled={readonly}
                style={{
                  height: 120,
                  width: 240,
                }}
              >
                {
                  <img
                    src={imageUrl ?? `${process.env.REACT_APP_CATALOG_URL}/images/logo.png`}
                    alt="avatar"
                    style={{ width: "95%" }}
                  />
                }
              </Upload>
            </ImgCrop>
          </Col>
        </Row>
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

export default observer(ConfigurationGeneralForm);
