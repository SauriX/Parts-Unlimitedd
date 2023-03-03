import { Row, Col, Divider, Spin, Typography } from "antd";
import  { Fragment, useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";
import InfoStudyHeader from "./InfoStudyHeader";
import { IStudyTec } from "../../../../app/models/study";
import TextArea from "antd/lib/input/TextArea";
import { Link } from "react-router-dom";
type Props = {
    id: number,
    sucursal: string;
    sucursalDestino: string;
    estudio: string;
    study: IStudyTec | undefined;
    setStudy: React.Dispatch<React.SetStateAction<IStudyTec | undefined>>
};
const InfoStudy = ({ id, sucursal, sucursalDestino, estudio,study,setStudy }: Props) => {
    const { studyStore } = useStore();
    const { getTecInfoById } = studyStore;
    const [loading, setLoading] = useState(false);
    const { Text } = Typography;
    useEffect(() => {
        const readInfoStudy= async () => {
            setLoading(true);
            var studys = await getTecInfoById(id);
            setStudy(studys);
            setLoading(false);
        };
        readInfoStudy();
    }, [getTecInfoById, id]);
    return (
        <Fragment>
            <InfoStudyHeader></InfoStudyHeader>
            <Text type="secondary" style={{color:"blue"}}>{estudio}</Text>
            <Divider className="header-divider" />
            <Spin spinning={loading} tip={""}>
                <Row gutter={[12, 12]}>
                    <Col span={8} style={{ textAlign: "center" }}>
                        Sucursal: {sucursal}
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                        Sucursal destino: {sucursalDestino}
                    </Col>
                    <Col span={8} style={{ textAlign: "center" }}>
                        Días de entrega: {study?.diasEntrega}
                    </Col>
                    <Col span={12}>
                        Tipo de muestra: {study?.tipoMuestra}
                    </Col>
                    <Col span={12}>
                        Días de estabilidad en medio ambiente: {study?.diasEstabilidad}
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
