import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider, Table, Space, Input } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IColumns } from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import MaskInput from "../../../../app/common/form/MaskInput";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from "mobx-react-lite";
import CheckInput from "../../../../app/common/form/CheckInput";
import TextInput from "../../../../app/common/form/TextInput";
import { IParameterForm, ItipoValorForm } from "../../../../app/models/parameter";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useStore } from "../../../../app/stores/store";
type Props = {
    idTipeVAlue: string;
    parameter:IParameterForm;
};
type UrlParams = {
    id: string|"";
};
const RangoObservacion : FC<Props> = ({ idTipeVAlue,parameter }) => {
    const [lista, setLista] = useState<any[]>([]);
    const [formValue] = Form.useForm<ItipoValorForm[]>();
    let { id } = useParams<UrlParams>();
    const { parameterStore } = useStore();
    const { addvalues,getAllvalues,update  } = parameterStore;
    const [valuesValor, setValuesValor] = useState<ItipoValorForm[]>([]);
    useEffect(() => {
        const readuser = async (idUser: string) => {
          let value = await getAllvalues(idUser,idTipeVAlue);
          console.log("form");
          console.log(value);

           value?.map(item=>lista.push(item));
         //setLista(prev=>[...prev,...value!]);
          formValue.setFieldsValue(value!);
        
   
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
                nombre:idTipeVAlue,
                opcion:"",
                descripcionTexto:x.descripcionTexto,
                descripcionParrafo:"",
                idParametro:id,
                id:x.id
            }
            return data;
        });

       var succes = await addvalues(val,id);
       succes = await update(parameter);
        if (succes) {
            navigate(`/parameter?search=${searchParams.get("search") || "all"}`);
        }

    };
    return (
        <div >
            <Divider orientation="left">Valores de referencia (Opción Observacion):​</Divider>
            <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
                <Button onClick={() => { }} type="default">Modificar</Button>
                <Button type="primary" htmlType="submit" onClick={() => { formValue.submit();}}>
                    Guardar
                </Button>
            </Col>
            <Form<any[]> form={formValue} name="dynamic_form_nest_item" style={{ marginTop: 20 }} onFinish={onFinish} autoComplete="off">
                <Form.List  initialValue={lista}  name="value">
                    {(Fields, { add, remove }) => (
                        <>
                            {Fields.map(({ key, name, ...valuesValor }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item
                                        {...valuesValor}
                                        label={"Observación"+(name+1)}
                                        name={[name, 'descripcionTexto']}
                                        rules={[{ required: true, message: 'Missing valor' }]}
                                    >
                                        <Input placeholder={"Observación"} />
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
export default observer(RangoObservacion);