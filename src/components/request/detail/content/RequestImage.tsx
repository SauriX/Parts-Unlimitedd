import { useEffect, useState } from "react";
import { Col, Row, Segmented, UploadProps, message, Upload, Image } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  beforeUploadValidation,
  getBase64,
  imageFallback,
  objectToFormData,
  uploadFakeRequest,
} from "../../../../app/util/utils";
import { RcFile } from "antd/lib/upload";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import { IRequestImage } from "../../../../app/models/request";

const { Dragger } = Upload;

const baseUrl = process.env.REACT_APP_MEDICAL_RECORD_URL + "/images/requests";

const RequestImage = () => {
  const { requestStore } = useStore();
  const { request, saveImage } = requestStore;

  const [type, setType] = useState<"orden" | "ine" | "formato">("orden");
  const [order, setOrder] = useState<string>();
  const [id, setId] = useState<string>();
  const [format, setFormat] = useState<string>();

  const submitImage = async (type: "orden" | "ine" | "formato", file: RcFile, imageUrl: string) => {
    if (request) {
      const requestImage: IRequestImage = {
        solicitudId: request.solicitudId!,
        expedienteId: request.expedienteId,
        imagen: file,
        tipo: type,
      };

      const formData = objectToFormData(requestImage);
      const ok = await saveImage(formData);

      if (ok) {
        if (type === "orden") {
          setOrder(imageUrl);
        } else if (type === "ine") {
          setId(imageUrl);
        } else if (type === "formato") {
          setFormat(imageUrl);
        }
      }
    }
  };

  const props: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: uploadFakeRequest,
    beforeUpload: (file) => beforeUploadValidation(file),
    onChange(info) {
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
    },
  };

  useEffect(() => {
    const orderUrl = `${baseUrl}/${request?.clave}/orden.png`;
    const idUrl = `${baseUrl}/${request?.clave}/ine.png`;
    const formatUrl = `${baseUrl}/${request?.clave}/formato.png`;

    fetch(orderUrl).then((x) => (x.status !== 404 ? setOrder(orderUrl) : null));
    fetch(idUrl).then((x) => (x.status !== 404 ? setId(idUrl) : null));
    fetch(formatUrl).then((x) => (x.status !== 404 ? setFormat(formatUrl) : null));
  }, [request?.clave]);

  const getContent = () => {
    if ((type === "orden" && !order) || (type === "ine" && !id) || (type === "formato" && !format)) {
      return (
        <>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Dar click o arrastrar archivo para cargar</p>
          <p className="ant-upload-hint">La imagén debe tener un tamaño máximo de 2MB y formato jpeg o png</p>
        </>
      );
    }

    const url = type === "orden" ? order : type === "ine" ? id : type === "formato" ? format : "";

    return <Image preview={false} style={{ maxWidth: "90%" }} src={url} fallback={imageFallback} />;
  };

  return (
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
        <Dragger {...props}>{getContent()}</Dragger>
      </Col>
    </Row>
  );
};

export default observer(RequestImage);
