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
} from "antd";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/proposal/TextInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IIndicationForm,
  IndicationFormValues,
} from "../../../app/models/indication";
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

type IndicationFormProps = {
  id: number;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const IndicationForm: FC<IndicationFormProps> = ({
  id,
  componentRef,
  printing,
}) => {
  const { indicationStore } = useStore();
  const { getById, create, update, getAll, indication } = indicationStore;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [form] = Form.useForm<IIndicationForm>();

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IIndicationForm>(
    new IndicationFormValues()
  );

  useEffect(() => {
    const readIndication = async (id: number) => {
      setLoading(true);
      const indication = await getById(id);
      form.setFieldsValue(indication!);
      setValues(indication!);
      setLoading(false);
    };

    if (id) {
      readIndication(id);
    }
  }, [form, getById, id]);

  useEffect(() => {
    const readIndication = async () => {
      setLoading(true);
      await getAll(searchParams.get("search") ?? "all");
      setLoading(false);
    };
    readIndication();
  }, [getAll, searchParams]);

  const onFinish = async (newValues: IIndicationForm) => {
    const indication = { ...values, ...newValues };

    let success = false;

    if (!indication.id) {
      success = await create(indication);
    } else {
      success = await update(indication);
    }

    if (success) {
      navigate(`/indications?search=${searchParams.get("search") ?? "all"}`);
    }
  };

  const actualIndication = () => {
    if (id) {
      const index = indication.findIndex((x) => x.id === id);
      return index + 1;
    }
    return 0;
  };

  const prevnextIndication = (index: number) => {
    const indi = indication[index];
    navigate(
      `/indications/${indi?.id}?mode=${searchParams.get(
        "mode"
      )}&search=${searchParams.get("search")}`
    );
  };

  useEffect(() => {
    console.log(values);
  }, [values]);

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

  const columns: IColumns<IStudyList> = [
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

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={indication.length}
              pageSize={1}
              current={actualIndication()}
              onChange={(value) => {
                prevnextIndication(value - 1);
              }}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate("/indications");
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

      <div style={{ display: printing ? "none" : "", marginBottom: 10 }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle
                  title="Catálogo de Indicaciones"
                  image="indicacion"
                />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IIndicationForm>
            {...formItemLayout}
            form={form}
            name="indication"
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
            <Row justify="space-between" gutter={[0, 24]}>
              <Col md={12} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col span={12}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={readonly}
                />
              </Col>
              <Col span={12}>
                <TextAreaInput
                  formProps={{
                    name: "descripcion",
                    label: "Descripción",
                  }}
                  max={500}
                  rows={8}
                  autoSize
                  required
                  readonly={readonly}
                />
              </Col>
              <Col span={12}>
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
        </div>
      </div>
      <Row>
        <Col md={24} sm={12} style={{ marginRight: 20, textAlign: "center" }}>
          <PageHeader
            ghost={false}
            title={
              <HeaderTitle title="Estudios donde se encuentra la indicación" />
            }
            className="header-container"
          ></PageHeader>
          <Divider className="header-divider" />
          <Table<IStudyList>
            size="small"
            rowKey={(record) => record.id}
            columns={columns.slice(0, 3)}
            pagination={false}
            dataSource={[...(values.estudios ?? [])]}
            scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(IndicationForm);
