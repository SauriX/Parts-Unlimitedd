import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { guidPattern } from "../../../app/util/utils";
import ReagentForm from "./ReagentForm";
import ReagentFormHeader from "./ReagentFormHeader";

type UrlParams = {
  id: string;
};

const ReagentDetail = () => {
  const { reagentStore } = useStore();
  const { scopes, access, clearScopes, exportForm } = reagentStore;

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
      setPrinting(true);
      await exportForm(reagentId);
      setPrinting(false);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

      if (reagentId === undefined) {
        navigate("/notFound");
      } else if (!permissions?.crear && reagentId === "") {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && reagentId !== "") {
        navigate(`/forbidden`);
      }
    };

    checkAccess();
  }, [access, navigate, reagentId]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (reagentId == null) return null;

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <ReagentFormHeader
        id={reagentId}
        handlePrint={handlePrint}
        handleDownload={handleDownload}
      />
      <Divider className="header-divider" />
      <ReagentForm
        id={reagentId}
        componentRef={componentRef}
        printing={printing}
      />
    </Fragment>
  );
};

export default observer(ReagentDetail);
