import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider, Table } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IColumns } from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import MaskInput from "../../../../app/common/form/MaskInput";
import { MinusCircleOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
type Props = {
    description: string;
};
const RangoEdad:FC<Props> = ({description}) => {
    const [lista, setLista] = useState<any[]>([]);
    const addRow = ()=>{
        setLista(prev => [...prev, { id: prev.length, nombre:  (prev.length + 1).toString() }])
    }
    const removeRow = (id:number)=>{
        const list = lista.filter((x) => x.id !== id);
        console.log(list);
        setLista(prev => list );
    }
    return (
        <div >
            <Divider orientation="left">{description}</Divider>

            <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
                <Button onClick={() => { }} type="default">Modificar</Button>
                <Button type="primary" htmlType="submit" onClick={() => { }}>
                    Guardar
                </Button>
            </Col>
            {lista.map(x => <Row key={x.nombre}>
                <Col md={6} sm={24} xs={12} style={{ marginTop: 20 }}>
                    <MaskInput
                        formProps={{
                            name: "rangue",
                            label: `${x.nombre} Rango de edad`
                        }}
                        mask={[
                            /[0-9]/,
                            /[0-9]/,
                            "-",
                            /[0-9]/,
                            /[0-9]/
                        ]}
                    ></MaskInput>
                </Col>
                <Col md={1} sm={24} xs={12} style={{ marginTop: 51 }}>
                </Col>
                <Col md={5} sm={24} xs={12} style={{ marginTop: 51 }}>
                    <SelectInput formProps={{ name: "", label: "" }} options={[{ value: 1, label: "Dias" },{ value: 2, label: "Meses" }, { value: 3, label: "Años" }]} required />
                </Col>
                <Col md={1} sm={24} xs={12} style={{ marginTop: 51 }}>
                </Col>
                <Col md={5} sm={24} xs={12} style={{ marginTop: 51 }}>
                    <MaskInput
                        formProps={{
                            name: "rangue2",
                            label: ""
                        }}
                        mask={[
                            /[0-9]/,
                            /[0-9]/,
                            /[0-9]/,
                            "-",
                            /[0-9]/,
                            /[0-9]/,
                            /[0-9]/
                        ]}
                    ></MaskInput>
                </Col>
                <Col md={1} sm={24} xs={12} style={{ marginTop: 51 }}>
                </Col>
                <Col md={5} sm={24} xs={12} style={{ marginTop: 51 }}>
                    <IconButton
                        title="Remover"
                        icon={<MinusCircleOutlined />}
                        onClick={() => removeRow(x.id)}
                    />
                </Col>
            </Row>)}
            <Button type="default" onClick={addRow} style={{marginLeft:"50%",marginTop:10}}>Agregar</Button>
        </div>
    );
}
export default observer(RangoEdad);