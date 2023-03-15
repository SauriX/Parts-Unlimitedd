import React, { FC, useEffect, useState } from "react";
import {
  Spin,
  Form,
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  Select,
  Input,
  Table,
  Checkbox,
} from "antd";
import { formItemLayout } from "../../../app/util/utils";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import { IOptions } from "../../../app/models/shared";
import TextInput from "../../../app/common/form/proposal/TextInput";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import {
  IPackEstudioList,
  IPackForm,
  PackFormValues,
} from "../../../app/models/packet";
import views from "../../../app/util/view";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";

const { Search } = Input;
type PackFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
  msj: String;
};
type UrlParams = {
  id: string;
};
const PackForm: FC<PackFormProps> = ({ componentRef, load, msj }) => {
  const { optionStore, packStore } = useStore();
  const { getAll, getById, create, update, getAllStudy, packs, studies } =
    packStore;
  const [lista, setLista] = useState(studies);
  const [searchParams] = useSearchParams();
  const { getDepartmentOptions, departmentOptions, getAreaOptions: getareaOptions, areaOptions: areas } =
    optionStore;
  const navigate = useNavigate();
  const [form] = Form.useForm<IPackForm>();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [areaForm, setAreaForm] = useState<IOptions[]>([]);
  const [areaId, setAreaId] = useState<number>();
  const [depId, setDepId] = useState<number>();
  const [searchvalue, setSearchvalue] = useState<string>();

  const [values, setValues] = useState<IPackForm>(new PackFormValues());
  let { id } = useParams<UrlParams>();
  const { width: windowWidth } = useWindowDimensions();
  const CheckReadOnly = () => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  };

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

  const setStudy = (active: boolean, item: IPackEstudioList) => {
    var index = lista.findIndex((x) => x.id == item.id);
    var list = lista;
    item.activo = active;
    list[index] = item;
    setLista(list);
    var indexVal = values.estudio.findIndex((x) => x.id == item.id);
    var val = values.estudio;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, estudio: val }));
  };
  useEffect(() => {
    console.log("use");
    const readuser = async (idUser: number) => {
      setLoading(true);
      console.log("here");
      const all = await getAll("all");
      console.log(all);
      var studis = await getAllStudy();
      console.log(studies, "estudios");
      var areaForm = await getareaOptions(values.idDepartamento);

      const user = await getById(idUser);
      user!.idDepartamento = 1;
      user!.idArea = 1;
      form.setFieldsValue(user!);
      studis = studis?.map((x) => {
        var activo = user?.estudio.find((y) => y.id === x.id) != null;
        return { ...x, activo };
      });
      setAreaForm(areaForm!);
      setValues(user!);
      setLista(studis!);
      setLoading(false);
      console.log(studis);
    };
    if (id) {
      readuser(Number(id));
    } else {
      form.setFieldsValue({ idDepartamento: 1, idArea: 1 });
    }
  }, [form, getById, id]);

  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columnsEstudios: IColumns<IPackEstudioList> = [
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
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      render: (value, item) => (
        <Checkbox
          name="activo"
          checked={item.activo}
          onChange={(value) => {
            console.log(value.target.checked);
            var active = false;
            if (value.target.checked) {
              console.log("here");
              active = true;
            }
            setStudy(active, item);
          }}
        />
      ),
    },
  ];

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];

    if (field === "idDepartamento") {
      console.log("deparatemento");
      const value = changedValues[field];
      var areaForm = await getareaOptions(value);
      setAreaForm(areaForm!);
      form.setFieldsValue({ idArea: undefined });
    }
  };
  const filterByDepartament = async (departament: number) => {
    if (departament) {
      var departamento = departmentOptions.filter(
        (x) => x.value === departament
      )[0].label;
      var areaSearch = await getareaOptions(departament);
      console.log(departamento, "departamento");
      var estudios = lista.filter((x) => x.departamento === departamento);
      console.log(lista, "lista");
      console.log(estudios, "estudios filtro dep");
      setValues((prev) => ({ ...prev, estudio: estudios }));
      setAreaSearch(areaSearch!);
    } else {
      var estudios = lista.filter((x) => x.activo === true);
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
      (x) =>
        x.clave.toLowerCase().includes(search.toLowerCase()) ||
        x.nombre.toLowerCase().includes(search.toLowerCase())
    );
    setValues((prev) => ({ ...prev, estudio: estudios }));
  };
  const onFinish = async (newValues: IPackForm) => {
    setLoading(true);
    const User = { ...values, ...newValues };

    User.estudio = lista.filter((x) => x.activo == true);

    console.log("finish ");
    console.log(lista);
    console.log(User);
    let success = false;
    if (!User.id) {
      success = await create(User);
    } else {
      success = await update(User);
    }

    setLoading(false);

    if (success) {
      navigate(`/${views.pack}?search=${searchParams.get("search") || "all"}`);
    }
  };
  const actualUser = () => {
    if (id) {
      const index = packs?.findIndex((x) => x.id === Number(id));
      return index + 1;
    }
    return 0;
  };
  console.log(form.getFieldsValue(), "form");
  const siguienteUser = (index: number) => {
    const user = packs[index];
    setAreaId(undefined);
    setDepId(undefined);
    setSearchvalue(undefined);
    navigate(
      `/${views.pack}/${user?.id}?mode=${searchParams.get("mode")}&search=${
        searchParams.get("search") ?? "all"
      }`
    );
  };
  return (
    <Spin spinning={loading || load} tip={load ? msj : ""}>
      <Row style={{ marginBottom: 24 }}>
        {!CheckReadOnly() && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate(`/${views.pack}`);
              }}
            >
              Cancelar
            </Button>
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
        {CheckReadOnly() && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => {
                navigate(
                  `/${views.pack}/${id}?mode=edit&search=${
                    searchParams.get("search") ?? "all"
                  }`
                );
              }}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: load ? "none" : "" }}>
        <div ref={componentRef}>
          {load && (
            <PageHeader
              ghost={false}
              title={<HeaderTitle title="Catálogo Paquetes" image="paquete" />}
              className="header-container"
            ></PageHeader>
          )}
          {load && <Divider className="header-divider" />}
          <Form<IPackForm>
            {...formItemLayout}
            form={form}
            name="branch"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
            style={{ marginLeft: "10px" }}
          >
            <Row gutter={[12, 24]} wrap>
              <Col md={8} sm={24}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col span={8}>
                <SelectInput
                  formProps={{ name: "idArea", label: "Área" }}
                  options={areaForm}
                  readonly={true}
                  required
                  defaultValue={1}
                  value={1}
                />
              </Col>
              <Col md={8} sm={24} xs={12}>
                <SwitchInput
                  name="visible"
                  label="Visible"
                  onChange={(value) => {
                    if (value) {
                      alerts.info("El paquete será visble en la web");
                    } else {
                      alerts.info("El paquete ya no será visble en la web");
                    }
                  }}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col span={8}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col span={8}>
                <SelectInput
                  formProps={{ name: "idDepartamento", label: "Departamento" }}
                  options={departmentOptions}
                  readonly={true}
                  required
                  defaultValue={1}
                  value={1}
                />
              </Col>
              <Col md={8} sm={24} xs={12}>
                <SwitchInput
                  name="activo"
                  label="Activo"
                  onChange={(value) => {
                    if (value) {
                      alerts.info(messages.confirmations.enable);
                    } else {
                      alerts.info(messages.confirmations.disable);
                    }
                  }}
                  readonly={CheckReadOnly()}
                />
              </Col>
              <Col span={8}>
                <TextInput
                  formProps={{
                    name: "nombreLargo",
                    label: "Nombre Largo",
                  }}
                  max={100}
                  required
                  readonly={CheckReadOnly()}
                />
              </Col>
            </Row>
          </Form>
          <br />
          <Divider orientation="left">Estudios</Divider>
          <Row justify="space-between" gutter={[24, 12]} align="middle">
            <Col span={6}>
              <Search
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
                allowClear 
              />
            </Col>
            <Col span={6} offset={2}>
              <SelectInput
                options={departmentOptions}
                onChange={(value) => {
                  setAreaId(undefined);
                  setDepId(value);
                  filterByDepartament(value);
                }}
                value={depId}
                placeholder={"Departamentos"}
                formProps={{
                  name: "departamentos",
                  label: "Departamento",
                }}
              />
            </Col>
            <Col span={6} offset={2}>
              <SelectInput
                options={aeraSearch}
                onChange={(value) => {
                  setAreaId(value);
                  filterByArea(value);
                }}
                value={areaId}
                placeholder={"Área"}
                formProps={{
                  name: "area",
                  label: "Área",
                }}
              />
            </Col>
          </Row>
          <br />
          <Table<IPackEstudioList>
            size="small"
            rowKey={(record) => record.id}
            columns={columnsEstudios.slice(0, 4)}
            pagination={false}
            dataSource={[...(values.estudio ?? [])]}
            scroll={{
              x: windowWidth < resizeWidth ? "max-content" : "auto",
            }}
          />
        </div>
      </div>
    </Spin>
  );
};

export default observer(PackForm);
