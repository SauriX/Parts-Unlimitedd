import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { useStore } from "../app/stores/store";
import SamplingStudyBody from "../components/Sampling/SamplingStudyBody";
import SamplingStudyHeader from "../components/Sampling/SamplingStudyHeader";

const SamplingStudy = () => {
  const { samplingStudyStore, generalStore } = useStore();
  const { scopes, access, clearScopes, exportList } = samplingStudyStore;
  const { generalFilter } = generalStore;
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    await exportList(generalFilter);
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      await access();
    };

    checkAccess();
  }, [access]);

  useEffect(() => {
    return () => {
      clearScopes();
    };
  }, [clearScopes]);

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <SamplingStudyHeader handleList={handleDownload} /> 
      <Divider className="header-divider" />
      <SamplingStudyBody printing={loading} />
    </Fragment>
  );
};

export default observer(SamplingStudy);
