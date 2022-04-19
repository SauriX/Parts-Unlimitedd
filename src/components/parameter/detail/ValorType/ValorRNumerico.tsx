import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider,Table } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import useWindowDimensions, { resizeWidth } from "../../../../app/util/window";
import { IColumns } from "../../../../app/common/table/utils";
import IconButton from "../../../../app/common/button/IconButton";
const ValorRNumerico = ()=>{
    const { width: windowWidth } = useWindowDimensions();
    return(
        <div>
            <Col md={24} sm={24} xs={24} style={{ marginLeft: "40%" }}>
            <Button onClick={()=>{}}  type="default">Modificar</Button>
                <Button type="primary" htmlType="submit" onClick={() => {  }}>
                    Guardar
                </Button>
            </Col>
            <Row>
                <Col md={12} sm={24} xs={12}>
                    
                </Col>
            </Row>
        </div>
    );
}
export default ValorRNumerico;