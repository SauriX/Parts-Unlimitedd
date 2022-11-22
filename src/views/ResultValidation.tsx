import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../app/stores/store";
import ResultValidationHeader from "../components/Resultvalidation/ResultValidationHeader";
import ResultValidationTable from "../components/Resultvalidation/ResultValidationTable";
import SamplingHeader from "../components/Sampling/SamplingHeader";
import SamplingTable from "../components/Sampling/SamplingTable";

const ResultValidation = () => {
  const { resultValidationStore,procedingStore } = useStore();
   //const { /* scopes, access, clearScopes, */ exportList,search } = procedingStore;
  const { /* scopes, access, clearScopes, */ exportList,search } = resultValidationStore;
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
      <ResultValidationHeader  handleList={handleDownload} />
      <Divider className="header-divider" />
      <ResultValidationTable componentRef={componentRef} printing={loading} />
    </Fragment>
  );
};

export default observer(ResultValidation);