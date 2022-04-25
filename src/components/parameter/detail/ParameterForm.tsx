import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider, PageHeader, Table } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
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
import { IParameterForm, ParameterFormValues } from "../../../app/models/parameter";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import ValorType from "./ValorType/ValorType"
import { IOptions } from "../../../app/models/shared";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { IStudyList } from "../../../app/models/study";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../app/common/table/utils";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
type ParameterFormProps = {
    componentRef: React.MutableRefObject<any>;
    load: boolean;
};
type UrlParams = {
    id: string;
};
const ParameterForm: FC<ParameterFormProps> = ({ componentRef, load }) => {
    const { parameterStore } = useStore();
    const {  } = parameterStore;
    const [form] = Form.useForm<IParameterForm>();

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const { width: windowWidth } = useWindowDimensions();
    const [targetKeys, setTargetKeys] = useState<string[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    let navigate = useNavigate();
    const [values, setValues] = useState<IParameterForm>(new ParameterFormValues());
    const [ValueType,setValueType] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    let { id } = useParams<UrlParams>();
    const tipodeValorList:IOptions[] =[
        {value:1 ,label:"Numérico"},
        {value:2 ,label:"Numérico por sexo"},
        {value:3 ,label:"Numérico por edad"},
        {value:4 ,label:"Numérico por edad y sexo"},
        {value:5 ,label:"Opción múltiple"},
        {value:6 ,label:"Numérico con una columna"},
        {value:7 ,label:"Texto"},
        {value:8 ,label:"Parrafo"},
        {value:9 ,label:"etiqueta"},
        {value:10 ,label:" observación"},

    ];
    useEffect(() => {
        const readuser = async (idUser: string) => {
          setLoading(true);
          
/*           const parameter = await getById(idUser);
          form.setFieldsValue(parameter!);
          setValues(parameter!); */
          setLoading(false);
        };
        if (id) {
          readuser(id);
        }
    }, [form, /* getById */, id]);
    useEffect(() => {
        const readUsers = async () => {
          setLoading(true);
          //await getAll(searchParams.get("search") ?? "all");
          setLoading(false);
        };
        readUsers();
    }, [/* getAll */, searchParams]);
    const CheckReadOnly = () => {
        let result = false;
        const mode = searchParams.get("mode");
        if (mode == "ReadOnly") {
          result = true;
        }
        return result;
    }
    const actualParameter = () => {
        if (id) {
          //const index = users.findIndex(x => x.idUsuario === id);
          //return index + 1;
          return 1;
        }
        return 0;
    }
    const siguienteParameter = (index: number) => {
        console.log(id);
        //const user = users[index];
    
        //navigate(`/users/${user?.idUsuario}?mode=${searchParams.get("mode")}&search=${searchParams.get("search") ?? "all"}`);
    }
    const onFinish = async (newValues: IParameterForm) => {
        const Parameter = { ...values, ...newValues };
        let success = false;
        if (!Parameter.id) {
          //success = await create(User);
        } else {
          //success = await update(User);
        }
        if (success) {
          navigate(`/parameter?search=${searchParams.get("search") || "all"}`);
        }
    };
    const onValuesChange = (changeValues: any) => {
        const fields = Object.keys(changeValues)[0]; 
        if (fields === "tipoValor") {
          const value = changeValues[fields];
          setValueType(value);
        }
    }
    const [searchState, setSearchState] = useState<ISearch>({
        searchedText: "",
        searchedColumn: "",
      });
    const columns: IColumns<IStudyList> = [
        {
          ...getDefaultColumnProps("clave", "Id Estudio", {
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
          ...getDefaultColumnProps("areaId", "Area", {
            searchState,
            setSearchState,
            width: "30%",
            windowSize: windowWidth,
          }),
        },
      ];
      
    return (
        <Spin spinning={loading || load}>
            <div ref={componentRef}>
                <Row style={{ marginBottom: 24 }}>
                {id &&
                    <Col md={12} sm={24} xs={12} style={{ textAlign: "left" }}>
                    <Pagination size="small" total={10} pageSize={1} current={actualParameter()} onChange={(value) => { siguienteParameter(value - 1) }} />
                    </Col>
                }
                {!CheckReadOnly() &&
                    <Col md={24} sm={24} xs={24} style={id ? { textAlign: "right" } : { marginLeft: "80%" }}>
                    <Button onClick={() => { navigate(`/parameter`); }} >Cancelar</Button>
                    <Button type="primary" htmlType="submit" onClick={() => { form.submit() }}>
                        Guardar
                    </Button>
                    </Col>
                }
                {
                    CheckReadOnly() &&
                    <Col md={12} sm={24} xs={12} style={{ textAlign: "right" }}>
                    <ImageButton key="edit" title="Editar" image="editar" onClick={() => { navigate(`/parameter/${id}?mode=edit&search=${searchParams.get("search") ?? "all"}`); }} />
                    </Col>
                }
                </Row>
                <Form<IParameterForm>
                    {...formItemLayout}
                    form={form}
                    name="parameter"
                    onValuesChange={onValuesChange}
                    onFinish={onFinish}
                    scrollToFirstError
                    onFieldsChange={() => {
                        setDisabled(
                        !form.isFieldsTouched() ||
                        form.getFieldsError().filter(({ errors }) => errors.length).length > 0
                        );
                    }}
                >
                    <Row>
                        <Col md={12} sm={24} xs={12}>
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
                        <Col md={12} sm={24} xs={12}>
                            <SelectInput formProps={{ name: "departamento", label: "Departamento" }} options={[{ value: "0", label: "test" }]} readonly={CheckReadOnly()} required />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
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
                        <Col md={12} sm={24} xs={12}>
                            <SelectInput formProps={{ name: "area", label: "Area" }} options={[{ value: "0", label: "test" }]} readonly={CheckReadOnly()} required />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <TextInput
                                formProps={{
                                name: "nombreCorto",
                                label: "Nombre Corto",
                                }}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <SelectInput formProps={{ name: "reactivo", label: "Reactivo" }} options={[{ value: "0", label: "test" }]} readonly={CheckReadOnly()} required />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <TextInput
                                formProps={{
                                name: "unidades",
                                label: "Unidades",
                                }}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <TextInput
                                formProps={{
                                name: "unidadSi",
                                label: "Unidad Si",
                                }}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <SelectInput formProps={{ name: "tipoValor", label: "Tipo de valor" }} options={tipodeValorList} readonly={CheckReadOnly()} required />
                            <SelectInput formProps={{ name: "formatoImpresion", label: "Formato de impresion" }} options={[{ value: "0", label: "test" }]} readonly={CheckReadOnly()} required />
                            <TextInput
                                formProps={{
                                name: "formula",
                                label: "Formula",
                                }}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <TextInput
                                formProps={{
                                name: "fcs",
                                label: "FCSI",
                                }}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <TextInput
                                formProps={{
                                name: "formato",
                                label: "Formato",
                                }}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <SwitchInput name="activo" label="Activo" onChange={(value) => { if (value) { alerts.info(messages.confirmations.enable) } else { alerts.info(messages.confirmations.disable) } }} readonly={CheckReadOnly()} />
                        </Col>
                        <Col md={12} sm={24} xs={12}>
                            <TextAreaInput
                                formProps={{
                                name: "valorInicial",
                                label: "Valor Inicial",
                                }}
                                rows={4}
                                max={100}
                                required
                                readonly={CheckReadOnly()}
                            />
                        </Col>
                    </Row>
                </Form>
                <ValorType value={ValueType}></ValorType>
                <Row>
                    <Col md={24} sm={12} style={{marginRight: 20, textAlign: "center" }}>
                        <PageHeader
                            ghost={false}
                            title={<HeaderTitle title="Estudios donde se encuentra la indicación"/>}
                            className="header-container"
                            ></PageHeader>
                            <Divider className="header-divider" />
                        <Table<IStudyList>
                            size="small"
                            rowKey={(record) => record.id}
                            columns={columns.slice(0, 3)}
                            pagination={false}
                            dataSource={[...(values.estudios??[])]}
                            scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
                            />
                    </Col>
                </Row>
            </div>
        </Spin>
    );
}
export default observer(ParameterForm);
  