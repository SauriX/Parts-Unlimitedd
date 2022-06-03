import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import RouteForm from "./RouteForm";
import RouteFormHeader from "./RouteFormHeader";

type UrlParams = {
  id: string;
};

const RouteDetail = () => {
  const { routeStore } = useStore();
  const { scopes, access, clearScopes, exportForm } = routeStore;

  const navigate = useNavigate();

  const [printing, setPrinting] = useState(false);

  const { id } = useParams<UrlParams>();
  const routeId = !id ? "" : !guidPattern.test(id) ? undefined : id;

  const componentRef = useRef<any>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });

  const handleDownload = async () => {
    if (routeId) {
      setPrinting(true);
      await exportForm(routeId);
      setPrinting(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

      if (routeId === undefined) {
        console.log("undefined");
        navigate("/notFound");
      } else if (!permissions?.crear && routeId === "") {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && routeId !== "") {
        navigate(`/forbidden`);
      }
    };

    checkAccess();
  }, [access, navigate, routeId]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (routeId == null) return null;

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <RouteFormHeader id={routeId} handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <RouteForm id={routeId} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(RouteDetail);
