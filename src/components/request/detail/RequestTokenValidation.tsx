import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";

const RequestTokenValidation = () => {
  const { requestStore } = useStore();
  const { request } = requestStore;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (request) {
    }
  }, [request]);

  return <div>RequestTokenValidation</div>;
};

export default observer(RequestTokenValidation);
