import { Spin, Form, Row, Col, Transfer, Tooltip, Tree, Tag, Pagination, Button, Divider } from "antd";
import React, { FC, Fragment, useEffect, useMemo, useState } from "react";
import ValorRNumerico from "./ValorRNumerico"
import RangoEdad from "./RangoEdad";
import RangoEdadXSexo from "./NumericoXSexo"
import RangoNumericoXEdad from "./RangoNumericoXEdad"; 
import RangoNumericoXEdadSexo from "./RangoNumericoXEdadSexo";
import OpcionMultiple from "./OpcionMultiple";
import ReferenciaTexto from "./ReferenciaTexto";
import ReferenciaEtiqueta from "./ReferenciaEtiqueta";
import ReferenciaParrafo from "./ReferenciaParrafo";
import NumericoColumna from "./NumericoColumna"
import RangoObservacion from "./RangoObservacion";
interface ValorProps {
    value:number;
}
const ValorType:FC<ValorProps> = ({value})=>{
    function LayoutContendio(value:number) {

        switch(value) {
   
         case 1: return <ValorRNumerico idTipeVAlue={value}></ValorRNumerico>; break;
         case 2: return <RangoEdadXSexo></RangoEdadXSexo>; break;
         case 3: return <RangoNumericoXEdad></RangoNumericoXEdad>; break;
         case 4: return <RangoNumericoXEdadSexo></RangoNumericoXEdadSexo>; break;
         case 5: return <OpcionMultiple></OpcionMultiple> ; break;
         case 6: return <NumericoColumna></NumericoColumna> ; break;
         case 7: return <ReferenciaTexto></ReferenciaTexto> ; break;
         case 8: return <ReferenciaParrafo></ReferenciaParrafo> ; break;
         case 10: return <RangoObservacion></RangoObservacion> ; break;
         default: return    ; break;
   
       } 
    }
    return(
        <Fragment>
            {LayoutContendio(value)}
        </Fragment>
    );
}
export default ValorType;