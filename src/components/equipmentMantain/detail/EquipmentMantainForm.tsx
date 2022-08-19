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

} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import React, { FC, useEffect, useState } from "react";
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
import { RcFile } from "antd/lib/upload";

type EquipmentFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const EquipmentForm: FC<EquipmentFormProps> = ({ id, componentRef, printing, }) => {
  const { equipmentStore, optionStore } = useStore();
  const { getSucursalesOptions, sucursales } = optionStore;
  const { getById, create, update, getAll, equipment } = equipmentStore;

  const navigate = useNavigate();
  const [type, setType] = useState<"orden" | "ine" | "formato">("orden");
  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IEquipmentForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [values, setValues] = useState<IEquipmentForm>(
    new EquipmentFormValues()
  );

  const [branch, setBranch] = useState<IEquipmentBranch>();
  useEffect(() => {
    getSucursalesOptions();
  }, [getSucursalesOptions]);

  useEffect(() => {
    const readEquipment = async (id: number) => {
      setLoading(true);
      const equipment = await getById(id);
      form.setFieldsValue(equipment!);
      setValues(equipment!);
      setLoading(false);
    };

    if (id) {
      readEquipment(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    const readEquipment = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readEquipment();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: IEquipmentForm) => {
    const equipment = { ...values, ...newValues };

    let success = false;

    if (!equipment.id) {
      success = await create(equipment);
    } else {
      success = await update(equipment);
    }

    if (success) {
      navigate(`/equipment?search=${searchParams.get("search") ?? "all"}`);
    }
  };

  const addValueEquipment = () => {
    if (branch) {
      const valuesEquipment: IEquipmentBranch[] = [];
    }
  };



    const { requestStore } = useStore();
    const { request, saveImage } = requestStore;


    const [order, setOrder] = useState<string>();
    const [ids, setId] = useState<string>();
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

    useEffect(() => {
      console.log(values);
    }, [values]);

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
    //POpConfirm
    //   const {  Popconfirm, message  } = antd;

    // function confirm(e) {
    //   console.log(e);
    //   message.success('El registro ha sido activado');
    // }

    // function cancel(e) {
    //   console.log(e);
    //   message.error('Operacion Cancelada');
    // }

    // ReactDOM.render(
    //   <Popconfirm
    //     title="¿Desea activar el registro? El registro será activado"
    //     onConfirm={confirm}
    //     onCancel={cancel}
    //     okText="Si, Activar"
    //     cancelText="Cancelar"
    //   >
    //     <a href="#">Delete</a>
    //   </Popconfirm>,
    //   mountNode,
    // );
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
                    navigate("/equipment");
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
                      image="Indicaciones"
                    />
                  }
                  className="header-container"
                ></PageHeader>
              )}
              {printing && <Divider className="header-divider" />}
              <Form<IEquipmentForm>
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
                        name: "clave",
                        label: "Fecha programda",
                      }}></DateInput>
                    <TextAreaInput
                      formProps={{
                        name: "clave",
                        label: "Observ",
                      }}
                      rows={10}
                    ></TextAreaInput>

                  </Col>
                  <Col md={12} sm={24}>
                    <Row gutter={[0, 12]}>
                      <Col span={24}>
                        <Segmented
                          className="requet-image-segment"
                          defaultValue={"orden"}
                          options={[
                            { label: "Documento", value: "orden" },
                            { label: "Imagen", value: "ine" },

                          ]}
                          onChange={(value: any) => setType(value)}
                        />
                      </Col>
                      <Col span={24}>
                        <Dragger {...props}>{getContent()}</Dragger>
                      </Col>
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
