import { Fragment, useEffect, useState } from "react";
import {
  Col,
  Row,
  Segmented,
  UploadProps,
  message,
  Upload,
  Image,
  Modal,
  Spin,
} from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import {
  beforeUploadValidation,
  getBase64,
  imageFallback,
  objectToFormData,
  uploadFakeRequest,
} from "../../../../app/util/utils";
import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
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
  const { request, getImages, saveImage, deleteImage } = requestStore;

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"orden" | "ine" | "ineReverso" | "formato">(
    "orden"
  );
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
    type: "orden" | "ine" | "ineReverso" | "formato",
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
          imageUrl = `${baseUrl}/${request?.clave}/${imageName}.png`;
          setImages({
            ...images,
            format: [...images.format.filter((x) => x !== imageUrl), imageUrl],
          });
        }
      }
    }
  };

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

  const onChangeImageFormat: UploadProps["onChange"] = ({ file }) => {
    getBase64(file.originFileObj, (imageStr) => {
      submitImage(type, file.originFileObj!, imageStr!.toString());
    });
  };

  const onRemoveImageFormat = async (file: UploadFile<any>) => {
    if (request) {
      setLoading(true);
      const ok = await deleteImage(
        request.expedienteId,
        request.solicitudId!,
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

  useEffect(() => {
    const readImages = async () => {
      if (request) {
        const orderUrl = `${baseUrl}/${request.clave}/orden.png`;
        const idUrl = `${baseUrl}/${request.clave}/ine.png`;
        const idBackUrl = `${baseUrl}/${request.clave}/ineReverso.png`;

        setLoading(true);
        const responses = await Promise.all([
          fetch(orderUrl),
          fetch(idUrl),
          fetch(idBackUrl),
          getImages(request.expedienteId, request.solicitudId!),
        ]);
        setLoading(false);

        setImages({
          order: responses[0].status !== 404 ? orderUrl : "",
          id: responses[1].status !== 404 ? idUrl : "",
          idBack: responses[2].status !== 404 ? idBackUrl : "",
          format: responses[3].map(
            (x) => `${baseUrl}/${request.clave}/${x}.png`
          ),
        });
      }
    };

    readImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.clave]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewVisible(false);

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

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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

  return (
    <Spin spinning={loading}>
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
    </Spin>
  );
};

export default observer(RequestImage);
