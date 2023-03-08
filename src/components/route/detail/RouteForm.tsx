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
  IRouteEstudioList,
  IRouteForm,
  RouteFormValues,
} from "../../../app/models/route";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import useWindowDimensions from "../../../app/util/window";
import { IOptions } from "../../../app/models/shared";
import CheckableTag from "antd/lib/tag/CheckableTag";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import TextAreaInput from "../../../app/common/form/proposal/TextAreaInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import TimeInput from "../../../app/common/form/proposal/TimeInput";

const { Search } = Input;
const { Text, Title } = Typography;

type RouteFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

type UrlParams = {
  id: string;
};

const RouteForm: FC<RouteFormProps> = ({ componentRef, printing }) => {
  const { optionStore, routeStore } = useStore();
  const { routes, getById, getAll, create, update, getAllStudy, studies } =
    routeStore;
  const [lista, setLista] = useState(studies);
  const {
    getDepartmentOptions,
    departmentOptions,
    getareaOptions,
    areas,
    BranchOptions,
    getBranchOptions,
    DeliveryOptions,
    getDeliveryOptions,
    MaquiladorOptions,
    getMaquiladorOptions,
  } = optionStore;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm<IRouteForm>();
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [areaForm, setAreaForm] = useState<IOptions[]>([]);
  const [areaId, setAreaId] = useState<number>();
  const [depId, setDepId] = useState<number>();
  const [searchvalue, setSearchvalue] = useState<string>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );
  const [values, setValues] = useState<IRouteForm>(new RouteFormValues());
  const [value, setValue] = useState<string>();
  let { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();
  const [selectedTags, setSelectedTags] = useState<IDias[]>([]);
  const tagsData: IDias[] = [
    { id: 1, dia: "L" },
    { id: 2, dia: "M" },
    { id: 3, dia: "M" },
    { id: 4, dia: "J" },
    { id: 5, dia: "V" },
    { id: 6, dia: "S" },
    { id: 7, dia: "D" },
  ];

  useEffect(() => {
    const studys = async () => {
      let estudio = await getAllStudy();
      setLista(estudio!);
      setValues((prev) => ({ ...prev, estudio: estudio! }));
    };
    if (!id) {
      studys();
    }
  }, [getAllStudy]);

  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);
  useEffect(() => {
    const areareader = async () => {
      await getareaOptions(0);
      setAreaSearch(areas);
      setAreaForm(areas);
    };
    areareader();
  }, [getareaOptions]);

  useEffect(() => {
    getBranchOptions();
    getDeliveryOptions();
    getMaquiladorOptions();
  }, [getBranchOptions, getDeliveryOptions, getMaquiladorOptions]);
  // const [discunt, setDiscunt] = useState<string|number>();
  useEffect(() => {
    //console.log("use");
    const readuser = async (idUser: string) => {
      try {
        setLoading(true);
        var studis = await getAllStudy();
        var areaForm = await getareaOptions(values.idDepartamento);
        const user = await getById(idUser);
        if (user?.sucursalDestinoId == null) {
          user!.sucursalDestinoId = user?.maquiladorId!.toString();
        }
        form.setFieldsValue(user!);
        studis = studis?.map((x) => {
          var activo = user?.estudio.find((y) => y.id === x.id) != null;
          return { ...x, activo };
        });
        setSelectedRowKeys(
          studis?.filter((x) => x.activo)?.map((x) => x.id) ?? []
        ); //aqui
        setAreaForm(areaForm!);
        setValues(user!);
        setLista(studis!);
        setLoading(false);

        setSelectedTags(user?.dias!);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      readuser(String(id));
    } else {
      form.setFieldsValue({ idDepartamento: undefined, idArea: undefined });
    }
  }, [form, getById, id]);

  useEffect(() => {
    if (routes.length === 0) {
      getAll(searchParams.get("search") ?? "all");
    }
  }, [getAll, routes.length, searchParams]);

  const onFinish = async (newValues: IRouteForm) => {
    setLoading(true);
    const route = { ...values, ...newValues };
    route.estudio = lista.filter((x) => x.activo === true);
    route.dias = selectedTags;
    const parent = treeData.find((x) =>
      x.children.map((x) => x.value).includes(newValues.sucursalDestinoId!)
    );
    if (parent?.title === "Sucursales") {
      route.maquiladorId = undefined;
      console.log("Llega el valor a SucursalDestino?", route.sucursalDestinoId);
    } else {
      route.maquiladorId = newValues.sucursalDestinoId;
      route.sucursalDestinoId = undefined;
      console.log("Llega el valor a Maquilador?", route.maquiladorId);
    }
    //console.log("checks seleccionados" ,selectedRowKeys);
    let success = false;
    if (!route.id) {
      //console.log(route.id, "Valor del id");

      success = await create(route);
    } else {
      success = await update(route);
    }
    setLoading(false);
    if (success) {
      goBack();
      getAll("all");
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

  const columnsEstudios: IColumns<IRouteEstudioList> = [
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
    //console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys); //console.log("checks seleccionados" ,selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,

    onSelect: (record: IRouteEstudioList, selected: boolean) => {
      setStudy(selected, record);
      //console.log("checks seleccionados" ,selectedRowKeys);
    },
    onSelectAll: (selected: boolean, _: any, studies: IRouteEstudioList[]) => {
      for (const study of studies) {
        setStudy(selected, study);
      } //console.log("checks seleccionados" ,selectedRowKeys);
    },
  };

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "idDepartamento") {
      //console.log("deparatemento");
      const value = changedValues[field];
      var areaForm = await getareaOptions(value);
      setAreaForm(areaForm!);
      form.setFieldsValue({ idArea: undefined });
    }

    if (field === "formatoDeTiempoId") {
      const value = changedValues[field];
      let horas = value * 24;
      horas = Math.round(horas * 100) / 100;
      form.setFieldsValue({ tiempoDeEntrega: horas });
    }
    if (field === "tiempoDeEntrega") {
      const value = changedValues[field];
      let dias = value / 24;
      if (dias < 1) {
        dias = 0;
      } else {
        dias = Math.round(dias * 100) / 100;
      }

      //console.log(dias);
      form.setFieldsValue({ formatoDeTiempoId: dias });
    }
  };

  const setStudy = (active: boolean, item: IRouteEstudioList) => {
    var index = lista.findIndex((x) => x.id === item.id);
    var list = lista;
    item.activo = active;
    list[index] = item;
    setLista(list);
    var indexVal = values.estudio.findIndex((x) => x.id === item.id);
    var val = values.estudio;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, estudio: val }));
  };

  const filterByDepartament = async (departament: number) => {
    if (departament) {
      var departamento = departmentOptions.filter(
        (x) => x.value === departament
      )[0].label;
      var areaSearch = await getareaOptions(departament);
      var estudios = lista.filter((x) => x.departamento === departamento);
      setValues((prev) => ({ ...prev, estudio: estudios }));
      setAreaSearch(areaSearch!);
    } else {
      estudios = lista;
      if (estudios.length <= 0) {
        estudios = lista;
      }
      setValues((prev) => ({ ...prev, estudio: estudios }));
    }
  };

  const filterByArea = (area?: number) => {
    if (area) {
      var areaActive = areas.filter((x) => x.value === area)[0].label;
      var estudios = lista.filter((x) => x.area === areaActive);
      setValues((prev) => ({ ...prev, estudio: estudios }));
    } else {
      const dep = departmentOptions.find((x) => x.value === depId)?.label;
      estudios = lista.filter((x) => x.departamento === dep);
      setValues((prev) => ({ ...prev, estudio: estudios }));
    }
  };

  const filterBySearch = (search: string) => {
    var estudios = lista.filter(
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
          onValuesChange={onValuesChange}
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
                  name: "sucursalOrigenId",
                  label: "Origen",
                }}
                readonly={readonly}
                required
                options={BranchOptions}
              />
            </Col>
            <Col md={8} sm={24} xs={12}>
              <Form.Item name="sucursalDestinoId" label="Destino">
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeData}
                  placeholder="Seleccione un destino"
                  treeDefaultExpandAll
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
                required
                options={DeliveryOptions}
              />
            </Col>
            <Col md={8} sm={24} xs={12}>
              <Form.Item label="Aplica para días:" name="diasDeEntrega">
                <Space size={[12, 0]} wrap>
                  {tagsData.map((tag) => (
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
              <Form.Item
                label="Tiempo de Entrega"
                required
              >
                <Input.Group compact>
                  <Input
                    style={{ width: "80%" }}
                    name="tiempoDeEntrega"
                    min={1}
                    max={31}
                    type="number"
                  />
                  <Select
                    style={{ width: "20%" }}
                    defaultValue="horas"
                    options={[
                      {
                        label: "Horas",
                        value: "horas",
                      },
                      {
                        label: "Días",
                        value: "dias",
                      },
                    ]}
                  ></Select>
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
      <Row gutter={[12, 0]} align="middle">
        <Col md={24} sm={24} xs={12}>
          <Title level={5}>Búsqueda por</Title>
        </Col>
        <Col md={8} sm={24} xs={12}>
          <Form.Item label="Buscar">
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
          </Form.Item>
        </Col>
        <Col md={8} sm={24} xs={12}>
          <SelectInput
            formProps={{ name: "areaSearch", label: "Área" }}
            options={aeraSearch}
            onChange={(value) => {
              setAreaId(value);
              filterByArea(value);
            }}
            value={areaId}
            placeholder={"Seleccionar área"}
          />
        </Col>
        <Col md={8} sm={24} xs={12}>
          <SelectInput
            formProps={{
              name: "departamento",
              label: "Departamentos",
            }}
            options={departmentOptions}
            onChange={(value) => {
              setAreaId(undefined);
              setDepId(value);
              filterByDepartament(value);
            }}
            value={depId}
            placeholder={"Seleccionar departamentos"}
          />
        </Col>
      </Row>
      <Row>
      <Col md={24} sm={24} xs={24}>
          <Table<IRouteEstudioList>
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
