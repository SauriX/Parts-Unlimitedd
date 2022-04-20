import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider } from "antd";
import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import RangoEdad from "./RangoEdad";

const RangoNumericoXEdadSexo = ()=>{
    return(
        <Fragment>

             <RangoEdad description="Valores de referencia Hombre (Numérico por edad y sexo):"></RangoEdad>
             <RangoEdad description="Valores de referencia Mujer (Numérico por edad y sexo):"></RangoEdad>

        </Fragment>
    );
}
export default RangoNumericoXEdadSexo;