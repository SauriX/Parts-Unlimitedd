import {
  Spin,
  Form,
  Row,
  Col,
  Pagination,
  Button,
  PageHeader,
  Divider,
  Input,
  Table,
  TreeSelect,
  Typography,
  Select,
  Space,
} from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  IDias,
  IRouteEstudioList as IStudyRouteList,
  IRouteForm,
  RouteFormValues,
} from "../../../app/models/route";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import { daysOfWeek } from "../../../app/util/catalogs";
import { SearchOutlined } from "@ant-design/icons";
import useWindowDimensions from "../../../app/util/window";
import { IOptions } from "../../../app/models/shared";
import CheckableTag from "antd/lib/tag/CheckableTag";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TimeInput from "../../../app/common/form/proposal/TimeInput";
import NumberInput from "../../../app/common/form/proposal/NumberInput";
import { profile } from "console";
import moment from "moment";
import { toJS } from "mobx";

const { Search } = Input;
const { Title } = Typography;

type RouteFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

type UrlParams = {
  id: string;
};

const RouteForm: FC<RouteFormProps> = ({ componentRef, printing }) => {
  const { optionStore, routeStore, profileStore } = useStore();
  const { routes, getById, getAll, create, update, getAllStudy, studies } =
    routeStore;
  const [studyList, setStudyRouteList] = useState(studies);
  const {
    BranchOptions,
    getAllBranchOptions,
    DeliveryOptions,
    getDeliveryOptions,
    MaquiladorOptions,
    getMaquiladorOptions,
    areaByDeparmentOptions,
    getAreaByDeparmentOptions,
  } = optionStore;
  const { profile } = profileStore;

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<IRouteForm>();
  const [formAreaByDepartment] = Form.useForm<any>();

  const [searchvalue, setSearchvalue] = useState<string>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IRouteForm>(new RouteFormValues());
  let { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();
  const [selectedTags, setSelectedTags] = useState<IDias[]>([]);
  const [timeType, setTimeType] = useState<number>(1);

  const selectedDepartment = Form.useWatch(
    "departamento",
    formAreaByDepartment
  );
  const [areaOptions, setAreaOptions] = useState<IOptions[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<IOptions[]>([]);

  useEffect(() => {
    const getStudies = async () => {
      let study = await getAllStudy();
      setStudyRouteList(study!);
      setValues((prev) => ({ ...prev, estudio: study! }));
    };
    if (!id) {
      getStudies();
    }
  }, [getAllStudy]);

  useEffect(() => {
    getAllBranchOptions();
    getDeliveryOptions();
    getMaquiladorOptions();
    getAreaByDeparmentOptions();
  }, [
    getAllBranchOptions,
    getDeliveryOptions,
    getMaquiladorOptions,
    getAreaByDeparmentOptions,
  ]);

  useEffect(() => {
    setDepartmentOptions(
      areaByDeparmentOptions?.map((x) => ({ value: x.value, label: x.label }))
    );
  }, [areaByDeparmentOptions]);

  useEffect(() => {
    setAreaOptions(
      areaByDeparmentOptions
        .filter((x) => selectedDepartment?.includes(x.value as number))
        .flatMap((x) => x.options ?? [])
    );
    formAreaByDepartment.setFieldValue("area", []);
  }, [selectedDepartment, areaByDeparmentOptions, formAreaByDepartment]);

  useEffect(() => {
    const readRoute = async (routeId: string) => {
      setLoading(true);
      var studies = await getAllStudy();
      const route = await getById(routeId);

      if (route) {
        setTimeType(route.tipoTiempo ?? 1);

        studies = studies?.map((x) => {
          var activo = route?.estudio.find((y) => y.id === x.id) != null;
          return { ...x, activo };
        });
        setSelectedRowKeys(
          studies?.filter((x) => x.activo)?.map((x) => x.id) ?? []
        );

        setValues(route);
        setStudyRouteList(studies!);

        if (route.destinoId || route.maquiladorId) {
          const branch = treeData
            .map((x) => x.children)
            .flat()
            .find((x) => x.value === route.destinoId);
          const maquila = treeData
            .map((x) => x.children)
            .flat()
            .find((x) => x.value === route.maquiladorId);

          if (branch) {
            route.destinoId = branch.value as string;
          }
          if (maquila) {
            route.destinoId = maquila.value as string;
          }
        }

        route.horaDeRecoleccion = moment(route.horaDeRecoleccion);
      }

      setLoading(false);
      setSelectedTags(route?.dias!);
      form.setFieldsValue(route!);

      setLoading(false);
    };
    if (id) {
      readRoute(id);
    } else {
      form.setFieldValue("origenId", profile?.sucursal);
    }
  }, [form, getById, id]);

  const onFinish = async (newValues: IRouteForm) => {
    setLoading(true);
    const route = { ...values, ...newValues };
    route.estudio = studyList.filter((x) => x.activo === true);
    route.dias = selectedTags;
    route.horaDeRecoleccion = moment(newValues.horaDeRecoleccion).utcOffset(0, true).toDate();

    const parent = treeData.find((x) =>
      x.children.map((x) => x.value).includes(newValues.destinoId!)
    );

    if (parent?.title === "Sucursales") {
      route.maquiladorId = undefined;
    } else {
      route.maquiladorId = newValues.destinoId;
      route.destinoId = undefined;
    }
    let success = false;
    if (!route.id) {
      success = await create(route);
    } else {
      success = await update(route);
    }
    setLoading(false);
    if (success) {
      goBack();
      await getAll("all");
    }
  };

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.route}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.route}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const getPage = (id: string) => {
    return routes.findIndex((x) => x.id === id) + 1;
  };

  const setPage = (page: number) => {
    const route = routes[page - 1];
    navigate(`/${views.route}/${route.id}?${searchParams}`);
  };

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const handleChange = (tag: IDias, checked: Boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags!, tag]
      : selectedTags.filter((t) => t.id !== tag.id);
    setSelectedTags(nextSelectedTags!);
  };

  const treeData = [
    {
      title: "Sucursales",
      value: "sucursalDestinoId",
      children: BranchOptions.map((x) => ({
        title: x.label,
        value: x.value,
      })),
    },
    {
      title: "Maquiladores",
      value: "maquiladorId",
      children: MaquiladorOptions.map((x) => ({
        title: x.label,
        value: x.value,
      })),
    },
  ];

  const columnsEstudios: IColumns<IStudyRouteList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("area", "Área", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("departamento", "Departamento", {
        searchState,
        setSearchState,
        width: "20%",
        windowSize: windowWidth,
      }),
    },
    Table.SELECTION_COLUMN,
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: (record: IStudyRouteList, selected: boolean) => {
      setStudy(selected, record);
    },
    onSelectAll: (selected: boolean, _: any, studies: IStudyRouteList[]) => {
      for (const study of studies) {
        setStudy(selected, study);
      }
    },
  };

  const setStudy = (active: boolean, item: IStudyRouteList) => {
    const index = studyList.findIndex((x) => x.id === item.id);
    const updatedItem = { ...item, activo: active };
    const updatedList = [...studyList];
    updatedList[index] = updatedItem;
    setStudyRouteList(updatedList);

    const updatedValues = [...values.estudio];
    updatedValues[index] = updatedItem;
    setValues((prev) => ({ ...prev, estudio: updatedValues }));
  };

  const filterBySearch = (search: string) => {
    var estudios = studyList.filter(
      (x) => x.clave.includes(search) || x.nombre.includes(search)
    );
    setValues((prev) => ({ ...prev, estudio: estudios }));
  };

  return (
    <Spin spinning={loading || printing} tip={printing ? "Imprimiendo" : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!!id && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
            <Pagination
              size="small"
              total={routes?.length ?? 0}
              pageSize={1}
              current={getPage(id)}
              onChange={setPage}
              showSizeChanger={false}
            />
          </Col>
        )}
        {!readonly && (
          <Col md={id ? 12 : 24} sm={24} xs={12} style={{ textAlign: "right" }}>
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
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={setEditMode}
            />
          </Col>
        )}
      </Row>
      <div ref={componentRef} style={{ display: printing ? "none" : "" }}>
        {printing && (
          <PageHeader
            ghost={false}
            title={<HeaderTitle title="Catálogo de Rutas" image="ruta" />}
            className="header-container"
          ></PageHeader>
        )}
        {printing && <Divider className="header-divider" />}
        <Form<IRouteForm>
          {...formItemLayout}
          form={form}
          name="reagent"
          initialValues={values}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="space-between">
            <Col md={8} sm={24} xs={12}>
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
            <Col md={8} sm={24} xs={12}>
              <SelectInput
                formProps={{
                  name: "origenId",
                  label: "Origen",
                }}
                readonly={readonly}
                required
                options={BranchOptions}
              />
            </Col>
            <Col md={8} sm={24} xs={12}>
              <Form.Item name="destinoId" label="Destino">
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeData}
                  placeholder="Seleccione un destino"
                  treeDefaultExpandAll
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col md={8} sm={24} xs={12}>
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
            <Col md={8} sm={24} xs={12}>
              <SelectInput
                formProps={{
                  name: "paqueteriaId",
                  label: "Paquetería ",
                }}
                defaultValue={0}
                readonly={readonly}
                options={DeliveryOptions}
              />
            </Col>
            <Col md={8} sm={24} xs={12}>
              <Form.Item label="Aplica para días:" name="diasDeEntrega">
                <Space size={[12, 0]} wrap>
                  {daysOfWeek.map((tag) => (
                    <CheckableTag
                      key={tag.id}
                      checked={
                        selectedTags.filter((x) => x.id === tag.id).length > 0
                      }
                      onChange={(checked) => handleChange(tag, checked)}
                    >
                      {tag.dia}
                    </CheckableTag>
                  ))}
                </Space>
              </Form.Item>
            </Col>

            <Col md={8} sm={24} xs={12}>
              <TimeInput
                formProps={{
                  name: "horaDeRecoleccion",
                  label: "Hora de salida",
                }}
                readonly={readonly}
                required
              />
            </Col>

            <Col md={8} sm={24} xs={12}>
              <Form.Item label="Tiempo de Entrega" required>
                <Input.Group compact>
                  <NumberInput
                    formProps={{
                      name: "tiempoDeEntrega",
                      label: "",
                    }}
                    min={1}
                    max={timeType === 2 ? 365 : 24}
                    readonly={readonly}
                  />
                  <SelectInput
                    formProps={{
                      name: "tipoTiempo",
                      label: "",
                    }}
                    defaultValue={1}
                    options={[
                      {
                        label: "Horas",
                        value: 1,
                      },
                      {
                        label: "Días",
                        value: 2,
                      },
                    ]}
                    readonly={readonly}
                  />
                </Input.Group>
              </Form.Item>
            </Col>
            <Col md={8} sm={24} xs={12}>
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
                required
                readonly={readonly}
              />
            </Col>
            <Col md={8} sm={24} xs={12}>
              <TextAreaInput
                formProps={{
                  name: "comentarios",
                  label: "Comentarios",
                }}
                max={500}
                rows={4}
                autoSize
                readonly={readonly}
              />
            </Col>
          </Row>
        </Form>
      </div>
      <Divider orientation="left">Asignación de Estudios</Divider>
      <Form<any>
        {...formItemLayout}
        form={formAreaByDepartment}
        name="areaByDepartment"
        scrollToFirstError
      >
        <Row gutter={[12, 0]} align="middle">
          <Col md={24} sm={24} xs={12}>
            <Title level={5}>Búsqueda por</Title>
          </Col>
          <Col md={8} sm={24} xs={12}>
            <Search
              name="search"
              key="search"
              placeholder="Buscar"
              onSearch={(value) => {
                filterBySearch(value);
                setSearchvalue(value);
              }}
              onChange={(value) => {
                setSearchvalue(value.target.value);
              }}
              value={searchvalue}
            />
          </Col>
          <Col md={8} sm={24} xs={12}>
            <SelectInput
              form={formAreaByDepartment}
              formProps={{
                name: "departamento",
                label: "Departamento",
                noStyle: true,
              }}
              multiple
              options={departmentOptions}
            />
          </Col>
          <Col md={8} sm={24} xs={12}>
            <SelectInput
              form={formAreaByDepartment}
              formProps={{
                name: "area",
                label: "Área",
                noStyle: true,
              }}
              multiple
              options={areaOptions}
            />
          </Col>
        </Row>
      </Form>
      <br />
      <Row>
        <Col md={24} sm={24} xs={24}>
          <Table<IStudyRouteList>
            size="small"
            rowKey={(record) => record.id}
            columns={columnsEstudios.slice(0, 6)}
            pagination={false}
            dataSource={[...(values.estudio ?? [])]}
            rowSelection={rowSelection}
            scroll={{ y: 240 }}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default observer(RouteForm);
