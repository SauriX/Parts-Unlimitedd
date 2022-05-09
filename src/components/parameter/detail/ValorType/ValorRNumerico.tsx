import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider,Table } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IColumns } from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
import NumberInput from "../../../../app/common/form/NumberInput";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IParameterForm, ItipoValorForm, tipoValorFormValues } from "../../../../app/models/parameter";
import { useStore } from "../../../../app/stores/store";
type Props = {
    idTipeVAlue: string;
    parameter:IParameterForm;
};
type UrlParams = {
    id: string;
};
const ValorRNumerico:FC<Props> = ({idTipeVAlue,parameter})=>{
    const { width: windowWidth } = useWindowDimensions();
    const [formValue] = Form.useForm<ItipoValorForm>();
    const [disabled, setDisabled] = useState(true);
    const { parameterStore } = useStore();
    const { addValue,getvalue,updatevalue,update  } = parameterStore;
    let { id } = useParams<UrlParams>();
    const [valuesValor, setValuesValor] = useState<ItipoValorForm>(new tipoValorFormValues());
    let navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const readuser = async (idUser: string) => {
          const value = await getvalue(idUser);
          console.log("her");
          formValue.setFieldsValue(value!);
          setValuesValor(value!);
          console.log(valuesValor)
            if(value?.id){
                setDisabled(true);
            }
        };
        if (id) {
          readuser(id);
        }
    }, [formValue, getvalue, id]);
    const onValuesChange = async (changeValues: any) => {
        const fields = Object.keys(changeValues)[0]; 
/*         if (fields === "tipoValor") {
          const value = changeValues[fields];
          setValueType(value);
        }
        if(fields==="departamento"){
            const value = changeValues[fields];
            await getareaOptions(value);
        } */
    }

    const onFinish = async (newValues: ItipoValorForm) => {
        console.log(newValues);
        const value = { ...valuesValor, ...newValues };
        let success = false;
        if (!value.id) {
            value.nombre = idTipeVAlue;
            value.parametroId=id||"";
            success = await addValue(value);
            success = await update(parameter);
        } else {
          success = await updatevalue(value);
          success = await update(parameter);
          
        }
        if (success) {
          navigate(`/parameters?search=${searchParams.get("search") || "all"}`);
        }
    };
    return(
        <div>
            <Divider orientation="left">Valores de referencia (Numérico):</Divider>
            
            <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
            {disabled&&<Button onClick={()=>{setDisabled(false)}}  type="default">Modificar</Button>}
                <Button type="primary" htmlType="submit" onClick={() => { formValue.submit() }}>
                    Guardar
                </Button>
            </Col>
            <Form<ItipoValorForm>
                form={formValue}
                name="value"
                onValuesChange={onValuesChange}
                onFinish={onFinish}
                scrollToFirstError
                onFieldsChange={() => {
                setDisabled(
                        !formValue.isFieldsTouched() ||
                        formValue.getFieldsError().filter(({ errors }) => errors.length).length > 0
                    );
                }}
            >
                <Row>
                    <Col md={12} sm={24} xs={12} style={{marginTop:20 }}>
                        <NumberInput
                            formProps={{
                                name: "valorInicial",
                                label: "Valor Inicial",
                            }}
                            max={9999999999}
                            min={0}
                            readonly={disabled}
                        /> 
                        <NumberInput
                            formProps={{
                                name: "valorFinal",
                                label: "Valor Final",
                            }}
                            max={9999999999}
                            min={0}
                            readonly={disabled}
                        /> 
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
export default ValorRNumerico;