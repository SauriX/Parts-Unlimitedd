import { Col, Divider, PageHeader, Row, Steps } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { IRouteTrackingList } from "../../../app/models/routeTracking";

type TTProps = {
  record?: IRouteTrackingList | IRouteTrackingList | undefined;
  title?: boolean;
  estatus?: number;
};

const TrackingTimeline = ({ record, title, estatus }: TTProps) => {
  return (
    <div className="tracking-card">
      <Row gutter={[0, 4]}>
        {title ? (
          <Fragment>
            <Col md={24}>
              <PageHeader
                title={`Seguimiento No.${record?.seguimiento}`}
                className="header-container-padding"
                avatar={{
                  src: `${process.env.REACT_APP_NAME}/assets/seguimiento.png`,
                  shape: "square",
                }}
              ></PageHeader>
            </Col>
            <Divider className="header-divider"></Divider>
          </Fragment>
        ) : (
          ""
        )}
        <Col md={24}>
          <Steps
            progressDot
            size="small"
            initial={1}
            current={record?.estatusSeguimiento || estatus}
            items={[
              {
                title: "Orden generada",
              },
              {
                title: "Toma de muestra",
              },
              {
                title: "En ruta",
              },
              {
                title: "Entregado",
              },
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};

export default observer(TrackingTimeline);
