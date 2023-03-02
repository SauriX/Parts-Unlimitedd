import React, { Fragment, useEffect } from "react";
import SeriesDetailHeader from "./SeriesDetailHeader";
import SeriesForm from "./SeriesForm";
import { Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

type SeriesParams = {
  id: string;
  tipoSerie: string;
};

const SeriesDetail = () => {
  const { seriesStore } = useStore();
  const { clearScopes, scopes, access } = seriesStore;
  const navigate = useNavigate();

  const { id, tipoSerie } = useParams<SeriesParams>();

  useEffect(() => {
    clearScopes();
  }, [clearScopes]);

  useEffect(() => {
    const checkAccess = async () => {
      const permissions = await access();

      if (!permissions?.crear && id === "new") {
        navigate(`/forbidden`);
      } else if (!permissions?.modificar && id !== "new") {
        navigate(`/forbidden`);
      }
    };

    checkAccess();
  }, [access, navigate, id]);

  if (!scopes?.acceder) return null;

  return (
    <Fragment>
      <SeriesDetailHeader tipoSerie={tipoSerie!} />
      <Divider className="header-divider" />
      <SeriesForm id={Number(id)} tipoSerie={Number(tipoSerie)} />
    </Fragment>
  );
};

export default observer(SeriesDetail);
