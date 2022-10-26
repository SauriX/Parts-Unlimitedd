import {
  Spin,
  Form,
  Row,
  Col,
  Transfer,
  Tooltip,
  Tree,
  Tag,
  Pagination,
  Button,
  Divider,
  PageHeader,
  Table,
  List,
  Select,
  Typography,
  InputRef,
  Input,
} from "antd";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/TextInput";
import SwitchInput from "../../../app/common/form/SwitchInput";
import SelectInput from "../../../app/common/form/SelectInput";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import ImageButton from "../../../app/common/button/ImageButton";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import { observer } from "mobx-react-lite";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import { IOptions } from "../../../app/models/shared";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from '@ant-design/icons';
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import { IStudyForm, StudyFormValues } from "../../../app/models/study";
import NumberInput from "../../../app/common/form/NumberInput";
import { IWorkList } from "../../../app/models/workList";
import { IParameterList } from "../../../app/models/parameter";
import { IIndicationList } from "../../../app/models/indication";
import { IReagentList } from "../../../app/models/reagent";
import { IPacketList } from "../../../app/models/packet";
import views from "../../../app/util/view";
import { ParameterModal } from "./modals/ParameterModal";
import { IndicationModal } from "./modals/IndicationModal";
import CheckableTag from "antd/lib/tag/CheckableTag";
import userEvent from "@testing-library/user-event";
import WorkList from "../../../views/WorkList";

type StudyFormProps = {
  componentRef: React.MutableRefObject<any>;
  load: boolean;
};
type UrlParams = {
  id: string;
};
const StudyForm: FC<StudyFormProps> = ({ componentRef, load }) => {
  const { optionStore, studyStore } = useStore();
  const {
    getDepartmentOptions,
    departmentOptions,
    getareaOptions,
    areas,
    getPrintFormatsOptions,
    printFormat,
    getMaquiladorOptions,
    MaquiladorOptions,
    getMethodOptions,
    MethodOptions,
    getsampleTypeOptions,
    sampleTypeOptions,
    getworkListOptions2,
    workListOptions2,
    getParameterOptions,
    parameterOptions,
    getIndication,
    indicationOptions,
    getReagentOptions,
    reagents,
    getTaponOption,
    taponOption,
  } = optionStore;
  const [selectedRowKeysp, setSelectedRowKeysp] = useState<React.Key[]>([]);
  const [selectedRowKeysi, setSelectedRowKeysi] = useState<React.Key[]>([]);
  const [selectedRowKeysw, setSelectedRowKeysw] = useState<React.Key[]>([]);
 
  const { getById, getAll, study, update, create,parameterSelected,setParameterSelected,indicationSelected,setIndicationSelected,workListSelected,setWorkListSelected } = studyStore;
  const [form] = Form.useForm<IStudyForm>();
  const { width: windowWidth } = useWindowDimensions();
  const [flag, setFlag] = useState(0);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [values, setValues] = useState<IStudyForm>(new StudyFormValues());
  const [searchParams, setSearchParams] = useSearchParams();
  const [workList, setWorkList] = useState<{ clave: ""; id: number }>();
  const [parameter, setParameter] = useState<{ clave: ""; id: string }>();
  const [indication, setIndication] = useState<{ clave: ""; id: number }>();
  const [Reagent, setReagent] = useState<{ clave: ""; id: string }>();
  const [visible, setVisible] = useState<boolean>(false);
  let { id } = useParams<UrlParams>();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };
