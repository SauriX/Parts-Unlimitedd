import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { IExportForm } from "../../../app/models/appointmen";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import ApointmentForm from "./apointmentForm";
import ApointmentHeaderForm from "./apointmentHeaderForm";

type UrlParams = {
  id: string;
};

const ApointmentDetail = () => {
   const { appointmentStore } = useStore();
  const {   access,   exportForm,sucursal  } =appointmentStore ; 
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [printing, setPrinting] = useState(false);

  const { id } = useParams<UrlParams>();
  const reagentId = !id ? "" : !guidPattern.test(id) ? undefined : id;

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

    if (reagentId) {
      var data:IExportForm={
        id:reagentId,
        tipo:searchParams.get("type")!
      }
      setPrinting(true);
       await exportForm(data); 
      setPrinting(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
     /*  const permissions = await access(); */

/*       if (reagentId === undefined) {
        console.log("undefined");
        navigate("/notFound");
      } else if (!permissions?.crear && reagentId === "") {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && reagentId !== "") {
        navigate(`/forbidden`);
      } */
    };

    checkAccess();
  }, [/* access */, navigate, reagentId]);

  useEffect(() => {
    return () => {
     /*  clearScopes(); */
    };
  }, [/* clearScopes */]);

/*   if (reagentId == null) return null;

  if (!scopes?.acceder) return null; */

  return (
    <Fragment>
      <ApointmentHeaderForm id={reagentId!} handlePrint={handlePrint} handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <ApointmentForm id={reagentId!} componentRef={componentRef} printing={printing} />
    </Fragment>
  );
};

export default observer(ApointmentDetail);
