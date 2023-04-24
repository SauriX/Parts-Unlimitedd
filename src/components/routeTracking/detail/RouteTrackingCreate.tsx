import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import RouteTrackingCreateForm from "./RouteTrackingCreateForm";
import RouteTrackingCreateHeader from "./RouteTrackingCreateHeader";

function RouteTrackingCreate() {
  return (
    <Fragment>
      <RouteTrackingCreateHeader />
      <Divider className="header-divider" />
      <RouteTrackingCreateForm />
    </Fragment>
  );
}

export default observer(RouteTrackingCreate);