/*   const handleChange = (tag: IWorkList, checked: boolean) => {
    const nextSelectedTags = checked ? [...selectedTags!, tag] : selectedTags!.filter(t => t.id !== tag.id);
    console.log('You are interested in: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };
 */
  const [disabled, setDisabled] = useState(() => {
    let result = false;
    const mode = searchParams.get("mode");
    if (mode == "ReadOnly") {
      result = true;
    }
    return result;
  });
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });
  const columnsParameter: IColumns<IParameterList> = [
    {
      ...getDefaultColumnProps("nombre", "Parametro", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
  ];
  const columnsIndication: IColumns<IIndicationList> = [
    {
      ...getDefaultColumnProps("nombre", "Indicación", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
  ];
  useEffect(() => {
    const readuser = async (id: number) => {
      setLoading(true);
      console.log("here");
      const all = await getAll("all");
      console.log(all);
      const user = await getById(id);

      if(user?.workLists!=""&& user?.workLists!=null){
        var tags = user.workLists.split("-");
        setTags(tags);
        console.log(tags);
      }
      setParameterSelected(user?.parameters!);
      setIndicationSelected(user?.indicaciones!);
      form.setFieldsValue(user!);

      setValues(user!);

      setLoading(false);
    };
    if (id) {
      readuser(Number(id));
    }
  }, [form, getById, id]);
  useEffect(() => {
    const readDepartments = async () => {
      await getDepartmentOptions();
      console.log("departamentos");
    };
    readDepartments();
  }, [getDepartmentOptions]);

  useEffect(() => {
    const readTapon = async () => {
      await getTaponOption();
    };
    readTapon();
  }, [getTaponOption]);
  useEffect(() => {
    const readPrint = async () => {
      await getPrintFormatsOptions();
    };

    readPrint();
  }, [getPrintFormatsOptions]);
  useEffect(() => {
    const readPrint = async () => {
      await getMethodOptions();
    };

    readPrint();
  }, [getMethodOptions]);
  useEffect(() => {
    const readMaquilador = async () => {
      await getMaquiladorOptions();
    };
    readMaquilador();
  }, [getMaquiladorOptions]);
  useEffect(() => {
    const readsampleType = async () => {
      await getsampleTypeOptions();
    };
    readsampleType();
  }, [getsampleTypeOptions]);
  useEffect(() => {
    const readWorkList = async () => {
      await getworkListOptions2();
    };
    readWorkList();
  }, [getworkListOptions2]);
  useEffect(() => {
    const readParameter = async () => {
      await getParameterOptions();
    };
    readParameter();
  }, [getParameterOptions]);
  useEffect(() => {
    const readIndication = async () => {
      await getIndication();
    };
    readIndication();
  }, [getIndication]);
  useEffect(() => {
    const readReagent = async () => {
      await getReagentOptions();
    };
    readReagent();
  }, [getReagentOptions]);
  const actualStudy = () => {
    if (id) {
      const index = study.findIndex((x) => x.id === Number(id));
      return index + 1;
    }
    return 0;
  };
  const siguienteStudy = (index: number) => {
    console.log(index);
    const estudio = study[index];

    navigate(
      `/${views.study}/${estudio?.id}?mode=${searchParams.get("mode")}&search=${
        searchParams.get("search") ?? "all"
      }`
    );
  };
  const onFinish = async (newValues: IStudyForm) => {
    setLoading(true);
    const User = { ...values, ...newValues };
    let success = false;
    var worklist = "";
    for(var i=0;i<tags.length;i++){
      if(i==0){
        worklist +=tags[i];
      }else{
        worklist +=`-${tags[i]}`;
      }
    }
    User.workLists = worklist;
    if (!User.id) {
      success = await create(User);
    } else {
      success = await update(User);
    }

    if (success) {
      navigate(`/${views.study}?search=${searchParams.get("search") || "all"}`);
    }
    setLoading(false);
  };
  const onValuesChange = async (changeValues: any, values: any) => {
    const fields = Object.keys(changeValues)[0];
    if (fields === "departamento") {
      const value = changeValues[fields];
      await getareaOptions(value);
    }
    if (fields === "diasrespuesta") {
      const value = changeValues[fields];
      let horas = value * 24;
      horas = Math.round(horas * 100) / 100;
      form.setFieldsValue({ tiemporespuesta: horas });
    }
    if (fields === "tiemporespuesta") {
      const value = changeValues[fields];
      let dias = value / 24;
      if (dias < 1) {
        dias = 0;
      } else {
        dias = Math.round(dias * 100) / 100;
      }

      console.log(dias);
      form.setFieldsValue({ diasrespuesta: dias });
    }
  };
  const addWorkList = () => {
    if (workList) {
      if (values.workList.findIndex((x) => x.id === workList.id) > -1) {
        alerts.warning("Ya esta agregada esta lista");
        return;
      }
      const workLists: IWorkList[] = [
        ...values.workList,
        {
          id: workList.id,
          clave: workList.clave,
          nombre: workList.clave,
          activo: true,
        },
      ];

      setValues((prev) => ({ ...prev, workList: workLists }));
      console.log(values);
    }
  };
  const deleteWorkList = (id: number) => {
    const workLists = values.workList.filter((x) => x.id !== id);

    setValues((prev) => ({ ...prev, workList: workLists }));
  };
  const addParameter = () => {
    if (parameter) {
      if (values.parameters.findIndex((x) => x.id === parameter.id) > -1) {
        alerts.warning("Ya esta agregada esta lista");
        return;
      }
      const parameterList: IParameterList[] = [
        ...values.parameters,
        {
          id: parameter.id,
          clave: parameter.clave,
          nombre: "",
          area: "",
          nombreCorto: "",
          resultadoId: "",
          departamento: "",
          resultado: "",
          activo: true,
          unidades: 0,
          unidadNombre: "",
          criticoMaximo: 0,
          criticoMinimo: 0,
          deltaCheck: false,
          mostrarFormato: false,
          requerido: false,
          tipoValor: "",
          valorFinal: "",
          valorInicial: "",
          solicitudEstudioId: 0,
        },
      ];

      setValues((prev) => ({ ...prev, parameters: parameterList }));
      console.log(values);
    }
  };
  const deleteParameter = () => {
    const filterList = parameterSelected.filter(
      (x) => !selectedRowKeysp.includes(x.id)
    );
    setParameterSelected(filterList);
  };
  const addIndication = () => {
    if (indication) {
      if (values.indicaciones.findIndex((x) => x.id === indication.id) > -1) {
        alerts.warning("Ya esta agregada esta lista");
        return;
      }
      const List: IIndicationList[] = [
        ...values.indicaciones,
        {
          id: indication.id,
          clave: "",
          nombre: indication.clave,
          descripcion: "",
          activo: true,
          estudios: [],
        },
      ];
      console.log("indicaciones");
      console.log(values);
      setValues((prev) => ({ ...prev, indicaciones: List }));
      console.log(values);
    }
  };
  const deleteIndicacion = () => {
    const filterList = indicationSelected.filter(
      (x) => !selectedRowKeysi.includes(x.id)
    );
    setIndicationSelected(filterList);
  };

  const addReagent = () => {
    if (Reagent) {
      if (values.reactivos.findIndex((x) => x.id === Reagent!.id) > -1) {
        alerts.warning("Ya esta agregada esta lista");
        return;
      }
      const List: IReagentList[] = [
        ...values.reactivos,
        {
          id: Reagent.id,
          clave: Reagent.clave,
          nombre: "",
          claveSistema: "",
          nombreSistema: "",
          activo: false,
        },
      ];

      setValues((prev) => ({ ...prev, reactivos: List }));
      console.log(values);
    }
  };
  const deleteReagent = (id: string) => {
    const List = values.reactivos.filter((x) => x.id !== id);

    setValues((prev) => ({ ...prev, reactivos: List }));
  };
  const onSelectChangep = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeysp(newSelectedRowKeys);
  };
  const rowSelectionp = {
    selectedRowKeysp,
    onChange: onSelectChangep,
  };
  const onSelectChangei = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeysi(newSelectedRowKeys);
  };
  const rowSelectioni = {
    selectedRowKeysi,
    onChange: onSelectChangei,
  };
  const columns: IColumns<IPacketList> = [
    {
      ...getDefaultColumnProps("id", "Id", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Paquete", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    /*         {
                  ...getDefaultColumnProps("areaId", "Área", {
                    searchState,
                    setSearchState,
                    width: "30%",
                    windowSize: windowWidth,
                  }),
                }, */
  ];
  return (
    <Spin spinning={loading || load}>
      <Row style={{ marginBottom: 24 }}>
        <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
          {id && (
            <Pagination
              size="small"
              total={study.length}
              pageSize={1}
              current={actualStudy()}
              onChange={(value) => {
                siguienteStudy(value - 1);
              }}
              showSizeChanger={false}
            />
          )}
        </Col>
        {!disabled && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button
              onClick={() => {
                navigate(`/${views.study}`);
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
        {disabled && (
          <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={() => {
                setDisabled(false);
                navigate(
                  `/${views.study}/${id}?mode=edit&search=${
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
              title={<HeaderTitle title="Catálogo Estudios" image="estudio" />}
              className="header-container"
            ></PageHeader>
          )}
          {load && <Divider className="header-divider" />}
          <Form<IStudyForm>
            {...formItemLayout}
            form={form}
            name="study"
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row>
              <Col md={8} sm={24} xs={8}>
                <TextInput
                  formProps={{
                    name: "clave",
                    label: "Clave",
                  }}
                  max={100}
                  required
                  readonly={disabled}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <SelectInput
                  formProps={{ name: "departamento", label: "Departamento" }}
                  options={departmentOptions.filter((x) => x.value != 1)}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={8} xs={8}>
                <SelectInput
                    formProps={{ name: "tapon", label: "Etiqueta" }}
                    options={taponOption}
                    readonly={disabled}
                    required
                  />
              </Col>

              <Col md={8} sm={24} xs={8}>
                <NumberInput
                  formProps={{
                    name: "orden",
                    label: "Orden",
                  }}
                  max={99999999}
                  min={0}
                  required
                  readonly={disabled}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <SelectInput
                  formProps={{ name: "area", label: "Área" }}
                  options={areas}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <NumberInput
                  formProps={{
                    name: "cantidad",
                    label: "Cantidad",
                  }}
                  min={1}
                  max={9999999999999999}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <TextInput
                  formProps={{
                    name: "nombre",
                    label: "Nombre",
                  }}
                  max={100}
                  required
                  readonly={disabled}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <SelectInput
                  formProps={{ name: "maquilador", label: "Maquilador" }}
                  options={MaquiladorOptions}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <SelectInput
                  formProps={{ name: "tipomuestra", label: "Tipo de muestra" }}
                  options={sampleTypeOptions}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <NumberInput
                  formProps={{
                    name: "dias",
                    label: "Días",
                  }}
                  min={0}
                  max={9999999999999999}
                  readonly={!visible || disabled}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <TextInput
                  formProps={{
                    name: "titulo",
                    label: "Titulo",
                  }}
                  max={100}
                  readonly={disabled}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
                <SelectInput
                  formProps={{ name: "metodo", label: "Método" }}
                  options={MethodOptions}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={8} xs={8}>
                <NumberInput
                    formProps={{
                      name: "diasrespuesta",
                      label: "Días de respuesta",
                    }}
                    min={0}
                    max={9999999999999999}
                    readonly={disabled}
                  />
              </Col>

              <Col md={8} sm={24} xs={8}>
                <TextInput
                  formProps={{
                    name: "nombreCorto",
                    label: "Nombre corto",
                  }}
                  max={100}
                  required
                  readonly={disabled}
                />
              </Col>
              <Col md={8} sm={24} xs={8}>
              <NumberInput
                  formProps={{
                    name: "tiemporespuesta",
                    label: "Tiempo de respuesta",
                  }}
                  min={1}
                  max={9999999999999999}
                  readonly={disabled}
                  required
                />
              </Col>
              <Col md={6} sm={24} xs={6}>
                <SwitchInput
                  name="prioridad"
                  label="Prioridad"
                  readonly={disabled}
                />
              </Col>
              <Col md={6} xs={6}>
              <SwitchInput
                  name="urgencia"
                  label="Urgencia"
                  readonly={disabled}
                />
              </Col>
              <Col md={6} sm={24} xs={6}>
                <SwitchInput
                  name="visible"
                  label="Visible"
                  onChange={(values) => {
                    setVisible(values);
                    console.log(values);
                  }}
                  readonly={disabled}
                />
              </Col>
              <Col md={6} sm={24} xs={6}>
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
                  readonly={disabled}
                />
              </Col>
            </Row>
          </Form>
          <div></div>
          <PageHeader
                ghost={false}
                title={
                  <HeaderTitle title="Listas de trabajo" />
                }
                className="header-container"

              ></PageHeader>
          {tags.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="tag-input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag:boolean = tag.length > 20;

        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag}
            closable={true}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={e => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="site-tag-plus" onClick={showInput}>
          <PlusOutlined /> Nueva 
        </Tag>
      )}
        
          <div></div>
          <PageHeader
                ghost={false}
                title={
                  <HeaderTitle title="Parámetros del estudio" />
                }
                className="header-container"

              ></PageHeader>
              <Divider className="header-divider" />
              <div>
                <Row>
                  <Col md={16}></Col>
                  <Col md={4}>

                  </Col>
                  <Col md={4}>
                    <div style={{display:"inline-block",marginLeft:"43%"}}>
                    {
                      parameterSelected.length > 0 && selectedRowKeysp.length > 0 && 
                        <Button  type="primary" danger onClick={()=>{deleteParameter()}}>
                          Eliminar
                        </Button>
                            
                    }
                    <Button
                    
                      type="primary"
                      onClick={async () => {
                        await ParameterModal(
                          
                          parameterSelected.map((x) => x.id)
                        );
                      }}
                    >
                      Buscar
                    </Button>
                    </div>

                  </Col>
                </Row>
                <br />
              </div>
              <Table<IParameterList>
                size="small"
                rowKey={(record) => record.id}
                columns={columnsParameter}
                pagination={false}
                dataSource={[...parameterSelected]}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
                rowSelection={rowSelectionp}
              />
          <div></div>
          <PageHeader
                ghost={false}
                title={
                  <HeaderTitle title="Indicaciones del estudio" />
                }
                className="header-container"

              ></PageHeader>
              <Divider className="header-divider" />
              <div>
                <Row>
                  <Col md={16}></Col>
                  <Col md={4}>

                  </Col>
                  <Col md={4}>
                  <div style={{display:"inline-block",marginLeft:"43%"}}>
                  {
                            indicationSelected.length > 0 && selectedRowKeysi.length > 0 && 
                              <Button  type="primary" danger onClick={deleteIndicacion}>
                                Eliminar
                              </Button>
                          

                          }
                  <Button
                  
                    type="primary"
                    onClick={async () => {
                      await IndicationModal(
                        
                       indicationSelected.map((x) => x.id)
                      );
                    }}
                  >
                    Buscar
                  </Button>
                  </div>
                  </Col>
                </Row>
                <br />
              </div>
              <Table<IIndicationList>
                size="small"
                rowKey={(record) => record.id}
                columns={columnsIndication}
                pagination={false}
                dataSource={[...indicationSelected]}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
                rowSelection={rowSelectioni}
              />
          <div></div>
          {/* <Divider orientation="left">Reactivos</Divider>
          <List<IReagentList>
            header={
              <div>
                <Col md={12} sm={24} style={{ marginRight: 20 }}>
                  Nombre Reactivo
                  <Select
                    options={reagents}
                    onChange={(value, option: any) => {
                      if (value) {
                        setReagent({ id: value, clave: option.label });
                      } else {
                        setReagent(undefined);
                      }
                    }}
                    style={{ width: 240, marginRight: 20, marginLeft: 10 }}
                  />
                  {disabled ||
                    (!load && (
                      <ImageButton
                        key="agregar"
                        title="Agregar Reactivo"
                        image="agregar-archivo"
                        onClick={addReagent}
                      />
                    ))}
                </Col>
              </div>
            }
            footer={<div></div>}
            bordered
            dataSource={values.reactivos}
            renderItem={(item) => (
              <List.Item>
                <Col md={12} sm={24} style={{ textAlign: "left" }}>
                  <Typography.Text mark></Typography.Text>
                  {item.clave}
                </Col>
                <Col md={12} sm={24} style={{ textAlign: "left" }}>
                  {!disabled && !load && (
                    <ImageButton
                      key="Eliminar"
                      title="Eliminar Reactivo"
                      image="Eliminar_Clinica"
                      onClick={() => {
                        deleteReagent(item.id);
                      }}
                    />
                  )}
                </Col>
              </List.Item>
            )}
          /> */}
          <Row>
            <Col
              md={24}
              sm={12}
              style={{ marginRight: 20, textAlign: "center" }}
            >
              <PageHeader
                ghost={false}
                title={
                  <HeaderTitle title="Paquete donde se encuentra el estudio" />
                }
                className="header-container"
              ></PageHeader>
              <Divider className="header-divider" />
              <Table<IPacketList>
                size="small"
                columns={columns.slice(0, 3)}
                pagination={false}
                dataSource={[...(values.paquete ?? [])]}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Spin>
  );
};
export default observer(StudyForm);
