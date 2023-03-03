import { Row, Col, Divider, Spin } from "antd";
import React, { Fragment, useEffect, useState } from "react";

import { useStore } from "../../../../app/stores/store";

import { observer } from "mobx-react-lite";

import InfoStudyHeader from "./InfoStudyHeader";
import { IInfoTecStudy } from "../../../../app/models/study";
import TextArea from "antd/lib/input/TextArea";
import { Link } from "react-router-dom";



type Props = {
    id: number,
    sucursal: string;
    sucursalDestino: string;
    estudio: string;
};

const InfoStudy = ({ id, sucursal, sucursalDestino, estudio }: Props) => {
    const { studyStore } = useStore();

    const { getTecInfoById } = studyStore;



    const [loading, setLoading] = useState(false);
    const [study, setStudy] = useState<IInfoTecStudy>();

    useEffect(() => {
        const readReagents = async () => {
            setLoading(true);
            var studys = await getTecInfoById(id);
            setStudy(studys);
            setLoading(false);
        };

        readReagents();
    }, [getTecInfoById, id]);





    return (
        <Fragment>
            <InfoStudyHeader></InfoStudyHeader>
            <Link to={""} style={{ fontSize: 13 }}>{estudio}</Link>
            <Divider className="header-divider" />
            <Spin spinning={loading} tip={""}>
                <Row gutter={[12, 12]}>
                    <Col span={8} style={{ textAlign: "center" }}>
                        Sucursal: {sucursal != null || sucursal !== undefined ? sucursal : ""}
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                        Sucursal destino: {sucursalDestino != null || sucursalDestino !== undefined ? sucursalDestino : ""}
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                        Días de entrega: {study?.diasEntrega}
                    </Col>
                    <Col span={12}>
                        Tipo de muestra: {study?.tipoMuestra}
                    </Col>
                    <Col span={12}>
                        Días de estabilidad en medio ambiente: {study?.diaEstabilidad}
                    </Col>
                    <Col span={12}>
                        Tubo de muestra: {study?.tapon}
                    </Col>
                    <Col span={12}>
                        Días de refrigeración: {study?.diasRefrigeracion}
                    </Col>
                    <Col span={24}>
                        <label htmlFor="">Instrucciones de toma:</label>
                        <TextArea value={study?.instrucciones} readOnly></TextArea>
                    </Col>
                </Row>
            </Spin>

        </Fragment>
    );
};

export default observer(InfoStudy);
