import { useEffect, useState } from "react";
import {
  Col,
  Row,
  Segmented,
  UploadProps,
  message,
  Upload,
  Image,
  Modal,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  beforeUploadValidation,
  getBase64,
  imageFallback,
  objectToFormData,
  uploadFakeRequest,
} from "../../../../app/util/utils";
import { RcFile, UploadFile } from "antd/lib/upload";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../app/stores/store";
import { IRequestImage } from "../../../../app/models/request";

const { Dragger } = Upload;

const baseUrl = process.env.REACT_APP_MEDICAL_RECORD_URL + "/images/requests";

type imageTypes = {
  order: string;
  id: string;
  idBack: string;
  format: string[];
};

const RequestImage = () => {
  const { requestStore } = useStore();
  const { request, saveImage } = requestStore;

  const [type, setType] = useState<"orden" | "ine" | "formato">("orden");
  const [images, setImages] = useState<imageTypes>({
    order: "",
    id: "",
    idBack: "",
    format: [],
  });
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const submitImage = async (
    type: "orden" | "ine" | "formato",
    file: RcFile,
    imageUrl: string
  ) => {
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
          setImages({ ...images, order: imageUrl });
        } else if (type === "ine") {
          setImages({ ...images, order: imageUrl });
        } else if (type === "formato") {
          setImages({ ...images, order: imageUrl });
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
    setImages({
      order: orderUrl,
      id: orderUrl,
      idBack: orderUrl,
      format: [orderUrl],
    });
    // const idUrl = `${baseUrl}/${request?.clave}/ine.png`;
    // const formatUrl = `${baseUrl}/${request?.clave}/formato.png`;

    // fetch(orderUrl).then((x) => (x.status !== 404 ? setOrder(orderUrl) : null));
    // fetch(idUrl).then((x) => (x.status !== 404 ? setId(idUrl) : null));
    // fetch(formatUrl).then((x) =>
    //   x.status !== 404 ? setFormat(formatUrl) : null
    // );
  }, [request?.clave]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

  const getContent = () => {
    // if (
    //   type === "orden" ||
    //   (type === "ine" && !id) ||
    //   (type === "formato" && !format)
    // ) {
    //   return (
    //     <>
    //       <p className="ant-upload-drag-icon">
    //         <InboxOutlined />
    //       </p>
    //       <p className="ant-upload-text">
    //         Dar click o arrastrar archivo para cargar
    //       </p>
    //       <p className="ant-upload-hint">
    //         La imagén debe tener un tamaño máximo de 2MB y formato jpeg o png
    //       </p>
    //     </>
    //   );
    // }

    const url =
      type === "orden"
        ? images.order
        : type === "ine"
        ? images.order
        : type === "formato"
        ? images.order
        : "";

    return (
      <Image
        preview={false}
        style={{ maxWidth: "90%" }}
        src={url}
        fallback={imageFallback}
      />
    );
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
        {type === "orden" ? (
          <Dragger {...props}>{getContent()}</Dragger>
        ) : type === "ine" ? (
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Dragger {...props}>{getContent()}</Dragger>
            </Col>
            <Col span={12}>
              <Dragger {...props}>{getContent()}</Dragger>
            </Col>
          </Row>
        ) : type === "formato" ? (
          <>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              fileList={images?.format.map((x) => ({
                uid: x,
                name: x.split("/")[x.split("/").length - 1],
                url: x,
              }))}
              onPreview={handlePreview}
              showUploadList={{ showRemoveIcon: false }}
              // onChange={handleChange}
            >
              {getContent()}
            </Upload>
            <Modal
              visible={previewVisible}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </>
        ) : null}
      </Col>
    </Row>
  );
};

export default observer(RequestImage);
