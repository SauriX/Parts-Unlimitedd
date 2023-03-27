import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import PackFormHeader from "./PackFormHeader";
import PackForm from "./PackForm";

type UrlParams = {
  id: string;
};

const PackDetail = () => {
  const [loading, setLoading] = useState(false);
  const [msj, setMsj] = useState<String>();
  const componentRef = useRef<any>();
  const { packStore } = useStore();
  const { getById, exportForm } = packStore;
  let { id } = useParams<UrlParams>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
      setMsj("Imprimiendo");
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
    const readuser = async (idUser: number) => {
      await getById(idUser);
    };
    if (id) {
      readuser(Number(id));
    }
  }, [getById, id]);
  const handleDownload = async () => {
    setLoading(true);
    setMsj("Descargando");
    const succes = await exportForm(Number(id)!);

    if (succes) {
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <PackFormHeader
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <PackForm componentRef={componentRef} load={loading} msj={msj!} />
    </Fragment>
  );
};

export default observer(PackDetail);
