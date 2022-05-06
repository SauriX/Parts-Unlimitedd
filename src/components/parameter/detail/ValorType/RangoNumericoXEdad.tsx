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
import RangoEdad from "./RangoEdad";
import { IParameterForm } from "../../../../app/models/parameter";
type Props = {
    idTipeVAlue: string;
    parameter:IParameterForm;
};
const RangoNumericoXEdad:FC<Props> = ({idTipeVAlue,parameter})  => {
    return (
        <div >
            <Divider orientation="left"></Divider>
            <RangoEdad disabled={false} auto={false} idTipeVAlue={idTipeVAlue} parameter={parameter} description="Valores de referencia (Numérico por edad):"></RangoEdad>
        </div>
    );
}
export default observer(RangoNumericoXEdad);