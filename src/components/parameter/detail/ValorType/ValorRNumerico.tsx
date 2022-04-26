import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider,Table } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IColumns } from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
import NumberInput from "../../../../app/common/form/NumberInput";
const ValorRNumerico = ()=>{
    const { width: windowWidth } = useWindowDimensions();
    return(
        <div>
            <Divider orientation="left">Valores de referencia (Numérico):​</Divider>
            
            <Col md={24} sm={24} xs={24} style={{ marginLeft: "50%" }}>
            <Button onClick={()=>{}}  type="default">Modificar</Button>
                <Button type="primary" htmlType="submit" onClick={() => {  }}>
                    Guardar
                </Button>
            </Col>
            <Row>
                <Col md={12} sm={24} xs={12} style={{marginTop:20 }}>
                    <NumberInput
                        formProps={{
                            name: "initialValuea",
                            label: "Valor Inicial",
                        }}
                        max={9999999999}
                        min={0}
                    /> 
                                        <NumberInput
                        formProps={{
                            name: "initialValuea",
                            label: "Valor Final",
                        }}
                        max={9999999999}
                        min={0}
                    /> 
                </Col>
            </Row>
        </div>
    );
}
export default ValorRNumerico;