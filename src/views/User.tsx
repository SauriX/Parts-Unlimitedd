import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useState } from "react";
import { useStore } from "../app/stores/store";
import UserHeader from "../components/user/UserHeader";
import UserTable from "../components/user/UserTable";

const User = () => {
  const { userStore } = useStore();
  const { access } = userStore;

  const [accessing, setAccessing] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      await access();
      setAccessing(false);
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    return () => {
      setAccessing(true);
    };
  }, []);

  if (accessing) return null;

  return (
    <Fragment>
      <UserHeader />
      <Divider className="header-divider" />
      <UserTable />
    </Fragment>
  );
};

export default observer(User);
