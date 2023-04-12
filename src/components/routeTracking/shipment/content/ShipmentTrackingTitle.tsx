import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { IShipmentTracking } from "../../../../app/models/shipmentTracking";
import { Col, Row, Typography } from "antd";
import DescriptionTitle from "../../../../app/common/display/DescriptionTitle";

const { Text } = Typography;

type STTProps = {
  shipment: IShipmentTracking | undefined;
};

const ShipmentTrackingTitle = ({ shipment }: STTProps) => {
  console.log(shipment);
  return (
    <Fragment>
      <Row gutter={[4, 0]} justify="space-between">
        <Col span={8}>
          <DescriptionTitle
            title="No. de seguimiento"
            content={shipment!.seguimiento}
          />
        </Col>
        <Col span={8}>
          <DescriptionTitle title="Ruta" content={shipment!.ruta} />
        </Col>
        <Col span={8}>
          <DescriptionTitle title="Nombre" content={shipment!.nombre} />
        </Col>
      </Row>
    </Fragment>
  );
};

export default observer(ShipmentTrackingTitle);
