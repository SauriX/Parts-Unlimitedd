import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider } from "antd";
import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import { IParameterForm } from "../../../../app/models/parameter";
import RangoEdad from "./RangoEdad";
type Props = {
    idTipeVAlue: string;
    parameter:IParameterForm;
};
const RangoNumericoXEdadSexo:FC<Props> = ({idTipeVAlue,parameter})=>{
    const [flag, setFlag] = useState<boolean>(false);
    const [disabled, setDisabled] = useState(true);
    const handle =(value:boolean)=>{
        setFlag(value);
    }
    return(
        <Fragment>
            <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
                <Button onClick={() => { setDisabled(false); console.log("editabe");  console.log(disabled);}} type="default">Modificar</Button>
                <Button type="primary" htmlType="submit" onClick={() => { handle(true) }}>
                    Guardar
                </Button>
            </Col>
             <RangoEdad disabled={disabled} auto={flag} idTipeVAlue={"hombre"} parameter={parameter} description="Valores de referencia Hombre (Numérico por edad y sexo):"></RangoEdad>
             <RangoEdad disabled={disabled} auto={flag} idTipeVAlue={"mujer"} parameter={parameter} description="Valores de referencia Mujer (Numérico por edad y sexo):"></RangoEdad>

        </Fragment>
    );
}
export default RangoNumericoXEdadSexo;