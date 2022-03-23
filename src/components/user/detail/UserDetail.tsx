import { Divider } from "antd";
import React, { Fragment } from "react";
import UserForm from "./UserForm";
import UserFormHeader from "./UserFormHeader";

const UserDetail = () => {
  return (
    <Fragment>
      <UserFormHeader />
      <Divider className="header-divider" />
      <UserForm />
    </Fragment>
  );
};

export default UserDetail;
