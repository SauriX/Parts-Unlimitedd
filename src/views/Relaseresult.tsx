import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../app/stores/store";
import RelaseResultHeader from "../components/RalaseResult/RelaseResultHeader";
import RelaseResultTable from "../components/RalaseResult/RelaseResultTable";
import ResultValidationHeader from "../components/Resultvalidation/ResultValidationHeader";
import ResultValidationTable from "../components/Resultvalidation/ResultValidationTable";

const Relaseresult = () => {
  const { relaseResultStore, resultValidationStore } = useStore();
  const { exportList, search, activeTab } = relaseResultStore;
  const { exportList: exportValidationList, search: validationSearch } =
    resultValidationStore;
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<any>();

  const handleDownload = async () => {
    setLoading(true);
    if (!activeTab) {
      await exportList(search);
    } else {
      await exportValidationList(validationSearch);
    }
    setLoading(false);
  };

  return (
    <Fragment>
      {!activeTab ? (
        <Fragment>
          <RelaseResultHeader handleList={handleDownload} />
          <Divider className="header-divider" />
          <RelaseResultTable componentRef={componentRef} printing={loading} />
        </Fragment>
      ) : (
        <Fragment>
          <ResultValidationHeader handleList={handleDownload} />
          <Divider className="header-divider" />
          <ResultValidationTable
            componentRef={componentRef}
            printing={loading}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default observer(Relaseresult);
