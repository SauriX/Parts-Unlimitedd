import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider } from "antd";
import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import ValorRNumerico from "./ValorRNumerico"
import RangoEdad from "./RangoEdad";
import RangoEdadXSexo from "./NumericoXSexo"
import RangoNumericoXEdad from "./RangoNumericoXEdad"; 
import RangoNumericoXEdadSexo from "./RangoNumericoXEdadSexo"; 
const ValorType = ()=>{
    return(
        <Fragment>
            <ValorRNumerico></ValorRNumerico>
            <RangoEdad description={"Valores de referencia (Rango de edad):"}></RangoEdad>
            <RangoEdadXSexo></RangoEdadXSexo>
            <RangoNumericoXEdad></RangoNumericoXEdad>
            <RangoNumericoXEdadSexo></RangoNumericoXEdadSexo>
        </Fragment>
    );
}
export default ValorType;