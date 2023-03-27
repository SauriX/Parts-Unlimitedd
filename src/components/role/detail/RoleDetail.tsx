import { Divider } from "antd";
import React, { Fragment, useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import RoleForm from "./RoleForm";
import RoleFormHeader from "./RoleFormHeader";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
type UrlParams = {
  id: string;
};
const RoleDetail = () => {
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<any>();
  const { roleStore } = useStore();
  const { exportForm, getById, role } = roleStore;
  const [searchParams, setSearchParams] = useSearchParams();
  let { id } = useParams<UrlParams>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
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
    setLoading(true);
    await exportForm(id!, role!.nombre);
    setLoading(false);
  };
  return (
    <Fragment>
      <RoleFormHeader
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <RoleForm componentRef={componentRef} load={loading} />
    </Fragment>
  );
};

export default observer(RoleDetail);
