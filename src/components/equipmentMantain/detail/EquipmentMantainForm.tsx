import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Table,
  List,
  Typography,
  Select,
  Segmented,
  UploadProps,
  message,
  Modal,

} from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";

import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  formItemLayout, beforeUploadValidation,
  getBase64,
  imageFallback,
  objectToFormData,
  uploadFakeRequest,
} from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IEquipmentForm,
  EquipmentFormValues,
  IEquipmentList,
  IEquipmentBranch,
} from "../../../app/models/equipment";

import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  getDefaultColumnProps,
  IColumns,
  defaultPaginationProperties,
  ISearch,
} from "../../../app/common/table/utils";
import { IStudyList } from "../../../app/models/study";
import { observer } from "mobx-react-lite";
import Study from "../../../app/api/study";
import DateInput from "../../../app/common/form/proposal/DateInput";
import Dragger from "antd/lib/upload/Dragger";
import { IRequestImage } from "../../../app/models/request";
import Upload, { RcFile, UploadFile } from "antd/lib/upload";
import { IImageSend, ImantainForm, MantainValues } from "../../../app/models/equipmentMantain";

type EquipmentFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  idmantain?:string;
};

const EquipmentForm: FC<EquipmentFormProps> = ({ id, componentRef, printing,idmantain }) => {
  const { equipmentMantainStore ,optionStore} = useStore();
  const { getSucursalesOptions, sucursales } = optionStore;
  const { getById, create, update, getAlls, equipments,saveImage,setSearch,search,mantain,equip,idEq,deleteImage } = equipmentMantainStore;
  const [type, setType] = useState<"orden" | "ine" | "ineReverso" | "formato">(
    "formato"
  );
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const baseUrl = process.env.REACT_APP_CATALOG_URL + "/images/mantain";

  type imageTypes = {
    order: string;
    id: string;
    idBack: string;
    format: string[];
  };
  const [form] = Form.useForm<ImantainForm>();
  const [images, setImages] = useState<imageTypes>({
    order: "",
    id: "",
    idBack: "",
    format: [],
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [values, setValues] = useState<ImantainForm>(
    new MantainValues()
  );

  const [branch, setBranch] = useState<IEquipmentBranch>();
  useEffect(() => {
    
    getSucursalesOptions();
  }, [getSucursalesOptions]);

  useEffect(() => {
    const readEquipment = async (id: string) => {
      
      setLoading(true);
      const equipment = await getById(id);
      form.setFieldsValue(equipment!);
      setImages((values)=>({...values,format:equipment!.imagenUrl}));
      setValues(equipment!);
      setLoading(false);
    };

    if (idmantain) {
      readEquipment(idmantain!);
    }
  }, [form, getById, id]);

  useEffect(() => {
    const readEquipment = async () => {
      setLoading(true);
      var searching=search!;
      console.log(idmantain,"id");
      searching.idEquipo=idmantain!;
      await getAlls(searching);
      setLoading(false);
    };
    console.log("id",id);
    readEquipment();
  }, [getAlls, searchParams]);

  const onFinish = async (newValues: ImantainForm) => {
    const equipment = { ...values, ...newValues };
    console.log(equipment,"equipment");
    let success = false;
    
    if (!equipment.id) {
     console.log(equip!)
      equipment.idEquipo=equip!.id!;
      equipment.ide=id;
      var response  = await create(equipment);
      console.log(response,"response");
      
      if(response?.id){
      
      
        navigate(`/equipmentMantain/edit/${response.id}`);
        
      }
    } else {
      equipment.clave = mantain?.clave!;
      equipment.no_serie=mantain?.no_serie!;
      success = await update(equipment);
       await sumbitImages();
    }

    if (success) {
      console.log(idEq)
      navigate(`/equipmentMantain/${idEq}`);
    }
  };

  const addValueEquipment = () => {
    if (branch) {
      const valuesEquipment: IEquipmentBranch[] = [];
    }
  };






    const [order, setOrder] = useState<string>();
    const [ids, setId] = useState<string>();
    const [format, setFormat] = useState<string>();



    const sumbitImages= async()=>{
      const formData = objectToFormData(images);
      const ok = await saveImage(formData);

      if (ok) {
        alerts.success("La imagen se ha guardado con éxito");
        return true;
/*         if (type === "orden") {
          setOrder(imageUrl);
        } else if (type === "ine") {
          setId(imageUrl);
        } else if (type === "formato") {  
          setFormat(imageUrl);
        } */
      }
    }
    useEffect(() => {
      console.log(values);
    }, [values]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
  
    const handlePreview = async (file: UploadFile) => {
      setPreviewImage(file.url || (file.preview as string));
      setPreviewVisible(true);
      setPreviewTitle(
        file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
      );
    };
    const onChangeImageFormat: UploadProps["onChange"] = ({ file }) => {
      getBase64(file.originFileObj, (imageStr) => {
        submitImage(type, file.originFileObj!, imageStr!.toString());
      });
    };
    const submitImage = async (
      type: "orden" | "ine" | "ineReverso" | "formato",
      file: RcFile,
      imageUrl: string
    ) => {
      if (mantain) {
        const requestImage: IRequestImage = {
          solicitudId: mantain.id!,
          expedienteId: mantain.id!,
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
            imageUrl = `/${values?.clave}/${imageName}.png`;
            console.log(imageName,"imagename");
            setImages({
              ...images,
              format: [...images.format.filter((x) => x !== imageUrl), imageUrl],
            });
          }
        }
      }
    };
    
  const onRemoveImageFormat = async (file: UploadFile<any>) => {
    if (mantain) {
      setLoading(true);
      const ok = await deleteImage(
        mantain.id,
        mantain.id!,
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
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleCancel = () => setPreviewVisible(false);
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
              url:`${baseUrl}${x}`,
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
    console.log("Table");
    const { width: windowWidth } = useWindowDimensions();
    const [searchState, setSearchState] = useState<ISearch>({
      searchedText: "",
      searchedColumn: "",
    });

    const columns: IColumns<IEquipmentList> = [
      {
        ...getDefaultColumnProps("clave", "Clave Estudio", {
          searchState,
          setSearchState,
          width: "30%",
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("nombre", "Estudio", {
          searchState,
          setSearchState,
          width: "30%",
          windowSize: windowWidth,
        }),
      },
      {
        ...getDefaultColumnProps("area", "Area", {
          searchState,
          setSearchState,
          width: "30%",
          windowSize: windowWidth,
        }),
      },
    ];
    const getContent = () => {
      if ((type === "orden" && !true) || (type === "ine" && !id) || (type === "formato" && !format)) {
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
    }
      return (
        <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
          <Row style={{ marginBottom: 24 }}>
            {!readonly && (
              <Col md={id ? 24 : 48} sm={48} style={{ textAlign: "right" }}>
                <Button
                  onClick={() => {
                    navigate(`/equipmentMantain/${idEq}`);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={disabled}
                  onClick={() => {
                    form.submit();
                  }}
                >
                  Guardar
                </Button>
              </Col>
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
                  title={
                    <HeaderTitle
                      title="Catálogo de Indicaciones"
                      
                    />
                  }
                  className="header-container"
                ></PageHeader>
              )}
              {printing && <Divider className="header-divider" />}
              <Form<ImantainForm>
                {...formItemLayout}
                form={form}
                name="equipment"
                initialValues={values}
                onFinish={onFinish}
                scrollToFirstError
                onFieldsChange={() => {
                  setDisabled(
                    !form.isFieldsTouched() ||
                    form.getFieldsError().filter(({ errors }) => errors.length)
                      .length > 0
                  );
                }}
              >
                <Row>
                  <Col md={12} sm={24}>
                    <DateInput

                      formProps={{
                        name: "fecha",
                        label: "Fecha programada",
                      }}
                      readonly={readonly}
                      ></DateInput>
                    <TextAreaInput
                      formProps={{
                        name: "descripcion",
                        label: "Observacion",
                      }}
                      rows={10}
                      readonly={readonly}
                    ></TextAreaInput>

                  </Col>
                  <Col md={12} sm={24}>
                    <Row gutter={[0, 12]}>

                      {mantain?.id&&<Col span={24}>
                        <label htmlFor="">Imagen</label>
                        {getFormatContent()}
                      </Col>}
                    </Row>


                  </Col>
                </Row>
              </Form>
            </div>
          </div>

        </Spin>
      );

    }
  export default observer(EquipmentForm);
