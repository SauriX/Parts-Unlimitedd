import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import ProceedingHeader from "../components/proceedings/ProceedingHeader";
import ProceedingTable from "../components/proceedings/ProceedingTable";
import SamplingHeader from "../components/Sampling/SamplingHeader";
import SamplingTable from "../components/Sampling/SamplingTable";

const Sampling = () => {
  const { procedingStore } = useStore();
   const { /* scopes, access, clearScopes, */ exportList,search } = procedingStore;

  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const componentRef = useRef<any>();



  const handleDownload = async () => {
    setLoading(true);
    await exportList(search);
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
     // await access();
    };

    checkAccess();
  }, [/* access */]);

  useEffect(() => {
    return () => {
      //clearScopes();
    };
  }, [/* clearScopes */]);
/* 
  if (!scopes?.acceder) return null;
 */
  return (
    <Fragment>
      <SamplingHeader  handleList={handleDownload} />
      <Divider className="header-divider" />
      <SamplingTable componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(Sampling);