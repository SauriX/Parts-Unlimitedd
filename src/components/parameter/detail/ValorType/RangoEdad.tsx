import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider, Table, Space, Input, Select } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IColumns } from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import MaskInput from "../../../../app/common/form/MaskInput";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from "mobx-react-lite";
import { IParameterForm, ItipoValorForm } from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
import { values } from "mobx";
import alerts from "../../../../app/util/alerts";
type Props = {
    description: string;
    idTipeVAlue: string;
    parameter:IParameterForm;
    auto:boolean;
    disabled:boolean;
};
type UrlParams = {
    id: string|"";
};
const RangoEdad:FC<Props> = ({description,idTipeVAlue,parameter,auto,disabled}) => {
    const [lista, setLista] = useState<any[]>([]);
    const [formValue] = Form.useForm<ItipoValorForm[]>();
    const [disable, setDisable] = useState(disabled);
    let { id } = useParams<UrlParams>();
    const { parameterStore } = useStore();
    const { addvalues,getAllvalues,update  } = parameterStore;
    const [valuesValor, setValuesValor] = useState<ItipoValorForm[]>([]);

    useEffect(()=>{
        const update =()=>{
            formValue.submit()
        }
        if(idTipeVAlue=="hombre"||idTipeVAlue=="mujer"){
            if(auto){
                update();
            }
        }
    },[auto]);

    useEffect(()=>{
        setDisable(disabled);
    },[disabled]);

    useEffect(() => {
        const readuser = async (idUser: string) => {
          let value = await getAllvalues(idUser,idTipeVAlue);
          console.log("form");
          console.log(value);

           value?.map(item=>lista.push(item));
         //setLista(prev=>[...prev,...value!]);
          formValue.setFieldsValue(value!);
            if(lista.length>0){
                setDisable(true);
            }
   
        };
        if (id) {
          readuser(id);
        }
    }, [formValue, getAllvalues, id]);
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    let navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const onFinish = async (values: any) => {
        console.log(values);

        const val:ItipoValorForm[] = values.value.map((x: ItipoValorForm) => {
            let data:ItipoValorForm = {
                valorInicialNumerico:x.valorInicialNumerico,
                valorFinalNumerico:x.valorFinalNumerico,
                rangoEdadInicial:x.rangoEdadInicial,
                rangoEdadFinal:x.rangoEdadFinal,
                medidaTiempoId:x.medidaTiempoId,
                nombre:idTipeVAlue,
                opcion:"",
                descripcionTexto:"",
                descripcionParrafo:"",
                parametroId:id,
                id:x.id
            }
            return data;
        });
        var validatehombre =val.map( (x)=> { console.log(x,"x"); if(x.valorInicialNumerico! > x.valorFinalNumerico!){ console.log("if");return true;} return false;});
        if(validatehombre.includes(true)){
            alerts.warning(`En ${description} inicial no puede ser mayor al final`);
            return
        }
        var validatehombreIgual =val.map( (x)=> { console.log(x,"x"); if(x.valorInicialNumerico! === x.valorFinalNumerico!){ console.log("if");return true;} return false;});
        if(validatehombreIgual.includes(true)){
            alerts.warning(`En ${description} inicial no puede ser igual al final`);
            return
        }
        if(parameter.formula!="" ){
            var succes = await addvalues(val,id);
            if(succes){
             succes = await update(parameter);
             if (succes) {
                 navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
             }
            }
        }else{
            alerts.warning("Necesita ingresar una formula");
        }


    };
    const onValuesChange = async (changeValues: any, values: any) => {
        const fields = Object.keys(changeValues)[0];
        if (fields === "rangoEdadInicial") {
          const value = changeValues[fields];
            console.log("on change");
            if(value< formValue.getFieldValue("rangoEdadFinal")){
                console.log("dentro del if");
                alerts.warning("El rango final no puede ser meno al inicial");
            }
        }
    };
    return (
        <div >
            <Divider orientation="left">{description}</Divider>

            {idTipeVAlue!="hombre"&& idTipeVAlue!="mujer"&&<Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
                <Button onClick={() => { setDisable(false) }} type="default">Modificar</Button>
                <Button type="primary" htmlType="submit" onClick={() => { formValue.submit();}}>
                    Guardar
                </Button>
            </Col>}
            <Form<any[]> form={formValue} name="dynamic_form_nest_item" style={{ marginTop: 20 }} onValuesChange={onValuesChange} onFinish={onFinish} autoComplete="off">
                <Form.List  initialValue={lista}  name="value">
                    {(Fields, { add, remove }) => (
                        <>
                            {Fields.map(({ key, name, ...valuesValor }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...valuesValor}

                                        name={[name, 'rangoEdadInicial']}
                                        rules={[{ required: true, message: 'Missing Hombre valor' }]}
                                    >
                                        <Input type={"number"} min={0} max={120} disabled={disable} placeholder={"Rango Edad"} />
                                    </Form.Item>
                                    <Form.Item
                                        {...valuesValor}
                                        name={[name, 'rangoEdadFinal']}
                                        rules={[{ required: true, message: 'Missing Rango de edad' }]}
                                    >
                                        <Input type={"number"} min={0} max={120} disabled={disable} placeholder="Rango Edad" />
                                    </Form.Item>
                                    <Form.Item
                                        {...valuesValor}
                                        name={[name, 'medidaTiempoId']}
                                        rules={[{ required: true, message: 'Missing Unidad de medida' }]}
                                    >
                                     <Select  defaultValue={0} disabled={disable}  options={[{label:"Unidad de tiempo",value:0},{label:"Días",value:1},{label:"Meses",value:2},{label:"Años",value:3}]}  />
                                    </Form.Item>
                                    <Form.Item
                                        {...valuesValor}
                                        name={[name, 'valorInicialNumerico']}
                                        rules={[{ required: true, message: 'valor inicial' }]}
                                    >
                                        <Input type={"number"} min={0} max={120} disabled={disable} placeholder={"Valor inicial"} />
                                    </Form.Item>
                                    <Form.Item
                                        {...valuesValor}
                                        name={[name, 'valorFinalNumerico']}
                                        rules={[{ required: true, message: 'Missing Valor final' }]}
                                    >
                                        <Input type={"number"} min={0} max={120} disabled={disable} placeholder="Valor final" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </div>
    );
}
export default observer(RangoEdad);