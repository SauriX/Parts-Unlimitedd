import { Divider } from "antd";
import React, { Fragment, useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import UserFormValues from "./UserForm";
import UserFormHeader from "./UserFormHeader";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
type UrlParams = {
  id: string;
};
const UserDetail = () => {
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<any>();
  const { userStore } = useStore();
  const { exportForm, getById, user } = userStore;
  const [searchParams, setSearchParams] = useSearchParams();
  let { id } = useParams<UrlParams>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    const readuser = async (idUser: string) => {
      await getById(idUser);
    };
    if (id) {
      readuser(id);
    }
  }, [getById, id]);

  const handleDownload = async () => {
    console.log(user);
    setLoading(true);
    const succes = await exportForm(id!);

    if (succes) {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <UserFormHeader handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <UserFormValues componentRef={componentRef} load={loading} />
    </Fragment>
  );
};

export default observer(UserDetail);
