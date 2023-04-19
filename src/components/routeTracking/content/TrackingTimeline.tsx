import { Col, Divider, PageHeader, Row, Steps } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";

type TTProps = {
  estatus: number | undefined;
  title?: boolean;
};

const TrackingTimeline = ({ estatus, title }: TTProps) => {
  return (
    <div className="tracking-card">
      <Row gutter={[0, 4]}>
        {title ? (
          <Fragment>
            <Col md={24}>
              <PageHeader
                title="Seguimiento"
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
            current={estatus}
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
