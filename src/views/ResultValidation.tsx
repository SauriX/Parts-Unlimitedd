import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../app/stores/store";
import ResultValidationHeader from "../components/Resultvalidation/ResultValidationHeader";
import ResultValidationTable from "../components/Resultvalidation/ResultValidationTable";
import SamplingHeader from "../components/Sampling/SamplingStudyHeader";
import SamplingTable from "../components/Sampling/SamplingStudyBody";

const ResultValidation = () => {
  const { resultValidationStore, relaseResultStore } = useStore();
  //const { /* scopes, access, clearScopes, */ exportList,search } = procedingStore;
  const { /* scopes, access, clearScopes, */ exportList, search } =
    resultValidationStore;
  const {
    activeTab,
    search: releaseSearch,
    exportList: releaseExportList,
  } = relaseResultStore;
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const componentRef = useRef<any>();

  const handleDownload = async () => {
    setLoading(true);
    if (!activeTab) {
      await releaseExportList(releaseSearch);
    } else {
      await exportList(search);
    }
    setLoading(false);
  };

  
  return (
    <Fragment>
      <Fragment>
        <ResultValidationHeader handleList={handleDownload} />
        <Divider className="header-divider" />
        <ResultValidationTable componentRef={componentRef} printing={loading} />
      </Fragment>
    </Fragment>
  );
};

export default observer(ResultValidation);
