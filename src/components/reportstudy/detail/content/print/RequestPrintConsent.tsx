import { Button } from "antd";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import requests from "../../../../../app/api/agent";
import { useStore } from "../../../../../app/stores/store";
import { catalog } from "../../../../../app/util/catalogs";

const urlDOP =
  process.env.REACT_APP_MEDICAL_RECORD_URL +
  "/consents/FOTM04 REV 01 CONSENTIMIENTO ANTIDOPING.pdf";
const urlVDRL =
  process.env.REACT_APP_MEDICAL_RECORD_URL +
  "/consents/FOTM03 REV 02 CONSENTIMIENTO HIV.pdf";

const RequestPrintConsent = () => {
  const { requestStore } = useStore();
  const { allStudies } = requestStore;

  const [isDop, setIsDop] = useState(false);
  const [isVdrl, setIsVdrl] = useState(false);

  useEffect(() => {
    setIsDop(allStudies.some((x) => x.areaId === catalog.area.dop));
    setIsVdrl(allStudies.some((x) => x.areaId === catalog.area.vdrl));
  }, [allStudies]);

  return (
    <>
      {isDop && (
        <Button
          onClick={() => {
            window.open(urlDOP);
          }}
        >
          Formato DOP
        </Button>
      )}
      {isVdrl && (
        <Button
          onClick={() => {
            window.open(urlVDRL);
          }}
        >
          Formato VDRL
        </Button>
      )}
    </>
  );
};

export default observer(RequestPrintConsent);
