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
  const { resultValidationStore, relaseResultStore, generalStore } = useStore();
  const { exportList } = resultValidationStore;
  const { activeTab, exportList: releaseExportList } = relaseResultStore;
  const { generalFilter } = generalStore;
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const componentRef = useRef<any>();

  const handleDownload = async () => {
    setLoading(true);
    if (!activeTab) {
      await releaseExportList(generalFilter);
    } else {
      await exportList(generalFilter);
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
