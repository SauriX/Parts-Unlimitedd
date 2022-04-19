import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider } from "antd";
import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import ValorRNumerico from "./ValorRNumerico"
const ValorType = ()=>{
    return(
        <Fragment>
            <Divider orientation="left">Valores De Refencia</Divider>
            <ValorRNumerico></ValorRNumerico>
        </Fragment>
    );
}
export default ValorType;